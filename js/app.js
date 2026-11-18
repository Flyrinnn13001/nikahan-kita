/**
 * THE WEDDING OF RIANI & RAFLY — "Illustrated Garden Zoom"
 * Interactive Storybook Watercolor Invitation Engine
 */

(function () {
  'use strict';

  /* ========================================================================
     1. PERSONALIZED GUEST NAME FROM URL PARAMETER ?to=<nama tamu>
     ======================================================================== */
  function initGuestName() {
    const params = new URLSearchParams(window.location.search);
    const rawGuest = params.get('to') || params.get('kepada') || params.get('guest') || '';
    const cleaned = rawGuest.trim();
    const guestDisplay = document.getElementById('guest-name-display');
    const rsvpNameInput = document.getElementById('rsvp-name');

    if (cleaned && guestDisplay) {
      guestDisplay.textContent = cleaned;
      if (rsvpNameInput && !rsvpNameInput.value) {
        rsvpNameInput.value = cleaned;
      }
    }
  }

  /* ========================================================================
     2. FLOATING SPARKLES & LIGHT PARTICLES GENERATOR IN THE GARDEN
     ======================================================================== */
  function initSparkles() {
    const container = document.getElementById('sparkles-container');
    if (!container) return;

    const count = window.innerWidth <= 600 ? 12 : 20;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'light-particle';
      const size = (3.5 + Math.random() * 5.5).toFixed(1);
      const left = (4 + Math.random() * 92).toFixed(1);
      const top = (12 + Math.random() * 82).toFixed(1);
      const dur = (5.5 + Math.random() * 6.5).toFixed(2);
      const delay = (-Math.random() * 10).toFixed(2);

      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${left}%`;
      p.style.top = `${top}%`;
      p.style.animationDuration = `${dur}s`;
      p.style.animationDelay = `${delay}s`;
      frag.appendChild(p);
    }
    container.appendChild(frag);
  }

  /* ========================================================================
     3. BACKGROUND MUSIC & FLOATING TOGGLE
     ======================================================================== */
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const floatingControls = document.getElementById('floating-controls');
  let isMusicPlaying = false;

  function playMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0.65;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isMusicPlaying = true;
          updateMusicButtonUI();
        })
        .catch(() => {
          isMusicPlaying = false;
          updateMusicButtonUI();
        });
    }
  }

  function updateMusicButtonUI() {
    if (!musicToggle) return;
    if (isMusicPlaying && !bgMusic.paused) {
      musicToggle.classList.add('playing');
      musicToggle.classList.remove('muted');
    } else {
      musicToggle.classList.remove('playing');
      musicToggle.classList.add('muted');
    }
  }

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        playMusic();
      } else {
        bgMusic.pause();
        isMusicPlaying = false;
        updateMusicButtonUI();
      }
    });
  }

  /* ========================================================================
     4. CINEMATIC COVER ZOOM-IN TRANSITION (SCALE 1 -> 3.5 OVER 3.6 SECONDS)
     ======================================================================== */
  const coverOverlay = document.getElementById('cover-overlay');
  const coverZoomRig = document.getElementById('cover-zoom-rig');
  const btnOpenInvitation = document.getElementById('btn-open-invitation');
  const gardenCameraRig = document.getElementById('garden-camera-rig');

  const coverOuterElements = [
    document.getElementById('cover-lilies-left'),
    document.getElementById('cover-lilies-right'),
    document.getElementById('cover-wax-seal'),
    document.getElementById('cover-quote-tag'),
    document.getElementById('cover-bottom-panel'),
  ].filter(Boolean);

  let isOpening = false;
  let isUnlocked = false;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function openInvitationWithZoom() {
    if (isOpening || isUnlocked) return;
    isOpening = true;

    // 1. Start Background Music & Show Floating Controls
    playMusic();
    if (floatingControls) {
      floatingControls.classList.add('visible');
    }

    // Ensure scroll is at top of garden track
    window.scrollTo(0, 0);

    // Prepare garden camera underneath to expand into full view synchronously
    if (gardenCameraRig) {
      gardenCameraRig.style.transform = 'translate3d(0%, 0%, 0) scale3d(0.86, 0.86, 1)';
    }

    const durationMs = 3400; // 3.4 seconds cinematic zoom into the painting
    const startTime = performance.now();
    let outerHidden = false;

    function stepZoom(now) {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / durationMs);
      const e = easeInOutCubic(rawProgress);

      // Zoom the cover rig from scale 1 to 3.5 toward the center of the oval painting
      const currentScale = 1 + (3.5 - 1) * e;
      if (coverZoomRig) {
        coverZoomRig.style.transform = `scale3d(${currentScale.toFixed(4)}, ${currentScale.toFixed(4)}, 1)`;
      }

      // Fade out outer frame elements (lilies, tag, wax seal, bottom panel) as they expand past screen
      if (!outerHidden) {
        const outerFade = Math.max(0, 1 - easeInOutCubic(Math.min(1, rawProgress * 1.45)));
        for (let i = 0; i < coverOuterElements.length; i++) {
          coverOuterElements[i].style.opacity = outerFade.toFixed(3);
        }
        if (outerFade <= 0.001) {
          outerHidden = true;
        }
      }

      // Fade out the cover overlay itself in the final 45% of the zoom so the live multi-layer garden shines through seamlessly
      const overlayOpacity = rawProgress < 0.52 ? 1 : Math.max(0, 1 - (rawProgress - 0.52) / 0.48);
      if (coverOverlay) {
        coverOverlay.style.opacity = overlayOpacity.toFixed(3);
      }

      // Concurrently expand the live garden stage from 0.86 to 1.00
      if (gardenCameraRig) {
        const gardenScale = 0.86 + 0.14 * e;
        gardenCameraRig.style.transform = `translate3d(0%, 0%, 0) scale3d(${gardenScale.toFixed(4)}, ${gardenScale.toFixed(4)}, 1)`;
      }

      if (rawProgress < 1) {
        requestAnimationFrame(stepZoom);
      } else {
        // Transition complete: unlock scroll and activate interactive garden scroll choreography
        if (coverOverlay) {
          coverOverlay.classList.add('hidden');
        }
        document.body.classList.remove('locked');
        isUnlocked = true;
        measureGardenMetrics();
        updateGardenScene(0, true);
      }
    }

    requestAnimationFrame(stepZoom);
  }

  if (btnOpenInvitation) {
    btnOpenInvitation.addEventListener('click', openInvitationWithZoom);
  }

  /* ========================================================================
     5. GARDEN SCROLL CAMERA CHOREOGRAPHY & MULTI-LAYER PARALLAX (60FPS)
     ======================================================================== */
  const gardenTrack = document.getElementById('garden-scroll-track');
  const coupleWrapper = document.getElementById('couple-wrapper');
  const catGreyWrapper = document.getElementById('cat-grey-wrapper');
  const catOrangeWrapper = document.getElementById('cat-orange-wrapper');

  const layerSkyVilla = document.getElementById('layer-sky-villa');
  const layerMidGarden = document.getElementById('layer-mid-garden');
  const layerCharacters = document.getElementById('layer-characters');
  const layerWildlife = document.getElementById('layer-wildlife');
  const layerFgFlowers = document.getElementById('layer-foreground-flowers');

  const cards = {
    hero: document.getElementById('scene-card-hero'),
    scrollHint: document.getElementById('scene-scroll-hint'),
    bride: document.getElementById('scene-card-bride'),
    groom: document.getElementById('scene-card-groom'),
    weddingDay: document.getElementById('scene-card-wedding-day'),
    location: document.getElementById('scene-card-location'),
    ayat: document.getElementById('scene-card-ayat'),
    saveDate: document.getElementById('scene-card-save-date'),
  };

  const chapterDots = Array.from(document.querySelectorAll('.chapter-dot'));

  /**
   * Camera keyframes across normalized scroll progress p in [0, 1]:
   * - scale: camera zoom factor
   * - x: camera pan X (%)
   * - y: camera pan Y (%)
   * - coupleAlpha: opacity of the couple & cats (fades down in Scene 7A when panning up to the sunset sky)
   * - coupleShiftY: vertical shift (px) of the couple when panning to the sky
   */
  const CAMERA_KEYFRAMES = [
    // Scene 3: Hero in the Garden (Full Sunset Scene)
    { p: 0.00, scale: 1.00, x: 0.0,   y: 0.0,   coupleAlpha: 1.0,  coupleShiftY: 0 },
    { p: 0.11, scale: 1.03, x: 0.0,   y: 0.0,   coupleAlpha: 1.0,  coupleShiftY: 0 },

    // Scene 4A: Zoom & Pan to Close-Up of Bride (Siti Riani)
    { p: 0.16, scale: 2.02, x: -13.5, y: 8.5,   coupleAlpha: 1.0,  coupleShiftY: 0 },
    { p: 0.26, scale: 2.08, x: -14.5, y: 9.0,   coupleAlpha: 1.0,  coupleShiftY: 0 },

    // Scene 4B: Pan Across to Close-Up of Groom (Muhamad Rafly Kristiadi)
    { p: 0.31, scale: 2.04, x: 14.5,  y: 10.5,  coupleAlpha: 1.0,  coupleShiftY: 0 },
    { p: 0.42, scale: 2.08, x: 15.0,  y: 11.0,  coupleAlpha: 1.0,  coupleShiftY: 0 },

    // Scene 4C: Zoom-Out Back to Full Couple Together
    { p: 0.46, scale: 1.10, x: 0.0,   y: -1.0,  coupleAlpha: 1.0,  coupleShiftY: 0 },
    { p: 0.52, scale: 1.10, x: 0.0,   y: -1.0,  coupleAlpha: 1.0,  coupleShiftY: 0 },

    // Scene 5: Zoom to Fluffy Grey Cat on Left (Wedding Day + Countdown)
    { p: 0.56, scale: 2.28, x: 27.5,  y: -21.5, coupleAlpha: 1.0,  coupleShiftY: 0 },
    { p: 0.67, scale: 2.32, x: 28.0,  y: -22.0, coupleAlpha: 1.0,  coupleShiftY: 0 },

    // Scene 6: Pan & Zoom to Small Orange Cat on Right near Veil (Location + Maps)
    { p: 0.72, scale: 2.28, x: -27.5, y: -22.5, coupleAlpha: 1.0,  coupleShiftY: 0 },
    { p: 0.82, scale: 2.32, x: -28.0, y: -23.0, coupleAlpha: 1.0,  coupleShiftY: 0 },

    // Scene 7A: Zoom-Out & Pan Up to Sunset Sky Above Villa (Surah Ar-Ruum 30:21, Couple Fades Down)
    { p: 0.86, scale: 1.36, x: 0.0,   y: 26.0,  coupleAlpha: 0.14, coupleShiftY: 68 },
    { p: 0.92, scale: 1.40, x: 0.0,   y: 27.5,  coupleAlpha: 0.14, coupleShiftY: 72 },

    // Scene 7B: Return Zoom to Couple + "Save the Date 22.08.2027"
    { p: 0.95, scale: 1.22, x: 0.0,   y: -2.0,  coupleAlpha: 1.0,  coupleShiftY: 0 },
    { p: 1.00, scale: 1.25, x: 0.0,   y: -2.5,  coupleAlpha: 1.0,  coupleShiftY: 0 },
  ];

  function sampleCameraKeyframes(p) {
    const clamped = Math.max(0, Math.min(1, p));
    for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
      const k0 = CAMERA_KEYFRAMES[i];
      const k1 = CAMERA_KEYFRAMES[i + 1];
      if (clamped >= k0.p && clamped <= k1.p) {
        const span = k1.p - k0.p || 0.0001;
        const localT = (clamped - k0.p) / span;
        const smoothT = easeInOutCubic(localT);
        return {
          scale: k0.scale + (k1.scale - k0.scale) * smoothT,
          x: k0.x + (k1.x - k0.x) * smoothT,
          y: k0.y + (k1.y - k0.y) * smoothT,
          coupleAlpha: k0.coupleAlpha + (k1.coupleAlpha - k0.coupleAlpha) * smoothT,
          coupleShiftY: k0.coupleShiftY + (k1.coupleShiftY - k0.coupleShiftY) * smoothT,
        };
      }
    }
    return CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];
  }

  /**
   * Computes smooth bell-curve / plateau visibility [0..1] for each scene card
   */
  function bandOpacity(p, startIn, fullIn, fullOut, endOut) {
    if (p <= startIn || p >= endOut) return 0;
    if (p >= fullIn && p <= fullOut) return 1;
    if (p < fullIn) return easeInOutCubic((p - startIn) / (fullIn - startIn));
    return 1 - easeInOutCubic((p - fullOut) / (endOut - fullOut));
  }

  const cardState = new WeakMap();

  function applyCardVisibility(el, alpha, slideY = 14) {
    if (!el) return;
    const rounded = Math.round(alpha * 1000) / 1000;
    const prev = cardState.get(el);
    if (prev !== undefined && Math.abs(prev - rounded) < 0.002) return;
    cardState.set(el, rounded);

    el.style.opacity = rounded.toFixed(3);
    const yOffset = ((1 - rounded) * slideY).toFixed(1);
    if (
      el.classList.contains('hero-title-banner') ||
      el.classList.contains('scroll-hint-pill') ||
      el.classList.contains('sky-ayat-card') ||
      el.classList.contains('save-date-finale-card')
    ) {
      el.style.transform = `translate3d(-50%, ${yOffset}px, 0)`;
    } else {
      el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
    }
    if (rounded > 0.55) {
      el.classList.add('interactive-active');
    } else {
      el.classList.remove('interactive-active');
    }
  }

  let targetProgress = 0;
  let currentProgress = 0;
  let gardenTrackTop = 0;
  let gardenTrackHeight = 1;
  let gardenScrollable = 1;
  let rafId = 0;
  let lastActiveDot = -1;
  let lastRenderedP = -1;
  let isGardenPaused = false;

  function measureGardenMetrics() {
    if (!gardenTrack) return;
    gardenTrackTop = gardenTrack.offsetTop;
    gardenTrackHeight = gardenTrack.offsetHeight;
    gardenScrollable = Math.max(1, gardenTrackHeight - window.innerHeight);
  }

  function updateGardenScene(p, force) {
    if (!force && Math.abs(p - lastRenderedP) < 0.0001) return;
    lastRenderedP = p;

    const cam = sampleCameraKeyframes(p);

    // 1. Transform main camera rig using GPU scale3d
    if (gardenCameraRig && isUnlocked) {
      const s = cam.scale.toFixed(4);
      gardenCameraRig.style.transform = `translate3d(${cam.x.toFixed(2)}%, ${cam.y.toFixed(2)}%, 0) scale3d(${s}, ${s}, 1)`;
    }

    // 2. Apply multi-plane parallax offsets relative to camera pan & scroll
    // Back sky/villa moves slowest; midground garden moves medium; foreground flowers move fastest
    const panX = cam.x;
    const panY = cam.y;
    const scrollShift = (p - 0.5) * 32;

    if (layerSkyVilla) {
      layerSkyVilla.style.transform = `translate3d(${(-panX * 0.22).toFixed(2)}%, ${(-panY * 0.22 + scrollShift * 0.12).toFixed(2)}px, 0)`;
    }
    if (layerMidGarden) {
      layerMidGarden.style.transform = `translate3d(${(-panX * 0.10).toFixed(2)}%, ${(-panY * 0.10 + scrollShift * 0.28).toFixed(2)}px, 0)`;
    }
    if (layerCharacters) {
      layerCharacters.style.opacity = cam.coupleAlpha.toFixed(3);
      layerCharacters.style.transform = `translate3d(0, ${cam.coupleShiftY.toFixed(1)}px, 0)`;
    }
    if (layerWildlife) {
      layerWildlife.style.transform = `translate3d(${(panX * 0.08).toFixed(2)}%, ${(panY * 0.08 - scrollShift * 0.4).toFixed(2)}px, 0)`;
    }
    if (layerFgFlowers) {
      const fgs = (1 + (cam.scale - 1) * 0.12).toFixed(3);
      layerFgFlowers.style.transform = `translate3d(${(panX * 0.22).toFixed(2)}%, ${(panY * 0.18 - scrollShift * 0.75).toFixed(2)}px, 0) scale3d(${fgs}, ${fgs}, 1)`;
    }

    // 3. Update Scene Story Overlays (dirty-checked inside applyCardVisibility)
    const heroAlpha = p < 0.10 ? 1 : Math.max(0, 1 - (p - 0.10) / 0.04);
    applyCardVisibility(cards.hero, heroAlpha, -10);
    applyCardVisibility(cards.scrollHint, heroAlpha, 10);

    // Scene 4A: Bride (Siti Riani)
    const brideAlpha = bandOpacity(p, 0.13, 0.16, 0.26, 0.29);
    applyCardVisibility(cards.bride, brideAlpha, 14);

    // Scene 4B: Groom (Muhamad Rafly Kristiadi)
    const groomAlpha = bandOpacity(p, 0.29, 0.32, 0.42, 0.45);
    applyCardVisibility(cards.groom, groomAlpha, 14);

    // Scene 5: Grey Cat Wedding Day Speech Bubble
    const weddingDayAlpha = bandOpacity(p, 0.54, 0.57, 0.67, 0.70);
    applyCardVisibility(cards.weddingDay, weddingDayAlpha, 12);
    if (catGreyWrapper) {
      if (weddingDayAlpha > 0.005) {
        const lift = weddingDayAlpha * -6;
        const rot = weddingDayAlpha * 4;
        const cs = (1 + weddingDayAlpha * 0.08).toFixed(3);
        catGreyWrapper.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale3d(${cs}, ${cs}, 1)`;
      } else if (catGreyWrapper.style.transform) {
        catGreyWrapper.style.transform = '';
      }
    }

    // Scene 6: Orange Cat Location Glowing Speech Bubble
    const locationAlpha = bandOpacity(p, 0.70, 0.73, 0.82, 0.85);
    applyCardVisibility(cards.location, locationAlpha, 12);
    if (catOrangeWrapper) {
      if (locationAlpha > 0.005) {
        const lift = locationAlpha * -5;
        const rot = locationAlpha * -4;
        const cs = (1 + locationAlpha * 0.08).toFixed(3);
        catOrangeWrapper.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale3d(${cs}, ${cs}, 1)`;
      } else if (catOrangeWrapper.style.transform) {
        catOrangeWrapper.style.transform = '';
      }
    }

    // Scene 7A: Sunset Sky Surah Ar-Ruum 30:21
    const ayatAlpha = bandOpacity(p, 0.85, 0.87, 0.92, 0.945);
    applyCardVisibility(cards.ayat, ayatAlpha, -14);

    // Scene 7B: Save the Date 22.08.2027 on Couple
    const saveDateAlpha = p >= 0.94 ? Math.min(1, (p - 0.94) / 0.03) : 0;
    applyCardVisibility(cards.saveDate, saveDateAlpha, 14);

    // 4. Update Active Chapter Dot Indicator only when chapter changes
    let activeIdx = 0;
    if (p >= 0.94) activeIdx = 7;
    else if (p >= 0.85) activeIdx = 6;
    else if (p >= 0.70) activeIdx = 5;
    else if (p >= 0.54) activeIdx = 4;
    else if (p >= 0.45) activeIdx = 3;
    else if (p >= 0.29) activeIdx = 2;
    else if (p >= 0.13) activeIdx = 1;

    if (activeIdx !== lastActiveDot) {
      if (lastActiveDot >= 0 && chapterDots[lastActiveDot]) {
        chapterDots[lastActiveDot].classList.remove('active');
      }
      if (chapterDots[activeIdx]) {
        chapterDots[activeIdx].classList.add('active');
      }
      lastActiveDot = activeIdx;
    }
  }

  function computeScrollProgress() {
    if (!gardenTrack) return 0;
    const scrolled = window.scrollY - gardenTrackTop;
    return Math.max(0, Math.min(1, scrolled / gardenScrollable));
  }

  function updateOffscreenPauseState() {
    if (!gardenTrack) return;
    const shouldPause = window.scrollY > gardenTrackTop + gardenTrackHeight + 40;
    if (shouldPause !== isGardenPaused) {
      isGardenPaused = shouldPause;
      gardenTrack.classList.toggle('garden-paused', shouldPause);
    }
  }

  function tickGarden() {
    rafId = 0;
    if (!isUnlocked) return;

    targetProgress = computeScrollProgress();
    const delta = targetProgress - currentProgress;

    if (Math.abs(delta) < 0.0003) {
      currentProgress = targetProgress;
      updateGardenScene(currentProgress, false);
      return; // Stop rAF completely when settled — zero idle battery/CPU usage!
    }

    currentProgress += delta * 0.2;
    updateGardenScene(currentProgress, false);
    rafId = requestAnimationFrame(tickGarden);
  }

  function requestGardenTick() {
    updateOffscreenPauseState();
    if (isUnlocked && !rafId) {
      rafId = requestAnimationFrame(tickGarden);
    }
  }

  function startGardenAnimationLoop() {
    measureGardenMetrics();
    window.addEventListener('scroll', requestGardenTick, { passive: true });
    window.addEventListener('resize', () => {
      measureGardenMetrics();
      requestGardenTick();
    }, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        measureGardenMetrics();
        requestGardenTick();
      }, 200);
    }, { passive: true });
  }

  // Interactive Chapter Dots Click-to-Scroll
  chapterDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      if (!gardenTrack) return;
      measureGardenMetrics();
      const prog = parseFloat(dot.getAttribute('data-progress') || '0');
      const targetY = gardenTrackTop + prog * gardenScrollable;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  /* ========================================================================
     6. LIVE COUNTDOWN TIMER TO MINGGU, 22 AGUSTUS 2027 08:00 WIB
     ======================================================================== */
  function initCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // 22 August 2027 08:00:00 WIB (UTC+7)
    const weddingTimestamp = new Date('2027-08-22T08:00:00+07:00').getTime();

    let prevD = '', prevH = '', prevM = '', prevS = '';

    function updateClock() {
      if (document.hidden) return;
      const now = Date.now();
      const diff = Math.max(0, weddingTimestamp - now);

      const d = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
      const h = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
      const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

      if (d !== prevD) { daysEl.textContent = d; prevD = d; }
      if (h !== prevH) { hoursEl.textContent = h; prevH = h; }
      if (m !== prevM) { minsEl.textContent = m; prevM = m; }
      if (s !== prevS) { secsEl.textContent = s; prevS = s; }
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ========================================================================
     7. GALERI MOMEN LIGHTBOX (TAP TO ENLARGE)
     ======================================================================== */
  function initGalleryLightbox() {
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalCaption = document.getElementById('lightbox-caption');
    const btnPrev = document.getElementById('lightbox-prev');
    const btnNext = document.getElementById('lightbox-next');
    const btnClose = document.getElementById('lightbox-close');

    if (!items.length || !modal || !modalImg) return;
    let activeIdx = 0;

    function showSlide(index) {
      activeIdx = (index + items.length) % items.length;
      const fig = items[activeIdx];
      const img = fig.querySelector('img');
      const cap = fig.getAttribute('data-caption') || '';
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
      }
      if (modalCaption) {
        modalCaption.textContent = cap;
      }
      modal.classList.add('active');
    }

    function closeLightbox() {
      modal.classList.remove('active');
    }

    items.forEach((item, idx) => {
      item.addEventListener('click', () => showSlide(idx));
    });

    if (btnPrev) btnPrev.addEventListener('click', () => showSlide(activeIdx - 1));
    if (btnNext) btnNext.addEventListener('click', () => showSlide(activeIdx + 1));
    if (btnClose) btnClose.addEventListener('click', closeLightbox);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showSlide(activeIdx - 1);
      if (e.key === 'ArrowRight') showSlide(activeIdx + 1);
    });
  }

  /* ========================================================================
     8. AMPLOP DIGITAL COPY TO CLIPBOARD + TOAST "Rekening Disalin!"
     ======================================================================== */
  function initDigitalEnvelopeCopy() {
    const copyButtons = document.querySelectorAll('.btn-copy-rekening');
    const toast = document.getElementById('copy-toast');
    let toastTimer = null;

    function triggerToast(message) {
      if (!toast) return;
      toast.textContent = message || '✨ Rekening Disalin!';
      toast.classList.add('show');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }

    function copyTextFallback(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch (_) {}
      document.body.removeChild(ta);
    }

    copyButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const numberToCopy = btn.getAttribute('data-copy') || '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(numberToCopy)
            .then(() => triggerToast('✨ Rekening Disalin!'))
            .catch(() => {
              copyTextFallback(numberToCopy);
              triggerToast('✨ Rekening Disalin!');
            });
        } else {
          copyTextFallback(numberToCopy);
          triggerToast('✨ Rekening Disalin!');
        }
      });
    });
  }

  /* ========================================================================
     9. RSVP & UCAPAN (FORM SUBMISSION + WISHES FEED)
     ======================================================================== */
  function initRsvpAndWishes() {
    const STORAGE_KEY = 'riani_rafly_wishes_v1';
    const form = document.getElementById('rsvp-form');
    const wishesList = document.getElementById('wishes-list');
    if (!form || !wishesList) return;

    const defaultWishes = [
      {
        name: 'Keluarga Besar H. Ahmad Fauzi',
        attendance: 'Hadir',
        message: 'Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fii khair. Selamat menempuh hidup baru Riani & Rafly, semoga menjadi keluarga sakinah, mawaddah, warahmah.',
        time: 'Baru saja',
      },
      {
        name: 'Dinda Permata & Partner',
        attendance: 'Hadir',
        message: 'MasyaAllah akhirnya hari bahagia ini tiba! Selamat ya Riani cantik & Rafly, lancar sampai hari H di Cirebon nanti!',
        time: '15 menit yang lalu',
      },
      {
        name: 'Reza Pratama',
        attendance: 'Hadir',
        message: 'Selamat berbahagia sahabatku Rafly & Riani! Semoga langgeng dunia akhirat dan selalu dilimpahi keberkahan.',
        time: '1 jam yang lalu',
      },
    ];

    let wishes = defaultWishes;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          wishes = parsed;
        }
      }
    } catch (_) {}

    function badgeClass(status) {
      if (status === 'Hadir') return 'hadir';
      if (status === 'Masih Ragu') return 'ragu';
      return 'absen';
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function renderWishes() {
      wishesList.innerHTML = wishes
        .map(
          (w) => `
          <article class="wish-item">
            <div class="wish-header">
              <span class="wish-author">${escapeHtml(w.name)}</span>
              <span class="wish-status-badge ${badgeClass(w.attendance)}">${escapeHtml(w.attendance)}</span>
            </div>
            <p class="wish-message">${escapeHtml(w.message)}</p>
            <span class="wish-time">${escapeHtml(w.time)}</span>
          </article>
        `
        )
        .join('');
    }

    renderWishes();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('rsvp-name');
      const attInput = document.getElementById('rsvp-attendance');
      const msgInput = document.getElementById('rsvp-message');

      const name = (nameInput ? nameInput.value : '').trim();
      const attendance = attInput ? attInput.value : 'Hadir';
      const message = (msgInput ? msgInput.value : '').trim();

      if (!name || !message) return;

      const newEntry = {
        name,
        attendance,
        message,
        time: 'Baru saja',
      };

      wishes.unshift(newEntry);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
      } catch (_) {}

      renderWishes();
      if (msgInput) msgInput.value = '';

      const toast = document.getElementById('copy-toast');
      if (toast) {
        toast.textContent = '💌 Terima kasih atas konfirmasi & ucapannya!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2600);
      }
    });
  }

  /* ========================================================================
     INITIALIZE ALL MODULES ON DOM READY
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initGuestName();
    initSparkles();
    initCountdown();
    initGalleryLightbox();
    initDigitalEnvelopeCopy();
    initRsvpAndWishes();
    startGardenAnimationLoop();
  });
})();
