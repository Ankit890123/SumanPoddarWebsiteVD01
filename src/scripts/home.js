/**
 * tecnosra - Suman Poddar - Home Page Application Logic
 */

import {
  initThemeToggle,
  initCursor,
  initTimecode,
  initNavigation,
  initDossierModal,
  initCurriculumModal,
  showToast,
  setupWiper
} from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  // Shared common features
  initThemeToggle();
  initCursor();
  initTimecode();
  initNavigation();
  initDossierModal();
  initCurriculumModal();

  // Home page specific modules
  initHeroReel();
  initFeaturedSlider();
  initAudioToggle();
  initContinuousTimelineSlider();
  initClientReviewsSlider();
});

// 19. Authentic 9:16 Vertical Video Reel Controller
function initHeroReel() {
  const reelWrapper = document.getElementById('hero-reel-wrapper');
  const heroVideo = document.getElementById('hero-reel-video');
  const playBtn = document.getElementById('hero-reel-play-btn');
  const playIcon = document.getElementById('hero-reel-play-icon');
  const progressBar = document.getElementById('hero-reel-progress');
  const likeBtn = document.getElementById('reel-like-btn');
  const likeIcon = document.getElementById('reel-like-icon');
  const likeCount = document.getElementById('reel-like-count');
  const aspectReelBtn = document.getElementById('hero-aspect-reel');
  const aspectCinemaBtn = document.getElementById('hero-aspect-cinema');

  if (!reelWrapper) return;

  function updateHeroPlayUI(playing) {
    if (playIcon) playIcon.textContent = playing ? 'pause' : 'play_arrow';
    if (playBtn) {
      if (playing) {
        playBtn.classList.add('opacity-0', 'pointer-events-none', 'video-btn-hidden');
        playBtn.style.opacity = '0';
        playBtn.style.visibility = 'hidden';
        reelWrapper.classList.add('video-is-playing');
      } else {
        playBtn.classList.remove('opacity-0', 'pointer-events-none', 'video-btn-hidden');
        playBtn.style.opacity = '';
        playBtn.style.visibility = '';
        reelWrapper.classList.remove('video-is-playing');
      }
    }
  }

  if (heroVideo) {
    heroVideo.addEventListener('play', () => updateHeroPlayUI(true));
    heroVideo.addEventListener('pause', () => updateHeroPlayUI(false));
    heroVideo.addEventListener('ended', () => updateHeroPlayUI(false));
    heroVideo.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play().then(() => updateHeroPlayUI(true)).catch(() => {});
      } else {
        heroVideo.pause();
        updateHeroPlayUI(false);
      }
    });
    heroVideo.addEventListener('timeupdate', () => {
      if (!heroVideo.duration) return;
      const pct = (heroVideo.currentTime / heroVideo.duration) * 100;
      if (progressBar) progressBar.style.width = `${pct}%`;
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!heroVideo) return;
      if (heroVideo.paused) {
        heroVideo.play().then(() => {
          updateHeroPlayUI(true);
          if (window.showToast) window.showToast('Playing 9:16 Vertical Reel • tecnosra Cut');
        }).catch(() => {});
      } else {
        heroVideo.pause();
        updateHeroPlayUI(false);
      }
    });
  }

  // Like button counter
  let isLiked = false;
  if (likeBtn && likeIcon && likeCount) {
    likeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isLiked = !isLiked;
      if (isLiked) {
        likeIcon.classList.add('text-red-500');
        likeIcon.textContent = 'favorite';
        likeCount.textContent = '142.1K';
        if (window.showToast) window.showToast('Reel added to favorites!');
      } else {
        likeIcon.classList.remove('text-red-500');
        likeCount.textContent = '142K';
      }
    });
  }

  // Aspect Ratio Switcher (9:16 Reel vs 16:9 Cinema Widescreen)
  const outerContainer = reelWrapper.parentElement;

  if (aspectReelBtn && aspectCinemaBtn && outerContainer) {
    aspectReelBtn.addEventListener('click', () => {
      // Set to 9:16 Reel
      reelWrapper.classList.remove('aspect-video', 'rounded-2xl');
      reelWrapper.classList.add('aspect-[9/16]', 'rounded-[36px]');
      outerContainer.classList.remove('max-w-lg', 'lg:max-w-xl');
      outerContainer.classList.add('max-w-[340px]', 'sm:max-w-[370px]');

      aspectReelBtn.className = 'px-2.5 py-1 rounded bg-primary text-on-primary text-[10px] font-bold tracking-wider transition-all cursor-pointer shadow-sm';
      aspectCinemaBtn.className = 'px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface text-[10px] font-bold tracking-wider transition-all cursor-pointer';

      if (window.showToast) window.showToast('Switched to 9:16 Vertical Reel Format');
    });

    aspectCinemaBtn.addEventListener('click', () => {
      // Set to 16:9 Cinema Wide
      reelWrapper.classList.remove('aspect-[9/16]', 'rounded-[36px]');
      reelWrapper.classList.add('aspect-video', 'rounded-2xl');
      outerContainer.classList.remove('max-w-[340px]', 'sm:max-w-[370px]');
      outerContainer.classList.add('max-w-lg', 'lg:max-w-xl');

      aspectCinemaBtn.className = 'px-2.5 py-1 rounded bg-primary text-on-primary text-[10px] font-bold tracking-wider transition-all cursor-pointer shadow-sm';
      aspectReelBtn.className = 'px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface text-[10px] font-bold tracking-wider transition-all cursor-pointer';

      if (window.showToast) window.showToast('Switched to 16:9 Cinema Widescreen Format');
    });
  }
}

