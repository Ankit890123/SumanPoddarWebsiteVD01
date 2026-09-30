/**
 * tecnosra - Suman Poddar - Portfolio Page Application Logic
 */

import {
  initThemeToggle,
  initCursor,
  initTimecode,
  initNavigation,
  initDossierModal,
  initCurriculumModal,
  showToast
} from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  // Shared common features
  initThemeToggle();
  initCursor();
  initTimecode();
  initNavigation();
  initDossierModal();
  initCurriculumModal();

  // Portfolio page specific modules
  initPortfolioFilters();
  initSkillFilters();
  initWorkMovement3DSlider();
  initScreeningModal();
  initShowreelPlayer();
  initTimelineInspector();
  initColorLab();
  initPortfolioImageUploaders();
  initPortfolioReelsCarousel();
});

// 13. Portfolio Category Filter System
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      const items = document.querySelectorAll('.portfolio-item-card');
      
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-primary', 'text-on-primary', 'shadow-md');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('active', 'bg-primary', 'text-on-primary', 'shadow-md');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');

      let visibleCount = 0;
      items.forEach(item => {
        const cat = (item.getAttribute('data-category') || '').toLowerCase();
        const catList = cat.split(/\s+/);
        if (filter === 'all' || catList.includes(filter)) {
          item.classList.remove('hidden');
          item.classList.add('flex');
          visibleCount++;
        } else {
          item.classList.add('hidden');
          item.classList.remove('flex');
        }
      });

      const pGrid = document.getElementById('portfolio-items-grid');
      if (pGrid) pGrid.scrollLeft = 0;
      if (window.refreshReelsCarousel) {
        window.refreshReelsCarousel();
      }

      const label = filter === 'png' ? '.PNG STILLS & ALPHA' : (filter === 'log' ? 'CAMERA LOG RAW STILLS' : filter.toUpperCase());
      showToast(`Showing ${label} archives (${visibleCount} items)`);
    });
  });
}

// 13b. Skills Category Filter System
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const items = document.querySelectorAll('.skill-item-card');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-primary', 'text-on-primary', 'shadow-md');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('active', 'bg-primary', 'text-on-primary', 'shadow-md');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');

      let visibleCount = 0;
      items.forEach(item => {
        const categories = (item.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          item.classList.remove('hidden');
          item.classList.add('flex');
          visibleCount++;
        } else {
          item.classList.add('hidden');
          item.classList.remove('flex');
        }
      });

      showToast(`Skills Filter: ${filter.toUpperCase()} (${visibleCount} tools visible)`);
    });
  });
}

