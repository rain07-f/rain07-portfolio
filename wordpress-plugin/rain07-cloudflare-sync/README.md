# RAIN07 Cloudflare Deploy Sync (WordPress Plugin)

Automated, debounced, zero-frontend-overhead WordPress plugin that triggers Cloudflare static rebuilds whenever:
- Technical Notes (standard WordPress `post`) are published, updated, unpublished, or deleted.
- Portfolio items (WordPress `portfolio` custom post type) are published, updated, unpublished, or deleted.

---

## Features

1. **Strictly Filtered**:
   - Only listens to `post` and `portfolio` post types.
   - Ignores autosaves (`DOING_AUTOSAVE`) and post revisions (`wp_is_post_revision`).
   - Ignores draft-to-draft, pending-to-draft, or trash-to-trash edits that cannot affect the public website.
2. **Debounce / Anti-Duplicate Protection**:
   - Uses a 25-second transient lock so multiple rapid updates (e.g. metadata save, taxonomy term attachment, status transition) coalesce into a single webhook dispatch.
3. **Non-blocking / Asynchronous Execution**:
   - Runs during WordPress `shutdown` to ensure database transactions complete first and the WordPress editor UI never freezes or waits on external build queues.
4. **Zero Frontend Footprint**:
   - Code executes exclusively in administrative or REST/CRON contexts. Zero scripts or styles are loaded on the public WordPress frontend.
5. **Brutalist Admin Dashboard & Manual Trigger**:
   - Includes a "SYNC TO LIVE SITE NOW" button in `Settings > RAIN07 Sync` and the top Admin Bar for on-demand synchronization.
   - Diagnostic table displays last sync time, trigger context, HTTP response code, and debounce status without exposing private URLs.

---

## Installation Options

### Option A: Must-Use Plugin (Recommended for Production)
Place `rain07-cloudflare-sync.php` directly in your WordPress `wp-content/mu-plugins/` directory:
```
wp-content/mu-plugins/rain07-cloudflare-sync.php
```
*Must-Use (MU) plugins are automatically enabled and cannot be accidentally deactivated from the WordPress admin.*

### Option B: Standard Plugin
Upload the `rain07-cloudflare-sync` folder to your WordPress `wp-content/plugins/` directory:
```
wp-content/plugins/rain07-cloudflare-sync/rain07-cloudflare-sync.php
```
Then navigate to **WordPress Admin &rarr; Plugins &rarr; Installed Plugins** and click **Activate**.

---

## Configuration

### Method 1: `wp-config.php` (Recommended for Highest Security)
Add your Cloudflare Deploy Hook URL to `wp-config.php` above `/* That's all, stop editing! */`:
```php
define('RAIN07_DEPLOY_HOOK_URL', 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/YOUR_DEPLOY_HOOK_ID');
```
*When defined in `wp-config.php`, the setting in WP Admin becomes read-only and cannot be altered or leaked via the database.*

### Method 2: WordPress Admin Dashboard
1. Go to **Settings &rarr; RAIN07 Sync**.
2. Paste your Cloudflare Deploy Hook URL into the input field.
3. Click **SAVE HOOK URL**.

---

## How to Get Your Cloudflare Deploy Hook URL

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** &rarr; select **rain07-portfolio**.
3. Go to **Settings** &rarr; **Builds** &rarr; scroll to **Deploy Hooks**.
4. Click **Add Deploy Hook**:
   - **Deploy hook name**: `WordPress Sync (RAIN07)`
   - **Branch**: `main`
5. Copy the generated URL and save it in your WordPress configuration.
