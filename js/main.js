/* ═══════════════════════════════════════════════════════════
   LA CAJA DE LOS RECUERDOS — JavaScript
   Sofía's Bat Mitzvah Art Project
═══════════════════════════════════════════════════════════ */

'use strict';

/* ───── PRELOADER ───── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
    // Autoplay Hatikvah (low volume)
    tryAutoplay();
  }, 1800);
});

/* ───── HATIKVAH AUDIO ───── */
const audio    = document.getElementById('hatikvah-audio');
const audioBtn = document.getElementById('audio-btn');
const audioIcon= document.getElementById('audio-icon');
let   audioStarted = false;

function tryAutoplay() {
  if (!audio) return;
  audio.volume = 0.18;
  const promise = audio.play();
  if (promise !== undefined) {
    promise
      .then(() => {
        audioStarted = true;
        audioBtn.classList.add('playing');
        audioIcon.textContent = '♫';
      })
      .catch(() => {
        // Autoplay blocked — user must interact first
        audioIcon.textContent = '♪';
      });
  }
}

audioBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.volume = 0.18;
    audio.play();
    audioBtn.classList.add('playing');
    audioIcon.textContent = '♫';
  } else {
    audio.pause();
    audioBtn.classList.remove('playing');
    audioIcon.textContent = '♪';
  }
});

// Fade in audio on first user interaction (browsers block autoplay)
document.addEventListener('click', () => {
  if (!audioStarted && audio.paused) {
    audio.volume = 0.18;
    audio.play().then(() => {
      audioStarted = true;
      audioBtn.classList.add('playing');
      audioIcon.textContent = '♫';
    }).catch(() => {});
  }
}, { once: true });

/* ───── NAV SCROLL ───── */
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

/* Smooth nav links */
document.querySelectorAll('#main-nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ───── LANGUAGE TABS ───── */
const tabs   = document.querySelectorAll('.lang-tab');
const panels = document.querySelectorAll('.lang-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const lang = tab.dataset.lang;

    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(`panel-${lang}`).classList.add('active');
  });
});

/* ───── PHOTO LIGHTBOX ───── */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose   = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img     = item.querySelector('img');
    const caption = item.querySelector('.photo-caption');

    lightboxImg.src         = img.src;
    lightboxImg.alt         = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Pause audio briefly to signal click (optional — remove if not desired)
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

/* ───── SCROLL REVEAL (Intersection Observer) ───── */
const revealElements = document.querySelectorAll('.timeline-item, .closing-poem, .reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger items in the same container
      const delay = entry.target.closest('.timeline')
        ? Array.from(document.querySelectorAll('.timeline-item')).indexOf(entry.target) * 150
        : 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => observer.observe(el));

/* ───── PARALLAX on floating photos ───── */
const fp1 = document.querySelector('.fp1');
const fp2 = document.querySelector('.fp2');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (fp1) fp1.style.transform = `rotate(-10deg) translateY(${y * 0.08}px)`;
  if (fp2) fp2.style.transform = `rotate(8deg) translateY(${-y * 0.06}px)`;
}, { passive: true });

/* ───── PHOTO FRAME TILT on hover (subtle 3D) ───── */
document.querySelectorAll('.photo-frame, .photo-frame-gallery').forEach(frame => {
  frame.addEventListener('mousemove', (e) => {
    const rect  = frame.getBoundingClientRect();
    const x     = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const y     = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    const tiltX = y * -4;
    const tiltY = x * 4;
    frame.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
  });

  frame.addEventListener('mouseleave', () => {
    // Restore original tilt
    if (frame.classList.contains('tilt-left'))  frame.style.transform = 'rotate(-2.5deg)';
    else if (frame.classList.contains('tilt-right')) frame.style.transform = 'rotate(2deg)';
    else frame.style.transform = '';
  });
});

/* ───── HERO CTA SCROLL ───── */
const heroCta = document.querySelector('.hero-cta');
if (heroCta) {
  heroCta.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('instalacion').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ───── CONSOLE SIGNATURE ───── */
console.log('%c✡ La Caja de los Recuerdos — Sofía 2026 ✡', 'color: #c9a96e; font-size: 1.2rem; font-family: serif; font-style: italic;');
