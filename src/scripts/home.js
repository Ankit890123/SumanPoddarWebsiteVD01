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
  initVideoFeedbackSuite();
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

// 11. 3D Video Slider Suite (Client Feedback with 3D Video Carousel)
function initVideoFeedbackSuite() {
  const container = document.getElementById('video-slider-3d-container');
  const cards = Array.from(document.querySelectorAll('.slider-3d-card'));
  const prevBtn = document.getElementById('slider-3d-prev-btn');
  const nextBtn = document.getElementById('slider-3d-next-btn');
  const dots = Array.from(document.querySelectorAll('.slider-dot'));

  if (!container || cards.length === 0) return;

  let currentIndex = 0;
  const total = cards.length;

  function updateSlider() {
    cards.forEach((card, index) => {
      // Calculate circular distance
      let diff = index - currentIndex;
      
      // Standardize diff to shortest circular route if desired, or clamp
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      const video = card.querySelector('video');
      const playBtn = card.querySelector('.slider-video-play-btn');
      const playIcon = playBtn ? playBtn.querySelector('.material-symbols-outlined') : null;

      if (diff === 0) {
        card.setAttribute('data-pos', '0');
      } else if (diff === -1) {
        card.setAttribute('data-pos', '-1');
        if (video && !video.paused) {
          video.pause();
          if (playIcon) playIcon.textContent = 'play_arrow';
        }
      } else if (diff === 1) {
        card.setAttribute('data-pos', '1');
        if (video && !video.paused) {
          video.pause();
          if (playIcon) playIcon.textContent = 'play_arrow';
        }
      } else if (diff === -2 || diff < -2) {
        card.setAttribute('data-pos', '-2');
        if (video && !video.paused) {
          video.pause();
          if (playIcon) playIcon.textContent = 'play_arrow';
        }
      } else if (diff === 2 || diff > 2) {
        card.setAttribute('data-pos', '2');
        if (video && !video.paused) {
          video.pause();
          if (playIcon) playIcon.textContent = 'play_arrow';
        }
      } else {
        card.setAttribute('data-pos', 'hidden');
        if (video && !video.paused) {
          video.pause();
          if (playIcon) playIcon.textContent = 'play_arrow';
        }
      }
    });

    // Update dots
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.remove('w-2', 'bg-outline-variant/60');
        dot.classList.add('w-8', 'bg-primary');
      } else {
        dot.classList.remove('w-8', 'bg-primary');
        dot.classList.add('w-2', 'bg-outline-variant/60');
      }
    });
  }

  function goToSlide(index) {
    // Pause currently active video before transition
    const activeCard = cards[currentIndex];
    if (activeCard) {
      const activeVid = activeCard.querySelector('video');
      const activeBtn = activeCard.querySelector('.slider-video-play-btn');
      const activeIcon = activeBtn ? activeBtn.querySelector('.material-symbols-outlined') : null;
      if (activeVid && !activeVid.paused) {
        activeVid.pause();
      }
      activeCard.classList.remove('video-is-playing');
      if (activeBtn) {
        activeBtn.classList.remove('opacity-0', 'pointer-events-none', 'video-btn-hidden');
        activeBtn.style.opacity = '';
        activeBtn.style.visibility = '';
      }
      if (activeIcon) activeIcon.textContent = 'play_arrow';
    }

    currentIndex = (index + total) % total;
    updateSlider();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Click on dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
      goToSlide(idx);
    });
  });

  // Setup cards click & video play/pause
  cards.forEach((card, index) => {
    const video = card.querySelector('video');
    const playBtn = card.querySelector('.slider-video-play-btn');
    const playIcon = playBtn ? playBtn.querySelector('.material-symbols-outlined') : null;

    function updateCardPlayUI(playing) {
      if (playIcon) playIcon.textContent = playing ? 'pause' : 'play_arrow';
      if (playBtn) {
        if (playing) {
          playBtn.classList.add('opacity-0', 'pointer-events-none', 'video-btn-hidden');
          playBtn.style.opacity = '0';
          playBtn.style.visibility = 'hidden';
          card.classList.add('video-is-playing');
        } else {
          playBtn.classList.remove('opacity-0', 'pointer-events-none', 'video-btn-hidden');
          playBtn.style.opacity = '';
          playBtn.style.visibility = '';
          card.classList.remove('video-is-playing');
        }
      }
    }

    // Click on side card moves it to center
    card.addEventListener('click', (e) => {
      const pos = card.getAttribute('data-pos');
      if (pos === '0') {
        // Toggle play if clicked on play button or video directly
        if (e.target.closest('.slider-video-play-btn') || e.target.tagName === 'VIDEO') {
          if (!video) return;
          if (video.paused) {
            video.play().then(() => {
              updateCardPlayUI(true);
              showToast('Playing Client Video Feedback');
            }).catch(() => {});
          } else {
            video.pause();
            updateCardPlayUI(false);
            showToast('Paused Video');
          }
        }
      } else {
        // Click on side card brings it to center
        goToSlide(index);
      }
    });

    if (video) {
      video.addEventListener('ended', () => updateCardPlayUI(false));
      video.addEventListener('pause', () => updateCardPlayUI(false));
      video.addEventListener('play', () => updateCardPlayUI(true));
    }
  });

  // Touch Swipe gestures
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 40;
    if (touchEndX < touchStartX - threshold) {
      nextSlide();
    } else if (touchEndX > touchStartX + threshold) {
      prevSlide();
    }
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    const section = document.getElementById('client-feedback-section');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    }
  });

  // Initial render
  updateSlider();
}
