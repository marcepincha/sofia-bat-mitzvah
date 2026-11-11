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
const gallery            = document.getElementById('gallery');
const galleryTrack       = gallery.querySelector('.photo-carousel-track');
const galleryPosition    = document.getElementById('gallery-position');
const galleryPrev        = document.getElementById('gallery-prev');
const galleryNext        = document.getElementById('gallery-next');
const lightbox           = document.getElementById('lightbox');
const lightboxImg        = document.getElementById('lightbox-img');
const lightboxCaption    = document.getElementById('lightbox-caption');
const lightboxClose      = document.getElementById('lightbox-close');
let galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
let galleryIndex = 0;

function showGalleryItem(index) {
  if (galleryItems.length === 0) return;
  galleryIndex = ((index % galleryItems.length) + galleryItems.length) % galleryItems.length;
  galleryTrack.style.transform = `translateX(-${galleryIndex * 100}%)`;
  galleryItems.forEach((item, itemIndex) => {
    item.setAttribute('aria-hidden', String(itemIndex !== galleryIndex));
  });
  galleryPosition.textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
}

galleryPrev.addEventListener('click', () => showGalleryItem(galleryIndex - 1));
galleryNext.addEventListener('click', () => showGalleryItem(galleryIndex + 1));
gallery.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') showGalleryItem(galleryIndex - 1);
  if (e.key === 'ArrowRight') showGalleryItem(galleryIndex + 1);
});

let swipeStartX = null;
gallery.addEventListener('touchstart', e => {
  swipeStartX = e.changedTouches[0].clientX;
}, { passive: true });
gallery.addEventListener('touchend', e => {
  if (swipeStartX === null) return;
  const swipeDistance = e.changedTouches[0].clientX - swipeStartX;
  if (Math.abs(swipeDistance) > 50) {
    showGalleryItem(galleryIndex + (swipeDistance < 0 ? 1 : -1));
  }
  swipeStartX = null;
}, { passive: true });

gallery.addEventListener('click', e => {
  const item = e.target.closest('.gallery-item');
  if (!item || !gallery.contains(item)) return;

  const img = item.querySelector('img');
  const caption = item.querySelector('.photo-caption');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const character = text[i];
    if (insideQuotes) {
      if (character === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (character === '"') {
        insideQuotes = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      insideQuotes = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (insideQuotes) throw new Error('El CSV tiene un campo entre comillas sin cerrar.');
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function renderPhotoDescription(item, descriptions) {
  const image = item.querySelector('img');
  const description = descriptions.get(image.dataset.filename);
  if (!description) return;

  const values = [
    description.descripcion_es,
    description.descripcion_en,
    description.descripcion_he
  ].filter(Boolean);
  if (values.length === 0) return;

  let caption = item.querySelector('.photo-caption');
  if (!caption) {
    caption = document.createElement('div');
    caption.className = 'photo-caption';
    item.querySelector('.photo-frame-gallery').append(caption);
  }

  caption.replaceChildren();
  values.forEach((value, index) => {
    if (index > 0) caption.append(document.createTextNode(' · '));
    const span = document.createElement('span');
    span.textContent = value;
    caption.append(span);
  });
}

async function loadGalleryCsv() {
  const response = await fetch('data/galeria.csv');
  if (!response.ok) throw new Error(`No se pudo cargar data/galeria.csv (${response.status}).`);

  const rows = parseCSV((await response.text()).replace(/^\uFEFF/, ''));
  const headers = rows.shift();
  const requiredHeaders = ['archivo', 'descripcion_es', 'descripcion_en', 'descripcion_he'];
  if (!headers || requiredHeaders.some(header => !headers.includes(header))) {
    throw new Error('El CSV debe incluir las columnas: archivo, descripcion_es, descripcion_en, descripcion_he.');
  }

  const descriptions = new Map();
  const filenames = [];
  rows.forEach((row, index) => {
    if (row.length !== headers.length) {
      throw new Error(`La fila ${index + 2} del CSV tiene ${row.length} columnas; se esperaban ${headers.length}.`);
    }
    const record = Object.fromEntries(headers.map((header, column) => [header, row[column].trim()]));
    if (!record.archivo) throw new Error(`Falta el nombre del archivo en la fila ${index + 2} del CSV.`);
    if (descriptions.has(record.archivo)) throw new Error(`El archivo ${record.archivo} está repetido en el CSV.`);
    descriptions.set(record.archivo, record);
    filenames.push(record.archivo);
  });

  return { descriptions, filenames };
}

function getGalleryApiUrl() {
  const githubDomain = '.github.io';
  if (!location.hostname.endsWith(githubDomain)) return null;

  const owner = location.hostname.slice(0, -githubDomain.length);
  const repository = location.pathname.split('/').filter(Boolean)[0];
  if (!owner || !repository) return null;

  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/images/galeria?per_page=1000`;
}

function createGalleryItem(filename, index, descriptions) {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.dataset.index = String(index);

  const frame = document.createElement('div');
  frame.className = 'photo-frame-gallery';

  const image = document.createElement('img');
  image.src = `images/galeria/${encodeURIComponent(filename)}`;
  image.alt = `Fotografía familiar: ${filename}`;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.dataset.filename = filename;

  frame.append(image);
  item.append(frame);
  renderPhotoDescription(item, descriptions);
  return item;
}

async function initializeGallery() {
  let descriptions = new Map();
  let fallbackFilenames = [];
  try {
    const csv = await loadGalleryCsv();
    descriptions = csv.descriptions;
    fallbackFilenames = csv.filenames;
  } catch (error) {
    console.error('Error al cargar las descripciones de la galería:', error);
  }

  let filenames = fallbackFilenames.filter(filename => filename !== 'mockup.jpg');
  const apiUrl = getGalleryApiUrl();
  if (apiUrl) {
    try {
      const response = await fetch(apiUrl, { headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error(`GitHub respondió ${response.status} al listar las imágenes.`);
      const files = await response.json();
      if (!Array.isArray(files)) throw new Error('La respuesta de GitHub no contiene una lista de archivos.');
      filenames = files
        .filter(file => file.type === 'file' && /\.(jpe?g|png|gif|webp|avif)$/i.test(file.name))
        .map(file => file.name);
    } catch (error) {
      console.error('No se pudieron detectar las imágenes automáticamente; se usará la lista del CSV:', error);
    }
  }

  filenames = [...new Set(filenames)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  filenames.forEach((filename, index) => {
    galleryTrack.append(createGalleryItem(filename, index + 1, descriptions));
  });

  galleryItems = Array.from(galleryTrack.querySelectorAll('.gallery-item'));
  showGalleryItem(0);
}

initializeGallery();

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
