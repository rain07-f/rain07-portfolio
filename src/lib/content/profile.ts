/**
 * Factual professional background data for RAIN07
 * Source of truth: LinkedIn profile — Reyno Nur Fahreza
 */

export interface ExperienceRole {
  title: string;
  org: string;
  period: string;
  category: 'ENGINEERING' | 'DEVELOPMENT' | 'INFRASTRUCTURE' | 'BUSINESS';
  summary: string;
  scope: string[];
  technologies: string[];
}

export const EXPERIENCE_ROLES: ExperienceRole[] = [
  {
    title: 'WORDPRESS WEBMASTER & SYSTEM ADMINISTRATION SUPPORT',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: '2020 – PRESENT',
    category: 'DEVELOPMENT',
    summary: 'WordPress operations, custom development, performance, security, and Linux server administration support.',
    scope: [
      'WordPress development, customization and maintenance',
      'Performance optimization and security hardening',
      'Linux server administration support',
      'Plugin management and content management systems'
    ],
    technologies: ['WordPress', 'Elementor Pro', 'WooCommerce', 'LiteSpeed Cache', 'Linux', 'PHP']
  },
  {
    title: 'PROJECT ESTIMATOR',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'AUG 2021 – PRESENT',
    category: 'ENGINEERING',
    summary: 'Technical estimation, equipment sizing, BOQ/RAB preparation, specifications, and project support.',
    scope: [
      'Bill of Quantities (BOQ) and RAB preparation',
      'Equipment sizing and technical specifications',
      'Power and UPS load calculations',
      'Vendor coordination and procurement support'
    ],
    technologies: ['BOQ / RAB', 'Hardware Sizing', 'Technical Specs', 'Power Load Estimation']
  },
  {
    title: 'BUSINESS DEVELOPMENT STAFF',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'AUG 2023 – SEP 2024',
    category: 'BUSINESS',
    summary: 'Business development activities, client engagement, and technical sales support.',
    scope: [
      'Client relationship and business development',
      'Technical proposal preparation',
      'Project opportunity identification and follow-up'
    ],
    technologies: ['Technical Proposals', 'Project Documentation']
  },
  {
    title: 'ACCOUNT MANAGER & PROJECT ESTIMATOR',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'JAN 2022 – DEC 2022',
    category: 'ENGINEERING',
    summary: 'Combined account management and project estimation responsibilities.',
    scope: [
      'Client account management and project coordination',
      'Technical estimation and BOQ preparation',
      'Project scope and timeline planning'
    ],
    technologies: ['BOQ / RAB', 'Project Planning', 'Client Management']
  },
  {
    title: 'PROJECT PLANNER',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'SEP 2020 – JUL 2021',
    category: 'ENGINEERING',
    summary: 'Project planning, scheduling, and technical coordination for IT infrastructure projects.',
    scope: [
      'Project scheduling and milestone tracking',
      'Technical documentation and coordination',
      'Site readiness and installation planning'
    ],
    technologies: ['Project Planning', 'Technical Documentation', 'IT Infrastructure']
  },
  {
    title: 'INFORMATION TECHNOLOGY PROJECT ENGINEER',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'MAY 2015 – SEP 2020',
    category: 'INFRASTRUCTURE',
    summary: 'IT project engineering covering network, server, CCTV, and infrastructure deployment.',
    scope: [
      'Network and server infrastructure deployment',
      'CCTV and NVR system installation',
      'NAS storage and UPS setup',
      'Technical site surveys and installation'
    ],
    technologies: ['MikroTik', 'CCTV / NVR', 'NAS', 'UPS', 'Networking', 'Linux']
  },
  {
    title: 'INFORMATION TECHNOLOGY TECHNICAL SUPPORT',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'MAY 2015 – SEP 2020',
    category: 'INFRASTRUCTURE',
    summary: 'IT technical support for hardware, software, networking, and end-user systems.',
    scope: [
      'Hardware and software troubleshooting',
      'Network configuration and maintenance',
      'End-user support and system maintenance'
    ],
    technologies: ['IT Support', 'Networking', 'Hardware', 'Windows / Linux']
  },
  {
    title: 'WORDPRESS WEBMASTER',
    org: 'FREELANCE',
    period: 'MAY 2019 – PRESENT',
    category: 'DEVELOPMENT',
    summary: 'WordPress development, customization, performance optimization, security, and maintenance.',
    scope: [
      'WordPress theme customization and development',
      'WooCommerce setup and configuration',
      'Performance optimization and security',
      'Site maintenance and updates'
    ],
    technologies: ['WordPress', 'Elementor Pro', 'WooCommerce', 'PHP', 'MySQL']
  }
];

