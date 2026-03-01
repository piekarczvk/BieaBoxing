/* ============================================================
   BIEA BOXING — Gallery Page Logic
   ============================================================
   Handles: filter buttons, lightbox, mobile menu,
   scroll reveal, language toggle, current year.
   ============================================================ */

const Gallery = {

  init() {
    this.setupFilters();
    this.setupLightbox();
    this.setupMobileMenu();
    this.setupScrollReveal();
    this.setCurrentYear();

    // Initialize i18n last (after DOM is populated)
    I18n.init();
  },

  // ========================================
  // FILTER BUTTONS
  // ========================================
  setupFilters() {
    const buttons = document.querySelectorAll('.gallery__filter');
    const items = document.querySelectorAll('.gallery__item');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active button
        buttons.forEach((b) => b.classList.remove('gallery__filter--active'));
        btn.classList.add('gallery__filter--active');

        const filter = btn.dataset.filter;

        items.forEach((item) => {
          if (filter === 'all' || item.dataset.type === filter) {
            item.classList.remove('gallery__item--hidden');
          } else {
            item.classList.add('gallery__item--hidden');
          }
        });
      });
    });
  },

  // ========================================
  // LIGHTBOX (ready for when images are added)
  // ========================================
  setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = lightbox?.querySelector('.lightbox__close');
    const prevBtn = lightbox?.querySelector('.lightbox__prev');
    const nextBtn = lightbox?.querySelector('.lightbox__next');

    if (!lightbox) return;

    let currentIndex = 0;
    let images = [];

    const open = (index) => {
      images = Array.from(document.querySelectorAll('.gallery__item[data-type="photos"]:not(.gallery__item--hidden) .gallery__thumb img'));
      if (images.length === 0) return;

      currentIndex = index;
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt || '';
      lightbox.hidden = false;
      requestAnimationFrame(() => lightbox.classList.add('lightbox--open'));
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      lightbox.classList.remove('lightbox--open');
      setTimeout(() => {
        lightbox.hidden = true;
        lightboxImg.src = '';
      }, 300);
      document.body.style.overflow = '';
    };

    const navigate = (dir) => {
      if (images.length === 0) return;
      currentIndex = (currentIndex + dir + images.length) % images.length;
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt || '';
    };

    // Click on gallery images to open lightbox
    document.getElementById('galleryGrid')?.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery__item[data-type="photos"]');
      if (!item) return;

      const img = item.querySelector('.gallery__thumb img');
      if (!img) return; // Don't open for placeholders

      const allImages = Array.from(document.querySelectorAll('.gallery__item[data-type="photos"]:not(.gallery__item--hidden) .gallery__thumb img'));
      const index = allImages.indexOf(img);
      if (index >= 0) open(index);
    });

    closeBtn?.addEventListener('click', close);
    prevBtn?.addEventListener('click', () => navigate(-1));
    nextBtn?.addEventListener('click', () => navigate(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
  },

  // ========================================
  // MOBILE MENU (same as main page)
  // ========================================
  setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('navMenu');

    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('navbar__hamburger--active');
      menu.classList.toggle('navbar__menu--open');
      document.body.style.overflow = menu.classList.contains('navbar__menu--open') ? 'hidden' : '';
    });

    menu.querySelectorAll('.navbar__link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('navbar__hamburger--active');
        menu.classList.remove('navbar__menu--open');
        document.body.style.overflow = '';
      });
    });
  },

  // ========================================
  // SCROLL REVEAL
  // ========================================
  setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
  },

  // ========================================
  // CURRENT YEAR
  // ========================================
  setCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  },
};

// ========================================
// BOOT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  Gallery.init();
});
