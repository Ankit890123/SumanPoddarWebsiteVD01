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
  initHomeWiper();
  initAudioToggle();
  initContinuousTimelineSlider();
  initVideoFeedbackSuite();
});

function initHomeWiper() {
  setupWiper('home-wipe-container', 'home-wipe-log-layer', 'home-wipe-handle');
}

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
        playBtn.classList.add('opacity-80');
      } else {
        playBtn.classList.remove('opacity-80');
      }
    }
  }

  if (heroVideo) {
    heroVideo.addEventListener('play', () => updateHeroPlayUI(true));
    heroVideo.addEventListener('pause', () => updateHeroPlayUI(false));
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

// 11. Video Feedback Suite (Interactive Video Reviews)
function initVideoFeedbackSuite() {
  const video = document.getElementById('client-feedback-video');
  const playBtn = document.getElementById('client-video-play-btn');
  const playIcon = document.getElementById('client-video-play-icon');
  const smallPlayBtn = document.getElementById('client-play-toggle-btn');
  const smallPlayIcon = document.getElementById('client-small-play-icon');
  const muteBtn = document.getElementById('client-video-mute-btn');
  const muteIcon = document.getElementById('client-video-mute-icon');
  const fullscreenBtn = document.getElementById('client-fullscreen-btn');
  const scrubberTrack = document.getElementById('client-scrubber-track');
  const progressBar = document.getElementById('client-video-progress');
  const timecodeDisplay = document.getElementById('client-video-timecode');
  const timeDisplay = document.getElementById('client-video-time-display');
  const captionDisplay = document.getElementById('client-video-caption');

  const clientData = {
    warner: {
      name: "Julian Vance",
      role: "Creative Director • Warner Music Group",
      company: "WARNER MUSIC RECORDINGS",
      videoSrc: "/src/assets/video/Trigotab Reel 9.mp4",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuClzy_GGkTzTR0Y4BK2wu6EHlJQYpCV9JaKVqC0HNzJvMNz2Bhsf8xSsweR-Kxtu9SJvxXwNlIgwjzOgsHNE-HXOXREWdASeex6R1BInHknH5EqI3PJwjIpg6ezpFR083yIAXFs2nINUsYXKiewAtNxRkK3NnC0C0UJMGzapx-zFRsRwl8NLJsxRmqt2jmSGuh_g0bucifp9lrwdX_B2LI6iGK61OqVE2DAPI39ayAiUPb5QbDFSAmk",
      poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpHGmJXFf6ZAf8Rrt8eZgrHLowU2fXPBYwQWSufBpIIvk8hI0jTgxBAoQ-L6wVy6P8rGlw6Xp5rnd77uZ11GPJ9Elw9Vo4nYrgBm-zP9XuF6R7qBtgGWvVVD4no9KTJBZwI28i8rIGs3MVVhkri-CYIHmn0woeMrek_r8CPP62hIodGcQm4D2B8HlnwZBXvps8xedKfLg5uLiA2JdWXF0l65oWtnWbjuSQz1VA53KTI9vQYKIyiz2g",
      badge: "WARNER MUSIC • RECORDED DEBRIEF",
      quote: "Suman extracted raw emotional adrenaline under an impossible 48-hour broadcast turnaround. The multicam sync of 14 arena cameras was flawless.",
      caption: '"Suman took 14 disjointed camera angles and cut them into pure emotion in 48 hours."',
      project: "Golden Echoes Arena Cut",
      outcome: "MTV VMA Nominee 2024",
      chapters: [
        { time: 14, title: "00:14 • The first rough cut had zero revisions" },
        { time: 42, title: "00:42 • 14-camera live sync & rhythmic drum cuts" },
        { time: 78, title: "01:18 • Delivering the final DCI 4K master in 48h" }
      ],
      markers: [{ time: 14, label: "Rough cut approved" }, { time: 42, label: "14 multicam tracks" }, { time: 78, label: "Winning Best Concert Film" }]
    },
    nike: {
      name: "Elena Rostova",
      role: "Head of Digital Content • Nike EMEA",
      company: "NIKE GLOBAL SPORTS",
      videoSrc: "/src/assets/video/Tsh Media Reel 1.mp4",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxcW-fZPnjAWh_2wCCEJmb-Zin00p10GqmSU6YoCZJlspyXELQfaDOZo12i0xuJOhJqhmMATDQr-JxZqFtRrw7wCVZkGhh7x7eYn1tIgz6f50GNM7HaJLsMgkucd8aazIwGf81azTh1_kLbB-R_yOXQJgnCRFT7MWsLFQ_vibuKxICqJUZJTg-h7O_DrBhPZk7HTe_U759jeiQoiDJFPQe12N2hg0NJ0JMlr5B9n5ZfEkakfHQDo_m",
      poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxcW-fZPnjAWh_2wCCEJmb-Zin00p10GqmSU6YoCZJlspyXELQfaDOZo12i0xuJOhJqhmMATDQr-JxZqFtRrw7wCVZkGhh7x7eYn1tIgz6f50GNM7HaJLsMgkucd8aazIwGf81azTh1_kLbB-R_yOXQJgnCRFT7MWsLFQ_vibuKxICqJUZJTg-h7O_DrBhPZk7HTe_U759jeiQoiDJFPQe12N2hg0NJ0JMlr5B9n5ZfEkakfHQDo_m",
      badge: "NIKE GLOBAL • EXECUTIVE REVIEW",
      quote: "The speed ramp choreography and kinetic audio design scaled our campaign to 42M impressions with zero revisions requested.",
      caption: '"The speed ramp choreography turned raw athlete footage into an unstoppable anthem."',
      project: "Relentless Anthem Worldwide",
      outcome: "42M Verified Impressions",
      chapters: [
        { time: 10, title: "00:10 • Sprint match cuts on heartbeats" },
        { time: 35, title: "00:35 • Shoe impact sound sync & bass drops" },
        { time: 65, title: "01:05 • 9:16 vertical reframe adaptation" }
      ],
      markers: [{ time: 10, label: "Speed ramp timing" }, { time: 35, label: "Shoe impact sound sync" }, { time: 65, label: "Social 9:16 reframe" }]
    },
    redbull: {
      name: "Marcus Sterling",
      role: "Executive Producer • Red Bull Media House",
      company: "RED BULL EXTREME",
      videoSrc: "/src/assets/video/Yashoda Mam.mp4",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcr_fzolGYyODN-7nJdWfRZuR2i43J2vRjEENtjUy7Ez9f5j7h5fkE2xTjE2B1kyc3Od0qYM7sIhvaVX4xgSNOt-AFCypV3H3tv3_NaE3bnXdg2br9Umftwy9s-5TddDeMpo1nBJTp-Iy-sVwV17aJfg7imPsaHLKgkeLxkbEwGOFk85WTsak3pkNTLbh8bervOQhPSklB5J6_0Cdltsy5liOjkipGyM4OkmM7J8iph5pHFwWe5WLs",
      poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcr_fzolGYyODN-7nJdWfRZuR2i43J2vRjEENtjUy7Ez9f5j7h5fkE2xTjE2B1kyc3Od0qYM7sIhvaVX4xgSNOt-AFCypV3H3tv3_NaE3bnXdg2br9Umftwy9s-5TddDeMpo1nBJTp-Iy-sVwV17aJfg7imPsaHLKgkeLxkbEwGOFk85WTsak3pkNTLbh8bervOQhPSklB5J6_0Cdltsy5liOjkipGyM4OkmM7J8iph5pHFwWe5WLs",
      badge: "RED BULL MEDIA HOUSE • VERDICT",
      quote: "Suman knows exactly when to hold on a mountain summit and when to cut rapidly on a downhill jump. Unrivaled rhythm.",
      caption: '"He knows how to balance heart-stopping kinetic speed with cinematic breathing space."',
      project: "Alpine Velocity Documentary",
      outcome: "Best Action Cut • BANFF 2024",
      chapters: [
        { time: 18, title: "00:18 • Downhill 120fps jump optical flow" },
        { time: 45, title: "00:45 • FPV drone acoustic sound design" },
        { time: 70, title: "01:10 • Alpine snow specular color match" }
      ],
      markers: [{ time: 18, label: "Downhill 120fps jump" }, { time: 45, label: "FPV drone sound design" }, { time: 70, label: "Grade match" }]
    },
    universal: {
      name: "Sophia Cho",
      role: "A&R Visual Director • Universal Music",
      company: "UNIVERSAL MUSIC RECORDINGS",
      videoSrc: "/src/assets/video/PB-Surbhi.mp4",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlYwsNQJrntYvf0k9pVNsjwgvZMoUjC1-JBPL_msgRg5rlfKexm5a-elqpJCFp-COoVSZMWmwwrsYjegUJF80Y5_Sup1_jS9zCUMfcYPAG80vte3gNIZsPAu0TJAe1vdNc73EVbfcFJQh4LP4L9RVmPhXXJXsIEyvrSuFYE2oMy94Zldv7KahJEgfuaXYosyMO8hCDnrEGnmLbI-twgNAG-2MYPtuoEY-XmjplXt-weT_0nU0k7-Ft",
      poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlYwsNQJrntYvf0k9pVNsjwgvZMoUjC1-JBPL_msgRg5rlfKexm5a-elqpJCFp-COoVSZMWmwwrsYjegUJF80Y5_Sup1_jS9zCUMfcYPAG80vte3gNIZsPAu0TJAe1vdNc73EVbfcFJQh4LP4L9RVmPhXXJXsIEyvrSuFYE2oMy94Zldv7KahJEgfuaXYosyMO8hCDnrEGnmLbI-twgNAG-2MYPtuoEY-XmjplXt-weT_0nU0k7-Ft",
      badge: "UNIVERSAL MUSIC • ARTIST VERDICT",
      quote: "Our artist cried when she watched the first rough cut. Suman didn't just edit clips; he built poetry with 16mm film scans.",
      caption: '"Our artist cried on the first pass. He didn\'t just cut video; he told her life story."',
      project: "Midnight Mirage Official MV",
      outcome: "Rolling Stone Feature 2024",
      chapters: [
        { time: 12, title: "00:12 • 16mm film grain & halation blend" },
        { time: 38, title: "00:38 • Vocal sync and lyric emotional pacing" },
        { time: 80, title: "01:20 • Closing single-take emotional hold" }
      ],
      markers: [{ time: 12, label: "16mm film grain" }, { time: 38, label: "Vocal sync harmony" }, { time: 80, label: "Closing emotional shot" }]
    },
    nissan: {
      name: "Kenji Takahashi",
      role: "Brand Communications Lead • Nissan Motor Co.",
      company: "NISSAN MOTOR CO. GLOBAL",
      videoSrc: "/src/assets/video/TCDReel.mp4",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSyALOg6EAXnoVRMDu0mGkkE_V45PLonx3J0DmLojsndtz4B04pqP4dZ32Xfv9CHGOhs8wlgAdOqlxbeiD7ogVVv7DByzSMJ2rkVP-NmCBfagBQBZklk_HGiXweI4yjsPC_BZT4ELW7lH3O0xzKJ9iDPefKTTu4zYmHVa_XBxZ_AL-MewiP81Poi8HRVDKerD8f4cNEMu8AiHKkRRl6iOBeGmWq4cp_e5kOruN7GlP6VQlAl5Q9c7L",
      poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSyALOg6EAXnoVRMDu0mGkkE_V45PLonx3J0DmLojsndtz4B04pqP4dZ32Xfv9CHGOhs8wlgAdOqlxbeiD7ogVVv7DByzSMJ2rkVP-NmCBfagBQBZklk_HGiXweI4yjsPC_BZT4ELW7lH3O0xzKJ9iDPefKTTu4zYmHVa_XBxZ_AL-MewiP81Poi8HRVDKerD8f4cNEMu8AiHKkRRl6iOBeGmWq4cp_e5kOruN7GlP6VQlAl5Q9c7L",
      badge: "NISSAN MOTOR CO. • EXECUTIVE REVIEW",
      quote: "Suman captured the raw adrenaline of GT-R nighttime drift with surgical precision. Pacing locked to Cosworth telemetry.",
      caption: '"Captured the raw adrenaline of GT-R nighttime drift with surgical precision."',
      project: "GT-R Midnight Protocol Commercial",
      outcome: "Clio Awards Finalist 2024",
      chapters: [
        { time: 15, title: "00:15 • Shinjuku night drift speed-ramping" },
        { time: 48, title: "00:48 • Titanium exhaust flame color grade" },
        { time: 75, title: "01:15 • Twin-turbo audio mix crescendo" }
      ],
      markers: [{ time: 15, label: "Perfume bottle specular" }, { time: 48, label: "Silk fabric micro-slowmo" }, { time: 75, label: "Kodak halation" }]
    },
    dior: {
      name: "Antoine De Beaumarchais",
      role: "Visual Lead • Dior Haute Parfumerie",
      company: "LVMH / CHRISTIAN DIOR",
      videoSrc: "/src/assets/video/TCDReel.mp4",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSyALOg6EAXnoVRMDu0mGkkE_V45PLonx3J0DmLojsndtz4B04pqP4dZ32Xfv9CHGOhs8wlgAdOqlxbeiD7ogVVv7DByzSMJ2rkVP-NmCBfagBQBZklk_HGiXweI4yjsPC_BZT4ELW7lH3O0xzKJ9iDPefKTTu4zYmHVa_XBxZ_AL-MewiP81Poi8HRVDKerD8f4cNEMu8AiHKkRRl6iOBeGmWq4cp_e5kOruN7GlP6VQlAl5Q9c7L",
      poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSyALOg6EAXnoVRMDu0mGkkE_V45PLonx3J0DmLojsndtz4B04pqP4dZ32Xfv9CHGOhs8wlgAdOqlxbeiD7ogVVv7DByzSMJ2rkVP-NmCBfagBQBZklk_HGiXweI4yjsPC_BZT4ELW7lH3O0xzKJ9iDPefKTTu4zYmHVa_XBxZ_AL-MewiP81Poi8HRVDKerD8f4cNEMu8AiHKkRRl6iOBeGmWq4cp_e5kOruN7GlP6VQlAl5Q9c7L",
      badge: "DIOR PARIS • HAUTE COUTURE VERDICT",
      quote: "The subtle color science and highlight roll-off Suman engineered honored our French heritage. Pristine luxury.",
      caption: '"The subtractive color science respected our luxury palette like a true cinematic master."',
      project: "Sauvage Elixir Campaign",
      outcome: "Best Luxury Commercial 2024",
      chapters: [
        { time: 15, title: "00:15 • Perfume bottle specular reflection" },
        { time: 50, title: "00:50 • Silk fabric micro-slowmo texture" },
        { time: 75, title: "01:15 • Subtractive Kodak halation print" }
      ],
      markers: [{ time: 15, label: "Perfume bottle specular" }, { time: 50, label: "Silk fabric micro-slowmo" }, { time: 75, label: "Kodak halation" }]
    }
  };

  // Synchronize state of the currently active debrief card with playback
  function syncActiveCardState(isPlaying) {
    const activeCard = document.querySelector('.client-select-card.active');
    if (!activeCard) return;
    const cardVideo = activeCard.querySelector('video');
    const cardPlayIcon = activeCard.querySelector('.card-play-icon');

    if (cardPlayIcon) {
      cardPlayIcon.textContent = isPlaying ? 'pause' : 'play_arrow';
    }

    if (isPlaying) {
      if (cardVideo && cardVideo.paused) {
        cardVideo.play().catch(() => {});
      }
    } else {
      if (cardVideo && !cardVideo.paused) {
        cardVideo.pause();
      }
    }
  }

  // Audio VU Meter dynamic simulation on playback
  let vuInterval = null;
  function animateVuMeter(active) {
    if (vuInterval) {
      clearInterval(vuInterval);
      vuInterval = null;
    }
    const bars = document.querySelectorAll('.audio-bar');
    if (active) {
      vuInterval = setInterval(() => {
        bars.forEach(b => {
          b.style.height = `${Math.floor(Math.random() * 12) + 4}px`;
        });
      }, 100);
    } else {
      const defaults = [10, 14, 11, 7];
      bars.forEach((b, i) => {
        b.style.height = `${defaults[i] || 8}px`;
      });
    }
  }

  function updatePlayUI(isPlaying) {
    if (playIcon) playIcon.textContent = isPlaying ? 'pause' : 'play_arrow';
    if (smallPlayIcon) smallPlayIcon.textContent = isPlaying ? 'pause' : 'play_arrow';
    if (playBtn) {
      if (isPlaying) {
        playBtn.classList.add('opacity-0', 'pointer-events-none');
      } else {
        playBtn.classList.remove('opacity-0', 'pointer-events-none');
      }
    }
    syncActiveCardState(isPlaying);
    animateVuMeter(isPlaying);
  }

  function togglePlay() {
    if (!video) return;
    if (video.paused) {
      video.play().then(() => {
        updatePlayUI(true);
        showToast('Playing Client Video Debrief');
      }).catch((err) => {
        console.warn('Playback request handled:', err);
        updatePlayUI(false);
      });
    } else {
      video.pause();
      updatePlayUI(false);
      showToast('Paused Video Debrief');
    }
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (smallPlayBtn) smallPlayBtn.addEventListener('click', togglePlay);
  if (video) {
    video.addEventListener('click', togglePlay);
    video.addEventListener('play', () => updatePlayUI(true));
    video.addEventListener('pause', () => updatePlayUI(false));
    video.addEventListener('ended', () => updatePlayUI(false));
  }

  if (muteBtn && video) {
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (muteIcon) {
        muteIcon.textContent = video.muted ? 'volume_off' : 'volume_up';
      }
      showToast(video.muted ? 'Client Video Audio Muted' : 'Client Audio Active (Stereo)');
    });
  }

  if (fullscreenBtn && video) {
    fullscreenBtn.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    });
  }

  if (video) {
    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      const progress = (video.currentTime / video.duration) * 100;
      if (progressBar) progressBar.style.width = `${progress}%`;

      const curM = Math.floor(video.currentTime / 60).toString().padStart(2, '0');
      const curS = Math.floor(video.currentTime % 60).toString().padStart(2, '0');
      const durM = Math.floor(video.duration / 60).toString().padStart(2, '0');
      const durS = Math.floor(video.duration % 60).toString().padStart(2, '0');
      if (timeDisplay) timeDisplay.textContent = `${curM}:${curS} / ${durM}:${durS}`;

      const frames = Math.floor((video.currentTime % 1) * 24).toString().padStart(2, '0');
      if (timecodeDisplay) timecodeDisplay.textContent = `00:${curM}:${curS}:${frames}`;
    });
  }

  if (scrubberTrack && video) {
    scrubberTrack.addEventListener('click', (e) => {
      const rect = scrubberTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      if (video.duration) {
        video.currentTime = pct * video.duration;
      }
    });
  }

  // Chapter jump listener binder
  function attachChapterListeners() {
    document.querySelectorAll('.client-chapter-jump').forEach(btn => {
      btn.addEventListener('click', () => {
        const time = parseFloat(btn.getAttribute('data-time') || '0');
        if (video) {
          video.currentTime = time;
          video.play().then(() => {
            updatePlayUI(true);
          }).catch(() => {});
        }
        showToast(`Jumped to chapter at 00:${Math.floor(time).toString().padStart(2, '0')}`);
      });
    });
  }
  attachChapterListeners();

  // Interactive Marker Pins
  document.querySelectorAll('.client-marker-pin').forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const time = parseFloat(pin.getAttribute('data-time') || '0');
      if (video) {
        video.currentTime = time;
        video.play().then(() => {
          updatePlayUI(true);
        }).catch(() => {});
      }
      showToast(`Jumped to marker: ${pin.title}`);
    });
  });

  // Select client debrief function
  function selectClient(clientId, shouldPlay = true) {
    const data = clientData[clientId];
    const targetCard = document.querySelector(`.client-select-card[data-client-id="${clientId}"]`);

    // Determine target video source - priority: card attribute, then clientData
    let targetSrc = (targetCard && targetCard.getAttribute('data-video-src')) || (data && data.videoSrc) || '';

    // Update active visual state across all cards
    document.querySelectorAll('.client-select-card').forEach(c => {
      const cId = c.getAttribute('data-client-id');
      const isThis = cId === clientId;
      const tag = c.querySelector('.card-active-tag');
      const dot = c.querySelector('.card-status-dot');
      const cardPlayIcon = c.querySelector('.card-play-icon');
      const previewVid = c.querySelector('video');

      if (isThis) {
        c.classList.add('active', 'border-2', 'border-primary', 'ring-2', 'ring-primary/30');
        c.classList.remove('border-outline-variant/30');
        if (tag) tag.classList.remove('hidden');
        if (dot) dot.classList.add('animate-pulse');
        if (cardPlayIcon) cardPlayIcon.textContent = 'pause';
        if (previewVid) {
          try {
            previewVid.currentTime = 0;
            previewVid.play().catch(() => {});
          } catch (e) {}
        }
      } else {
        c.classList.remove('active', 'border-2', 'border-primary', 'ring-2', 'ring-primary/30');
        c.classList.add('border-outline-variant/30');
        if (tag) tag.classList.add('hidden');
        if (dot) dot.classList.remove('animate-pulse');
        if (cardPlayIcon) cardPlayIcon.textContent = 'play_arrow';
        if (previewVid && !previewVid.paused) {
          try {
            previewVid.pause();
          } catch (e) {}
        }
      }
    });

    // Update main console metadata if data exists
    if (data) {
      const badge = document.getElementById('client-video-badge');
      const name = document.getElementById('active-client-name');
      const role = document.getElementById('active-client-role');
      const company = document.getElementById('active-client-company');
      const avatar = document.getElementById('active-client-avatar');
      const quote = document.getElementById('active-client-quote');
      const project = document.getElementById('active-client-project');
      const outcome = document.getElementById('active-client-outcome');
      const chaptersContainer = document.getElementById('active-client-chapters');
      const screenMasterBtn = document.getElementById('screen-master-cut-btn');

      if (badge) badge.textContent = data.badge;
      if (name) name.textContent = data.name;
      if (role) role.textContent = data.role;
      if (company) company.textContent = data.company;
      if (avatar && data.avatar) avatar.src = data.avatar;
      if (captionDisplay && data.caption) captionDisplay.textContent = data.caption;
      if (quote && data.quote) quote.textContent = `"${data.quote}"`;
      if (project) project.textContent = data.project;
      if (outcome) outcome.textContent = data.outcome;

      if (screenMasterBtn) {
        screenMasterBtn.setAttribute('data-title', `${data.project} (${data.company})`);
        screenMasterBtn.setAttribute('data-img', data.poster || '');
        screenMasterBtn.setAttribute('data-video', targetSrc);
      }

      if (chaptersContainer && data.chapters) {
        chaptersContainer.innerHTML = data.chapters.map(ch => `
          <button class="client-chapter-jump w-full text-left px-3 py-2 rounded bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20 flex items-center justify-between transition-colors group cursor-pointer" data-time="${ch.time}">
            <span class="text-on-surface group-hover:text-primary">${ch.title}</span>
            <span class="material-symbols-outlined text-sm text-primary">play_circle</span>
          </button>
        `).join('');
        attachChapterListeners();
      }
    }

    // Update main video player with guaranteed clean source switching
    if (video && targetSrc) {
      video.pause();

      // Clear any child nodes (such as leftover source tags) that prevent dynamic switching
      while (video.firstChild) {
        video.removeChild(video.firstChild);
      }

      if (data && data.poster) {
        video.poster = data.poster;
      }

      // Clean source path and handle encoding
      let cleanSrc = targetSrc;
      if (!cleanSrc.startsWith('blob:') && !cleanSrc.startsWith('data:') && !cleanSrc.startsWith('http')) {
        if (!cleanSrc.startsWith('/')) {
          cleanSrc = '/' + cleanSrc;
        }
        cleanSrc = encodeURI(decodeURI(cleanSrc));
      }

      video.removeAttribute('src');
      video.src = cleanSrc;
      video.currentTime = 0;
      video.load();

      if (shouldPlay) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            updatePlayUI(true);
            const label = data ? `${data.name} (${data.company})` : 'Client Video';
            showToast(`Now Playing: ${label}`);
          }).catch((err) => {
            console.log('Playback state:', err);
            updatePlayUI(false);
            const label = data ? data.name : 'Video';
            showToast(`Selected: ${label} (Click play button to start)`);
          });
        }
      } else {
        updatePlayUI(false);
        const label = data ? data.name : 'Video';
        showToast(`Selected: ${label}`);
      }
    }
  }

  // Attach click & video replacement listeners to client card
  function attachCardClickListener(card) {
    card.addEventListener('click', (e) => {
      // If clicked on the file input or replace label, avoid triggering card select
      if (e.target.closest('.change-card-video-label') || e.target.closest('input')) {
        return;
      }

      const clientId = card.getAttribute('data-client-id');
      const isCurrentlyActive = card.classList.contains('active');

      if (isCurrentlyActive && video) {
        if (!video.paused) {
          video.pause();
          updatePlayUI(false);
          const data = clientData[clientId];
          showToast(`Paused: ${data ? data.name : 'Debrief'}`);
        } else {
          video.play().then(() => {
            updatePlayUI(true);
            const data = clientData[clientId];
            showToast(`Resumed: ${data ? data.name : 'Debrief'}`);
          }).catch(() => {});
        }
        return;
      }

      selectClient(clientId, true);
    });

    // Also attach listener for card's custom video input ("Replace Video")
    const cardInput = card.querySelector('.card-custom-video-input');
    if (cardInput) {
      cardInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const videoUrl = URL.createObjectURL(file);
        const clientId = card.getAttribute('data-client-id');

        // Update card attributes and its preview video
        card.setAttribute('data-video-src', videoUrl);
        const previewVid = card.querySelector('video');
        if (previewVid) {
          previewVid.src = videoUrl;
          previewVid.load();
        }

        // Update clientData object
        if (clientData[clientId]) {
          clientData[clientId].videoSrc = videoUrl;
          clientData[clientId].quote = `Custom client video loaded: ${file.name}`;
        }

        // Immediately select & play this card in the main player
        selectClient(clientId, true);
        showToast(`Loaded video for ${clientData[clientId] ? clientData[clientId].name : 'Card'}: ${file.name}`);
        cardInput.value = '';
      });
    }
  }

  // Bind all existing client cards
  document.querySelectorAll('.client-select-card').forEach(card => {
    attachCardClickListener(card);
  });

  // Custom Video File Upload / Selection Handler ("Select & Add Video" button)
  const fileInput = document.getElementById('client-video-file-input');
  const addVideoBtn = document.getElementById('add-client-video-btn');

  if (addVideoBtn && fileInput) {
    addVideoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const target = e.target;
      const file = target && target.files && target.files[0];
      if (!file) return;

      const videoUrl = URL.createObjectURL(file);
      const customId = 'custom_' + Date.now();
      const rawName = file.name.replace(/\.[^/.]+$/, "");
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      // Register new debrief into clientData
      clientData[customId] = {
        name: formattedName,
        role: "Client Reviewer • Verified Debrief",
        company: "CUSTOM CLIENT VIDEO",
        videoSrc: videoUrl,
        avatar: "/suman_kumar.jpg",
        poster: "/suman_kumar.jpg",
        badge: `${formattedName.toUpperCase()} • CLIENT DEBRIEF`,
        quote: `Custom client recorded debrief successfully loaded into the studio feedback console: ${file.name}`,
        caption: `"${formattedName} video feedback debrief loaded."`,
        project: "Selected Client Video",
        outcome: "100% Client Satisfaction",
        chapters: [
          { time: 0, title: "00:00 • Custom debrief start" },
          { time: 10, title: "00:10 • Key feedback notes" }
        ],
        markers: [{ time: 0, label: "Start" }]
      };

      // Create new card in the grid
      const grid = document.getElementById('client-cards-grid');
      if (grid) {
        const newCard = document.createElement('div');
        newCard.className = 'client-select-card p-3 rounded-xl bg-surface-container border border-outline-variant/30 cursor-pointer transition-all hover:border-primary/60 hover:bg-surface-container-high space-y-3 group';
        newCard.setAttribute('data-client-id', customId);
        newCard.setAttribute('data-video-src', videoUrl);
        newCard.innerHTML = `
          <div class="relative aspect-[9/16] rounded-lg overflow-hidden bg-black">
            <video src="${videoUrl}" class="card-preview-video absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" playsinline muted loop preload="metadata"></video>
            <div class="card-play-overlay absolute inset-0 bg-black/35 group-hover:bg-black/15 flex items-center justify-center transition-all pointer-events-none">
              <div class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <span class="card-play-icon material-symbols-outlined text-2xl">play_arrow</span>
              </div>
            </div>
            <div class="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 text-primary font-mono text-[9px] font-bold pointer-events-none z-10 flex items-center gap-1.5">
              <span class="card-status-dot w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span class="truncate max-w-[80px]">CUSTOM</span>
            </div>
            <div class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 text-on-surface font-mono text-[9px] pointer-events-none z-10">VIDEO</div>
          </div>
          <div>
            <div class="font-syne font-bold text-sm text-on-surface flex items-center justify-between">
              <span class="truncate">${formattedName}</span>
              <span class="card-active-tag hidden text-[9px] font-mono text-primary font-bold">ACTIVE</span>
            </div>
            <div class="font-space text-[11px] text-on-surface-variant truncate">Client Review</div>
            <p class="font-jakarta text-xs text-on-surface-variant line-clamp-2 mt-1">"${file.name}"</p>
            <div class="mt-2 pt-2 border-t border-outline-variant/20 flex items-center justify-between">
              <span class="text-[10px] font-mono text-primary font-semibold flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">play_circle</span> Click to Play
              </span>
              <label class="change-card-video-label cursor-pointer text-[10px] font-mono text-on-surface-variant hover:text-primary flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container-high hover:bg-primary/20 transition-colors" title="Select custom video for this card">
                <span class="material-symbols-outlined text-xs">upload</span> Replace
                <input type="file" class="card-custom-video-input hidden" accept="video/*" />
              </label>
            </div>
          </div>
        `;

        attachCardClickListener(newCard);
        grid.insertBefore(newCard, grid.firstChild);

        // Immediately select & load into player
        selectClient(customId, true);
        showToast(`Video added & loaded: ${file.name}`);
      }

      fileInput.value = '';
    });
  }
}