export interface TechItem {
  id: string;
  name: string;
  category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'INFRASTRUCTURE' | 'CLOUD & NETWORKING' | 'ESTIMATION & ENGINEERING';
  badge: string;
}

export const TECH_INVENTORY: TechItem[] = [
  { id: '01', name: 'ASTRO', category: 'FRONTEND', badge: 'SSG' },
  { id: '02', name: 'TYPESCRIPT', category: 'FRONTEND', badge: 'Typed JS' },
  { id: '03', name: 'TAILWIND CSS', category: 'FRONTEND', badge: 'v4' },
  { id: '04', name: 'WORDPRESS', category: 'BACKEND', badge: '5-7 YRS' },
  { id: '05', name: 'ELEMENTOR PRO', category: 'FRONTEND', badge: 'Page Builder' },
  { id: '06', name: 'WOOCOMMERCE', category: 'BACKEND', badge: 'E-Commerce' },
  { id: '07', name: 'LARAVEL', category: 'BACKEND', badge: 'PHP Framework' },
  { id: '08', name: 'PHP', category: 'BACKEND', badge: '8.x' },
  { id: '09', name: 'MYSQL / MARIADB', category: 'DATABASE', badge: 'Relational' },
  { id: '10', name: 'POSTGRESQL', category: 'DATABASE', badge: 'Relational' },
  { id: '11', name: 'LINUX', category: 'INFRASTRUCTURE', badge: 'SysAdmin' },
  { id: '12', name: 'NGINX / LITESPEED', category: 'INFRASTRUCTURE', badge: 'Web Server' },
  { id: '13', name: 'DOCKER & TRAEFIK', category: 'INFRASTRUCTURE', badge: 'Containers' },
  { id: '14', name: 'PROXMOX', category: 'INFRASTRUCTURE', badge: 'Hypervisor' },
  { id: '15', name: 'CLOUDFLARE', category: 'CLOUD & NETWORKING', badge: 'DNS / CDN' },
  { id: '16', name: 'MIKROTIK', category: 'CLOUD & NETWORKING', badge: 'Routing / FW' },
  { id: '17', name: 'TAILSCALE', category: 'CLOUD & NETWORKING', badge: 'Mesh VPN' },
  { id: '18', name: 'BOQ & RAB', category: 'ESTIMATION & ENGINEERING', badge: 'Estimation' },
  { id: '19', name: 'CCTV / NVR', category: 'ESTIMATION & ENGINEERING', badge: 'Hardware' },
  { id: '20', name: 'NAS & UPS', category: 'ESTIMATION & ENGINEERING', badge: 'Hardware' }
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
    title: 'WEB DEVELOPMENT',
    description: 'Website and web application development using Astro, WordPress and Laravel.',
    deliverables: ['Astro static sites', 'WordPress & WooCommerce', 'Laravel applications & REST APIs']
  },
  {
    id: '02',
    title: 'WORDPRESS',
    description: 'Custom WordPress websites, Elementor, WooCommerce, performance and maintenance.',
    deliverables: ['Custom theme & plugin work', 'WooCommerce setup', 'Performance & security']
  },
  {
    id: '03',
    title: 'SERVER / VPS',
    description: 'Linux VPS setup, web server configuration, SSL, DNS and maintenance.',
    deliverables: ['Nginx / LiteSpeed / Docker setup', 'Proxmox & hosting panels', 'SSL, DNS & Cloudflare']
  },
  {
    id: '04',
    title: 'NETWORK / IT INFRASTRUCTURE',
    description: 'Network, server, CCTV, storage and supporting IT infrastructure.',
    deliverables: ['MikroTik configuration', 'CCTV / NVR / NAS setup', 'Structured cabling & VLAN']
  },
  {
    id: '05',
    title: 'PROJECT ESTIMATION',
    description: 'BOQ/RAB, technical specifications, equipment sizing and project estimation.',
    deliverables: ['Bill of Quantities (BOQ)', 'Rencana Anggaran Biaya (RAB)', 'Equipment & power sizing']
  }
];
