<?php
/**
 * Plugin Name: RAIN07 — Cloudflare Deploy Sync
 * Plugin URI: https://rain07.my.id
 * Description: Automatically triggers Cloudflare static rebuilds when WordPress Technical Notes (posts) or Portfolio (CPT) items are published, updated, or deleted.
 * Version: 1.0.0
 * Author: Reyno Nur Fahreza
 * Author URI: https://rain07.my.id
 * License: GPL-2.0+
 */

defined('ABSPATH') || exit;

class RAIN07_Cloudflare_Sync {
    const OPTION_HOOK_URL   = 'rain07_cf_deploy_hook_url';
    const OPTION_LAST_SYNC  = 'rain07_cf_last_sync_info';
    const TRANSIENT_LOCK    = 'rain07_cf_sync_debounce_lock';
    const DEBOUNCE_SECONDS  = 25;

    /**
     * Tracked post types that affect the public Astro website
     */
    private static $tracked_post_types = ['post', 'portfolio'];

    /**
     * In-memory flag to ensure only one dispatch is queued per PHP execution
     */
    private static $queued_sync = null;

    public static function init() {
        // Post lifecycle hooks
        add_action('transition_post_status', [__CLASS__, 'on_post_status_transition'], 10, 3);
        add_action('before_delete_post', [__CLASS__, 'on_before_delete_post'], 10, 1);

        // Execute queued sync on WordPress shutdown
        add_action('shutdown', [__CLASS__, 'execute_queued_sync']);

        // Admin interface
        if (is_admin()) {
            add_action('admin_menu', [__CLASS__, 'add_admin_menu']);
            add_action('admin_init', [__CLASS__, 'register_settings']);
            add_action('admin_post_rain07_manual_sync', [__CLASS__, 'handle_manual_sync']);
            add_action('admin_bar_menu', [__CLASS__, 'add_admin_bar_sync_button'], 100);
            add_action('admin_notices', [__CLASS__, 'render_admin_notices']);
        }
    }

    /**
     * Resolve the Deploy Hook URL:
     * 1. wp-config.php constant RAIN07_DEPLOY_HOOK_URL (highest precedence, secure)
     * 2. wp_options setting saved in admin
     */
    public static function get_deploy_hook_url() {
        if (defined('RAIN07_DEPLOY_HOOK_URL') && !empty(RAIN07_DEPLOY_HOOK_URL)) {
            return trim(RAIN07_DEPLOY_HOOK_URL);
        }
        return trim((string) get_option(self::OPTION_HOOK_URL, ''));
    }

    /**
     * Handle post publishing, updating, unpublishing, and trashing
     */
    public static function on_post_status_transition($new_status, $old_status, $post) {
        if (!$post || !is_object($post)) {
            return;
        }

        // 1. Verify tracked post type
        if (!in_array($post->post_type, self::$tracked_post_types, true)) {
            return;
        }

        // 2. Ignore autosaves and revisions
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (wp_is_post_revision($post->ID) || wp_is_post_autosave($post->ID)) {
            return;
        }

        // 3. Only act if content is becoming published, was published, or was updated while published
        $was_published = ($old_status === 'publish');
        $is_published  = ($new_status === 'publish');

        if (!$was_published && !$is_published) {
            // Draft to draft, pending to draft, etc. — does not affect public static site
            return;
        }

        $action_label = 'updated';
        if (!$was_published && $is_published) {
            $action_label = 'published';
        } elseif ($was_published && !$is_published) {
            $action_label = 'unpublished (' . $new_status . ')';
        }

        self::queue_sync([
            'trigger'    => 'post_transition',
            'post_id'    => $post->ID,
            'post_type'  => $post->post_type,
            'post_title' => get_the_title($post->ID),
            'action'     => $action_label,
            'timestamp'  => current_time('mysql')
        ]);
    }

    /**
     * Handle permanent deletion of a published post or portfolio item
     */
    public static function on_before_delete_post($post_id) {
        $post = get_post($post_id);
        if (!$post || !in_array($post->post_type, self::$tracked_post_types, true)) {
            return;
        }

        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        if ($post->post_status === 'publish') {
            self::queue_sync([
                'trigger'    => 'post_delete',
                'post_id'    => $post_id,
                'post_type'  => $post->post_type,
                'post_title' => get_the_title($post_id),
                'action'     => 'permanently deleted',
                'timestamp'  => current_time('mysql')
            ]);
        }
    }

