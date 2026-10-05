/**
 * Factual professional background data for RAIN07
 * Strictly complies with provided user profile specifications without fabricating dates or metrics.
 */

export interface ExperienceRole {
  title: string;
  category: 'ENGINEERING' | 'DEVELOPMENT' | 'INFRASTRUCTURE';
  summary: string;
  scope: string[];
  technologies: string[];
}

export const EXPERIENCE_ROLES: ExperienceRole[] = [
  {
    title: 'FULL-STACK WEB DEVELOPER',
    category: 'DEVELOPMENT',
    summary: 'Designing, building, and maintaining production-grade web applications and decoupled architectures.',
    scope: [
      'Full-stack application development with modern architectures',
      'REST API design, authentication, authorization, and data contracts',
      'Integration between Headless CMS backends and modern frontend frameworks',
      'Database schema planning, Eloquent ORM modeling, and query tuning'
    ],
    technologies: ['Astro', 'TypeScript', 'Tailwind CSS', 'Laravel', 'PHP', 'Livewire', 'MySQL', 'REST APIs']
  },
  {
    title: 'WORDPRESS DEVELOPER',
    category: 'DEVELOPMENT',
    summary: '5–7 years practical experience building custom WordPress and WooCommerce solutions with custom fields and dynamic content.',
    scope: [
      'Custom theme and component development using Elementor Pro, Gutenberg, and modern builders',
      'WooCommerce store setup, checkout flow customization, and payment integration',
      'Headless WordPress API configuration and Custom Post Type architecture',
      'Performance tuning with LiteSpeed Cache, Redis object cache, and Core Web Vitals remediation'
    ],
    technologies: ['WordPress', 'Elementor Pro', 'WooCommerce', 'Gutenberg', 'Crocoblock', 'Bricks Builder', 'Blocksy', 'LiteSpeed Cache']
  },
  {
    title: 'LARAVEL / BACKEND DEVELOPER',
    category: 'DEVELOPMENT',
    summary: 'Engineering business-critical CRUD systems, SaaS architectures, and multi-tenant applications with Laravel.',
    scope: [
      'Authentication and role management using Laravel Sanctum, Breeze, and Spatie Permission',
      'Data import/export pipelines with Laravel Excel and queue/background processing concepts',
      'Multi-tenant systems and SaaS domain routing',
      'Robust error handling, audit logging, and transactional database integrity'
    ],
    technologies: ['Laravel', 'PHP', 'Blade', 'Livewire', 'Sanctum', 'Breeze', 'Spatie', 'Eloquent', 'PostgreSQL', 'MariaDB']
  },
  {
    title: 'LINUX SYSTEM ADMINISTRATOR',
    category: 'INFRASTRUCTURE',
    summary: 'Managing cloud VPS instances, virtual environments, reverse proxies, and operating system hardening.',
    scope: [
      'Linux server provisioning, firewall rules, and SSH key management',
      'Web server tuning across Nginx, LiteSpeed, and Apache',
      'Containerized deployments with Docker and Traefik reverse proxies',
      'Hypervisor management with Proxmox VE and hosting panels (CloudPanel, CyberPanel, aaPanel)'
    ],
    technologies: ['Linux', 'Ubuntu / Debian', 'Nginx', 'LiteSpeed', 'Docker', 'Traefik', 'Proxmox', 'Redis', 'CloudPanel']
  },
  {
    title: 'IT INFRASTRUCTURE & NETWORK ENGINEER',
    category: 'INFRASTRUCTURE',
    summary: 'Designing, deploying, and managing physical and edge network infrastructure for reliability and uptime.',
    scope: [
      'Network engineering: TCP/IP, DNS, DHCP, NAT, IPv4, IPv6, and MikroTik router configurations',
      'Secure site-to-site connectivity and remote mesh VPNs using Tailscale',
      'Deployment of managed switches, VLAN segmentation, access points, and structured cabling',
      'Surveillance and storage: CCTV IP cameras, NVR systems, NAS storage, and UPS battery load sizing'
    ],
    technologies: ['MikroTik', 'Tailscale', 'TCP/IP', 'VLAN', 'Managed Switches', 'CCTV / NVR', 'NAS', 'UPS Sizing']
  },
  {
    title: 'IT PROJECT ESTIMATOR & PROJECT ENGINEER',
    category: 'ENGINEERING',
    summary: 'Translating business requirements into detailed technical specifications, equipment sizing, and budget estimates.',
    scope: [
      'Preparation of Bill of Quantities (BOQ) and Rencana Anggaran Biaya (RAB)',
      'Server sizing, network bandwidth planning, and electrical power/UPS load calculations',
      'Technical drawings, equipment specification sheets, and vendor coordination',
      'Site installation readiness validation and procurement technical clarification'
    ],
    technologies: ['BOQ / RAB', 'Technical Drawings', 'Hardware Sizing', 'Power Load Estimation', 'Procurement Specs']
  }
];

