/**
 * tecnosra - Suman Poddar - Video Editing & Production House
 * Shared Common Utilities & Navigation Logic
 */

// Theme Toggle Engine (Dark & Light Mode)
function initThemeToggle() {
  const toggleButtons = document.querySelectorAll('.theme-toggle');

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    
    // Update button accessibility and tooltip attributes
    toggleButtons.forEach(btn => {
      const isLight = theme === 'light';
      btn.setAttribute('aria-label', isLight ? 'Switch to Dark mode' : 'Switch to Light mode');
      btn.setAttribute('title', isLight ? 'Switch to Dark mode' : 'Switch to Light mode');
    });
  }

  // Check saved theme or default
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme('dark');
  }

  // Click listeners for all theme toggle triggers (desktop & mobile)
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentIsLight = document.documentElement.classList.contains('light');
      applyTheme(currentIsLight ? 'dark' : 'light');
    });
  });

  // Listen for OS system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// 1. Custom Smooth Cursor (Disabled as requested)
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const follower = document.getElementById('cursor-follower');
  if (dot) dot.remove();
  if (follower) follower.remove();
}

// 2. Real-time SMPTE Timecode Generator (24fps)
function initTimecode() {
  const timecodeElements = document.querySelectorAll('.dynamic-timecode');
  let frame = 12;
  let second = 24;
  let minute = 0;
  let hour = 0;

  setInterval(() => {
    frame++;
    if (frame >= 24) {
      frame = 0;
      second++;
      if (second >= 60) {
        second = 0;
        minute++;
        if (minute >= 60) {
          minute = 0;
          hour++;
        }
      }
    }
    const fStr = frame.toString().padStart(2, '0');
    const sStr = second.toString().padStart(2, '0');
    const mStr = minute.toString().padStart(2, '0');
    const hStr = hour.toString().padStart(2, '0');
    const tc = `${hStr}:${mStr}:${sStr}:${fStr}`;

    timecodeElements.forEach(el => {
      el.textContent = tc;
    });
  }, 1000 / 24);
}

// 3. Multi-Screen Navigation
function initNavigation() {
  const navLinks = document.querySelectorAll('[data-path]');
  const screens = document.querySelectorAll('.app-screen');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileOpenBtn = document.getElementById('mobile-menu-open');
  const mobileCloseBtn = document.getElementById('mobile-menu-close');

  if (mobileOpenBtn && mobileDrawer) {
    mobileOpenBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('translate-x-full');
    });
  }
  if (mobileCloseBtn && mobileDrawer) {
    mobileCloseBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('translate-x-full');
    });
  }

  function navigateTo(path) {
    const targetScreen = document.getElementById(`screen-${path}`);
    if (targetScreen && screens.length > 1) {
      screens.forEach(screen => {
        if (screen.id === `screen-${path}`) {
          screen.classList.remove('hidden');
          screen.classList.add('block');
        } else {
          screen.classList.add('hidden');
          screen.classList.remove('block');
        }
      });

      // Update active nav styling
      document.querySelectorAll('nav [data-path]').forEach(link => {
        const linkPath = link.getAttribute('data-path');
        if (linkPath === path) {
          link.classList.add('text-primary', 'font-semibold');
          link.classList.remove('text-on-surface-variant');
        } else {
          link.classList.remove('text-primary', 'font-semibold');
          link.classList.add('text-on-surface-variant');
        }
      });

      // Close mobile drawer if open
      if (mobileDrawer) {
        mobileDrawer.classList.add('translate-x-full');
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const pageMap = {
        'home': '/index.html',
        'my-course': '/my-course.html',
        'portfolio': '/portfolio.html',
        'contact': '/contact.html'
      };
      const targetUrl = pageMap[path] || `/${path}.html`;
      window.location.href = targetUrl;
    }
  }

  // Sync active navigation state with current page URL
  const pathname = window.location.pathname;
  let activePage = 'home';
  if (pathname.includes('my-course')) activePage = 'my-course';
  else if (pathname.includes('portfolio')) activePage = 'portfolio';
  else if (pathname.includes('contact')) activePage = 'contact';

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const path = link.getAttribute('data-path');
      const href = link.getAttribute('href');
      const targetScreen = path ? document.getElementById(`screen-${path}`) : null;

      // If user is already on this page and clicks its nav link, smooth scroll to top
      if (path === activePage && targetScreen) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (mobileDrawer) {
          mobileDrawer.classList.add('translate-x-full');
        }
        return;
      }

      // If linking to separate HTML page and screen is not on this page
      if (!targetScreen || screens.length <= 1) {
        if (href && (href.endsWith('.html') || href.startsWith('/'))) {
          return;
        }
        if (path) {
          e.preventDefault();
          navigateTo(path);
        }
        return;
      }

      if (path) {
        e.preventDefault();
        navigateTo(path);
      }
    });
  });

  document.querySelectorAll('nav [data-path]').forEach(link => {
    const linkPath = link.getAttribute('data-path');
    if (linkPath === activePage) {
      link.classList.add('text-primary', 'font-semibold');
      link.classList.remove('text-on-surface-variant');
    } else {
      link.classList.remove('text-primary', 'font-semibold');
      link.classList.add('text-on-surface-variant');
    }
  });

  document.querySelectorAll('#mobile-nav-drawer [data-path]').forEach(link => {
    const linkPath = link.getAttribute('data-path');
    if (linkPath === activePage) {
      link.classList.add('text-primary');
      link.classList.remove('text-on-surface-variant');
    } else {
      link.classList.remove('text-primary');
      link.classList.add('text-on-surface-variant');
    }
  });

  // Expose globally
  window.navigateToScreen = navigateTo;
}