// 9. Director's Cut Screening Modal
function initScreeningModal() {
  const modal = document.getElementById('screening-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const triggers = document.querySelectorAll('.open-modal-trigger');
  const playPauseBtn = document.getElementById('modal-play-btn');
  const playIcon = document.getElementById('modal-play-icon');
  const modalImage = document.getElementById('modal-img-target');
  const modalVideo = document.getElementById('modal-video-target');
  const modalTitle = document.getElementById('modal-title-text');

  if (!modal) return;

  function stopModalVideo() {
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
      modalVideo.classList.add('hidden');
    }
    if (modalImage) modalImage.classList.remove('hidden');
    if (playIcon) playIcon.textContent = 'play_arrow';
  }

  triggers.forEach(t => {
    t.addEventListener('click', () => {
      const title = t.getAttribute('data-title');
      const img = t.getAttribute('data-img');
      const isImgOnly = t.getAttribute('data-img-only') === 'true' || t.getAttribute('data-video') === 'none';
      const videoSrc = isImgOnly ? null : (t.getAttribute('data-video') || (img ? null : '/src/assets/video/AjantaReel.mp4'));

      if (title && modalTitle) modalTitle.textContent = title;
      if (img && modalImage) modalImage.src = img;

      if (isImgOnly || !videoSrc) {
        if (modalVideo) {
          modalVideo.pause();
          modalVideo.currentTime = 0;
          modalVideo.classList.add('hidden');
        }
        if (modalImage) modalImage.classList.remove('hidden');
        if (playPauseBtn) playPauseBtn.classList.add('hidden');
      } else {
        if (playPauseBtn) playPauseBtn.classList.remove('hidden');
        if (modalVideo && videoSrc) {
          modalVideo.src = videoSrc;
          modalVideo.classList.remove('hidden');
          if (modalImage) modalImage.classList.add('hidden');
          modalVideo.currentTime = 0;
          modalVideo.play().then(() => {
            if (playIcon) playIcon.textContent = 'pause';
            if (playPauseBtn) {
              playPauseBtn.classList.add('opacity-0', 'pointer-events-none', 'video-btn-hidden');
              playPauseBtn.style.opacity = '0';
              playPauseBtn.style.visibility = 'hidden';
            }
            modal.classList.add('video-is-playing');
          }).catch(() => {
            if (playIcon) playIcon.textContent = 'play_arrow';
            if (playPauseBtn) {
              playPauseBtn.classList.remove('opacity-0', 'pointer-events-none', 'video-btn-hidden');
              playPauseBtn.style.opacity = '';
              playPauseBtn.style.visibility = '';
            }
            modal.classList.remove('video-is-playing');
          });
        }
      }

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      stopModalVideo();
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      stopModalVideo();
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      const currModal = document.getElementById('curriculum-modal');
      if (currModal) {
        currModal.classList.add('hidden');
        currModal.classList.remove('flex');
      }
    }
  });

  if (playPauseBtn && playIcon) {
    function updateModalPlayUI(playing) {
      playIcon.textContent = playing ? 'pause' : 'play_arrow';
      if (playing) {
        playPauseBtn.classList.add('opacity-0', 'pointer-events-none', 'video-btn-hidden');
        playPauseBtn.style.opacity = '0';
        playPauseBtn.style.visibility = 'hidden';
        modal.classList.add('video-is-playing');
      } else {
        playPauseBtn.classList.remove('opacity-0', 'pointer-events-none', 'video-btn-hidden');
        playPauseBtn.style.opacity = '';
        playPauseBtn.style.visibility = '';
        modal.classList.remove('video-is-playing');
      }
    }

    playPauseBtn.addEventListener('click', () => {
      if (modalVideo && !modalVideo.classList.contains('hidden')) {
        if (modalVideo.paused) {
          modalVideo.play().then(() => {
            updateModalPlayUI(true);
            showToast('Playback Resumed (ProRes 422 HQ)');
          }).catch(() => {});
        } else {
          modalVideo.pause();
          updateModalPlayUI(false);
          showToast('Playback Paused at Current Frame');
        }
      }
    });

    if (modalVideo) {
      modalVideo.addEventListener('play', () => updateModalPlayUI(true));
      modalVideo.addEventListener('pause', () => updateModalPlayUI(false));
      modalVideo.addEventListener('ended', () => updateModalPlayUI(false));
      modalVideo.addEventListener('click', () => {
        if (modalVideo.paused) {
          modalVideo.play().then(() => updateModalPlayUI(true)).catch(() => {});
        } else {
          modalVideo.pause();
          updateModalPlayUI(false);
        }
      });
    }
  }
}

// 3D Depth Perspective Coverflow Slider for Work & Movement
function initWorkMovement3DSlider() {
  const container = document.getElementById('work-movement-slider');
  const track = document.getElementById('movement-slider-track');
  const slides = Array.from(document.querySelectorAll('.movement-3d-slide'));
  const prevBtn = document.getElementById('movement-slider-prev');
  const nextBtn = document.getElementById('movement-slider-next');
  const leftZone = document.getElementById('movement-slider-left-zone');
  const rightZone = document.getElementById('movement-slider-right-zone');
  const dotsContainer = document.getElementById('movement-slider-dots');

  if (!container || !track || slides.length === 0) return;

  let currentIndex = 0;
  const total = slides.length;
  let autoplayTimer = null;
  let isHovered = false;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `h-2 rounded-full transition-all duration-300 cursor-pointer ${
        idx === 0 ? 'w-8 bg-primary shadow-sm' : 'w-2 bg-outline-variant hover:bg-on-surface-variant'
      }`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(idx);
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('button');
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.className = 'h-2 w-8 bg-primary rounded-full transition-all duration-300 cursor-pointer shadow-sm';
      } else {
        dot.className = 'h-2 w-2 bg-outline-variant hover:bg-on-surface-variant rounded-full transition-all duration-300 cursor-pointer';
      }
    });
  }

  function updateSlides() {
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;

    slides.forEach((slide, idx) => {
      let diff = idx - currentIndex;
      const card = slide.querySelector('.slide-card') || slide;

      // Wrap diff for circular looping
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      slide.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      card.classList.remove('ring-2', 'ring-primary', 'border-primary/80');
      slide.classList.remove('cursor-zoom-in');

      if (diff === 0) {
        // Active Center Slide - Front and pristine
        slide.style.transform = 'translate3d(0, 0, 80px) scale(1) rotateY(0deg)';
        slide.style.opacity = '1';
        slide.style.zIndex = '35';
        slide.style.filter = 'drop-shadow(0 25px 35px rgba(0,0,0,0.85))';
        slide.style.pointerEvents = 'auto';
        card.classList.add('ring-2', 'ring-primary', 'border-primary/80');
        slide.classList.add('cursor-zoom-in');
      } else if (diff === 1) {
        // Right #1
        const translateX = isMobile ? '48%' : (isTablet ? '52%' : '58%');
        slide.style.transform = `translate3d(${translateX}, 0, -60px) scale(0.84) rotateY(-24deg)`;
        slide.style.opacity = '0.78';
        slide.style.zIndex = '25';
        slide.style.filter = 'brightness(0.75) drop-shadow(0 15px 25px rgba(0,0,0,0.6))';
        slide.style.pointerEvents = 'auto';
      } else if (diff === -1) {
        // Left #1
        const translateX = isMobile ? '-48%' : (isTablet ? '-52%' : '-58%');
        slide.style.transform = `translate3d(${translateX}, 0, -60px) scale(0.84) rotateY(24deg)`;
        slide.style.opacity = '0.78';
        slide.style.zIndex = '25';
        slide.style.filter = 'brightness(0.75) drop-shadow(0 15px 25px rgba(0,0,0,0.6))';
        slide.style.pointerEvents = 'auto';
      } else if (diff === 2) {
        // Right #2
        const translateX = isMobile ? '82%' : (isTablet ? '90%' : '98%');
        slide.style.transform = `translate3d(${translateX}, 0, -180px) scale(0.68) rotateY(-36deg)`;
        slide.style.opacity = '0.45';
        slide.style.zIndex = '15';
        slide.style.filter = 'brightness(0.55)';
        slide.style.pointerEvents = 'auto';
      } else if (diff === -2) {
        // Left #2
        const translateX = isMobile ? '-82%' : (isTablet ? '-90%' : '-98%');
        slide.style.transform = `translate3d(${translateX}, 0, -180px) scale(0.68) rotateY(36deg)`;
        slide.style.opacity = '0.45';
        slide.style.zIndex = '15';
        slide.style.filter = 'brightness(0.55)';
        slide.style.pointerEvents = 'auto';
      } else {
        // Hidden / distant background
        const dir = diff > 0 ? 1 : -1;
        slide.style.transform = `translate3d(${dir * 130}%, 0, -320px) scale(0.5) rotateY(${dir * -45}deg)`;
        slide.style.opacity = '0';
        slide.style.zIndex = '1';
        slide.style.pointerEvents = 'none';
      }
    });

    updateDots();
  }

  function goToSlide(index) {
    currentIndex = (index + total) % total;
    updateSlides();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Button Listeners
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (leftZone) leftZone.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  if (rightZone) rightZone.addEventListener('click', () => { nextSlide(); resetAutoplay(); });

  // Slide Direct Click
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      if (currentIndex === idx) {
        // Open modal full screen view for active slide
        const img = slide.querySelector('img');
        if (img) {
          const imgSrc = img.getAttribute('src');
          const title = img.getAttribute('alt') || 'Work & Movement Frame';
          const modal = document.getElementById('screening-modal');
          const modalTitle = document.getElementById('modal-title');
          const modalImg = document.getElementById('modal-poster-img');
          const videoContainer = document.getElementById('modal-video-container');
          if (modal && modalImg) {
            if (modalTitle) modalTitle.textContent = title;
            modalImg.src = imgSrc;
            modalImg.classList.remove('hidden');
            if (videoContainer) videoContainer.classList.add('hidden');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
          }
        }
      } else {
        goToSlide(idx);
        resetAutoplay();
      }
    });
  });

  // Touch & Swipe Support
  let startX = 0;
  let endX = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    if (Math.abs(diffX) > 45) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoplay();
    }
  }, { passive: true });

  // Keyboard navigation when hovered
  window.addEventListener('keydown', (e) => {
    const rect = container.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoplay();
      }
    }
  });

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (!isHovered) {
        nextSlide();
      }
    }, 3800);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    startAutoplay();
  }

  container.addEventListener('mouseenter', () => { isHovered = true; });
  container.addEventListener('mouseleave', () => { isHovered = false; });

  // Responsive resize
  window.addEventListener('resize', () => {
    updateSlides();
  });

  // Initial render
  updateSlides();
  startAutoplay();
}