    /**
     * Queue a sync payload in-memory.
     * Prevents multiple hooks during a single request (e.g. meta save + taxonomy + status transition)
     * from triggering multiple webhooks.
     */
    public static function queue_sync(array $info) {
        self::$queued_sync = $info;
    }

    /**
     * Dispatch the webhook on PHP shutdown
     */
    public static function execute_queued_sync() {
        if (!self::$queued_sync) {
            return;
        }

        $info = self::$queued_sync;
        self::$queued_sync = null;

        self::trigger_build($info);
    }

    /**
     * Send HTTP POST to Cloudflare Deploy Hook (or GitHub Dispatch URL)
     */
    public static function trigger_build(array $context = [], $ignore_debounce = false) {
        $hook_url = self::get_deploy_hook_url();

        if (empty($hook_url)) {
            self::record_sync_result([
                'status'    => 'error',
                'message'   => 'Deploy Hook URL is not configured. Rebuild skipped.',
                'context'   => $context,
                'timestamp' => current_time('mysql')
            ]);
            return false;
        }

        // Check debounce transient lock to prevent rapid successive builds
        if (!$ignore_debounce && get_transient(self::TRANSIENT_LOCK)) {
            self::record_sync_result([
                'status'    => 'debounced',
                'message'   => 'Sync coalesced: another build was triggered less than ' . self::DEBOUNCE_SECONDS . 's ago.',
                'context'   => $context,
                'timestamp' => current_time('mysql')
            ]);
            return true;
        }

        // Set debounce lock
        set_transient(self::TRANSIENT_LOCK, 1, self::DEBOUNCE_SECONDS);

        // Prepare request headers & body
        $headers = [
            'User-Agent' => 'RAIN07-WordPress-Sync/1.0',
            'Accept'     => 'application/json'
        ];
        $body = '';

        // Support GitHub repository dispatch if a GitHub API URL is provided
        if (strpos($hook_url, 'api.github.com') !== false) {
            $headers['Content-Type'] = 'application/json';
            $body = wp_json_encode([
                'event_type' => 'wordpress_sync',
                'client_payload' => [
                    'source'    => 'wordpress',
                    'timestamp' => time()
                ]
            ]);
        }

        // Non-blocking asynchronous POST to never delay WordPress admin user experience
        $response = wp_remote_post($hook_url, [
            'method'    => 'POST',
            'timeout'   => 8,
            'blocking'  => true, // Block briefly to capture diagnostic HTTP status code for admin display
            'headers'   => $headers,
            'body'      => $body,
            'sslverify' => true
        ]);

        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();
            self::record_sync_result([
                'status'    => 'failed',
                'message'   => 'HTTP request failed: ' . sanitize_text_field($error_message),
                'context'   => $context,
                'timestamp' => current_time('mysql')
            ]);
            return false;
        }

        $code = wp_remote_retrieve_response_code($response);
        $is_success = ($code >= 200 && $code < 300);

        self::record_sync_result([
            'status'      => $is_success ? 'success' : 'failed',
            'http_code'   => $code,
            'message'     => $is_success ? "Build triggered successfully (HTTP $code)" : "Cloudflare returned HTTP $code",
            'context'     => $context,
            'timestamp'   => current_time('mysql')
        ]);