// 5. Featured Directorial Works Slider
function initFeaturedSlider() {
  let activeIndex = 0;
  const slideElements = [];
  let sIndex = 0;
  while (document.getElementById(`slide-${sIndex}`)) {
    slideElements.push(document.getElementById(`slide-${sIndex}`));
    sIndex++;
  }

  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const currentIndexEl = document.getElementById('current-slide-index');
  const progressEl = document.getElementById('slide-progress');

  if (slideElements.length === 0) return;

  function goToSlide(index) {
    slideElements[activeIndex].classList.add('hidden');
    slideElements[activeIndex].classList.remove('block');

    activeIndex = (index + slideElements.length) % slideElements.length;

    slideElements[activeIndex].classList.remove('hidden');
    slideElements[activeIndex].classList.add('block');

    if (currentIndexEl) {
      currentIndexEl.textContent = activeIndex < 9 ? `0${activeIndex + 1}` : `${activeIndex + 1}`;
    }
    if (progressEl) {
      const pct = ((activeIndex + 1) / slideElements.length) * 100;
      progressEl.style.width = `${pct}%`;
    }
  }

  window.goToSlide = goToSlide;

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(activeIndex + 1));

  // Category filter
  const filterBtns = document.querySelectorAll('.works-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-primary-container', 'text-on-primary', 'font-bold');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary-container', 'text-on-primary', 'font-bold');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');

      const cat = btn.getAttribute('data-category');
      if (cat === 'commercial') {
        goToSlide(0);
      } else if (cat === 'music-video') {
        goToSlide(1);
      } else if (cat === 'motion') {
        goToSlide(2);
      } else {
        goToSlide(0);
      }
    });
  });
}

// 4. Audio Atmos HUD Simulation
function initAudioToggle() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  const audioStatus = document.getElementById('audio-status');
  let isMuted = false;

  if (!audioBtn || !audioIcon || !audioStatus) return;

  audioBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
      audioIcon.textContent = 'volume_off';
      audioStatus.textContent = 'AUDIO: MUTED';
      audioBtn.classList.add('text-error');
      showToast('Master Audio Muted');
    } else {
      audioIcon.textContent = 'volume_up';
      audioStatus.textContent = 'AUDIO: 48kHz ATMOS';
      audioBtn.classList.remove('text-error');
      showToast('Spatial Atmos 48kHz Stream Active');
    }
  });
}