// 17. Master Directorial Showreel Player
function initShowreelPlayer() {
  const playBtn = document.getElementById('showreel-play-btn');
  const playIcon = document.getElementById('showreel-play-icon');
  const progressTrack = document.getElementById('showreel-progress-track');
  const progressBar = document.getElementById('showreel-progress-bar');
  const timecodeEl = document.getElementById('showreel-timecode');
  const currTimeEl = document.getElementById('showreel-curr-time');
  const chapterBtns = document.querySelectorAll('.showreel-chapter-btn');
  const stemSelect = document.getElementById('showreel-stem-select');

  if (!playBtn) return;

  let isPlaying = false;
  let currentSeconds = 84; // default at 01:24
  const totalSeconds = 180;
  let playInterval = null;

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function formatTimecode(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const f = Math.floor((sec % 1) * 24);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
  }

  function updateDisplay() {
    if (currTimeEl) currTimeEl.textContent = formatTime(currentSeconds);
    if (timecodeEl) timecodeEl.textContent = formatTimecode(currentSeconds);
    if (progressBar) {
      const pct = (currentSeconds / totalSeconds) * 100;
      progressBar.style.width = `${pct}%`;
    }
  }

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      if (playIcon) playIcon.textContent = 'pause';
      showToast('Master Showreel 2025: Playback started (ProRes 4444 4K)');
      playInterval = setInterval(() => {
        currentSeconds += 0.5;
        if (currentSeconds >= totalSeconds) {
          currentSeconds = 0;
        }
        updateDisplay();
      }, 500);
    } else {
      if (playIcon) playIcon.textContent = 'play_arrow';
      clearInterval(playInterval);
      showToast('Playback paused');
    }
  });

  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      currentSeconds = clickPos * totalSeconds;
      updateDisplay();
      showToast(`Seeked to ${formatTime(currentSeconds)}`);
    });
  }

  chapterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chapterBtns.forEach(b => {
        b.classList.remove('active', 'bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container/80', 'text-on-surface-variant');
      });
      btn.classList.add('active', 'bg-primary', 'text-on-primary');
      btn.classList.remove('bg-surface-container/80', 'text-on-surface-variant');

      const time = parseFloat(btn.getAttribute('data-time') || '0');
      const label = btn.getAttribute('data-label') || 'Chapter';
      currentSeconds = time;
      updateDisplay();
      showToast(`Chapter Jump: ${label} [${formatTime(time)}]`);
    });
  });

  if (stemSelect) {
    stemSelect.addEventListener('change', () => {
      const stemName = stemSelect.options[stemSelect.selectedIndex].text;
      showToast(`Active Audio Bus: ${stemName}`);
    });
  }

  updateDisplay();
}

// 18. Interactive NLE Timeline Inspector
function initTimelineInspector() {
  const clipNodes = document.querySelectorAll('.timeline-clip-node');
  if (!clipNodes.length) return;
  const clipNameEl = document.getElementById('inspector-clip-name');
  const clipCameraEl = document.getElementById('inspector-clip-camera');
  const clipRationaleEl = document.getElementById('inspector-clip-rationale');
  const playToggle = document.getElementById('timeline-play-toggle');
  const playIcon = document.getElementById('timeline-play-icon');
  const activeTcEl = document.getElementById('timeline-active-tc');
  const soloBtns = document.querySelectorAll('.track-solo-btn');

  const shotData = {
    shot1: {
      name: "A01_Crane_Night_01",
      camera: "RED V-Raptor 8K // Cooke 2x Anamorphic",
      rationale: "Wide establishing crane swoop over Tokyo expressway; cuts on rising engine acoustic crescendo."
    },
    shot2: {
      name: "A02_Cockpit_POV_04",
      camera: "RED V-Raptor 8K // Cooke 2x Anamorphic",
      rationale: "Speed ramp from 120fps to 24fps on tachometer redline for hyper-kinetic acceleration impact."
    },
    shot3: {
      name: "A03_Tracking_Bridge_09",
      camera: "ARRI Alexa 35 // Master Primes T1.3",
      rationale: "Micro-trimmed whip match cut on wheel rim rotation vector with 0.18s optical motion blur transition."
    },
    shot4: {
      name: "A04_Hero_Apex_12",
      camera: "Sony Venice 2 8K // Tribe7 Blackwing7",
      rationale: "Sub-frame audio alignment to cinematic synth riser impact at -14.2 LUFS master delivery."
    }
  };

  clipNodes.forEach(node => {
    node.addEventListener('click', () => {
      const shotKey = node.getAttribute('data-shot') || 'shot1';
      const data = shotData[shotKey] || shotData.shot1;

      clipNodes.forEach(n => n.classList.remove('ring-2', 'ring-primary'));
      node.classList.add('ring-2', 'ring-primary');

      if (clipNameEl) clipNameEl.textContent = data.name;
      if (clipCameraEl) clipCameraEl.textContent = data.camera;
      if (clipRationaleEl) clipRationaleEl.textContent = data.rationale;

      showToast(`Selected Clip: ${data.name}`);
    });
  });

  soloBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('bg-primary');
      btn.classList.toggle('text-on-primary');
      const isSoloed = btn.classList.contains('bg-primary');
      showToast(isSoloed ? 'Track Audio/Video Solo Activated' : 'Track Solo Deactivated');
    });
  });

  let scrubbing = false;
  let scrubInterval = null;
  let tcSec = 14;
  let tcFrame = 8;

  if (playToggle) {
    playToggle.addEventListener('click', () => {
      scrubbing = !scrubbing;
      if (scrubbing) {
        if (playIcon) playIcon.textContent = 'pause';
        showToast('NLE Timeline: Real-time playhead scrub active');
        scrubInterval = setInterval(() => {
          tcFrame += 4;
          if (tcFrame >= 24) {
            tcFrame = 0;
            tcSec = (tcSec + 1) % 60;
          }
          if (activeTcEl) {
            activeTcEl.textContent = `00:00:${tcSec.toString().padStart(2, '0')}:${tcFrame.toString().padStart(2, '0')}`;
          }
        }, 150);
      } else {
        if (playIcon) playIcon.textContent = 'play_arrow';
        clearInterval(scrubInterval);
        showToast('Playhead scrub paused');
      }
    });
  }
}