        return $is_success;
    }

    /**
     * Store last sync diagnosis in wp_options without leaking full secret URL
     */
    private static function record_sync_result(array $data) {
        update_option(self::OPTION_LAST_SYNC, $data, false);
    }

    /**
     * Handle manual sync click from admin
     */
    public static function handle_manual_sync() {
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized user.', 'rain07'));
        }
        check_admin_referer('rain07_manual_sync_action');

        $success = self::trigger_build([
            'trigger'    => 'manual_admin_click',
            'user'       => wp_get_current_user()->user_login,
            'timestamp'  => current_time('mysql')
        ], true); // Ignore debounce on manual trigger

        $redirect = add_query_arg([
            'page'             => 'rain07-sync-settings',
            'rain07_sync_done' => $success ? '1' : '0'
        ], admin_url('options-general.php'));

        wp_safe_redirect($redirect);
        exit;
    }

    /**
     * Add Settings Menu
     */
    public static function add_admin_menu() {
        add_options_page(
            'RAIN07 Live Sync',
            'RAIN07 Sync',
            'manage_options',
            'rain07-sync-settings',
            [__CLASS__, 'render_settings_page']
        );
    }

    /**
     * Register Settings
     */
    public static function register_settings() {
        register_setting('rain07_sync_settings_group', self::OPTION_HOOK_URL, [
            'type'              => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default'           => ''
        ]);
    }

    /**
     * Admin bar quick button
     */
    public static function add_admin_bar_sync_button($wp_admin_bar) {
        if (!current_user_can('manage_options')) {
            return;
        }

        $sync_url = wp_nonce_url(
            admin_url('admin-post.php?action=rain07_manual_sync'),
            'rain07_manual_sync_action'
        );

        $wp_admin_bar->add_node([
            'id'    => 'rain07_sync_node',
            'title' => '<span class="ab-icon dashicons dashicons-update"></span> Sync RAIN07 Live',
            'href'  => $sync_url,
            'meta'  => [
                'title' => 'Trigger immediate Cloudflare static rebuild'
            ]
        ]);
    }

    /**
     * Admin notices after manual trigger
     */
    public static function render_admin_notices() {
        if (!isset($_GET['rain07_sync_done'])) {
            return;
        }
        $done = $_GET['rain07_sync_done'] === '1';
        $class = $done ? 'notice-success' : 'notice-error';
        $message = $done
            ? '<strong>RAIN07 Sync:</strong> Cloudflare rebuild request sent successfully!'
            : '<strong>RAIN07 Sync:</strong> Failed to trigger Cloudflare rebuild. Please check your Deploy Hook URL configuration.';
        echo '<div class="notice ' . esc_attr($class) . ' is-dismissible"><p>' . $message . '</p></div>';
    }

    /**
     * Settings Page UI (Brutalist aesthetic matching RAIN07)
     */
    public static function render_settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        $configured_url = self::get_deploy_hook_url();
        $is_constant    = defined('RAIN07_DEPLOY_HOOK_URL') && !empty(RAIN07_DEPLOY_HOOK_URL);
        $last_sync      = get_option(self::OPTION_LAST_SYNC, []);
        $manual_sync_url = wp_nonce_url(
            admin_url('admin-post.php?action=rain07_manual_sync'),
            'rain07_manual_sync_action'
        );
        ?>
        <div class="wrap" style="max-width: 900px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="border-bottom: 3px solid #111; padding-bottom: 12px; margin-bottom: 24px;">
                <h1 style="font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.03em; margin: 0 0 6px 0;">
                    RAIN07 // Cloudflare Live Sync
                </h1>
                <p style="font-family: monospace; font-size: 13px; color: #555; margin: 0;">
                    Automatic static rebuild triggers for WordPress Technical Notes & Portfolio CPT
                </p>
            </div>

            <!-- Manual Trigger Box -->
            <div style="background: #F2F0EA; border: 2px solid #111; padding: 20px; margin-bottom: 24px; box-shadow: 4px 4px 0 #111;">
                <h2 style="font-size: 16px; font-weight: 900; text-transform: uppercase; margin: 0 0 8px 0;">
                    ⚡ Immediate Synchronization
                </h2>
                <p style="font-size: 14px; margin: 0 0 16px 0; color: #222;">
                    Force a static build on Cloudflare immediately without modifying any posts.
                </p>
                <a href="<?php echo esc_url($manual_sync_url); ?>" 
                   class="button button-primary" 
                   style="background: #111; border-color: #111; border-radius: 0; font-weight: 700; text-transform: uppercase; padding: 6px 18px; height: auto;">
                    SYNC TO LIVE SITE NOW →
                </a>
            </div>

            <!-- Configuration Form -->
            <div style="background: #fff; border: 2px solid #111; padding: 20px; margin-bottom: 24px; box-shadow: 4px 4px 0 #111;">
                <h2 style="font-size: 16px; font-weight: 900; text-transform: uppercase; margin: 0 0 12px 0;">
                    Configuration
                </h2>

                <?php if ($is_constant): ?>
                    <div style="background: #e7f3fe; border-left: 4px solid #0057FF; padding: 12px; margin-bottom: 16px; font-size: 13px;">
                        <strong>Configured via <code>wp-config.php</code>:</strong> The deploy hook URL is defined securely in code via <code>RAIN07_DEPLOY_HOOK_URL</code> constant.
                    </div>
                <?php endif; ?>

                <form method="post" action="options.php">
                    <?php settings_fields('rain07_sync_settings_group'); ?>
                    
                    <table class="form-table" style="margin-top: 0;">
                        <tr>
                            <th scope="row" style="padding-top: 10px;">
                                <label for="<?php echo esc_attr(self::OPTION_HOOK_URL); ?>" style="font-weight: 700;">
                                    Cloudflare Deploy Hook URL
                                </label>
                            </th>
                            <td style="padding-top: 10px;">
                                <input type="password" 
                                       id="<?php echo esc_attr(self::OPTION_HOOK_URL); ?>" 
                                       name="<?php echo esc_attr(self::OPTION_HOOK_URL); ?>" 
                                       value="<?php echo esc_attr(get_option(self::OPTION_HOOK_URL, '')); ?>" 
                                       class="regular-text" 
                                       style="width: 100%; max-width: 550px; font-family: monospace; border-radius: 0; border: 2px solid #111;"
                                       <?php echo $is_constant ? 'disabled' : ''; ?>
                                       placeholder="https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/..." />
                                
                                <button type="button" 
                                        onclick="const f = document.getElementById('<?php echo esc_js(self::OPTION_HOOK_URL); ?>'); f.type = f.type === 'password' ? 'text' : 'password';" 
                                        class="button" 
                                        style="border-radius: 0; margin-left: 6px;">
                                    Show/Hide
                                </button>
                                
                                <p class="description" style="margin-top: 8px;">
                                    Obtained from Cloudflare Dashboard &rarr; Workers & Pages &rarr; <code>rain07-portfolio</code> &rarr; Settings &rarr; Builds &rarr; Deploy Hooks.<br>
                                    Alternatively, define <code>define('RAIN07_DEPLOY_HOOK_URL', 'https://...');</code> in your <code>wp-config.php</code>.
                                </p>
                            </td>
                        </tr>
                    </table>

                    <?php if (!$is_constant): ?>
                        <?php submit_button('SAVE HOOK URL', 'primary', 'submit', false, [
                            'style' => 'background: #111; border-color: #111; border-radius: 0; font-weight: 700; text-transform: uppercase; padding: 6px 18px; margin-top: 10px;'
                        ]); ?>
                    <?php endif; ?>
                </form>
            </div>

            <!-- Diagnostics Box -->
            <div style="background: #fff; border: 2px solid #111; padding: 20px; box-shadow: 4px 4px 0 #111;">
                <h2 style="font-size: 16px; font-weight: 900; text-transform: uppercase; margin: 0 0 12px 0;">
                    Latest Synchronization Status
                </h2>

                <?php if (empty($last_sync)): ?>
                    <p style="font-size: 13px; color: #777; margin: 0;">No synchronization recorded yet.</p>
                <?php else: ?>
                    <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 13px;">
                        <tr>
                            <td style="padding: 6px 0; width: 140px; font-weight: bold; border-bottom: 1px solid #eee;">Status:</td>
                            <td style="padding: 6px 0; border-bottom: 1px solid #eee;">
                                <?php
                                $status = $last_sync['status'] ?? 'unknown';
                                $bg = $status === 'success' ? '#d4edda' : ($status === 'debounced' ? '#fff3cd' : '#f8d7da');
                                $color = $status === 'success' ? '#155724' : ($status === 'debounced' ? '#856404' : '#721c24');
                                ?>
                                <span style="display: inline-block; padding: 2px 8px; font-weight: bold; text-transform: uppercase; background: <?php echo $bg; ?>; color: <?php echo $color; ?>; border: 1px solid currentColor;">
                                    <?php echo esc_html(strtoupper($status)); ?>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #eee;">Message:</td>
                            <td style="padding: 6px 0; border-bottom: 1px solid #eee;">
                                <?php echo esc_html($last_sync['message'] ?? 'N/A'); ?>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #eee;">Timestamp:</td>
                            <td style="padding: 6px 0; border-bottom: 1px solid #eee;">
                                <?php echo esc_html($last_sync['timestamp'] ?? 'N/A'); ?>
                            </td>
                        </tr>
                        <?php if (!empty($last_sync['context'])): ?>
                            <tr>
                                <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Context:</td>
                                <td style="padding: 6px 0;">
                                    <pre style="margin: 0; background: #F2F0EA; padding: 8px; border: 1px solid #ccc; font-size: 12px;"><?php 
                                        echo esc_html(wp_json_encode($last_sync['context'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)); 
                                    ?></pre>
                                </td>
                            </tr>
                        <?php endif; ?>
                    </table>
                <?php endif; ?>
            </div>
        </div>
        <?php
    }
}

add_action('plugins_loaded', ['RAIN07_Cloudflare_Sync', 'init']);