// 20. Director's Anamorphic Strip: Continuous Timeline Archive Slider
function initContinuousTimelineSlider() {
  const slider = document.getElementById('timeline-archive-slider');
  const prevBtn = document.getElementById('timeline-archive-prev');
  const nextBtn = document.getElementById('timeline-archive-next');
  const track = document.getElementById('timeline-archive-track');
  const bar = document.getElementById('timeline-archive-bar');

  if (!slider) return;

  function updateScrubber() {
    if (!bar) return;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if (maxScroll <= 0) {
      bar.style.width = '100%';
      return;
    }
    const visibleRatio = (slider.scrollLeft + slider.clientWidth) / slider.scrollWidth;
    const pct = Math.min(100, Math.max(25, visibleRatio * 100));
    bar.style.width = `${pct}%`;
  }

  function getStepWidth() {
    const card = slider.querySelector('.timeline-archive-card');
    return card ? card.offsetWidth + 24 : 540;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const step = getStepWidth();
      slider.scrollBy({ left: -step, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const step = getStepWidth();
      slider.scrollBy({ left: step, behavior: 'smooth' });
    });
  }

  slider.addEventListener('scroll', updateScrubber, { passive: true });

  if (track) {
    track.addEventListener('click', (e) => {
      const rect = track.getBoundingClientRect();
      const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      slider.scrollTo({ left: clickPos * maxScroll, behavior: 'smooth' });
    });
  }

  // Mouse drag support for smooth desktop timeline scrubbing
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let dragged = false;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    dragged = false;
    slider.classList.add('cursor-grabbing');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      slider.classList.remove('cursor-grabbing');
    }
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 6) dragged = true;
    slider.scrollLeft = scrollLeft - walk;
  });

  // Card click triggers screening modal if not dragged
  slider.querySelectorAll('.timeline-archive-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (dragged) return;
      if (e.target.closest('button')) return;
      const playBtn = card.querySelector('.open-modal-trigger');
      if (playBtn) playBtn.click();
    });
  });

  // Initial calculation
  setTimeout(updateScrubber, 100);
  window.addEventListener('resize', updateScrubber, { passive: true });
}