// 19. Photochemical Color Science & Film Emulation Laboratory
function initColorLab() {
  const tabs = document.querySelectorAll('.color-lab-tab');
  const imgEl = document.getElementById('color-lab-img');
  if (!tabs.length || !imgEl) return;
  const badgeEl = document.getElementById('color-lab-badge');
  const subtitleEl = document.getElementById('color-lab-subtitle');
  const titleEl = document.getElementById('color-lab-title');
  const descEl = document.getElementById('color-lab-desc');
  const highlightEl = document.getElementById('color-lab-highlight');
  const shadowEl = document.getElementById('color-lab-shadow');
  const halationEl = document.getElementById('color-lab-halation');
  const grainEl = document.getElementById('color-lab-grain');

  const profiles = {
    kodak: {
      badge: "PROFILE: KODAK VISION3 5219 / 2383",
      subtitle: "PHOTOPROCESS: PRINT FILM EMULATION",
      title: "Kodak Vision3 5219 + 2383 Print Stock",
      desc: "Subtractive cyan-magenta-yellow dye density with warm, organic highlight roll-off. Preserves rich skin tone tonality even under high-intensity xenon illumination.",
      highlight: "Soft Subtractive Curve",
      shadow: "Lifted Cold Navy (#06080E)",
      halation: "650nm Optical Red Bleed",
      grain: "4K Photochemical 35mm",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlYwsNQJrntYvf0k9pVNsjwgvZMoUjC1-JBPL_msgRg5rlfKexm5a-elqpJCFp-COoVSZMWmwwrsYjegUJF80Y5_Sup1_jS9zCUMfcYPAG80vte3gNIZsPAu0TJAe1vdNc73EVbfcFJQh4LP4L9RVmPhXXJXsIEyvrSuFYE2oMy94Zldv7KahJEgfuaXYosyMO8hCDnrEGnmLbI-twgNAG-2MYPtuoEY-XmjplXt-weT_0nU0k7-Ft"
    },
    arri: {
      badge: "PROFILE: ARRI LOGC4 TO REC.709 DCI",
      subtitle: "WIDE GAMUT: 17 STOPS DYNAMIC LATITUDE",
      title: "ARRI REVEAL Color Science Master",
      desc: "Maximum linear color separation tuned for high-budget commercial broadcasts. Clean highlight rolloff without channel clipping or digital artifacting.",
      highlight: "Smooth Exponential LogC4",
      shadow: "Neutral DCI Theatrical Zero",
      halation: "Controlled Optical Antiglare",
      grain: "Subtle Micro-Digital Texture",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwja6j1cVjFO_RA-Eazchg8knmebni4ho6W49rYFmyH1Y9F7kJFN03nQb05lZfqEYykYVOsOQUs-RLdFZydgo7nTzVQT6pXIqIpsj5jlpuoFpWq88iETBFznkIhJl8eKpOixSQXuVVmOHnKroxAkXVQYXw4guoov9OLeuI5MFvWAwyD0yA-Tj7B6URdbqbBgf6JzYVBIm7FZ7BVBuqgpt4-oixhP8bgn0jRP8Tp0D2TTchA5jry-1w"
    },
    tokyo: {
      badge: "PROFILE: TOKYO MIDNIGHT NEON SPLIT",
      subtitle: "CHROMATIC: CYBERPUNK CHROMATIC SPLIT",
      title: "Nocturnal Dual-Tone Split Grading",
      desc: "Deep tungsten warmth paired with aggressive cyan shadow undertones. Emphasizes urban reflections and illuminated asphalt for high-octane automotive visuals.",
      highlight: "Warm Tungsten Glow (3200K)",
      shadow: "Deep Cyan Matrix (#03141F)",
      halation: "High-Frequency Flare Bloom",
      grain: "High-ISO 800 Organic Texture",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcr_fzolGYyODN-7nJdWfRZuR2i43J2vRjEENtjUy7Ez9f5j7h5fkE2xTjE2B1kyc3Od0qYM7sIhvaVX4xgSNOt-AFCypV3H3tv3_NaE3bnXdg2br9Umftwy9s-5TddDeMpo1nBJTp-Iy-sVwV17aJfg7imPsaHLKgkeLxkbEwGOFk85WTsak3pkNTLbh8bervOQhPSklB5J6_0Cdltsy5liOjkipGyM4OkmM7J8iph5pHFwWe5WLs"
    },
    mono: {
      badge: "PROFILE: 16MM SILVER GELATIN PRINT",
      subtitle: "MONOCHROME: SILVER EMULSION SPECTRUM",
      title: "High-Silver Black & White Film Grain",
      desc: "Luminance-based tonal distribution matching vintage Kodak Tri-X 7266 motion picture stock. Rich micro-contrast with distinctive silver haloid particulate.",
      highlight: "Specular Silver Glow",
      shadow: "True Photochemical Jet Black",
      halation: "Diffusion Filter Flaring",
      grain: "16mm Visible Grain Particles",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpHGmJXFf6ZAf8Rrt8eZgrHLowU2fXPBYwQWSufBpIIvk8hI0jTgxBAoQ-L6wVy6P8rGlw6Xp5rnd77uZ11GPJ9Elw9Vo4nYrgBm-zP9XuF6R7qBtgGWvVVD4no9KTJBZwI28i8rIGs3MVVhkri-CYIHmn0woeMrek_r8CPP62hIodGcQm4D2B8HlnwZBXvps8xedKfLg5uLiA2JdWXF0l65oWtnWbjuSQz1VA53KTI9vQYKIyiz2g"
    },
    rawlog: {
      badge: "PROFILE: SONY S-LOG3 / ARRI LOGC4 FLAT (RAW / LOG)",
      subtitle: "SENSOR NATIVE: UNGRADED FLAT CAMERA LOG",
      title: "Native Camera LOG Sensor Still Profile",
      desc: "Direct logarithmic sensor readout prior to any color transformation. Maximum dynamic range preservation (16+ stops) for deep grading latitude and shadow recovery.",
      highlight: "Logarithmic Uncompressed Rolloff",
      shadow: "Lifted 10-bit Raw Sensor Floor",
      halation: "Native Lens Flare Spectrum",
      grain: "Sensor Photon Distribution",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlYwsNQJrntYvf0k9pVNsjwgvZMoUjC1-JBPL_msgRg5rlfKexm5a-elqpJCFp-COoVSZMWmwwrsYjegUJF80Y5_Sup1_jS9zCUMfcYPAG80vte3gNIZsPAu0TJAe1vdNc73EVbfcFJQh4LP4L9RVmPhXXJXsIEyvrSuFYE2oMy94Zldv7KahJEgfuaXYosyMO8hCDnrEGnmLbI-twgNAG-2MYPtuoEY-XmjplXt-weT_0nU0k7-Ft"
    },
    pngmaster: {
      badge: "FORMAT: 4K LOSSLESS PNG (ALPHA CHANNEL)",
      subtitle: "GRAPHICS: 24-BIT RGB + 8-BIT ALPHA LOSSLESS",
      title: "Lossless PNG Master Stills & VFX Composites",
      desc: "Zero compression artifacting with true transparent alpha channels. Ideal for title cards, holographic UI overlays, motion design plates, and digital keying.",
      highlight: "Linear 100% Retained Highlights",
      shadow: "Lossless True Alpha Keying",
      halation: "Clean Sub-Pixel Border Matte",
      grain: "Zero Macroblocking Artifacts",
      img: "/src/assets/images/volcanic_black_matrix_1788806061665.jpg"
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active', 'bg-primary', 'text-on-primary');
        t.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      tab.classList.add('active', 'bg-primary', 'text-on-primary');
      tab.classList.remove('bg-surface-container', 'text-on-surface-variant');

      const profileKey = tab.getAttribute('data-profile') || 'kodak';
      const prof = profiles[profileKey] || profiles.kodak;

      if (imgEl) imgEl.src = prof.img;
      if (badgeEl) badgeEl.textContent = prof.badge;
      if (subtitleEl) subtitleEl.textContent = prof.subtitle;
      if (titleEl) titleEl.textContent = prof.title;
      if (descEl) descEl.textContent = prof.desc;
      if (highlightEl) highlightEl.textContent = prof.highlight;
      if (shadowEl) shadowEl.textContent = prof.shadow;
      if (halationEl) halationEl.textContent = prof.halation;
      if (grainEl) grainEl.textContent = prof.grain;

      showToast(`Active LUT Matrix: ${prof.title}`);
    });
  });
}

