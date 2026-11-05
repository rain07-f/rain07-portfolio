/**
 * RAIN07 — Unified GSAP Motion Design System
 * 
 * Digital Engineering / Refined Brutalist Motion
 * - Performance-first: GPU-accelerated (transform & opacity only)
 * - Accessibility-first: Full prefers-reduced-motion compliance
 * - SEO & SSR safe: 100% visible fallback if JavaScript is disabled
 * - Lifecycle-safe: Scoped via gsap.context() with complete cleanup
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely on client only
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
  });
}

let activeMotionContext: gsap.Context | null = null;

/**
 * Check if the user has requested reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Clean up all active GSAP animations and ScrollTriggers.
 */
export function cleanupMotion(): void {
  if (activeMotionContext) {
    activeMotionContext.revert();
    activeMotionContext = null;
  }
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

/**
 * Initialize all GSAP animations across RAIN07 pages.
 */
export function initPageMotion(): void {
  if (typeof window === 'undefined') return;

  // 1. Accessibility guard: if reduced motion is requested, do not animate
  if (prefersReducedMotion()) {
    cleanupMotion();
    return;
  }

  // 2. Clean up any existing animations before creating new ones (prevents duplication)
  cleanupMotion();

  // 3. Create scoped GSAP context
  activeMotionContext = gsap.context(() => {
    initHeroMotion();
    initCoreServicesMotion();
    initSelectedWorkMotion();
    initExpertiseMotion();
    initAboutMotion();
    initContactMotion();
    initGenericPageMotion();
  });
}

/**
 * 01. HERO ANIMATION
 * - Line-based reveal for massive brutalist headline
 * - Subtle vertical movement & opacity for metadata, subtitle & description
 * - Clip-path wipe reveal for workstation image panel
 * - Staggered entrance for CTA buttons
 */
function initHeroMotion(): void {
  const heroSection = document.getElementById('home');
  if (!heroSection) return;

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.08
  });

  // Top metadata strip
  const metaBar = heroSection.querySelector('.hero-meta-bar');
  if (metaBar) {
    tl.from(metaBar, {
      y: -12,
      opacity: 0,
      duration: 0.45,
      clearProps: 'opacity,transform'
    }, 0);
  }

  // Subtitle badge
  const badge = heroSection.querySelector('.hero-badge');
  if (badge) {
    tl.from(badge, {
      y: 12,
      opacity: 0,
      duration: 0.4,
      clearProps: 'opacity,transform'
    }, 0.1);
  }

  // Headline line-by-line reveal
  const titleLines = heroSection.querySelectorAll('.hero-line');
  if (titleLines.length) {
    tl.from(titleLines, {
      yPercent: 110,
      opacity: 0,
      duration: 0.65,
      stagger: 0.12,
      clearProps: 'opacity,transform'
    }, 0.15);
  }

  // Description editorial paragraph
  const desc = heroSection.querySelector('.hero-desc');
  if (desc) {
    tl.from(desc, {
      y: 14,
      opacity: 0,
      duration: 0.5,
      clearProps: 'opacity,transform'
    }, 0.35);
  }

  // CTA buttons entrance
  const ctaButtons = heroSection.querySelectorAll('.hero-cta-btn');
  if (ctaButtons.length) {
    tl.from(ctaButtons, {
      y: 14,
      opacity: 0,
      duration: 0.45,
      stagger: 0.1,
      clearProps: 'opacity,transform'
    }, 0.45);
  }

  // Workstation framed image panel clip-path reveal
  const imageWrap = heroSection.querySelector('.hero-image-wrap');
  const heroImg = heroSection.querySelector('.hero-image');
  if (imageWrap) {
    tl.fromTo(
      imageWrap,
      { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 0.75,
        ease: 'power3.inOut',
        clearProps: 'clipPath'
      },
      0.2
    );

    if (heroImg) {
      tl.from(heroImg, {
        scale: 1.08,
        duration: 0.85,
        ease: 'power2.out',
        clearProps: 'transform'
      }, 0.2);
    }
  }

  // Bottom telemetry bar
  const telemetry = heroSection.querySelector('.hero-telemetry');
  if (telemetry) {
    tl.from(telemetry, {
      y: 8,
      opacity: 0,
      duration: 0.4,
      clearProps: 'opacity,transform'
    }, 0.55);
  }
}

/**
 * 02. CORE SERVICES ANIMATION
 * - Section header separate reveal
 * - Staggered entrance for the 2 service cards
 * - Micro-stagger for focus areas
 */
function initCoreServicesMotion(): void {
  const section = document.getElementById('services');
  if (!section) return;

  const header = section.querySelector('.services-header');
  const cards = section.querySelectorAll('.service-card');

  if (header) {
    gsap.from(header, {
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    });
  }

  if (cards.length) {
    gsap.from(cards, {
      scrollTrigger: {
        trigger: cards[0],
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.16,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    });

    // Stagger list items inside cards
    cards.forEach((card) => {
      const items = card.querySelectorAll('.service-focus-item');
      if (items.length) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
          },
          x: -10,
          opacity: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: 'power1.out',
          clearProps: 'opacity,transform'
        });
      }
    });
  }
}

/**
 * 03. SELECTED PROJECTS ANIMATION
 * - Section header reveal
 * - Project cards entrance
 * - Image clip-path wipe reveal (horizontal editorial shutter)
 * - Project description and CTA button reveal with short delay
 */