export interface TechItem {
  id: string;
  name: string;
  category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'INFRASTRUCTURE' | 'CLOUD & NETWORKING' | 'ESTIMATION & ENGINEERING';
  badge: string;
}

export const TECH_INVENTORY: TechItem[] = [
  { id: '01', name: 'ASTRO', category: 'FRONTEND', badge: 'v7 / SSG' },
  { id: '02', name: 'TYPESCRIPT', category: 'FRONTEND', badge: 'Strict' },
  { id: '03', name: 'TAILWIND CSS', category: 'FRONTEND', badge: 'v4' },
  { id: '04', name: 'WORDPRESS', category: 'BACKEND', badge: '5-7 YRS' },
  { id: '05', name: 'ELEMENTOR PRO', category: 'FRONTEND', badge: 'Advanced' },
  { id: '06', name: 'WOOCOMMERCE', category: 'BACKEND', badge: 'Customized' },
  { id: '07', name: 'LARAVEL', category: 'BACKEND', badge: 'SaaS / CRUD' },
  { id: '08', name: 'PHP', category: 'BACKEND', badge: '8.x' },
  { id: '09', name: 'MYSQL / MARIADB', category: 'DATABASE', badge: 'Relational' },
  { id: '10', name: 'POSTGRESQL', category: 'DATABASE', badge: 'Relational' },
  { id: '11', name: 'LINUX', category: 'INFRASTRUCTURE', badge: 'SysAdmin' },
  { id: '12', name: 'VPS HOSTING', category: 'INFRASTRUCTURE', badge: 'Production' },
  { id: '13', name: 'NGINX / LITESPEED', category: 'INFRASTRUCTURE', badge: 'Web Server' },
  { id: '14', name: 'DOCKER & TRAEFIK', category: 'INFRASTRUCTURE', badge: 'Containers' },
  { id: '15', name: 'CLOUDFLARE', category: 'CLOUD & NETWORKING', badge: 'Workers / DNS' },
  { id: '16', name: 'PROXMOX VE', category: 'INFRASTRUCTURE', badge: 'Hypervisor' },
  { id: '17', name: 'MIKROTIK', category: 'CLOUD & NETWORKING', badge: 'Routing / FW' },
  { id: '18', name: 'TAILSCALE', category: 'CLOUD & NETWORKING', badge: 'Mesh VPN' },
  { id: '19', name: 'BOQ & RAB ESTIMATION', category: 'ESTIMATION & ENGINEERING', badge: 'Costing' },
  { id: '20', name: 'CCTV, NAS & UPS', category: 'ESTIMATION & ENGINEERING', badge: 'Hardware' }
];

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
}

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: '01',
    title: 'CUSTOM WEB & FULL-STACK DEVELOPMENT',
    description: 'High-performance websites, decoupled web applications, and content systems engineered for speed and conversion.',
    deliverables: ['Astro static/hybrid applications', 'WordPress & Headless CMS architectures', 'Custom Laravel systems & REST APIs']
  },
  {
    id: '02',
    title: 'WORDPRESS & WOOCOMMERCE ENGINEERING',
    description: 'Bespoke WordPress implementations backed by 5–7 years practical expertise without template bloat.',
    deliverables: ['Custom CPT & field structuring', 'WooCommerce store architecture', 'Speed & LiteSpeed cache tuning']
  },
  {
    id: '03',
    title: 'LINUX SERVER & VPS INFRASTRUCTURE',
    description: 'Production setup, security hardening, reverse proxying, and proactive maintenance for web servers.',
    deliverables: ['Nginx / LiteSpeed / Docker configuration', 'CloudPanel / aaPanel / Proxmox setup', 'SSL, DNS & Cloudflare edge integration']
  },
  {
    id: '04',
    title: 'NETWORKING & EDGE SECURITY',
    description: 'Robust network topology implementation connecting office, data center, and cloud resources.',
    deliverables: ['MikroTik firewall & NAT rules', 'Tailscale mesh routing', 'VLAN segmentation & managed switches']
  },
  {
    id: '05',
    title: 'IT PROJECT SIZING & ESTIMATION (BOQ/RAB)',
    description: 'Comprehensive technical and financial project calculations ensuring budget accuracy before physical deployment.',
    deliverables: ['Bill of Quantities (BOQ)', 'Rencana Anggaran Biaya (RAB)', 'UPS, power & server load calculations']
  }
];
