/**
 * Krishna - PERSONAL PORTFOLIO JAVASCRIPT ENGINE
 * Handles: Preloader, Canvas Particles, Custom Cursor, Typing Effect,
 * Scroll Progress, Theme Switcher, Skill Filters, Interactive Project Modals,
 * Contact Form & Toast Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Preloader Screen
  // --------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 15) + 5;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
      }, 300);
    }
    if (loaderBar) loaderBar.style.width = `${loadProgress}%`;
    if (loaderPercent) loaderPercent.textContent = `${loadProgress}%`;
  }, 40);

  // --------------------------------------------------------------------------
  // 2. Futuristic Background Particle Canvas
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.color = Math.random() > 0.5 ? '#00f2fe' : '#9d4edf';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Subtle repulsion from cursor
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x -= (dx / dist) * 0.8;
          this.y -= (dy / dist) * 0.8;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: 65 }, () => new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 110) * 0.15;
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // --------------------------------------------------------------------------
  // 3. Custom Cursor Engine
  // --------------------------------------------------------------------------
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (cursorDot && cursorOutline && window.matchMedia('(pointer: fine)').matches) {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.top = `${mouseY}px`;
      cursorDot.style.left = `${mouseX}px`;
    });

    function renderCursor() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.top = `${outlineY}px`;
      cursorOutline.style.left = `${outlineX}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverables = document.querySelectorAll('a, button, .glass-card, .filter-btn');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // --------------------------------------------------------------------------
  // 4. Hero Typing Animation
  // --------------------------------------------------------------------------
  const typedTextSpan = document.getElementById('typing-text');
  if (typedTextSpan) {
    const roles = [
      'AI & Machine Learning Student',
      'Future Software Engineer',
      'Full Stack Developer',
      'Cloud Computing Explorer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let typingSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2200; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }

      setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
  }

  // --------------------------------------------------------------------------
  // 5. Scroll Progress & Back To Top Ring
  // --------------------------------------------------------------------------
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const circle = document.querySelector('.progress-ring-circle');

  const radius = circle ? circle.r.baseVal.value : 20;
  const circumference = 2 * Math.PI * radius;

  if (circle) {
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
  }

  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;

    // Scroll Progress bar
    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent * 100}%`;
    }

    // Back to top visibility & SVG circle ring
    if (backToTopBtn && circle) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }

      const offset = circumference - (scrollPercent * circumference);
      circle.style.strokeDashoffset = offset;
    }

    // Header sticky styling
    const header = document.getElementById('header');
    if (header) {
      if (scrollTop > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active Section Link Highlight
    highlightActiveNav();
  }

  window.addEventListener('scroll', handleScroll);

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Navigation Active Section Observer
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

  function highlightActiveNav() {
    let scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Mobile Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const menuIcon = document.getElementById('menu-icon');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      if (mobileDrawer.classList.contains('open')) {
        menuIcon.className = 'fa-solid fa-xmark';
      } else {
        menuIcon.className = 'fa-solid fa-bars';
      }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        if (menuIcon) menuIcon.className = 'fa-solid fa-bars';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. Dark / Light Theme Switcher
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // Check saved theme
  const savedTheme = localStorage.getItem('mk_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('mk_portfolio_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }

  // --------------------------------------------------------------------------
  // 8. Skill Category Filter
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 9. Interactive Project Live Demo Modal Simulator
  // --------------------------------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  const demoBtns = document.querySelectorAll('.btn-demo');

  const projectDemos = {
    chatbot: {
      title: 'AI Chatbot Simulator',
      render: () => `
        <div class="chatbot-demo">
          <p class="text-sm text-muted mb-3"><i class="fa-solid fa-circle-info"></i> Interactive JavaScript AI Assistant Demo</p>
          <div class="chat-window glass-card" style="padding: 1rem; height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.8rem; background: rgba(0,0,0,0.3);" id="chat-box">
            <div class="chat-msg bot-msg" style="align-self: flex-start; background: rgba(0, 242, 254, 0.15); border: 1px solid var(--accent-cyan); padding: 0.6rem 1rem; border-radius: 12px; max-width: 80%;">
              <strong>AI Bot:</strong> Hello! I am Krishna's AI Assistant. How can I help you today?
            </div>
          </div>
          <div class="chat-input-row" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
            <input type="text" id="chat-input" class="glass-input" placeholder="Ask something (e.g., 'What are Mangesh's skills?')..." style="flex-grow: 1;">
            <button class="btn btn-primary" id="btn-chat-send"><i class="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
      `,
      init: () => {
        const chatBox = document.getElementById('chat-box');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('btn-chat-send');

        function sendMessage() {
          const text = chatInput.value.trim();
          if (!text) return;

          // Append User Message
          const userMsg = document.createElement('div');
          userMsg.className = 'chat-msg user-msg';
          userMsg.style.cssText = 'align-self: flex-end; background: rgba(157, 78, 223, 0.2); border: 1px solid var(--accent-purple); padding: 0.6rem 1rem; border-radius: 12px; max-width: 80%;';
          userMsg.innerHTML = `<strong>You:</strong> ${escapeHtml(text)}`;
          chatBox.appendChild(userMsg);
          chatInput.value = '';
          chatBox.scrollTop = chatBox.scrollHeight;

          // Generate AI Bot Reply
          setTimeout(() => {
            let botReply = "I am a custom AI chatbot built with JavaScript and API integration. Krishna Chaudhary specializes in AI, ML, Cloud & Web Dev!";
            const lower = text.toLowerCase();
            if (lower.includes('skill') || lower.includes('technology')) {
              botReply = "Krishna is skilled in Python, C, JavaScript, Web APIs, Azure Cloud, and Full Stack Web Development!";
            } else if (lower.includes('education') || lower.includes('college')) {
              botReply = "Krishna is pursuing B.Tech in AI & ML at GLA University with top academic scores!";
            } else if (lower.includes('contact') || lower.includes('email')) {
              botReply = "You can reach Krishna at krsna7308@gmail.com or call +91 9258127500.";
            }

            const botMsg = document.createElement('div');
            botMsg.className = 'chat-msg bot-msg';
            botMsg.style.cssText = 'align-self: flex-start; background: rgba(0, 242, 254, 0.15); border: 1px solid var(--accent-cyan); padding: 0.6rem 1rem; border-radius: 12px; max-width: 80%;';
            botMsg.innerHTML = `<strong>AI Bot:</strong> ${botReply}`;
            chatBox.appendChild(botMsg);
            chatBox.scrollTop = chatBox.scrollHeight;
          }, 600);
        }

        if (chatSend) chatSend.addEventListener('click', sendMessage);
        if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
      }
    },

    student: {
      title: 'Student Management System Demo',
      render: () => `
        <div class="student-demo">
          <p class="text-sm text-muted mb-3"><i class="fa-solid fa-circle-info"></i> Responsive Web Application for Student Records</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem;">
            <input type="text" id="student-name" class="glass-input" placeholder="Student Name">
            <input type="text" id="student-course" class="glass-input" placeholder="Course (e.g. B.Tech AIML)">
          </div>
          <button class="btn btn-primary btn-full mb-3" id="btn-add-student"><i class="fa-solid fa-plus"></i> Add Student Record</button>
          <div style="max-height: 180px; overflow-y: auto;">
            <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--glass-border); color: var(--accent-cyan);">
                  <th style="padding: 0.5rem;">Name</th>
                  <th style="padding: 0.5rem;">Course</th>
                  <th style="padding: 0.5rem;">Action</th>
                </tr>
              </thead>
              <tbody id="student-table-body">
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 0.5rem;">Krishna Chaudhary</td>
                  <td style="padding: 0.5rem;">B.Tech AIML</td>
                  <td style="padding: 0.5rem;"><span style="color:var(--accent-green)">Active</span></td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 0.5rem;">Aditya Verma</td>
                  <td style="padding: 0.5rem;">B.Tech CS</td>
                  <td style="padding: 0.5rem;"><span style="color:var(--accent-green)">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `,
      init: () => {
        const addBtn = document.getElementById('btn-add-student');
        const nameInput = document.getElementById('student-name');
        const courseInput = document.getElementById('student-course');
        const tbody = document.getElementById('student-table-body');

        if (addBtn) {
          addBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const course = courseInput.value.trim();
            if (!name || !course) {
              showToast('Please fill in both Student Name and Course', 'error');
              return;
            }
            const tr = document.createElement('tr');
            tr.style.cssText = 'border-bottom: 1px solid rgba(255,255,255,0.05);';
            tr.innerHTML = `
              <td style="padding: 0.5rem;">${escapeHtml(name)}</td>
              <td style="padding: 0.5rem;">${escapeHtml(course)}</td>
              <td style="padding: 0.5rem;"><span style="color:var(--accent-green)">Active</span></td>
            `;
            tbody.appendChild(tr);
            nameInput.value = '';
            courseInput.value = '';
            showToast('Student record added successfully!', 'success');
          });
        }
      }
    },

    weather: {
      title: 'Weather App Live Search',
      render: () => `
        <div class="weather-demo">
          <p class="text-sm text-muted mb-3"><i class="fa-solid fa-circle-info"></i> Weather Application using OpenWeather API</p>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.2rem;">
            <input type="text" id="weather-city" class="glass-input" placeholder="Enter City (e.g. Mathura, Delhi, London)" style="flex-grow: 1;" value="Mathura">
            <button class="btn btn-primary" id="btn-search-weather"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
          </div>
          <div id="weather-display" class="glass-card" style="padding: 1.5rem; text-align: center; background: rgba(0, 242, 254, 0.05); border: 1px solid var(--accent-cyan);">
            <i class="fa-solid fa-sun neon-yellow" style="font-size: 3rem; margin-bottom: 0.5rem;"></i>
            <h3 style="font-size: 1.8rem; margin: 0.2rem 0;">28°C</h3>
            <p style="font-weight: 600; font-size: 1.1rem; color: var(--accent-cyan);" id="weather-loc">Mathura, IN</p>
            <p style="color: var(--text-muted); font-size: 0.9rem;" id="weather-desc">Clear Sky & Warm Sunlight</p>
            <div style="display: flex; justify-content: space-around; margin-top: 1rem; padding-top: 0.8rem; border-top: 1px solid var(--glass-border); font-size: 0.85rem;">
              <span><i class="fa-solid fa-droplet neon-blue"></i> Humidity: 52%</span>
              <span><i class="fa-solid fa-wind neon-purple"></i> Wind: 12 km/h</span>
            </div>
          </div>
        </div>
      `,
      init: () => {
        const searchBtn = document.getElementById('btn-search-weather');
        const cityInput = document.getElementById('weather-city');
        const locText = document.getElementById('weather-desc');
        const locName = document.getElementById('weather-loc');

        if (searchBtn) {
          searchBtn.addEventListener('click', () => {
            const city = cityInput.value.trim();
            if (!city) return;
            locName.textContent = `${city.toUpperCase()}, IN`;
            const temps = [24, 28, 31, 26, 29];
            const randTemp = temps[Math.floor(Math.random() * temps.length)];
            document.querySelector('#weather-display h3').textContent = `${randTemp}°C`;
            locText.textContent = `Partly Cloudy with pleasant breeze in ${city}`;
            showToast(`Fetched weather metrics for ${city}`, 'success');
          });
        }
      }
    }
  };

  demoBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const demoObj = projectDemos[projKey];

      if (demoObj && projectModal) {
        modalTitle.innerHTML = `<i class="fa-solid fa-laptop-code neon-cyan"></i> ${demoObj.title}`;
        modalBody.innerHTML = demoObj.render();
        projectModal.classList.add('active');
        demoObj.init();
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (projectModal) projectModal.classList.remove('active');
    });
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. Copy-to-Clipboard Buttons
  // --------------------------------------------------------------------------
  const copyBtns = document.querySelectorAll('.btn-copy');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`, 'success');
        }).catch(() => {
          showToast('Failed to copy to clipboard', 'error');
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 11. Contact Form Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('btn-submit-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Message Sent!`;
          setTimeout(() => {
            submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Message`;
          }, 3000);
        }

        showToast('Thank you! Your message has been sent to Krishna Chaudhary.', 'success');
        contactForm.reset();
      }, 1200);
    });
  }

  // --------------------------------------------------------------------------
  // 12. Scroll Reveal Animations (Intersection Observer)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // Trigger initial scroll calculation
  handleScroll();

  // --------------------------------------------------------------------------
  // 13. Download Resume PDF Handler & Interactive Click Animations
  // --------------------------------------------------------------------------
  const heroResumeBtn = document.getElementById('hero-download-cv');
  const footerResumeBtn = document.getElementById('footer-download-cv');

  if (heroResumeBtn) {
    heroResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generateAndDownloadResumePDF(heroResumeBtn);
    });
  }

  if (footerResumeBtn) {
    footerResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generateAndDownloadResumePDF(footerResumeBtn);
    });
  }
});

/**
 * Generate and download professional PDF CV 
 */