// 11. Client Text Reviews Moveable Slider & Filter System
function initClientReviewsSlider() {
  const track = document.getElementById('reviews-slider-track');
  const prevBtn = document.getElementById('reviews-prev-btn');
  const nextBtn = document.getElementById('reviews-next-btn');
  const dotsContainer = document.getElementById('reviews-pagination-dots');
  const progressBar = document.getElementById('reviews-slider-progress');
  const filterButtons = document.querySelectorAll('.review-filter-btn');
  const countDisplay = document.getElementById('reviews-count');

  if (!track) return;

  const allCards = Array.from(track.querySelectorAll('.review-card'));
  let visibleCards = allCards.filter(c => !c.classList.contains('hidden'));
  let autoPlayTimer = null;
  let isDragging = false;
  let startX = 0;
  let scrollLeftStart = 0;
  let hasMoved = false;

  // 1. Get current step / card width including gap
  function getCardStep() {
    if (!visibleCards.length) return 380;
    const firstCard = visibleCards[0];
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 24;
    return firstCard.offsetWidth + gap;
  }

  // 2. Render Pagination Dots
  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';

    visibleCards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `review-dot h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === 0 ? 'w-7 bg-primary shadow-sm' : 'w-2 bg-outline-variant/60 hover:bg-on-surface-variant'}`;
      dot.setAttribute('aria-label', `Go to review ${idx + 1}`);
      dot.setAttribute('title', `Review ${idx + 1}`);
      dot.addEventListener('click', () => {
        scrollToIndex(idx);
      });
      dotsContainer.appendChild(dot);
    });
  }

  // 3. Scroll to specific index
  function scrollToIndex(index) {
    if (index < 0) index = 0;
    if (index >= visibleCards.length) index = visibleCards.length - 1;
    const step = getCardStep();
    track.scrollTo({
      left: index * step,
      behavior: 'smooth'
    });
    updateUI(index);
  }

  // 4. Update UI Indicators (Dots & Progress)
  function updateUI(forcedIndex = null) {
    if (!visibleCards.length) return;
    const step = getCardStep();
    const currentIndex = forcedIndex !== null ? forcedIndex : Math.round(track.scrollLeft / step);

    // Update Dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.review-dot');
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.className = 'review-dot h-2 rounded-full transition-all duration-300 cursor-pointer w-7 bg-primary shadow-sm';
        } else {
          dot.className = 'review-dot h-2 rounded-full transition-all duration-300 cursor-pointer w-2 bg-outline-variant/60 hover:bg-on-surface-variant';
        }
      });
    }

    // Update Progress Bar
    if (progressBar) {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const pct = maxScroll > 0 ? Math.min(100, Math.max(10, ((track.scrollLeft / maxScroll) * 100))) : 100;
      progressBar.style.width = `${pct}%`;
    }

    // Update Button Disabled State styling
    if (prevBtn) {
      prevBtn.style.opacity = track.scrollLeft <= 10 ? '0.5' : '1';
    }
    if (nextBtn) {
      const maxScroll = track.scrollWidth - track.clientWidth;
      nextBtn.style.opacity = track.scrollLeft >= maxScroll - 10 ? '0.5' : '1';
    }
  }

  // 5. Navigation Arrow Button Listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      pauseAutoPlay();
      const step = getCardStep();
      track.scrollBy({ left: -step, behavior: 'smooth' });
      setTimeout(updateUI, 350);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      pauseAutoPlay();
      const step = getCardStep();
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 20) {
        // Loop back to start
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: step, behavior: 'smooth' });
      }
      setTimeout(updateUI, 350);
    });
  }

  // 6. Mouse Dragging Mechanics
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasMoved = false;
    startX = e.pageX - track.offsetLeft;
    scrollLeftStart = track.scrollLeft;
    track.classList.add('cursor-grabbing');
    track.classList.remove('cursor-grab', 'scroll-smooth');
    pauseAutoPlay();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    if (Math.abs(walk) > 5) hasMoved = true;
    track.scrollLeft = scrollLeftStart - walk;
    updateUI();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('cursor-grabbing');
    track.classList.add('cursor-grab', 'scroll-smooth');
    updateUI();
    resumeAutoPlay();
  });

  // 7. Touch Swiping & Scroll Events
  track.addEventListener('scroll', () => {
    requestAnimationFrame(() => updateUI());
  }, { passive: true });

  // 8. Auto-Play Carousel Glide
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (isDragging) return;
      const step = getCardStep();
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 20) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: step, behavior: 'smooth' });
      }
      setTimeout(updateUI, 350);
    }, 4500);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  function pauseAutoPlay() {
    stopAutoPlay();
  }

  function resumeAutoPlay() {
    startAutoPlay();
  }

  track.addEventListener('mouseenter', pauseAutoPlay);
  track.addEventListener('mouseleave', resumeAutoPlay);
  track.addEventListener('touchstart', pauseAutoPlay, { passive: true });
  track.addEventListener('touchend', resumeAutoPlay, { passive: true });

  // 9. Category Filtering Integration
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      // Update button styling
      filterButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary', 'font-bold', 'shadow-md', 'active');
        b.classList.add('bg-surface-container', 'border', 'border-outline-variant/40', 'text-on-surface');
      });

      btn.classList.add('bg-primary', 'text-on-primary', 'font-bold', 'shadow-md', 'active');
      btn.classList.remove('bg-surface-container', 'border', 'border-outline-variant/40', 'text-on-surface');

      // Filter cards
      let count = 0;
      allCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('hidden');
          card.classList.add('flex');
          count++;
        } else {
          card.classList.add('hidden');
          card.classList.remove('flex');
        }
      });

      visibleCards = allCards.filter(c => !c.classList.contains('hidden'));

      if (countDisplay) {
        countDisplay.textContent = count;
      }

      // Reset track position & rebuild dots
      track.scrollTo({ left: 0, behavior: 'smooth' });
      renderDots();
      setTimeout(updateUI, 200);
    });
  });

  // Initial Boot
  renderDots();
  updateUI(0);
  startAutoPlay();
  window.addEventListener('resize', () => updateUI(), { passive: true });
}
