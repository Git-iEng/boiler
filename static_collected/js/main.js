/* ==========================================================
   landing-page-solar-system.js
   - Scroll reveal (replays on scroll up/down)
   - Optional: adjust initial hash scroll for fixed header
   - Optional: smooth scroll for [data-scroll-to] anchors
   ========================================================== */

/* ===== CONFIG ===== */
const SOLAR = {
  revealSelector: '.reveal-solar-system',
  inViewClass: 'in-view-solar-system',
  headerSelector: '.header',
  anchorSelector: '[data-scroll-to]'
};

/* ===== Helpers ===== */
function getHeaderOffset() {
  const header = document.querySelector(SOLAR.headerSelector);
  return header ? header.offsetHeight : 0;
}

function smoothScrollTo(targetSelector) {
  if (!targetSelector || !targetSelector.startsWith('#')) return;
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const y = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
  window.scrollTo({ top: y, behavior: 'smooth' });
}

/* ===== Scroll Reveal that re-triggers on leave ===== */
(function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll(SOLAR.revealSelector).forEach(el => el.classList.add(SOLAR.inViewClass));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add(SOLAR.inViewClass);
      } else {
        // Remove when leaving viewport so it can animate again on return
        el.classList.remove(SOLAR.inViewClass);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(SOLAR.revealSelector).forEach(el => io.observe(el));
})();

/* ===== Smooth in-page scrolling for elements with [data-scroll-to] ===== */
(function initSmoothAnchors() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(SOLAR.anchorSelector);
    if (!trigger) return;

    const href = trigger.getAttribute('href');
    const dataTarget = trigger.getAttribute('data-target');
    const targetSelector = dataTarget || href;

    if (targetSelector && targetSelector.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(targetSelector);
    }
  });

  // If the page loads with a hash, fix initial position for fixed header
  window.addEventListener('load', () => {
    if (window.location.hash) {
      // Wait a tick so layout is ready
      setTimeout(() => smoothScrollTo(window.location.hash), 0);
    }
  });
})();

/* ==========================================================
   Logos pager (dots) + continuous marquee coexist (robust)
   ========================================================== */
(function initLogosPager() {
  const wrap = document.querySelector('.logos-wrap-solar-system');
  const track = document.getElementById('logos-track-solar-system');
  const dotsWrap = document.getElementById('dots-solar-system');
  if (!wrap || !track || !dotsWrap) return;

  const dots = Array.from(dotsWrap.querySelectorAll('.dot-solar-system'));
  const RESUME_DELAY = 3500; // ms after click before continuous scroll resumes
  let resumeTimer = null;

  // set active dot helper
  function setActiveDot(idx) {
    dots.forEach((d, i) => d.classList.toggle('is-active-solar-system', i === idx));
  }
  setActiveDot(0);

  // compute page width (use visible viewport of the logos)
  function pageWidth() { return wrap.clientWidth; }

  // Fully disable CSS animation and let us control transform
  function enterManualMode() {
    track.classList.add('manual-solar-system');
    track.style.animationPlayState = 'paused';
  }

  // Resume CSS animation from the start smoothly
  function resumeContinuous() {
    // remove manual transform + class and restart animation cleanly
    track.style.transform = '';
    track.classList.remove('manual-solar-system');

    // Restart the CSS animation reliably (toggle to 'none' then back)
    const prevAnim = getComputedStyle(track).animation;
    track.style.animation = 'none';
    // force reflow
    // eslint-disable-next-line no-unused-expressions
    track.offsetHeight;
    // restore whatever animation was in CSS
    track.style.animation = prevAnim;
    track.style.animationPlayState = 'running';
  }

  // Jump to page n by translating the track
  function goToPage(n) {
    const idx = Math.max(0, Math.min(n, dots.length - 1));
    setActiveDot(idx);

    enterManualMode();

    const offset = -idx * pageWidth();
    track.style.transform = `translateX(${offset}px)`;

    // schedule resume
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(resumeContinuous, RESUME_DELAY);
  }

  // Click handlers on dots
  dots.forEach(d => {
    d.addEventListener('click', () => {
      const n = parseInt(d.getAttribute('data-page') || '0', 10);
      goToPage(n);
    });
  });

  // Maintain the same page on resize while paused
  const ro = new ResizeObserver(() => {
    const active = dots.findIndex(el => el.classList.contains('is-active-solar-system'));
    if (active > -1 && track.classList.contains('manual-solar-system')) {
      track.style.transform = `translateX(${-active * pageWidth()}px)`;
    }
  });
  ro.observe(wwrap = wrap); // observe container width changes

  // Also pause marquee on hover (optional, keeps prior UX)
  wrap.addEventListener('mouseenter', () => {
    if (!track.classList.contains('manual-solar-system')) {
      track.style.animationPlayState = 'paused';
    }
  });
  wrap.addEventListener('mouseleave', () => {
    if (!track.classList.contains('manual-solar-system')) {
      track.style.animationPlayState = 'running';
    }
  });
})();