// 22. Portfolio Image Upload & Format Suite (.PNG & LOG / RAW / JPG)
function initPortfolioImageUploaders() {
  // A. Hero Portrait Image Uploader & Persistence
  const heroFileInput = document.getElementById('portfolio-hero-file-input');
  const heroImg = document.getElementById('portfolio-hero-img');
  const heroBadge = document.getElementById('portfolio-hero-format-badge');
  const heroFilename = document.getElementById('hero-img-filename');
  const toggleFitBtn = document.getElementById('toggle-hero-fit-btn');
  const fitLabel = document.getElementById('hero-fit-label');
  const resetBtn = document.getElementById('reset-hero-img-btn');

  // Check if user previously saved a custom hero image in localStorage
  if (heroImg) {
    try {
      const savedHeroImg = localStorage.getItem('tsra_portfolio_hero_img');
      const savedHeroFormat = localStorage.getItem('tsra_portfolio_hero_format');
      const savedHeroName = localStorage.getItem('tsra_portfolio_hero_name');
      const savedHeroFit = localStorage.getItem('tsra_portfolio_hero_fit');

      if (savedHeroImg) {
        heroImg.src = savedHeroImg;
        if (heroBadge && savedHeroFormat) heroBadge.textContent = savedHeroFormat;
        if (heroFilename && savedHeroName) heroFilename.textContent = savedHeroName;
      }
      if (savedHeroFit && toggleFitBtn && fitLabel) {
        if (savedHeroFit === 'contain') {
          heroImg.classList.remove('object-cover');
          heroImg.classList.add('object-contain', 'p-4');
          fitLabel.textContent = 'Contain';
        }
      }
    } catch (e) {
      console.warn('LocalStorage error reading hero image', e);
    }
  }

  // Handle Hero File Selection
  if (heroFileInput && heroImg) {
    heroFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const fileName = file.name;
      const ext = fileName.split('.').pop().toLowerCase();
      let formatTag = `FORMAT: .${ext.toUpperCase()}`;
      if (ext === 'png') {
        formatTag = 'FORMAT: .PNG (ALPHA / LOSSLESS)';
      } else if (ext === 'log' || ext === 'dng' || ext === 'raw') {
        formatTag = 'FORMAT: CAMERA LOG (FLAT SENSOR RAW)';
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target.result;
        heroImg.src = resultUrl;
        if (heroBadge) heroBadge.textContent = formatTag;
        if (heroFilename) heroFilename.textContent = fileName;

        try {
          localStorage.setItem('tsra_portfolio_hero_img', resultUrl);
          localStorage.setItem('tsra_portfolio_hero_format', formatTag);
          localStorage.setItem('tsra_portfolio_hero_name', fileName);
        } catch (err) {
          // If storage quota exceeded for huge images, ignore
        }

        if (window.showToast) {
          window.showToast(`Hero image updated: ${fileName} (${formatTag})`);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Handle Hero Fit Toggle (Cover vs Contain for transparent PNG cutouts)
  if (toggleFitBtn && heroImg && fitLabel) {
    toggleFitBtn.addEventListener('click', () => {
      if (heroImg.classList.contains('object-cover')) {
        heroImg.classList.remove('object-cover');
        heroImg.classList.add('object-contain', 'p-4');
        fitLabel.textContent = 'Contain';
        try { localStorage.setItem('tsra_portfolio_hero_fit', 'contain'); } catch (_) {}
        if (window.showToast) window.showToast('Hero display set to Contain (Alpha PNG / Cutout mode)');
      } else {
        heroImg.classList.remove('object-contain', 'p-4');
        heroImg.classList.add('object-cover');
        fitLabel.textContent = 'Cover';
        try { localStorage.setItem('tsra_portfolio_hero_fit', 'cover'); } catch (_) {}
        if (window.showToast) window.showToast('Hero display set to Full Bleed Cover');
      }
    });
  }

  // Handle Hero Reset
  if (resetBtn && heroImg) {
    resetBtn.addEventListener('click', () => {
      heroImg.src = '/suman_kumar.jpg';
      heroImg.classList.remove('object-contain', 'p-4');
      heroImg.classList.add('object-cover');
      if (fitLabel) fitLabel.textContent = 'Cover';
      if (heroBadge) heroBadge.textContent = 'FORMAT: .PNG / LOG / JPG';
      if (heroFilename) heroFilename.textContent = 'suman_kumar.jpg';
      try {
        localStorage.removeItem('tsra_portfolio_hero_img');
        localStorage.removeItem('tsra_portfolio_hero_format');
        localStorage.removeItem('tsra_portfolio_hero_name');
        localStorage.removeItem('tsra_portfolio_hero_fit');
      } catch (_) {}
      if (window.showToast) window.showToast('Reset hero image to default portrait');
    });
  }

  // B. Card-level Image Replacement for any existing or new card
  function bindCardImageInputs() {
    const cardInputs = document.querySelectorAll('.portfolio-card-img-input:not([data-bound])');
    cardInputs.forEach(input => {
      input.setAttribute('data-bound', 'true');
      input.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const card = input.closest('.portfolio-item-card');
        if (!card) return;

        const imgEl = card.querySelector('img');
        const modalTrigger = card.querySelector('.open-modal-trigger');
        const ext = file.name.split('.').pop().toLowerCase();
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          if (imgEl) {
            imgEl.src = dataUrl;
            if (ext === 'png') {
              imgEl.parentElement.classList.add('bg-black/90');
            }
          }
          if (modalTrigger) {
            modalTrigger.setAttribute('data-img', dataUrl);
          }

          if (window.showToast) {
            window.showToast(`Replaced card image with ${file.name} (.${ext.toUpperCase()})`);
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }
  bindCardImageInputs();

  // C. Insert New Image (.PNG / LOG / RAW / JPG) into Portfolio Grid
  const addImageInput = document.getElementById('portfolio-add-image-input');
  const portfolioGrid = document.getElementById('portfolio-items-grid');

  if (addImageInput && portfolioGrid) {
    addImageInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      let addedCount = 0;
      files.forEach((file) => {
        const ext = file.name.split('.').pop().toLowerCase();
        const isPng = ext === 'png';
        const isLog = ext === 'log' || ext === 'dng' || ext === 'raw';

        const categoryTag = isPng ? 'all png commercial' : (isLog ? 'all log color' : 'all commercial');
        const formatBadge = isPng 
          ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> FORMAT: .PNG ALPHA'
          : (isLog 
              ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> FORMAT: CAMERA LOG' 
              : `FORMAT: .${ext.toUpperCase()}`);
        
        const badgeColor = isPng 
          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' 
          : (isLog ? 'bg-amber-950/80 border-amber-500/40 text-amber-400' : 'bg-black/80 border-primary/30 text-primary');

        const titleText = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          const card = document.createElement('div');
          card.className = 'portfolio-item-card rounded-2xl overflow-hidden border border-outline/30 bg-surface-container group flex flex-col justify-between shadow-xl transition-all hover:border-primary/60 hover:-translate-y-1.5 relative aspect-[9/16] w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start cursor-pointer';
          card.setAttribute('data-category', categoryTag);

          card.innerHTML = `
            <div class="relative w-full h-full overflow-hidden bg-black rounded-2xl">
              <img src="${dataUrl}" alt="${titleText}" class="portfolio-card-video absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/60 pointer-events-none"></div>

              <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 font-mono text-[10px]">
                <span class="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold tracking-wider flex items-center gap-1 shadow-md">
                  <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  9:16 REEL
                </span>
                <span class="px-2 py-0.5 rounded ${badgeColor} font-bold border">${ext.toUpperCase()}</span>
              </div>

              <div class="card-play-overlay absolute inset-0 bg-black/25 group-hover:bg-black/10 flex items-center justify-center transition-all z-10">
                <button data-title="${titleText}" data-img="${dataUrl}" class="open-modal-trigger w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 cursor-pointer" title="Screen Asset">
                  <span class="card-play-icon material-symbols-outlined text-3xl">play_arrow</span>
                </button>
              </div>

              <div class="absolute bottom-3.5 left-3.5 right-3.5 z-10 pointer-events-none space-y-1">
                <div class="flex items-center justify-between text-[10px] font-mono text-white/90">
                  <span class="truncate max-w-[170px] text-amber-300 font-bold">USER ARCHIVE</span>
                  <span class="px-1.5 py-0.5 rounded bg-black/80 font-bold text-primary">.${ext.toUpperCase()}</span>
                </div>
                <h4 class="font-syne font-bold text-sm text-white drop-shadow-md truncate">${titleText}</h4>
                <p class="font-jakarta text-[11px] text-white/80 line-clamp-1 drop-shadow">Imported media asset formatted for 9:16 Reel display.</p>
              </div>
            </div>
          `;

          portfolioGrid.prepend(card);
          bindCardImageInputs();

          // Bind modal trigger for the newly prepended card
          const trigger = card.querySelector('.open-modal-trigger');
          if (trigger) {
            trigger.addEventListener('click', (e) => {
              e.stopPropagation();
              const modal = document.getElementById('screening-modal');
              const modalTitle = document.getElementById('modal-title-text');
              const modalImage = document.getElementById('modal-img-target');
              const modalVideo = document.getElementById('modal-video-target');
              if (modalTitle) modalTitle.textContent = titleText;
              if (modalImage) {
                modalImage.src = dataUrl;
                modalImage.classList.remove('hidden');
              }
              if (modalVideo) {
                modalVideo.pause();
                modalVideo.classList.add('hidden');
              }
              if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
              }
            });
          }

          addedCount++;
          if (addedCount === files.length) {
            if (window.refreshReelsCarousel) {
              window.refreshReelsCarousel();
            }
            if (window.showToast) {
              window.showToast(`Successfully added ${files.length} .PNG/LOG image(s) to Film Archive!`);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }
}

// 23. Curated Film Archive: Auto-Sliding & Manual Carousel with Inline 9:16 Playback (NO Full-Screen Modal)
function initPortfolioReelsCarousel() {
  const grid = document.getElementById('portfolio-items-grid');
  const prevBtn = document.getElementById('reels-slide-prev');
  const nextBtn = document.getElementById('reels-slide-next');
  const counterEl = document.getElementById('reels-slider-counter');
  const dotsContainer = document.getElementById('reels-dots-container');
  const fadeLeft = document.getElementById('reels-fade-left');
  const fadeRight = document.getElementById('reels-fade-right');
  const trackWrapper = document.getElementById('reels-carousel-track-wrapper');

  if (!grid) return;

  let isAutoSlideActive = true;
  let isHovered = false;
  let autoSlideTimer = null;
  const AUTO_SLIDE_INTERVAL = 3800; // 3.8 seconds per reel slide

  function getVisibleCards() {
    return Array.from(grid.querySelectorAll('.portfolio-item-card')).filter(card => {
      return !card.classList.contains('hidden') && card.style.display !== 'none';
    });
  }

  function getActiveIndex(cards) {
    if (!cards || !cards.length) return 0;
    const gridRect = grid.getBoundingClientRect();
    const gridCenter = gridRect.left + gridRect.width / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - gridCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    return closestIdx;
  }

  function scrollToCardIndex(index, behavior = 'smooth') {
    const cards = getVisibleCards();
    if (!cards.length) return;
    const targetIdx = Math.max(0, Math.min(cards.length - 1, index));
    const targetCard = cards[targetIdx];
    if (!targetCard) return;

    const gridRect = grid.getBoundingClientRect();
    const cardRect = targetCard.getBoundingClientRect();
    const targetScrollLeft = grid.scrollLeft + (cardRect.left - gridRect.left);

    grid.scrollTo({
      left: targetScrollLeft,
      behavior: behavior
    });
  }

  function slideNext() {
    const cards = getVisibleCards();
    if (!cards.length) return;
    const currentIdx = getActiveIndex(cards);
    const nextIdx = (currentIdx + 1) % cards.length;
    scrollToCardIndex(nextIdx, 'smooth');
  }

  function slidePrev() {
    const cards = getVisibleCards();
    if (!cards.length) return;
    const currentIdx = getActiveIndex(cards);
    const prevIdx = (currentIdx - 1 + cards.length) % cards.length;
    scrollToCardIndex(prevIdx, 'smooth');
  }

  function resetAutoSlideTimer() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
    if (!isAutoSlideActive) return;

    autoSlideTimer = setInterval(() => {
      if (isAutoSlideActive && !isHovered) {
        // Only slide if no video inside the carousel is actively playing
        const anyPlaying = Array.from(grid.querySelectorAll('video')).some(v => !v.paused);
        if (!anyPlaying) {
          slideNext();
        }
      }
    }, AUTO_SLIDE_INTERVAL);
  }

  // Build Pagination Dots & Synchronize Counter
  function updateCarouselUI() {
    const cards = getVisibleCards();
    const total = cards.length;
    if (total === 0) {
      if (counterEl) counterEl.textContent = 'NO REELS';
      if (dotsContainer) dotsContainer.innerHTML = '';
      return;
    }

    const activeIdx = getActiveIndex(cards);
    if (counterEl) {
      const curNum = String(activeIdx + 1).padStart(2, '0');
      const totNum = String(total).padStart(2, '0');
      counterEl.textContent = `REEL ${curNum} / ${totNum}`;
    }

    // Update Dots
    if (dotsContainer) {
      if (dotsContainer.children.length !== total) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
          const dot = document.createElement('button');
          dot.className = 'h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none';
          dot.setAttribute('title', `Go to Reel ${i + 1}`);
          dot.setAttribute('aria-label', `Go to Reel ${i + 1}`);
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            scrollToCardIndex(i, 'smooth');
            resetAutoSlideTimer();
          });
          dotsContainer.appendChild(dot);
        }
      }

      Array.from(dotsContainer.children).forEach((dot, i) => {
        if (i === activeIdx) {
          dot.className = 'h-2.5 w-8 rounded-full bg-primary shadow-sm transition-all duration-300 cursor-pointer';
        } else {
          dot.className = 'h-2 w-2 rounded-full bg-outline-variant/40 hover:bg-outline transition-all duration-300 cursor-pointer';
        }
      });
    }

    // Update Fades
    if (fadeLeft) {
      fadeLeft.style.opacity = grid.scrollLeft > 20 ? '1' : '0';
    }
    if (fadeRight) {
      const isAtEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 20;
      fadeRight.style.opacity = isAtEnd ? '0' : '1';
    }
  }

  // Scroll listener with throttle
  let scrollTicking = false;
  grid.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateCarouselUI();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Manual Prev / Next Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      slidePrev();
      resetAutoSlideTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      slideNext();
      resetAutoSlideTimer();
    });
  }

  // Keyboard navigation when near or hovering
  window.addEventListener('keydown', (e) => {
    if (trackWrapper && (trackWrapper.contains(document.activeElement) || isHovered)) {
      if (e.key === 'ArrowRight') {
        slideNext();
        resetAutoSlideTimer();
      } else if (e.key === 'ArrowLeft') {
        slidePrev();
        resetAutoSlideTimer();
      }
    }
  });

  // Pause on hover or touch interaction
  grid.addEventListener('mouseenter', () => { isHovered = true; });
  grid.addEventListener('mouseleave', () => { isHovered = false; });
  grid.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
  grid.addEventListener('touchend', () => {
    setTimeout(() => { isHovered = false; }, 2500);
  }, { passive: true });

  // =========================================================================
  // INLINE REEL PLAYBACK (STRICTLY NO FULL-SCREEN MODAL)
  // =========================================================================
  function bindInlineReelPlayback() {
    const cards = grid.querySelectorAll('.portfolio-item-card');

    cards.forEach(card => {
      if (card.getAttribute('data-reel-bound') === 'true') return;
      card.setAttribute('data-reel-bound', 'true');

      const video = card.querySelector('video.portfolio-card-video');
      const playBtn = card.querySelector('.reel-inline-play-btn');
      const playIcon = card.querySelector('.reel-play-icon');
      const muteBtn = card.querySelector('.reel-inline-mute-btn');
      const muteIcon = card.querySelector('.reel-mute-icon');
      const progressBar = card.querySelector('.reel-inline-progress');
      const timecodeBadge = card.querySelector('.reel-timecode-badge');
      const playOverlay = card.querySelector('.card-play-overlay');

      if (!video) return;

      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      function setReelPlayingState(playing) {
        if (playing) {
          card.classList.add('video-is-playing');
          if (playOverlay) {
            playOverlay.classList.remove('opacity-100');
            playOverlay.classList.add('opacity-0', 'pointer-events-none', 'video-btn-hidden');
            playOverlay.style.opacity = '0';
            playOverlay.style.visibility = 'hidden';
          }
          if (playBtn) {
            playBtn.classList.add('opacity-0', 'pointer-events-none', 'video-btn-hidden');
            playBtn.style.opacity = '0';
            playBtn.style.visibility = 'hidden';
          }
          if (playIcon) playIcon.textContent = 'pause';
        } else {
          card.classList.remove('video-is-playing');
          if (playOverlay) {
            playOverlay.classList.remove('opacity-0', 'pointer-events-none', 'video-btn-hidden');
            playOverlay.classList.add('opacity-100');
            playOverlay.style.opacity = '';
            playOverlay.style.visibility = '';
          }
          if (playBtn) {
            playBtn.classList.remove('opacity-0', 'pointer-events-none', 'video-btn-hidden');
            playBtn.style.opacity = '';
            playBtn.style.visibility = '';
          }
          if (playIcon) playIcon.textContent = 'play_arrow';
        }
      }

      function toggleReelPlay(e) {
        if (e) e.stopPropagation();

        // If currently playing, pause it
        if (!video.paused) {
          video.pause();
          setReelPlayingState(false);
          showToast('Reel paused');
          resetAutoSlideTimer();
          return;
        }

        // Pause any other playing video across all reels
        grid.querySelectorAll('video').forEach(otherVideo => {
          if (otherVideo !== video && !otherVideo.paused) {
            otherVideo.pause();
            const otherCard = otherVideo.closest('.portfolio-item-card');
            if (otherCard) {
              otherCard.classList.remove('video-is-playing');
              const otherIcon = otherCard.querySelector('.reel-play-icon');
              const otherOverlay = otherCard.querySelector('.card-play-overlay');
              const otherBtn = otherCard.querySelector('.reel-inline-play-btn');
              if (otherIcon) otherIcon.textContent = 'play_arrow';
              if (otherOverlay) {
                otherOverlay.classList.remove('opacity-0', 'pointer-events-none', 'video-btn-hidden');
                otherOverlay.classList.add('opacity-100');
                otherOverlay.style.opacity = '';
                otherOverlay.style.visibility = '';
              }
              if (otherBtn) {
                otherBtn.classList.remove('opacity-0', 'pointer-events-none', 'video-btn-hidden');
                otherBtn.style.opacity = '';
                otherBtn.style.visibility = '';
              }
            }
          }
        });

        // Play inline inside the card
        if (video.muted) {
          video.muted = false;
          if (muteIcon) muteIcon.textContent = 'volume_up';
        }
        const startPromise = video.play();
        if (startPromise !== undefined) {
          startPromise.then(() => {
            setReelPlayingState(true);
            const reelTitle = card.querySelector('h4')?.textContent || 'Reel';
            showToast(`Playing "${reelTitle}" inline (9:16 Reel)`);
          }).catch(() => {
            // If browser policy blocked audio autoplay, retry muted
            video.muted = true;
            if (muteIcon) muteIcon.textContent = 'volume_off';
            video.play().then(() => {
              setReelPlayingState(true);
              const reelTitle = card.querySelector('h4')?.textContent || 'Reel';
              showToast(`Playing "${reelTitle}" inline (Tap unmute for audio)`);
            }).catch(() => {
              setReelPlayingState(false);
            });
          });
        }
      }

      video.addEventListener('play', () => setReelPlayingState(true));
      video.addEventListener('pause', () => setReelPlayingState(false));
      video.addEventListener('ended', () => {
        setReelPlayingState(false);
        if (progressBar) progressBar.style.width = '0%';
        resetAutoSlideTimer();
      });

      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleReelPlay(e);
        });
      }

      card.addEventListener('click', (e) => {
        // If clicked on mute button or its children, don't toggle play
        if (e.target.closest('.reel-inline-mute-btn')) return;
        toggleReelPlay(e);
      });

      // Mute / Unmute
      if (muteBtn && muteIcon) {
        muteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          video.muted = !video.muted;
          if (video.muted) {
            muteIcon.textContent = 'volume_off';
            showToast('Audio Muted');
          } else {
            muteIcon.textContent = 'volume_up';
            showToast('Audio Active');
          }
        });
      }

      // Timeupdate for progress bar
      video.addEventListener('timeupdate', () => {
        if (video.duration && progressBar) {
          const pct = (video.currentTime / video.duration) * 100;
          progressBar.style.width = `${pct}%`;
        }
        if (video.duration && timecodeBadge) {
          const cur = Math.floor(video.currentTime);
          const s = (cur % 60).toString().padStart(2, '0');
          const m = Math.floor(cur / 60).toString().padStart(2, '0');
          timecodeBadge.textContent = `${m}:${s}`;
        }
      });

      video.addEventListener('ended', () => {
        if (playIcon) playIcon.textContent = 'play_arrow';
        if (playOverlay) {
          playOverlay.classList.remove('opacity-0', 'pointer-events-none');
          playOverlay.classList.add('opacity-100');
        }
        if (progressBar) progressBar.style.width = '0%';
        resetAutoSlideTimer();
      });
    });
  }

  // Bind playback on existing cards
  bindInlineReelPlayback();

  // Initial UI refresh and timer start
  updateCarouselUI();
  resetAutoSlideTimer();

  // Expose global refresh function so filter and upload logic can sync dots and binds
  window.refreshReelsCarousel = function() {
    bindInlineReelPlayback();
    updateCarouselUI();
    resetAutoSlideTimer();
  };
}
