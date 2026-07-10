/* EXOTICS CA — Main JS */
(function () {
  'use strict';

  // Hero video autoplay
  const heroVideo = document.querySelector('.hero__video');
  function playHeroVideo() {
    if (!heroVideo) return;
    heroVideo.muted = true;
    heroVideo.play().catch(() => {});
  }

  // Age Gate
  const ageGate = document.getElementById('age-gate');
  const ageYes = document.getElementById('age-yes');
  const ageNo = document.getElementById('age-no');

  if (ageGate) {
    const verified = sessionStorage.getItem('exotics_age_verified');
    if (verified === 'true') {
      ageGate.classList.add('hidden');
      playHeroVideo();
    }

    if (ageYes) {
      ageYes.addEventListener('click', () => {
        sessionStorage.setItem('exotics_age_verified', 'true');
        ageGate.classList.add('hidden');
        document.body.style.overflow = '';
        playHeroVideo();
      });
    }

    if (ageNo) {
      ageNo.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
      });
    }
  }

  // Header scroll
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Menu toggle
  const menuBtn = document.querySelector('.header__menu-btn');
  const navOverlay = document.querySelector('.nav-overlay');
  const navClose = document.querySelector('.nav-overlay__close');

  function toggleMenu(open) {
    if (!navOverlay) return;
    navOverlay.classList.toggle('open', open);
    menuBtn?.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
  }

  menuBtn?.addEventListener('click', () => toggleMenu(true));
  navClose?.addEventListener('click', () => toggleMenu(false));

  navOverlay?.querySelectorAll('.nav-overlay__link:not(.has-sub)').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Shop submenu toggle
  const shopLink = document.querySelector('.nav-overlay__link.has-sub');
  if (shopLink) {
    shopLink.addEventListener('click', (e) => {
      e.preventDefault();
      shopLink.classList.toggle('open');
    });
  }

  // Modals
  const emailModal = document.getElementById('email-modal');
  const modalCloses = document.querySelectorAll('.modal__close, .modal-overlay');

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
  }

  function closeModals() {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.modal);
    });
  });

  modalCloses.forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) closeModals();
    });
  });

  // Auto-show email modal after age gate (first visit)
  if (!sessionStorage.getItem('exotics_email_shown') && ageGate) {
    const observer = new MutationObserver(() => {
      if (ageGate.classList.contains('hidden') && !sessionStorage.getItem('exotics_email_shown')) {
        setTimeout(() => {
          openModal('email-modal');
          sessionStorage.setItem('exotics_email_shown', 'true');
        }, 1500);
        observer.disconnect();
      }
    });
    observer.observe(ageGate, { attributes: true, attributeFilter: ['class'] });
  }

  // Form submissions
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.querySelector('.form-success');
      const error = form.querySelector('.form-error');
      if (success) {
        success.style.display = 'block';
        if (error) error.style.display = 'none';
        form.reset();
        setTimeout(() => { success.style.display = 'none'; }, 4000);
      }
    });
  });

  // Scroll animations
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => io.observe(el));
  }

  // Product filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const strainCards = document.querySelectorAll('.strain-card');

  function applyFilter(filter) {
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
    strainCards.forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  if (window.location.hash === '#limited') {
    applyFilter('limited');
    document.getElementById('limited')?.scrollIntoView({ behavior: 'smooth' });
  }

  // Store locator search
  const locatorSearch = document.getElementById('locator-search');
  if (locatorSearch) {
    locatorSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.locator-city').forEach(city => {
        const name = city.dataset.city || '';
        const stores = city.textContent.toLowerCase();
        city.style.display = (name.includes(query) || stores.includes(query) || !query) ? '' : 'none';
      });
    });
  }

  // Gallery lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const lb = document.createElement('div');
      lb.className = 'modal-overlay open';
      lb.innerHTML = `<div style="max-width:90vw;max-height:90vh"><img src="${img.src}" style="max-width:100%;max-height:90vh;object-fit:contain"><button class="modal__close" style="position:fixed;top:2rem;right:2rem;font-size:2rem;color:white">&times;</button></div>`;
      document.body.appendChild(lb);
      lb.addEventListener('click', (e) => {
        if (e.target === lb || e.target.classList.contains('modal__close')) lb.remove();
      });
    });
  });
})();