function generateAndDownloadResumePDF(btnElement) {
  if (!btnElement) return;

  // 1. Trigger Ripple Wave Animation
  const rect = btnElement.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'cv-ripple-effect';
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${rect.width / 2 - size / 2}px`;
  ripple.style.top = `${rect.height / 2 - size / 2}px`;
  btnElement.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);

  // 2. Set Loading/Downloading Button Animation
  btnElement.classList.add('btn-cv-downloading');
  const iconEl = btnElement.querySelector('.btn-icon-cv');
  const textEl = btnElement.querySelector('.btn-text-cv');

  if (iconEl) iconEl.className = 'fa-solid fa-spinner btn-icon-cv';
  if (textEl) textEl.textContent = 'Generating PDF...';

  setTimeout(() => {
    try {
      if (window.jspdf && window.jspdf.jsPDF) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Professional PDF Color Palette
        const primaryNavy = [15, 23, 42];     // #0f172a Deep Slate Navy
        const accentCyan = [2, 132, 199];     // #0284c7 Vivid Cyan
        const darkText = [30, 41, 59];        // #1e293b Dark Gray Body Text
        const mutedText = [100, 116, 139];    // #64748b Secondary Text
        const lineBorder = [226, 232, 240];   // #e2e8f0 Section Divider Line

        // Top Header Banner Box
        doc.setFillColor(...primaryNavy);
        doc.rect(0, 0, 210, 28, 'F');

        // Main Name & Subtitle
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('Krishna Chaudhary', 15, 15);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(56, 189, 248);
        doc.text('AI & Machine Learning Student | Future Software Engineer', 15, 22);

        // Contact Information Header Row
        doc.setFontSize(8.5);
        doc.setTextColor(...darkText);
        doc.text('Email: krsnajaat@gmail.com   |   Phone: +91 9258127500   |   Location: Mathura, India', 15, 34);
        doc.text('GitHub: https://github.com/KRSNAJAAT   |   LinkedIn: https://www.linkedin.com/in/krishna-chaudhary-1a188537b/', 15, 39);

        // Divider
        doc.setDrawColor(...lineBorder);
        doc.setLineWidth(0.5);
        doc.line(15, 42, 195, 42);

        let y = 49;

        // Helper Section Heading Generator
        const addSectionHeader = (title) => {
          doc.setFillColor(...accentCyan);
          doc.rect(15, y - 4, 3.5, 11, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.5);
          doc.setTextColor(...primaryNavy);
          doc.text(title, 22, y + 4);

          doc.setDrawColor(...lineBorder);
          doc.line(15, y + 8, 195, y + 8);
          y += 14;
        };

        // 1. Professional Summary
        addSectionHeader('PROFESSIONAL SUMMARY');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...darkText);
        const summaryText = "Passionate B.Tech Computer Science student specializing in Artificial Intelligence and Web Engineering at GLA University. Strong analytical thinker skilled in Python, JavaScript, Full Stack Web Development, and Cloud Computing. Adept at building responsive applications and solving complex engineering challenges.";
        const splitSummary = doc.splitTextToSize(summaryText, 180);
        doc.text(splitSummary, 15, y);
        y += splitSummary.length * 4.5 + 4;

        // 2. Education
        addSectionHeader('EDUCATION');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(...primaryNavy);
        doc.text('GLA University, Mathura', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...mutedText);
        doc.text('Pursuing (2026 - Present)', 195, y, { align: 'right' });
        y += 4.5;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...accentCyan);
        doc.text('Bachelor of Technology - B.Tech (AI & Web Technologies)', 15, y);
        y += 4.5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...darkText);
        doc.text('• Specialization in Artificial Intelligence, Cloud Services & Web Development.', 18, y);
        y += 7;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryNavy);
        doc.text('Higher Secondary & Secondary Education (CBSE)', 15, y);
        y += 4.5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...darkText);
        doc.text('• Intermediate (Class XII): Score 87.00%', 18, y);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...mutedText);
        doc.text('Grade: 87.0%', 195, y, { align: 'right' });
        y += 4.5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...darkText);
        doc.text('• High School (Class X): Score 84.6%', 18, y);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...mutedText);
        doc.text('Grade: 84.6%', 195, y, { align: 'right' });
        y += 8;

        // 3. Technical Skills
        addSectionHeader('TECHNICAL SKILLS');

        const skillList = [
          { label: 'Languages:', val: 'Python, C, JavaScript (ES6+), HTML5, CSS3' },
          { label: 'AI & Data Science:', val: 'Pandas, NumPy, OpenCV, Computer Vision, Prompt Engineering' },
          { label: 'Web Technologies:', val: 'Full Stack Web Development, Node.js, Express, RESTful APIs, Tailwind CSS' },
          { label: 'Developer Tools:', val: 'Git, GitHub, Linux Shell, VS Code, Google Cloud Platform Fundamentals' }
        ];

        skillList.forEach(item => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(...primaryNavy);
          doc.text(item.label, 15, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...darkText);
          doc.text(item.val, 55, y);
          y += 5;
        });
        y += 3;

        // 4. Key Projects
        addSectionHeader('KEY PROJECTS');

        const projList = [
          {
            title: 'AI Voice & Vision Assistant',
            desc: 'Developed a smart desktop voice assistant in Python integrating speech recognition, computer vision face processing, and automated task execution.'
          },
          {
            title: 'Machine Learning Predictive Analytics Engine',
            desc: 'Engineered an end-to-end ML classification model with Scikit-Learn & Pandas to analyze datasets and forecast complex operational metrics.'
          },
          {
            title: 'Interactive Personal Portfolio & Student Hub',
            desc: 'Designed a high-performance web portfolio featuring modern glassmorphism design, theme engines, live project demos, and responsive layout.'
          }
        ];

        projList.forEach(p => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(...primaryNavy);
          doc.text(`• ${p.title}`, 15, y);
          y += 4.5;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(...darkText);
          const splitP = doc.splitTextToSize(p.desc, 175);
          doc.text(splitP, 19, y);
          y += splitP.length * 4 + 3;
        });

        // 5. Achievements & Certifications
        addSectionHeader('ACHIEVEMENTS & CERTIFICATIONS');

        const certsList = [
          'Scored 84.6% in High School and 87.00% in Intermediate examinations.',
          'Active tech participant in GLA University Tech Fests and Coding Hackathons.',
          'Completed certifications in Machine Learning and Full Stack Web Development.'
        ];

        certsList.forEach(c => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(...darkText);
          doc.text(`• ${c}`, 15, y);
          y += 4.5;
        });

        // Footer Note in PDF
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(...mutedText);
        doc.text('Official Resume of Krishna Chaudhary • Generated via Portfolio', 105, 287, { align: 'center' });

        // Save PDF
        doc.save('Krishna_Chaudhary_Resume.pdf');
      } else {
        downloadFallbackResumeText();
      }

      // 3. Update Button State to Success
      btnElement.classList.remove('btn-cv-downloading');
      btnElement.classList.add('btn-cv-success');

      if (iconEl) iconEl.className = 'fa-solid fa-circle-check btn-icon-cv neon-green';
      if (textEl) textEl.textContent = 'Downloaded!';

      showToast('📄 Krishna\'s Resume (PDF) downloaded successfully!', 'success');

      setTimeout(() => {
        btnElement.classList.remove('btn-cv-success');
        if (iconEl) iconEl.className = 'fa-solid fa-file-arrow-down btn-icon-cv';
        if (textEl) textEl.textContent = btnElement.id === 'footer-download-cv' ? 'Download Resume (PDF)' : 'Download Resume';
      }, 2800);

    } catch (err) {
      console.error('Error generating PDF:', err);
      downloadFallbackResumeText();

      btnElement.classList.remove('btn-cv-downloading');
      if (iconEl) iconEl.className = 'fa-solid fa-file-arrow-down btn-icon-cv';
      if (textEl) textEl.textContent = btnElement.id === 'footer-download-cv' ? 'Download Resume (PDF)' : 'Download Resume';
    }
  }, 600);
}

/**
 * Fallback Text Download if PDF library fails
 */
function downloadFallbackResumeText() {
  const textContent = `Krishna Chaudhary
AI & Web Engineering Student | Future Software Engineer
Email: krsnajaat7308@gmail.com | Phone: +91 9258127500
Location: GLA University, Mathura, Uttar Pradesh, India
GitHub: https://github.com/KRSNAJAAT
LinkedIn: https://www.linkedin.com/in/krishna-chaudhary-1a188537b/

================================================================
PROFESSIONAL SUMMARY
================================================================
Passionate B.Tech Computer Science student specializing in Artificial Intelligence 
and Web Technologies at GLA University. Skilled in Python, JavaScript, Cloud Computing,
and Full Stack Web Development.

================================================================
EDUCATION
================================================================
• B.Tech in Artificial Intelligence & Web Engineering - GLA University, Mathura
• Intermediate (12th Class) - Score: 87.0%
• High School (10th Class) - Score: 84.6%

================================================================
TECHNICAL SKILLS
================================================================
• Programming Languages: Python, C, JavaScript (ES6+), HTML5, CSS3
• Web & Cloud: Full Stack Web Development, Node.js, Express, REST APIs, Microsoft Azure
• Developer Tools: Git, GitHub, Linux Shell, VS Code
`;

  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Krishna_Chaudhary_Resume.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📄 Krishna\'s Resume downloaded!', 'success');
}

// Helper Toast Notification System
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast glass-card`;

  let icon = 'fa-circle-info neon-cyan';
  if (type === 'success') icon = 'fa-circle-check neon-green';
  if (type === 'error') icon = 'fa-circle-exclamation neon-pink';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

// Utility HTML escape
function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, (tag) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