function initSelectedWorkMotion(): void {
  const section = document.getElementById('work');
  if (!section) return;

  const header = section.querySelector('.work-header');
  const cards = section.querySelectorAll('.project-card');

  if (header) {
    gsap.from(header, {
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    });
  }

  if (cards.length) {
    gsap.from(cards, {
      scrollTrigger: {
        trigger: cards[0],
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 28,
      opacity: 0,
      duration: 0.55,
      stagger: 0.12,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    });

    // Animate thumbnail clip-path and info inside each project card
    cards.forEach((card) => {
      const thumbWrap = card.querySelector('.project-thumb-wrap');
      const infoWrap = card.querySelector('.project-info-wrap');

      if (thumbWrap) {
        gsap.fromTo(
          thumbWrap,
          { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              toggleActions: 'play none none none',
              once: true
            },
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 0.65,
            ease: 'power3.inOut',
            clearProps: 'clipPath'
          }
        );
      }

      if (infoWrap) {
        gsap.from(infoWrap, {
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none none',
            once: true
          },
          y: 12,
          opacity: 0,
          duration: 0.45,
          delay: 0.1,
          ease: 'power2.out',
          clearProps: 'opacity,transform'
        });
      }
    });
  }
}

/**
 * 04. EXPERTISE & TECHNOLOGIES ANIMATION
 * - Section header reveal
 * - 4 Category cards reveal
 * - Tech pills fast staggered entrance
 */
function initExpertiseMotion(): void {
  const section = document.getElementById('expertise');
  if (!section) return;

  const header = section.querySelector('.expertise-header');
  const cards = section.querySelectorAll('.expertise-card');

  if (header) {
    gsap.from(header, {
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    });
  }

  if (cards.length) {
    gsap.from(cards, {
      scrollTrigger: {
        trigger: cards[0],
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 24,
      opacity: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    });

    // Tech pills micro-stagger
    cards.forEach((card) => {
      const pills = card.querySelectorAll('.tech-pill');
      if (pills.length) {
        gsap.from(pills, {
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none none',
            once: true
          },
          scale: 0.94,
          opacity: 0,
          duration: 0.25,
          stagger: 0.025,
          ease: 'power1.out',
          clearProps: 'opacity,transform,scale'
        });
      }
    });
  }
}

/**
 * 05. ABOUT EDITORIAL ANIMATION
 * - Editorial profile box reveal
 * - Subtle text reveal for heading & summary
 * - Timeline footer and CTA entrance
 */
function initAboutMotion(): void {
  const section = document.getElementById('about');
  if (!section) return;

  const header = section.querySelector('.about-header');
  const card = section.querySelector('.about-card');
  const title = section.querySelector('.about-title');
  const summary = section.querySelector('.about-summary');
  const footer = section.querySelector('.about-footer');

  if (header) {
    gsap.from(header, {
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    });
  }

  if (card) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
      },
      defaults: { ease: 'power2.out' }
    });

    tl.from(card, {
      y: 24,
      opacity: 0,
      duration: 0.5,
      clearProps: 'opacity,transform'
    });

    if (title) {
      tl.from(title, {
        y: 12,
        opacity: 0,
        duration: 0.4,
        clearProps: 'opacity,transform'
      }, '-=0.3');
    }

    if (summary) {
      tl.from(summary, {
        y: 10,
        opacity: 0,
        duration: 0.4,
        clearProps: 'opacity,transform'
      }, '-=0.25');
    }

    if (footer) {
      tl.from(footer, {
        y: 10,
        opacity: 0,
        duration: 0.35,
        clearProps: 'opacity,transform'
      }, '-=0.2');
    }
  }
}

/**
 * 06. CONTACT CTA ANIMATION
 * - Strong, restrained heading reveal
 * - Staggered entrance for the 3 large brutalist contact action buttons
 */
function initContactMotion(): void {
  const section = document.getElementById('contact');
  if (!section) return;

  const header = section.querySelector('.contact-header');
  const card = section.querySelector('.contact-card');
  const title = section.querySelector('.contact-title');
  const desc = section.querySelector('.contact-desc');
  const ctaButtons = section.querySelectorAll('.contact-cta-btn');

  if (header) {
    gsap.from(header, {
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    });
  }

  if (card) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
      },
      defaults: { ease: 'power2.out' }
    });

    tl.from(card, {
      y: 24,
      opacity: 0,
      duration: 0.5,
      clearProps: 'opacity,transform'
    });

    if (title) {
      tl.from(title, {
        y: 14,
        opacity: 0,
        duration: 0.45,
        clearProps: 'opacity,transform'
      }, '-=0.35');
    }

    if (desc) {
      tl.from(desc, {
        y: 10,
        opacity: 0,
        duration: 0.4,
        clearProps: 'opacity,transform'
      }, '-=0.3');
    }

    if (ctaButtons.length) {
      tl.from(ctaButtons, {
        y: 16,
        opacity: 0,
        duration: 0.45,
        stagger: 0.1,
        clearProps: 'opacity,transform'
      }, '-=0.2');
    }
  }
}

/**
 * GENERIC INNER PAGES REVEAL
 * Covers .reveal-item elements on subpages (/services, /work, /expertise, /about, /notes)
 */
function initGenericPageMotion(): void {
  // Select reveal-items that are not inside already handled homepage sections
  const genericItems = document.querySelectorAll(
    'main .reveal-item:not(#services .reveal-item):not(#work .reveal-item):not(#expertise .reveal-item):not(#about .reveal-item):not(#contact .reveal-item)'
  );

  genericItems.forEach((item) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'opacity,transform'
    });
  });
}

