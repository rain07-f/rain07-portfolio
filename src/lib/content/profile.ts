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
    summary: 'Maintain and customise WordPress websites, handle plugin updates, troubleshoot issues, and support Linux server operations.',
    scope: [
      'Customise and maintain WordPress themes and plugins',
      'Troubleshoot website issues and tune performance',
      'Provide Linux server administration support',
      'Handle security updates, plugin maintenance, and backups'
    ],
    technologies: ['WordPress', 'Elementor Pro', 'WooCommerce', 'LiteSpeed Cache', 'Linux', 'PHP']
  },
  {
    title: 'PROJECT ESTIMATOR',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'AUG 2021 – PRESENT',
    category: 'ENGINEERING',
    summary: 'Prepare BOQ/RAB, select and size equipment, calculate power and UPS requirements, and coordinate technical details with vendors.',
    scope: [
      'Prepare Bill of Quantities (BOQ) and RAB documentation',
      'Size hardware and review technical specifications',
      'Calculate power loads and UPS capacity requirements',
      'Coordinate technical requirements with vendors and procurement'
    ],
    technologies: ['BOQ / RAB', 'Hardware Sizing', 'Technical Specs', 'Power Load Estimation']
  },
  {
    title: 'BUSINESS DEVELOPMENT STAFF',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'AUG 2023 – SEP 2024',
    category: 'BUSINESS',
    summary: 'Support client discussions, prepare technical proposals, and follow up on project opportunities.',
    scope: [
      'Participate in client meetings and requirement discussions',
      'Prepare technical proposals and project bids',
      'Follow up on new project opportunities and specifications'
    ],
    technologies: ['Technical Proposals', 'Project Documentation']
  },
  {
    title: 'ACCOUNT MANAGER & PROJECT ESTIMATOR',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'JAN 2022 – DEC 2022',
    category: 'ENGINEERING',
    summary: 'Handle client coordination alongside project costing, BOQ preparation, and scope planning.',
    scope: [
      'Manage client communication and project requirements',
      'Prepare project costing and detailed BOQ estimates',
      'Align project scope with budget and technical timelines'
    ],
    technologies: ['BOQ / RAB', 'Project Planning', 'Client Management']
  },
  {
    title: 'PROJECT PLANNER',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'SEP 2020 – JUL 2021',
    category: 'ENGINEERING',
    summary: 'Plan project schedules, coordinate technical requirements, and prepare sites for installation work.',
    scope: [
      'Create project timelines and track implementation milestones',
      'Coordinate technical documentation between teams',
      'Assess site conditions and prepare for installation work'
    ],
    technologies: ['Project Planning', 'Technical Documentation', 'IT Infrastructure']
  },
  {
    title: 'INFORMATION TECHNOLOGY PROJECT ENGINEER',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'MAY 2015 – SEP 2020',
    category: 'INFRASTRUCTURE',
    summary: 'Worked on IT infrastructure projects involving networks, servers, CCTV/NVR, NAS storage, and UPS systems.',
    scope: [
      'Deploy network infrastructure, switches, and routers',
      'Install and configure CCTV cameras and NVR recording systems',
      'Set up NAS storage units and backup UPS power',
      'Conduct technical site surveys and oversee installation work'
    ],
    technologies: ['MikroTik', 'CCTV / NVR', 'NAS', 'UPS', 'Networking', 'Linux']
  },
  {
    title: 'INFORMATION TECHNOLOGY TECHNICAL SUPPORT',
    org: 'PT. DCT TOTAL SOLUTIONS',
    period: 'MAY 2015 – SEP 2020',
    category: 'INFRASTRUCTURE',
    summary: 'Troubleshoot hardware, software, network, and end-user issues.',
    scope: [
      'Troubleshoot desktop hardware, OS, and software issues',
      'Configure local network connections and peripherals',
      'Provide direct technical support for end-users'
    ],
    technologies: ['IT Support', 'Networking', 'Hardware', 'Windows / Linux']
  },
  {
    title: 'WORDPRESS WEBMASTER',
    org: 'FREELANCE',
    period: 'MAY 2019 – PRESENT',
    category: 'DEVELOPMENT',
    summary: 'Build and customise WordPress websites, configure WooCommerce, and handle maintenance and performance improvements.',
    scope: [
      'Build and customise WordPress themes and pages',
      'Configure WooCommerce stores and settings',
      'Optimize site speed, security, and mobile responsiveness',
      'Handle routine maintenance, core updates, and backups'
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
    description: 'Business websites and web applications built around your requirements.',
    deliverables: ['Custom responsive websites', 'Full-stack web applications', 'REST API and database integration']
  },
  {
    id: '02',
    title: 'WORDPRESS',
    description: 'WordPress and WooCommerce setup, customisation, fixes, and maintenance.',
    deliverables: ['Custom theme and plugin adjustments', 'Online store setup and payment workflows', 'Performance tuning and security hardening']
  },
  {
    id: '03',
    title: 'SERVER / VPS',
    description: 'VPS setup, web server configuration, SSL, DNS, and ongoing maintenance.',
    deliverables: ['Nginx, LiteSpeed, and Docker setups', 'Proxmox hypervisors and control panels', 'Cloudflare CDN and domain management']
  },
  {
    id: '04',
    title: 'NETWORK / IT INFRASTRUCTURE',
    description: 'Network setup, server deployment, CCTV/NVR, NAS, and related infrastructure work.',
    deliverables: ['MikroTik routing and firewall policies', 'CCTV, NVR, and network storage installation', 'Structured cabling and network segmentation']
  },
  {
    id: '05',
    title: 'PROJECT ESTIMATION',
    description: 'Equipment sizing, technical specifications, BOQ/RAB, and power calculations.',
    deliverables: ['Bill of Quantities (BOQ) preparation', 'Rencana Anggaran Biaya (RAB) costing', 'Hardware load and battery backup planning']
  }
];