/* ==========================================================
   Count-up animation for Impact stats
   ========================================================== */
(function initImpactCounters() {
  const items = document.querySelectorAll('.stat-value-solar-system-impact');
  if (!items.length) return;

  function countTo(el) {
    const end = parseFloat(el.getAttribute('data-count-to')) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400; // ms (slow & smooth)
    const startTime = performance.now();

    function tick(now) {
      const p = Math.min(1, (now - startTime) / duration);
      // easeOutCubic for a nice finish
      const eased = 1 - Math.pow(1 - p, 3);
      let val = end * eased;

      // If the end has decimals, keep one decimal, else integer
      const hasDecimal = String(end).includes('.');
      el.textContent = prefix + (hasDecimal ? val.toFixed(1) : Math.round(val)) + suffix;

      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + (hasDecimal ? end.toFixed(1) : Math.round(end)) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        // start counting when visible
        countTo(el);
      } else {
        // reset so it can play again on re-enter
        el.textContent = (el.getAttribute('data-prefix') || '') + '0' + (el.getAttribute('data-suffix') || '');
      }
    });
  }, { threshold: 0.35 });

  items.forEach(el => {
    // initialize to 0 with prefix/suffix
    el.textContent = (el.getAttribute('data-prefix') || '') + '0' + (el.getAttribute('data-suffix') || '');
    io.observe(el);
  });
})();
/* ==========================================================
   Solutions: "View All Solutions" toggle
   ========================================================== */
(function initSolutionsToggle() {
  const grid = document.getElementById('solutions-grid-solar-system-solution');
  const btn = document.getElementById('solutions-toggle-btn-solar-system-solution');
  if (!grid || !btn) return;

  function setState(expanded) {
    grid.classList.toggle('is-collapsed-solar-system-solution', !expanded);
    btn.setAttribute('aria-expanded', String(expanded));
    btn.textContent = expanded ? 'View Fewer' : 'View LV Switchboards ';

    // Nudge IntersectionObserver so reveal animations can trigger for newly shown cards
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event('scroll'));
    });
  }

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    setState(!expanded);
  });

  // default collapsed on load
  setState(false);
})();
/* ==========================================================
   Solar App: lightweight tilt/parallax for media cards
   Targets elements with [data-tilt]
   ========================================================== */
