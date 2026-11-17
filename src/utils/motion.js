import { gsap } from 'gsap';

const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const finePointer = () =>
  window.matchMedia('(pointer: fine)').matches;

let cursorReady = false;

export function initCursor() {
  if (cursorReady || reduced() || !finePointer()) return;
  cursorReady = true;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  document.body.classList.add('has-cursor');

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

  let magneticEl = null;
  let tiltEl = null;

  const clearMagnetic = () => {
    if (!magneticEl) return;
    gsap.to(magneticEl, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    magneticEl = null;
  };

  const clearTilt = () => {
    if (!tiltEl) return;
    gsap.to(tiltEl, {
      rotationX: 0, rotationY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)',
      clearProps: 'transform',
    });
    tiltEl = null;
  };

  document.addEventListener('pointermove', (e) => {
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);

    const interactive = e.target.closest('a, button, input, select, [role="button"], .leaflet-marker-icon');
    ring.classList.toggle('cursor-ring--hot', Boolean(interactive));

    const magnetic = e.target.closest('[data-magnetic]');
    if (magnetic !== magneticEl) {
      clearMagnetic();
      magneticEl = magnetic;
    }
    if (magneticEl) {
      const r = magneticEl.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(magneticEl, {
        x: Math.max(-6, Math.min(6, dx * 0.25)),
        y: Math.max(-6, Math.min(6, dy * 0.25)),
        duration: 0.4, ease: 'power3.out',
      });
    }

    const tilt = e.target.closest('[data-tilt]');
    if (tilt !== tiltEl) {
      clearTilt();
      tiltEl = tilt;
    }
    if (tiltEl) {
      const r = tiltEl.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(tiltEl, {
        rotationY: px * 6, rotationX: -py * 6,
        transformPerspective: 900, duration: 0.5, ease: 'power2.out',
      });
    }

    const glow = e.target.closest('[data-spotlight]');
    if (glow) {
      const r = glow.getBoundingClientRect();
      glow.style.setProperty('--mx', `${e.clientX - r.left}px`);
      glow.style.setProperty('--my', `${e.clientY - r.top}px`);
    }
  });

  document.addEventListener('pointerleave', () => {
    clearMagnetic();
    clearTilt();
  });
}

export function pageEnter(scope) {
  if (!scope || reduced()) return;

  const lines = scope.querySelectorAll('.line-inner');
  if (lines.length) {
    gsap.fromTo(lines,
      { yPercent: 115 },
      { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.09, clearProps: 'transform' });
  }

  const rising = scope.querySelectorAll('[data-rise]');
  if (rising.length) {
    gsap.fromTo(rising,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.07, clearProps: 'transform,opacity' });
  }
}

export function staggerMarkers() {
  if (reduced()) return;
  const markers = document.querySelectorAll('.pulse-marker');
  if (!markers.length) return;
  gsap.fromTo(markers,
    { scale: 0 },
    {
      scale: 1, duration: 0.55, ease: 'back.out(2.2)',
      stagger: { each: 0.035, from: 'random' },
      clearProps: 'transform', overwrite: 'auto',
    });
}

export function mapSweep(wrapper) {
  if (!wrapper || reduced()) return;
  const sweep = document.createElement('div');
  sweep.className = 'map-sweep';
  sweep.setAttribute('aria-hidden', 'true');
  wrapper.appendChild(sweep);
  gsap.fromTo(sweep,
    { scale: 0.1, opacity: 0.7 },
    {
      scale: 1.6, opacity: 0, duration: 1.5, ease: 'power2.out',
      onComplete: () => sweep.remove(),
    });
}