// Global Toast System
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'fixed bottom-6 right-6 z-[200] px-4 py-3 rounded-lg bg-surface-container-high/95 backdrop-blur-2xl text-on-surface font-space text-xs border border-primary/30 shadow-2xl flex items-center gap-2 transition-all transform translate-y-12 opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
    <span>${message}</span>
  `;

  toast.classList.remove('translate-y-12', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-12', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3500);
}
window.showToast = showToast;

// 14. Technical Project Dossier Modal
function initDossierModal() {
  const modal = document.getElementById('dossier-modal');
  const closeBtn = document.getElementById('close-dossier-modal');
  const playCutBtn = document.getElementById('dossier-play-cut-btn');
  const triggers = document.querySelectorAll('.open-dossier-btn');

  const dossierData = {
    nissan: {
      title: "Nissan GT-R: Midnight Protocol",
      category: "COMMERCIAL AUTOMOTIVE",
      client: "Nissan Motor Corporation // Agency: TBWA\\Chiat\\Day",
      camera: "RED V-Raptor 8K VV",
      optics: "Cooke Anamorphic /i 2x",
      color: "ACEScc AP0 / DCI-P3",
      fps: "23.976 FPS Native",
      codec: "Apple ProRes 4444 XQ",
      audio: "24-Bit 48kHz -14 LUFS",
      treatment: "Raw footage comprised 6.2TB of cinema camera files. Pacing structure was engineered with a 128 BPM kinetic sync grid, combining speed-ramped whip transitions with optical flow interpolation for tire smoke particulate rendering.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcr_fzolGYyODN-7nJdWfRZuR2i43J2vRjEENtjUy7Ez9f5j7h5fkE2xTjE2B1kyc3Od0qYM7sIhvaVX4xgSNOt-AFCypV3H3tv3_NaE3bnXdg2br9Umftwy9s-5TddDeMpo1nBJTp-Iy-sVwV17aJfg7imPsaHLKgkeLxkbEwGOFk85WTsak3pkNTLbh8bervOQhPSklB5J6_0Cdltsy5liOjkipGyM4OkmM7J8iph5pHFwWe5WLs"
    },
    warner: {
      title: "Golden Echoes: Live at Royale",
      category: "MUSIC CONCERT LIVE",
      client: "Warner Records // Director: Julian Vance",
      camera: "ARRI Alexa 35 (14 Units)",
      optics: "ARRI Master Primes T1.3",
      color: "ARRI LogC4 to Rec.709 HDR",
      fps: "23.976 FPS Multicam",
      codec: "Avid DNxHR HQX 4K",
      audio: "5.1 Dolby Atmos + Stereo Mix",
      treatment: "14 camera angles live synchronized on an edit SAN. Suman mapped song tempo changes directly to cut frequencies, building an escalating kinetic tension throughout the 4-minute performance.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpHGmJXFf6ZAf8Rrt8eZgrHLowU2fXPBYwQWSufBpIIvk8hI0jTgxBAoQ-L6wVy6P8rGlw6Xp5rnd77uZ11GPJ9Elw9Vo4nYrgBm-zP9XuF6R7qBtgGWvVVD4no9KTJBZwI28i8rIGs3MVVhkri-CYIHmn0woeMrek_r8CPP62hIodGcQm4D2B8HlnwZBXvps8xedKfLg5uLiA2JdWXF0l65oWtnWbjuSQz1VA53KTI9vQYKIyiz2g"
    },
    aura: {
      title: "Aura: Haute Couture Fashion Film",
      category: "FASHION & 35MM CINEMA",
      client: "Paris Fashion Week // Studio Lin",
      camera: "ARRI 435 Photochemical 35mm",
      optics: "Super Baltar Vintage Glass",
      color: "Kodak 5219 / 2383 Emulation",
      fps: "48 FPS High Speed",
      codec: "ProRes 4444 12-Bit RGB",
      audio: "Ambient Drone & Silk ASMR Foley",
      treatment: "35mm photochemical film stocks scanned at 6.5K resolution. The color pipeline applied non-linear subtractive density curves to emulate vintage magazine editorial prints.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlYwsNQJrntYvf0k9pVNsjwgvZMoUjC1-JBPL_msgRg5rlfKexm5a-elqpJCFp-COoVSZMWmwwrsYjegUJF80Y5_Sup1_jS9zCUMfcYPAG80vte3gNIZsPAu0TJAe1vdNc73EVbfcFJQh4LP4L9RVmPhXXJXsIEyvrSuFYE2oMy94Zldv7KahJEgfuaXYosyMO8hCDnrEGnmLbI-twgNAG-2MYPtuoEY-XmjplXt-weT_0nU0k7-Ft"
    },
    nike: {
      title: "Nike Global: Relentless Anthem",
      category: "COMMERCIAL GLOBAL",
      client: "Nike EMEA // Wieden+Kennedy",
      camera: "Sony Venice 2 8K",
      optics: "Tribe7 Blackwing7",
      color: "ACEScc Custom Nike High-Key",
      fps: "60 FPS Variable",
      codec: "ProRes 422 HQ Broadcast",
      audio: "Aggressive Industrial Hip-Hop Stems",
      treatment: "48 individual athletes across 12 sports match-cut by action vectors. Whip transitions precisely masked with optical motion estimation.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxcW-fZPnjAWh_2wCCEJmb-Zin00p10GqmSU6YoCZJlspyXELQfaDOZo12i0xuJOhJqhmMATDQr-JxZqFtRrw7wCVZkGhh7x7eYn1tIgz6f50GNM7HaJLsMgkucd8aazIwGf81azTh1_kLbB-R_yOXQJgnCRFT7MWsLFQ_vibuKxICqJUZJTg-h7O_DrBhPZk7HTe_U759jeiQoiDJFPQe12N2hg0NJ0JMlr5B9n5ZfEkakfHQDo_m"
    },
    valkyrie: {
      title: "Aston Martin: Valkyrie Apex",
      category: "COLOR SCIENCE & AUTOMOTIVE",
      client: "Aston Martin Racing",
      camera: "ARRI Alexa Mini LF",
      optics: "Leitz Thalia Anamorphic",
      color: "Dolby Vision 4.0 1,000 Nits",
      fps: "23.976 FPS Master",
      codec: "ProRes 4444 XQ HDR",
      audio: "V12 Cosworth 11,000 RPM Telemetry",
      treatment: "Mastered in Dolby Vision with dual master passes for HDR10 and theatrical SDR. Isolated titanium exhaust heat glow utilizing narrow-band hue qualifiers.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSyALOg6EAXnoVRMDu0mGkkE_V45PLonx3J0DmLojsndtz4B04pqP4dZ32Xfv9CHGOhs8wlgAdOqlxbeiD7ogVVv7DByzSMJ2rkVP-NmCBfagBQBZklk_HGiXweI4yjsPC_BZT4ELW7lH3O0xzKJ9iDPefKTTu4zYmHVa_XBxZ_AL-MewiP81Poi8HRVDKerD8f4cNEMu8AiHKkRRl6iOBeGmWq4cp_e5kOruN7GlP6VQlAl5Q9c7L"
    },
    despierta: {
      title: "Despierta: Narrative Cut",
      category: "MUSIC NARRATIVE FILM",
      client: "Universal Music Latino",
      camera: "Arriflex 416 (Super 16mm)",
      optics: "Zeiss Super Speed Mk III",
      color: "Kodak 250D 7207 Film Scan",
      fps: "24 FPS Film Sync",
      codec: "ProRes 4444",
      audio: "Acoustic Vocal Stems & Rain Atmos",
      treatment: "Intimate character study moving between flashback and present day. Sound design strips all music at key dramatic peaks to intensify dialogue emotion.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuClzy_GGkTzTR0Y4BK2wu6EHlJQYpCV9JaKVqC0HNzJvMNz2Bhsf8xSsweR-Kxtu9SJvxXwNlIgwjzOgsHNE-HXOXREWdASeex6R1BInHknH5EqI3PJwjIpg6ezpFR083yIAXFs2nINUsYXKiewAtNxRkK3NnC0C0UJMGzapx-zFRsRwl8NLJsxRmqt2jmSGuh_g0bucifp9lrwdX_B2LI6iGK61OqVE2DAPI39ayAiUPb5QbDFSAmk"
    },
    apple: {
      title: "Apple: Titanium Symphony",
      category: "COMMERCIAL TECHNOLOGY",
      client: "Apple Inc. Worldwide // TBWA\\Media Arts Lab",
      camera: "RED Monstro 8K VV",
      optics: "Leica Summilux-C T1.4",
      color: "Apple Display P3 // ACEScc",
      fps: "60 FPS Master",
      codec: "ProRes 4444 XQ",
      audio: "Dolby Atmos 5.1 Acoustic CNC Stems",
      treatment: "Micro-machined acoustic sync with CNC titanium milling rhythms. Audio stems were recorded with ultra-sensitive condenser arrays and balanced with ultrasonic harmonics to make metal feel palpable on consumer earphones.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwja6j1cVjFO_RA-Eazchg8knmebni4ho6W49rYFmyH1Y9F7kJFN03nQb05lZfqEYykYVOsOQUs-RLdFZydgo7nTzVQT6pXIqIpsj5jlpuoFpWq88iETBFznkIhJl8eKpOixSQXuVVmOHnKroxAkXVQYXw4guoov9OLeuI5MFvWAwyD0yA-Tj7B6URdbqbBgf6JzYVBIm7FZ7BVBuqgpt4-oixhP8bgn0jRP8Tp0D2TTchA5jry-1w"
    },
    prada: {
      title: "Prada: Velvet Shadows",
      category: "HAUTE COUTURE FASHION FILM",
      client: "Prada Milano // Director: Matteo Rossi",
      camera: "Panavision Millennium XL2 (35mm)",
      optics: "Panavision Primo Anamorphic",
      color: "Kodak Vision3 500T 5219 Emulation",
      fps: "24 FPS Theatrical",
      codec: "Apple ProRes 4444 12-Bit RGB",
      audio: "Milan Nocturnal Rain ASMR & Sub-bass",
      treatment: "Captured on 35mm motion picture film stock in Milan during night exterior downpours. The color suite engineered custom highlight halation around neon reflections and maintained rich black shadow density without clipping.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlYwsNQJrntYvf0k9pVNsjwgvZMoUjC1-JBPL_msgRg5rlfKexm5a-elqpJCFp-COoVSZMWmwwrsYjegUJF80Y5_Sup1_jS9zCUMfcYPAG80vte3gNIZsPAu0TJAe1vdNc73EVbfcFJQh4LP4L9RVmPhXXJXsIEyvrSuFYE2oMy94Zldv7KahJEgfuaXYosyMO8hCDnrEGnmLbI-twgNAG-2MYPtuoEY-XmjplXt-weT_0nU0k7-Ft"
    },
    kendrick: {
      title: "Mirage Echoes: Official MV",
      category: "MUSIC VIDEO CINEMATIC",
      client: "pgLang / Interscope Records",
      camera: "ARRI Alexa 35 & Phantom Flex 4K",
      optics: "Atlas Orion Anamorphic 2x",
      color: "ACEScc Bleach Bypass & High Contrast",
      fps: "1000 FPS Phantom Ramps",
      codec: "Avid DNxHR HQX 12-Bit",
      audio: "Multi-Track Master Hip-Hop Stems",
      treatment: "Extreme frame-rate transitions between 1,000 FPS Phantom slomo explosion impacts and 24 FPS hand-held choreography. MTV Video Music Awards Best Editing Nominee 2024.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpHGmJXFf6ZAf8Rrt8eZgrHLowU2fXPBYwQWSufBpIIvk8hI0jTgxBAoQ-L6wVy6P8rGlw6Xp5rnd77uZ11GPJ9Elw9Vo4nYrgBm-zP9XuF6R7qBtgGWvVVD4no9KTJBZwI28i8rIGs3MVVhkri-CYIHmn0woeMrek_r8CPP62hIodGcQm4D2B8HlnwZBXvps8xedKfLg5uLiA2JdWXF0l65oWtnWbjuSQz1VA53KTI9vQYKIyiz2g"
    }
  };

  let currentProject = null;

  triggers.forEach(t => {
    t.addEventListener('click', () => {
      const projId = t.getAttribute('data-project-id') || 'nissan';
      const data = dossierData[projId] || dossierData.nissan;
      currentProject = data;

      document.getElementById('dossier-title').textContent = data.title;
      document.getElementById('dossier-category').textContent = data.category;
      document.getElementById('dossier-client').textContent = data.client;
      document.getElementById('dossier-camera').textContent = data.camera;
      document.getElementById('dossier-optics').textContent = data.optics;
      document.getElementById('dossier-color').textContent = data.color;
      document.getElementById('dossier-fps').textContent = data.fps;
      document.getElementById('dossier-codec').textContent = data.codec;
      document.getElementById('dossier-audio').textContent = data.audio;
      document.getElementById('dossier-treatment').textContent = data.treatment;

      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }

  if (playCutBtn) {
    playCutBtn.addEventListener('click', () => {
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      if (currentProject) {
        const screenModal = document.getElementById('screening-modal');
        const modalTitle = document.getElementById('modal-title-text');
        const modalImage = document.getElementById('modal-img-target');
        if (modalTitle) modalTitle.textContent = currentProject.title;
        if (modalImage) modalImage.src = currentProject.img;
        if (screenModal) {
          screenModal.classList.remove('hidden');
          screenModal.classList.add('flex');
        }
      }
    });
  }
}

function initCurriculumModal() {
  const modal = document.getElementById('curriculum-modal');
  const closeBtn = document.getElementById('close-curriculum-modal');
  const titleEl = document.getElementById('curriculum-title');
  const codeEl = document.getElementById('curriculum-code');
  const durationEl = document.getElementById('curriculum-duration');
  const descEl = document.getElementById('curriculum-desc');
  const listEl = document.getElementById('curriculum-lessons-list');

  if (!modal) return;

  document.querySelectorAll('.open-curriculum-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modId = btn.getAttribute('data-module-id');
      const data = moduleData[modId] || moduleData[1];

      if (titleEl) titleEl.textContent = data.title;
      if (codeEl) codeEl.textContent = data.code;
      if (durationEl) durationEl.textContent = data.duration;
      if (descEl) descEl.textContent = data.description;

      if (listEl) {
        listEl.innerHTML = data.lessons.map(l => `
          <div class="flex items-center justify-between p-space-sm rounded bg-surface-container hover:bg-surface-container-high transition-colors">
            <div class="flex items-center gap-space-xs">
              <span class="material-symbols-outlined text-primary text-sm">play_circle</span>
              <span class="font-body-md text-body-sm text-on-surface">${l}</span>
            </div>
            <span class="font-technical-data text-technical-data text-secondary">HD 4K</span>
          </div>
        `).join('');
      }

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }
}

function setupWiper(containerId, overlayId, handleId) {
  const container = document.getElementById(containerId);
  const overlay = document.getElementById(overlayId);
  const handle = document.getElementById(handleId);
  if (!container || !overlay || !handle) return;

  const overlayImg = overlay.querySelector('img');

  function syncImageDimensions() {
    if (overlayImg && container) {
      const cWidth = container.clientWidth;
      const cHeight = container.clientHeight;
      if (cWidth > 0) {
        overlayImg.style.width = `${cWidth}px`;
        overlayImg.style.maxWidth = `${cWidth}px`;
        overlayImg.style.minWidth = `${cWidth}px`;
      }
      if (cHeight > 0) {
        overlayImg.style.height = `${cHeight}px`;
      }
    }
  }

  syncImageDimensions();
  window.addEventListener('resize', syncImageDimensions);

  let isWiping = false;

  function move(clientX) {
    const rect = container.getBoundingClientRect();
    let pos = (clientX - rect.left) / rect.width;
    if (pos < 0.02) pos = 0.02;
    if (pos > 0.98) pos = 0.98;
    const pct = (pos * 100).toFixed(2);
    overlay.style.width = `${pct}%`;
    handle.style.left = `${pct}%`;
  }

  container.addEventListener('click', (e) => {
    move(e.clientX);
  });

  container.addEventListener('mousedown', (e) => {
    isWiping = true;
    move(e.clientX);
  });
  window.addEventListener('mouseup', () => { isWiping = false; });
  window.addEventListener('mousemove', (e) => {
    if (!isWiping) return;
    move(e.clientX);
  });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    isWiping = true;
    if (e.touches[0]) move(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', () => { isWiping = false; });
  window.addEventListener('touchmove', (e) => {
    if (!isWiping) return;
    if (e.touches[0]) move(e.touches[0].clientX);
  }, { passive: true });
}

// Universal Video Play Button Auto-Hide Engine (Across Entire Website)
function initGlobalVideoAutoHide() {
  function getPlayElements(video) {
    const parent = video.closest('.slider-3d-card, #hero-reel-wrapper, .portfolio-item-card, #screening-modal, .group, .relative') || video.parentElement;
    if (!parent) return { parent: null, elements: [] };
    const elements = Array.from(parent.querySelectorAll(`
      .slider-video-play-btn,
      #hero-reel-play-btn,
      #modal-play-btn,
      .card-play-overlay,
      .card-play-icon,
      .reel-inline-play-btn,
      .reel-play-icon,
      [id*="play-btn"],
      [class*="play-btn"],
      [class*="play-overlay"]
    `));
    return { parent, elements };
  }

  function hidePlayUI(video) {
    const { parent, elements } = getPlayElements(video);
    if (parent) parent.classList.add('video-is-playing');
    elements.forEach(el => {
      el.classList.add('video-btn-hidden', 'opacity-0', 'pointer-events-none');
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';
    });
  }

  function showPlayUI(video) {
    const { parent, elements } = getPlayElements(video);
    if (parent) parent.classList.remove('video-is-playing');
    elements.forEach(el => {
      el.classList.remove('video-btn-hidden', 'opacity-0', 'pointer-events-none');
      el.style.opacity = '';
      el.style.visibility = '';
      el.style.pointerEvents = '';
      const icon = el.querySelector('.material-symbols-outlined') || (el.classList.contains('material-symbols-outlined') ? el : null);
      if (icon) icon.textContent = 'play_arrow';
    });
  }

  // Use capture phase (true) because HTML5 play/pause/ended don't bubble
  document.addEventListener('play', (e) => {
    if (e.target && e.target.tagName === 'VIDEO') {
      hidePlayUI(e.target);
    }
  }, true);

  document.addEventListener('pause', (e) => {
    if (e.target && e.target.tagName === 'VIDEO') {
      showPlayUI(e.target);
    }
  }, true);

  document.addEventListener('ended', (e) => {
    if (e.target && e.target.tagName === 'VIDEO') {
      showPlayUI(e.target);
    }
  }, true);

  // Global click-to-pause on playing videos
  document.addEventListener('click', (e) => {
    if (e.target && e.target.tagName === 'VIDEO') {
      const vid = e.target;
      if (!vid.paused) {
        vid.pause();
        showPlayUI(vid);
      }
    }
  }, true);

  // Check initial state of all videos on page load
  const allVideos = document.querySelectorAll('video');
  allVideos.forEach(v => {
    if (!v.paused) {
      hidePlayUI(v);
    } else {
      showPlayUI(v);
    }
  });
}

// Universal Director's Cut Screening Modal
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
    if (playPauseBtn) {
      playPauseBtn.classList.remove('opacity-0', 'pointer-events-none', 'video-btn-hidden');
      playPauseBtn.style.opacity = '';
      playPauseBtn.style.visibility = '';
    }
    if (playIcon) playIcon.textContent = 'play_arrow';
    modal.classList.remove('video-is-playing');
  }

  function updateModalPlayUI(playing) {
    if (playIcon) playIcon.textContent = playing ? 'pause' : 'play_arrow';
    if (playPauseBtn) {
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
            updateModalPlayUI(true);
          }).catch(() => {
            updateModalPlayUI(false);
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

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (modalVideo && !modalVideo.classList.contains('hidden')) {
        if (modalVideo.paused) {
          modalVideo.play().then(() => {
            updateModalPlayUI(true);
            showToast('Playback Resumed');
          }).catch(() => {});
        } else {
          modalVideo.pause();
          updateModalPlayUI(false);
          showToast('Playback Paused');
        }
      }
    });
  }

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

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      stopModalVideo();
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });
}

// Automatically initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initGlobalVideoAutoHide();
      initScreeningModal();
    });
  } else {
    initGlobalVideoAutoHide();
    initScreeningModal();
  }
}

export {
  initThemeToggle,
  initCursor,
  initTimecode,
  initNavigation,
  showToast,
  initDossierModal,
  initCurriculumModal,
  setupWiper,
  initScreeningModal,
  initGlobalVideoAutoHide
};