(function initSolarAppTilt() {
  const els = document.querySelectorAll('[data-tilt]');
  if (!els.length) return;

  const MAX_TILT = 8;         // degrees
  const MAX_TRANS = 10;       // px translate for parallax feel
  const EASE = 'cubic-bezier(.2,.65,.2,1)';

  function applyTilt(el, e) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = (+dy * MAX_TILT).toFixed(2);
    const rotY = (-dx * MAX_TILT).toFixed(2);
    const tx = (-dx * MAX_TRANS).toFixed(2);
    const ty = (-dy * MAX_TRANS).toFixed(2);

    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate(${tx}px, ${ty}px)`;
    el.style.transition = 'transform .08s';
  }

  function resetTilt(el) {
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translate(0,0)';
    el.style.transition = `transform .5s ${EASE}`;
  }

  els.forEach(el => {
    el.addEventListener('pointermove', (e) => applyTilt(el, e));
    el.addEventListener('pointerleave', () => resetTilt(el));
    el.addEventListener('pointerdown', () => resetTilt(el)); // prevent sticky tilt on touch
  });
})();


/* ==========================================================
   Projects carousel: arrows scroll by one full "page"
   ========================================================== */
(function initProjectsCarousel() {
  const viewport = document.getElementById('projects-viewport-solar-system-projects');
  const prevBtn = document.querySelector('.prev-solar-system-projects');
  const nextBtn = document.querySelector('.next-solar-system-projects');
  if (!viewport || !prevBtn || !nextBtn) return;

  function updateButtons() {
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const atStart = viewport.scrollLeft <= 0;
    const atEnd = viewport.scrollLeft >= maxScroll - 1;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
  }

  function scrollPage(dir) {
    const distance = viewport.clientWidth; // page = visible width
    viewport.scrollBy({ left: dir * distance, behavior: 'smooth' });
    // optimistic button state; will correct on 'scroll' event
    setTimeout(updateButtons, 350);
  }

  prevBtn.addEventListener('click', () => scrollPage(-1));
  nextBtn.addEventListener('click', () => scrollPage(1));

  // keep buttons in sync
  viewport.addEventListener('scroll', () => {
    // debounced update
    window.clearTimeout(viewport._btnTimer);
    viewport._btnTimer = setTimeout(updateButtons, 80);
  });
  window.addEventListener('resize', updateButtons);

  // init
  updateButtons();
})();
// 
/* ==========================================================
   Types tabs: click/keyboard + hash support
   ========================================================== */
(function initSolarTypes() {
  const tabs = Array.from(document.querySelectorAll('.tab-btn-solar-system-types'));
  const panels = {
    'on-grid': document.getElementById('panel-on-grid-solar-system-types'),
    'off-grid': document.getElementById('panel-off-grid-solar-system-types'),
    'hybrid': document.getElementById('panel-hybrid-solar-system-types')
  };
  if (!tabs.length) return;

  function activate(type) {
    // tabs
    tabs.forEach(btn => {
      const isActive = btn.dataset.type === type;
      btn.classList.toggle('is-active-solar-system-types', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      // tabindex for roving focus
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    // panels
    Object.entries(panels).forEach(([key, el]) => {
      const show = key === type;
      if (!el) return;
      el.classList.toggle('is-active-solar-system-types', show);
      el.hidden = !show;
      if (show) {
        // restart small fade-in animation
        el.style.animation = 'none'; el.offsetHeight; el.style.animation = '';
      }
    });
  }

  // Click
  tabs.forEach(btn => btn.addEventListener('click', () => activate(btn.dataset.type)));

  // Keyboard: left/right arrows
  document.querySelector('.tabs-solar-system-types')?.addEventListener('keydown', (e) => {
    const idx = tabs.findIndex(b => b.classList.contains('is-active-solar-system-types'));
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = (idx + dir + tabs.length) % tabs.length;
      tabs[next].focus();
      tabs[next].click();
    }
  });

  // Hash support e.g. #hybrid
  function fromHash() {
    const h = (location.hash || '').replace('#', '').toLowerCase();
    if (['on-grid', 'off-grid', 'hybrid'].includes(h)) activate(h);
  }
  window.addEventListener('hashchange', fromHash);

  // init
  activate('on-grid');
  fromHash();
})();
/* ==========================================================
   Scoped tabs for all .section-types-solar-system-types
   (no global getElementById; supports multiple instances)
   ========================================================== */
(function initAllSolarTypeTabs() {
  document.querySelectorAll('.section-types-solar-system-types').forEach(section => {
    const tabsWrap = section.querySelector('.tabs-solar-system-types');
    if (!tabsWrap) return;

    const tabs = Array.from(section.querySelectorAll('.tab-btn-solar-system-types'));
    const panels = Array.from(section.querySelectorAll('.panel-solar-system-types'));
    if (!tabs.length || !panels.length) return;

    function activate(btn) {
      // Tabs state
      tabs.forEach(t => {
        const isActive = t === btn;
        t.classList.toggle('is-active-solar-system-types', isActive);
        t.setAttribute('aria-selected', String(isActive));
        t.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      // Panels state (scoped within this section)
      const targetId = btn.getAttribute('aria-controls');
      panels.forEach(p => {
        const show = p.id === targetId;
        p.hidden = !show;
        p.classList.toggle('is-active-solar-system-types', show);
        if (show) { p.style.animation = 'none'; p.offsetHeight; p.style.animation = ''; }
      });
    }

    // Click to activate
    tabs.forEach(btn => btn.addEventListener('click', () => activate(btn)));

    // Keyboard: Left/Right arrows within this tablist
    tabsWrap.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const current = tabs.findIndex(t => t.classList.contains('is-active-solar-system-types'));
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = (current + dir + tabs.length) % tabs.length;
      tabs[next].focus();
      activate(tabs[next]);
    });

    // Init: use the one marked active or the first
    activate(tabs.find(t => t.classList.contains('is-active-solar-system-types')) || tabs[0]);
  });
})();

/* IntersectionObserver reveal - shows elements when they enter the viewport,
   hides them again when they leave (works on scroll down and up). */
(function () {
  const els = document.querySelectorAll('.reveal-up');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('is-visible-mobility'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible-mobility');
      } else {
        entry.target.classList.remove('is-visible-mobility');
      }
    });
  }, { threshold: 0.18 });

  els.forEach(el => io.observe(el));
})();


document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.-gemini-tab');
  const contents = document.querySelectorAll('.-gemini-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Add active class to the clicked tab
      tab.classList.add('active');

      // Find the corresponding content using the data-tab attribute
      const tabId = tab.getAttribute('data-tab');
      const content = document.getElementById(`${tabId}-content`);

      // Add active class to the content
      if (content) {
        content.classList.add('active');
      }
    });
  });

  // Set the default active tab and content on page load
  const defaultTab = document.querySelector('.-gemini-tab[data-tab="mission"]');
  const defaultContent = document.getElementById('mission-content');

  if (defaultTab && defaultContent) {
    defaultTab.classList.add('active');
    defaultContent.classList.add('active');
  }
});

(function () {
  const grid = document.getElementById('grid-neplan-card-with-animation');
  if (!grid) return;
  const cards = grid.querySelectorAll('.card-neplan-card-with-animation');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show-neplan-card-with-animation');
      } else {
        // remove so it replays when scrolling back (LIFO feel)
        e.target.classList.remove('show-neplan-card-with-animation');
      }
    });
  }, { threshold: 0.18 });

  cards.forEach(c => io.observe(c));
})();


(() => {
  const SELECTOR = '.reveal-left, .reveal-right, .reveal-up, .reveal-down';

  // Apply per-element delay from data attribute if provided
  document.querySelectorAll(SELECTOR).forEach(el => {
    const d = el.getAttribute('data-reveal-delay');
    if (d) el.style.setProperty('--reveal-delay', /^\d+$/.test(d) ? `${d}ms` : d);
  });

  // Auto-stagger children inside a .reveal-group
  document.querySelectorAll('.reveal-group[data-reveal-stagger]').forEach(group => {
    const step = parseInt(group.dataset.revealStagger, 10) || 120; // ms
    let i = 0;
    group.querySelectorAll(SELECTOR).forEach(el => {
      el.style.setProperty('--reveal-delay', `${i * step}ms`);
      i++;
    });
  });

  // Observe and toggle visibility (replays when scrolling back unless .reveal-once)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.classList.add('is-visible');
      else if (!target.classList.contains('reveal-once'))
        target.classList.remove('is-visible');
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(SELECTOR).forEach(el => io.observe(el));
})();

/* Intersection Observer for gentle reveals */
(function () {
  const items = document.querySelectorAll('.reveal-lv-electrical-panel-');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in-lv-electrical-panel-');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(el => io.observe(el));

  /* Simple form handler (prevent empty submit in demo) */
  const form = document.getElementById('service-form-lv-electrical-panel-');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    // You can hook this to your backend
    alert(`Thanks ${fd.get('name') || ''}! We’ll contact you soon.`);
    form.reset();
  });
})();

/* IntersectionObserver reveal - shows elements when they enter the viewport,
   hides them again when they leave (works on scroll down and up). */
(function () {
  const els = document.querySelectorAll('.reveal-up');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('is-visible-mobility'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible-mobility');
      } else {
        entry.target.classList.remove('is-visible-mobility');
      }
    });
  }, { threshold: 0.18 });

  els.forEach(el => io.observe(el));
})();


document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.-gemini-tab');
  const contents = document.querySelectorAll('.-gemini-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Add active class to the clicked tab
      tab.classList.add('active');

      // Find the corresponding content using the data-tab attribute
      const tabId = tab.getAttribute('data-tab');
      const content = document.getElementById(`${tabId}-content`);

      // Add active class to the content
      if (content) {
        content.classList.add('active');
      }
    });
  });

  // Set the default active tab and content on page load
  const defaultTab = document.querySelector('.-gemini-tab[data-tab="mission"]');
  const defaultContent = document.getElementById('mission-content');

  if (defaultTab && defaultContent) {
    defaultTab.classList.add('active');
    defaultContent.classList.add('active');
  }
});

(function () {
  const grid = document.getElementById('grid-neplan-card-with-animation');
  if (!grid) return;
  const cards = grid.querySelectorAll('.card-neplan-card-with-animation');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show-neplan-card-with-animation');
      } else {
        // remove so it replays when scrolling back (LIFO feel)
        e.target.classList.remove('show-neplan-card-with-animation');
      }
    });
  }, { threshold: 0.18 });

  cards.forEach(c => io.observe(c));
})();


(() => {
  const SELECTOR = '.reveal-left, .reveal-right, .reveal-up, .reveal-down';

  // Apply per-element delay from data attribute if provided
  document.querySelectorAll(SELECTOR).forEach(el => {
    const d = el.getAttribute('data-reveal-delay');
    if (d) el.style.setProperty('--reveal-delay', /^\d+$/.test(d) ? `${d}ms` : d);
  });

  // Auto-stagger children inside a .reveal-group
  document.querySelectorAll('.reveal-group[data-reveal-stagger]').forEach(group => {
    const step = parseInt(group.dataset.revealStagger, 10) || 120; // ms
    let i = 0;
    group.querySelectorAll(SELECTOR).forEach(el => {
      el.style.setProperty('--reveal-delay', `${i * step}ms`);
      i++;
    });
  });

  // Observe and toggle visibility (replays when scrolling back unless .reveal-once)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.classList.add('is-visible');
      else if (!target.classList.contains('reveal-once'))
        target.classList.remove('is-visible');
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(SELECTOR).forEach(el => io.observe(el));
})();

/* Simple reveal on scroll */
(() => {
  const els = document.querySelectorAll('.reveal-lv-electrical-panel-');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in-lv-electrical-panel-');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  els.forEach(el => io.observe(el));
})();

// Reveal on scroll for the About section
(() => {
  const items = document.querySelectorAll('.reveal-lv-electrical-about-');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in-lv-electrical-about-');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  items.forEach(el => io.observe(el));
})();
(() => {
  const els = document.querySelectorAll(
    '.reveal-left-lv-electrical-services, .reveal-right-lv-electrical-services, .reveal-up-lv-electrical-services'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in-lv-electrical-services');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  els.forEach(el => io.observe(el));
})();
(() => {
  const els = document.querySelectorAll(
    '.reveal-left-lv-electrical-services, .reveal-right-lv-electrical-services, .reveal-up-lv-electrical-services'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in-lv-electrical-services');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  els.forEach(el => io.observe(el));
})();
(() => {
  const els = document.querySelectorAll(
    '.reveal-left-lv-electrical-services, .reveal-right-lv-electrical-services, .reveal-up-lv-electrical-services'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in-lv-electrical-services');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  els.forEach(el => io.observe(el));
})();
// Simple reveal on scroll for the process section
(() => {
  const els = document.querySelectorAll(
    '.reveal-left-lv-electrical-process, .reveal-right-lv-electrical-process'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in-lv-electrical-process');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  els.forEach(el => io.observe(el));
})();
// Reveal-on-scroll for the Why Choose Us section (trigger on every scroll)

// Reveal-on-scroll for the Why Choose Us section – always trigger on scroll up and down
(() => {
  const targets = document.querySelectorAll(
    '.reveal-left-le-electrical-why-us, .reveal-right-le-electrical-why-us, .reveal-top-le-electrical-why-us, .reveal-bottom-le-electrical-why-us'
  );

  const revealOnScroll = () => {
    targets.forEach(target => {
      const rect = target.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;

      if (inView) {
        target.classList.add('reveal-in-le-electrical-why-us');
      } else {
        target.classList.remove('reveal-in-le-electrical-why-us');
      }
    });
  };

  // Run on scroll and on page load
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('resize', revealOnScroll);
  window.addEventListener('load', revealOnScroll);
})();


document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('servicesGrid');
  const detail = document.getElementById('svcDetail');
  const exploreBtn = document.getElementById('exploreServicesBtn'); // header button if present

  if (!grid || !detail) return;

  // --- DETAILS CONTENT MAP ---
  const detailsMap = {
    msb: {
      title: 'Main Switchboards Manufactured to Australian AS61439 Standard',
      body: `
        <p><strong>At iEngineering Australia</strong>, we take pride in offering high-quality main switchboards designed and manufactured in compliance with the Australian <strong>AS61439</strong> standard. This ensures the highest levels of safety, reliability, and performance for your power distribution needs.</p>

        <h4>Why Choose AS61439-Compliant Main Switchboards?</h4>
        <ul>
          <li><strong>Enhanced Safety:</strong> Protection for both operators and equipment.</li>
          <li><strong>Reliability:</strong> Consistent performance even under demanding conditions.</li>
          <li><strong>Adaptability:</strong> Tailored solutions to meet diverse requirements.</li>
        </ul>

        <h4>Customization Options to Suit Your Needs</h4>
        <p>Every project is unique. We offer tailored solutions using high-quality components from leading global brands:</p>
        <ul>
          <li><strong>ABB:</strong> Innovative and reliable solutions.</li>
          <li><strong>Schneider Electric:</strong> Energy-efficient and smart technologies.</li>
          <li><strong>Rittal:</strong> Robust and versatile enclosure systems.</li>
          <li><strong>L&K:</strong> Custom-built boards to match specific project requirements.</li>
        </ul>
        <p>Our team works closely with you to design and manufacture main switchboards that precisely match your specifications, ensuring seamless integration with your electrical systems.</p>

        <h4>Applications</h4>
        <ul>
          <li>Commercial buildings</li>
          <li>Industrial facilities</li>
          <li>Infrastructure projects</li>
          <li>Renewable energy systems</li>
        </ul>
      `,
      image: {src: '../static/images/solutions/msb.avif', alt: 'AS61439 main switchboard' }
    },
    mdp: {
      title: "Main Distribution Panel (MDP) – AS61439 Compliant",
      body: `
    <h4>Introduction</h4>
    <p>Welcome to iEngineering's Main Distribution Panel (MDP) solutions – the backbone of efficient electrical distribution systems. Our MDPs are engineered for high performance, safety, and durability, providing reliable power management for commercial, industrial, and residential applications. With advanced technology, precision engineering, and industry-leading design, iEngineering MDPs ensure seamless distribution, maximum uptime, and superior operational efficiency.</p>

    <h4>What is a Main Distribution Panel (MDP)?</h4>
    <p>A Main Distribution Panel is a critical component in electrical systems, acting as the primary control point for distributing electricity throughout a building or facility. It receives power from the source and distributes it to various sub-circuits, ensuring stable and efficient operation of electrical equipment. Our MDPs are designed to handle high loads, ensure safety through circuit protection, and facilitate easy maintenance and upgrades.</p>

    <h4>Key Features of iEngineering MDP</h4>
    <ul class="svc-detail-list">
      <li>Reliable Power Distribution</li>
      <li>Enhanced Safety</li>
      <li>Customization Options</li>
      <li>High Durability</li>
      <li>Compact and Efficient Design</li>
      <li>Future-Proof Technology</li>
    </ul>

    <h4>Applications</h4>
    <ul class="svc-detail-list">
      <li>Commercial Buildings</li>
      <li>Industrial Facilities</li>
      <li>Data Centers</li>
      <li>Hospitals and Healthcare Facilities</li>
      <li>Residential Complexes</li>
      <li>Infrastructure Projects</li>
    </ul>
  `,
      // one image only – set the correct path/filename you have in your project
      image: { src: "../static/images/solutions/mdp.avif", alt: "iEngineering Main Distribution Panel (MDP)" }
    },
    mcc: {
      title: "Motor Control Centres (MCC)",
      body: `
    <p>Motor Control Centre (MCC) panels are essential components in industrial and commercial electrical systems. Designed to centralize and manage the control of motors and other connected electrical devices, MCC panels offer efficiency, safety, and reliability.</p>

    <h4>What Are MCC Panels?</h4>
    <p>MCC panels are assemblies of one or more enclosed sections housing motor control units. They are commonly used to control electric motors in factories, buildings, and industrial plants. The panels integrate various control mechanisms like switches, circuit breakers, fuses, and overload relays to ensure smooth and secure motor operations.</p>

    <h4>Benefits of Using MCC Panels</h4>
    <ul class="svc-detail-list">
      <li><strong>Centralized Control:</strong> Efficiently manage multiple motors from a single location.</li>
      <li><strong>Enhanced Protection:</strong> Safeguards against overloads, short circuits, and phase failures.</li>
      <li><strong>Energy Efficiency:</strong> Optimizes motor performance to reduce energy consumption.</li>
      <li><strong>Improved Productivity:</strong> Ensures reliable motor operation, minimizing disruptions.</li>
    </ul>

    <h4>Applications</h4>
    <ul class="svc-detail-list">
      <li>Manufacturing Plants</li>
      <li>Power Generation Facilities</li>
      <li>Water Treatment Plants</li>
      <li>HVAC Systems</li>
      <li>Oil and Gas Refineries</li>
      <li>Commercial Buildings</li>
    </ul>
  `
    ,
    // one image only – set the correct path/filename you have in your project
      image: { src: "../static/images/solutions/mcc.avif", alt: "iEngineering Main Distribution Panel (MDP)" }
    },
    plc: {
  title: "PLC Control Panels",
  body: `
    <p>At iEngineering, we specialize in designing, manufacturing, and delivering high-quality Programmable Logic Controller (PLC) control panels tailored to meet the unique needs of your industry. With years of experience and cutting-edge technology, we empower businesses with efficient and reliable automation solutions.</p>

    <h4>Features of Our PLC Control Panels</h4>
    <ul class="svc-detail-list">
      <li><strong>Customizable Design:</strong> Tailored layouts and configurations to suit your specific process requirements.</li>
      <li><strong>Advanced Connectivity:</strong> Integration with SCADA, HMI, and other industrial systems for seamless communication.</li>
      <li><strong>Enhanced Safety:</strong> Built-in safety features to ensure reliable and secure operation.</li>
      <li><strong>Energy Efficiency:</strong> Optimized for power-saving performance to reduce operational costs.</li>
      <li><strong>Durability:</strong> Engineered for long-term reliability, even in harsh industrial environments.</li>
    </ul>

    <h4>Applications</h4>
    <ul class="svc-detail-list">
      <li>Manufacturing</li>
      <li>Oil and Gas</li>
      <li>Water Treatment</li>
      <li>Power Generation</li>
      <li>Automotive</li>
      <li>Food and Beverage</li>
      <li>Pharmaceuticals</li>
    </ul>

    <h4>Our Process</h4>
    <ul class="svc-detail-list">
      <li><strong>Consultation:</strong> Understanding your specific needs and challenges.</li>
      <li><strong>Design:</strong> Developing a tailored solution with detailed schematics.</li>
      <li><strong>Manufacturing:</strong> Assembling panels using high-quality materials and components.</li>
      <li><strong>Testing:</strong> Rigorous testing to ensure reliability and compliance with industry standards.</li>
      <li><strong>Installation & Commissioning:</strong> Seamless integration and operational setup.</li>
      <li><strong>Support & Maintenance:</strong> Ongoing assistance to maximize uptime and efficiency.</li>
    </ul>
  `,
  // optional image; set to your real asset path or remove the image field
  image: { src: "../static/images/solutions/plc.avif", alt: "iEngineering PLC Control Panels" }
},
pcc: {
  title: "Power Control Centre (PCC) Panels",
  body: `
    <p>At iEngineering, we specialize in delivering high-quality Power Control Centre (PCC) panels designed to meet the diverse energy management needs of modern industries. Our PCC panels are the backbone of power distribution systems, ensuring efficient and safe operation of electrical networks across various sectors.</p>

    <h4>What Are PCC Panels?</h4>
    <p>PCC panels are an integral part of any electrical system, used for controlling and distributing power from the main source to multiple circuits and equipment. These panels are built to handle high-capacity power and are critical for maintaining stability, reliability, and safety in large-scale power distribution networks.</p>

    <h4>Applications</h4>
    <ul class="svc-detail-list">
      <li>Power Generation Plants</li>
      <li>Manufacturing Units</li>
      <li>Oil and Gas Facilities</li>
      <li>Commercial Complexes</li>
      <li>Data Centers</li>
      <li>Renewable Energy Systems</li>
    </ul>
  `,
  // optional image: update path/name or remove this field if you don't want an image
  image: { src: "../static/images/solutions/pcc.avif", alt: "iEngineering Power Control Centre (PCC) panel" }
},
pdb: {
  title: "Power Distribution Boards (PDBs)",
  body: `
    <h4>Powering Progress with Precision and Reliability</h4>
    <p>At iEngineering, we are committed to delivering state-of-the-art power distribution solutions tailored to meet the diverse needs of industries and businesses worldwide. Our Power Distribution Boards (PDBs) are designed to ensure safe, reliable, and efficient distribution of electrical power, enabling seamless operations for your projects.</p>

    <h4>Our Expertise</h4>
    <p>With years of experience in engineering and technology, we take pride in designing and manufacturing high-quality PDBs that conform to global safety and performance standards. From small-scale setups to large industrial infrastructures, our solutions are customized to provide the perfect balance of functionality and durability.</p>

    <h4>Key Features of iEngineering Power Distribution Boards</h4>
    <ul class="svc-detail-list">
      <li><strong>High Efficiency:</strong> Engineered to minimize energy loss while maximizing power delivery.</li>
      <li><strong>Safety First:</strong> Advanced protective features against faults, overloads, and short circuits.</li>
      <li><strong>Customizable Designs:</strong> Tailored to your exact operational requirements and environments.</li>
      <li><strong>Robust Build:</strong> Premium materials for long-term reliability in demanding conditions.</li>
      <li><strong>Smart Monitoring:</strong> Optional IoT-enabled monitoring for real-time insights.</li>
    </ul>

    <h4>Applications</h4>
    <ul class="svc-detail-list">
      <li>Commercial Buildings</li>
      <li>Industrial Plants</li>
      <li>Renewable Energy Projects</li>
      <li>Data Centers</li>
      <li>Telecommunications Infrastructure</li>
    </ul>
  `,
  // optional: keep or remove this if you don't want an image
  image: { src: "../static/images/solutions/pdb.avif", alt: "iEngineering Power Distribution Board (PDB)" }
},
metering: {
  title: "iEngineering Metering Panels",
  body: `
    <h4>Overview</h4>
    <p>iEngineering provides state-of-the-art metering panels designed for industrial and commercial applications. Our panels are engineered with precision and durability, offering seamless integration with various electrical systems. Whether you're looking for accurate energy monitoring, advanced control capabilities, or reliable protection, iEngineering metering panels are your trusted solution for ensuring optimal performance and compliance.</p>

    <h4>Key Features of iEngineering Metering Panels</h4>
    <ul class="svc-detail-list">
      <li><strong>Accurate Energy Monitoring</strong></li>
      <li><strong>Advanced Control Options</strong></li>
      <li><strong>Reliable Protection</strong></li>
      <li><strong>Customization</strong></li>
      <li><strong>Easy Integration</strong></li>
      <li><strong>Durability</strong></li>
    </ul>

    <h4>Applications</h4>
    <ul class="svc-detail-list">
      <li>Commercial Buildings</li>
      <li>Industrial Plants</li>
      <li>Data Centers</li>
      <li>Renewable Energy Systems</li>
    </ul>
  `,
  // one image (optional) — set to your real asset path or remove this field
  image: {src: "../static/images/solutions/metering.avif", alt: "iEngineering Metering Panel" }
}




  };

  // --- RENDER DETAILS (single function) ---
  function openDetails(key) {
    const data = detailsMap[key];
    if (!data) return;

    const imgHTML = data.image
      ? `<figure class="svc-detail-figure"><img class="svc-detail-img" src="${data.image.src}" alt="${data.image.alt || ''}"></figure>`
      : '';

    detail.innerHTML = `
      <div class="svc-detail-layout">
        ${imgHTML}
        <div class="svc-detail-copy">
          <h3>${data.title}</h3>
          ${data.body || ''}
        </div>
      </div>
    `;
    detail.style.display = 'block';
    detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function closeDetails() {
    detail.style.display = 'none';
    detail.innerHTML = '';
  }

  // --- CLICK HANDLER (delegated) ---
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.svc-cta-lv-electrical-services');
    if (!btn) return;
    const key = btn.getAttribute('data-detail');
    const currentTitle = detail.querySelector('h3')?.textContent || '';
    if (detail.style.display === 'block' && currentTitle === (detailsMap[key]?.title || '')) {
      closeDetails();
    } else {
      openDetails(key);
    }
  });

  // --- EXPLORE / VIEW LESS toggle (uses .is-hidden on extra cards) ---
  if (exploreBtn) {
    const allCards = Array.from(grid.querySelectorAll('.svc-item-lv-electrical-services'));
    const extraCards = allCards.slice(3); // cards 4..7
    let expanded = false;

    function setExpanded(state) {
      expanded = state;
      if (expanded) {
        extraCards.forEach(el => el.classList.remove('is-hidden'));
        exploreBtn.textContent = 'View Less';
        exploreBtn.setAttribute('aria-expanded', 'true');
        
      } else {
        extraCards.forEach(el => el.classList.add('is-hidden'));
        closeDetails();
        exploreBtn.textContent = 'Explore Solutions';
        exploreBtn.setAttribute('aria-expanded', 'false');
        
      }
      // retrigger reveal animations if you use them
      extraCards.forEach(el => {
        el.classList.remove('reveal-in-lv-electrical-services');
        void el.offsetWidth;
      });
    }

    // init collapsed
    setExpanded(false);

    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setExpanded(!expanded);
    });
  }

  // --- SCROLL REVEAL (bi-directional) ---
  const revealEls = document.querySelectorAll(
    '.reveal-left-lv-electrical-services, .reveal-right-lv-electrical-services, .reveal-up-lv-electrical-services'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in-lv-electrical-services');
      } else {
        entry.target.classList.remove('reveal-in-lv-electrical-services');
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  revealEls.forEach(el => io.observe(el));
});
(() => {
  const modal = document.getElementById('csc-modal');
  const form  = document.getElementById('csc-form');
  const close = modal.querySelector('.modal-close-csc-solar-system-csc-products');
  const successPane  = document.getElementById('csc-success');
  const docNameInput = document.getElementById('csc-doc-name');

  function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    successPane.hidden = true;
    form.hidden = false;
    form.reset();
    setTimeout(() => document.getElementById('csc-name')?.focus(), 50);
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  // Open from each "Request Download" button
  document.querySelectorAll('.request-download-csc-solar-system-csc-products').forEach(btn => {
    btn.addEventListener('click', () => {
      docNameInput.value = btn.dataset.doc || '';
      openModal();
    });
  });

  // Close handlers
  close.addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop-csc-solar-system-csc-products')
       .addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ===== Scroll reveal + count-up when visible ===== */
(() => {
  const els = document.querySelectorAll('.reveal-lv-electrical-get-in-touch');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('in-view'), delay);

      // If this block contains counters, animate them once
      el.querySelectorAll?.('.stat-num-lv-electrical-get-in-touch').forEach(counter => {
        if (counter.dataset.done) return;
        counter.dataset.done = '1';
        const end = parseInt(counter.dataset.count || '0', 10);
        const hasPlus = end >= 20; // to match mock (25+, 500+, 20+)
        const suffix = hasPlus ? '+' : (end === 98 ? '%' : '');
        let start = 0, duration = 900, startTs;
        const step = (ts) => {
          if (!startTs) startTs = ts;
          const p = Math.min((ts - startTs) / duration, 1);
          const val = Math.floor(start + (end - start) * p);
          counter.textContent = val;
          counter.setAttribute('data-suffix', suffix);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

      io.unobserve(el);
    });
  }, { threshold: 0.15 });

  els.forEach(el => io.observe(el));
})();

