/* EXOTICS CA — Pre-launch teaser flow (index only) */
(function () {
  'use strict';

  const signupGate = document.getElementById('signup-gate');
  if (!signupGate) return;

  const titleDeed = document.getElementById('title-deed');
  const titleDeedName = document.getElementById('title-deed-name');
  const signupForm = document.getElementById('signup-form');
  const hero = document.querySelector('.hero--video');
  const heroVideo = document.querySelector('.hero__video');
  const teaserFinale = document.getElementById('teaser-finale');
  const mainContent = document.getElementById('main-content');
  const ageGate = document.getElementById('age-gate');

  const STORAGE = {
    age: 'exotics_age_verified',
    signedUp: 'exotics_signed_up',
    userName: 'exotics_user_name'
  };

  function playKaChing() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;

      function tone(freq, start, dur, type, vol) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(vol, now + start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur);
      }

      tone(1200, 0, 0.08, 'square', 0.15);
      tone(1800, 0.06, 0.12, 'sine', 0.2);
      tone(900, 0.1, 0.2, 'triangle', 0.12);
      tone(2400, 0.14, 0.06, 'square', 0.08);
    } catch (_) { /* audio optional */ }
  }

  function showSignup() {
    signupGate.classList.remove('hidden');
    document.body.classList.add('signup-active');
    document.body.style.overflow = 'hidden';
  }

  function hideSignup() {
    signupGate.classList.add('hidden');
    document.body.classList.remove('signup-active');
  }

  function showTitleDeed(name) {
    if (titleDeedName) titleDeedName.textContent = name.toUpperCase();
    titleDeed.classList.add('visible');
    playKaChing();
    return new Promise(resolve => {
      setTimeout(() => {
        titleDeed.classList.remove('visible');
        titleDeed.classList.add('exit');
        setTimeout(() => {
          titleDeed.classList.remove('exit');
          resolve();
        }, 600);
      }, 3000);
    });
  }

  function playHeroVideo() {
    if (!heroVideo) return;
    heroVideo.muted = true;
    heroVideo.loop = false;
    heroVideo.currentTime = 0;
    heroVideo.play().catch(() => {});
  }

  let teaserStarted = false;

  function startTeaserSequence() {
    if (teaserStarted) return;
    teaserStarted = true;

    document.body.classList.add('teaser-mode');
    document.body.style.overflow = 'hidden';
    if (mainContent) mainContent.setAttribute('aria-hidden', 'true');

    window.scrollTo(0, 0);
    playHeroVideo();

    setTimeout(() => {
      hero?.classList.add('hero--fading');
      teaserFinale?.classList.add('visible');
      heroVideo?.pause();
    }, 5000);
  }

  function enterPostSignup(name) {
    sessionStorage.setItem(STORAGE.signedUp, 'true');
    sessionStorage.setItem(STORAGE.userName, name);
    hideSignup();
    showTitleDeed(name).then(startTeaserSequence);
  }

  function checkAgeAndRoute() {
    const ageOk = sessionStorage.getItem(STORAGE.age) === 'true';
    const signedUp = sessionStorage.getItem(STORAGE.signedUp) === 'true';

    if (!ageOk) {
      document.body.style.overflow = 'hidden';
      return;
    }

    ageGate?.classList.add('hidden');

    if (signedUp) {
      hideSignup();
      startTeaserSequence();
    } else {
      showSignup();
    }
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name')?.value.trim();
      const email = document.getElementById('signup-email')?.value.trim();
      const phone = document.getElementById('signup-phone')?.value.trim();
      if (!name || !email || !phone) return;

      const btn = signupForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'PROCESSING...';
      }

      setTimeout(() => enterPostSignup(name), 400);
    });
  }

  if (ageGate) {
    const ageYes = document.getElementById('age-yes');
    const ageNo = document.getElementById('age-no');

    ageYes?.addEventListener('click', () => {
      sessionStorage.setItem(STORAGE.age, 'true');
      ageGate.classList.add('hidden');
      const signedUp = sessionStorage.getItem(STORAGE.signedUp) === 'true';
      if (signedUp) {
        startTeaserSequence();
      } else {
        showSignup();
      }
    }, { once: false });

    ageNo?.addEventListener('click', () => {
      window.location.href = 'https://www.google.com';
    });

    if (sessionStorage.getItem(STORAGE.age) === 'true') {
      checkAgeAndRoute();
    }
  }

  document.querySelectorAll('.teaser-locked').forEach(el => {
    el.addEventListener('click', (e) => {
      if (document.body.classList.contains('teaser-mode')) e.preventDefault();
    });
  });

  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('teaser-mode')) return;
    if (e.target.closest('.header__menu-btn') || e.target.closest('.header__menu-wrap')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  window.addEventListener('scroll', (e) => {
    if (document.body.classList.contains('teaser-mode')) {
      window.scrollTo(0, 0);
    }
  }, { passive: false });

  window.addEventListener('wheel', (e) => {
    if (document.body.classList.contains('teaser-mode')) e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (document.body.classList.contains('teaser-mode') && !e.target.closest('.signup-gate')) {
      e.preventDefault();
    }
  }, { passive: false });
})();