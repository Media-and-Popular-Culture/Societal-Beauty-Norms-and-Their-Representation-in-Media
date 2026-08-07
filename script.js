/* =============================================================================
   FROM EVERYDAY NORM TO INSTITUTIONAL CHANGE — SCRIPT
   Gender and Society Performance Task | Group CZA
   =============================================================================

   HOW TO EDIT THIS FILE (read me first!)
   -----------------------------------------------------------------------------
   You should NOT need to touch this file to update content — text, images
   and cards are all edited in index.html. This file only controls BEHAVIOUR
   (menus, animations, counters, theme switching...).

   The file is split into small, independent functions, one per feature, each
   with a short comment explaining what it does. They are all called together
   at the very bottom, inside the "Init" section. If you want to turn a
   feature off, just comment out its line in that section.
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================ 1. Preloader =============================== */
  // Hides the loading screen once the page has fully loaded.
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('is-hidden'), 400);
    });
    // Safety net: hide it anyway after 2.5s even if 'load' is slow to fire.
    setTimeout(() => preloader.classList.add('is-hidden'), 2500);
  }

  /* ======================= 2. Scroll Progress Bar =========================== */
  // Fills the thin bar at the top of the page based on scroll position.
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = percent + '%';
    };
    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
  }

  /* ============ 3. Navbar: solid-on-scroll + active link highlight ========== */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.navbar__link');
    const sections = document.querySelectorAll('main section[id]');
    if (!navbar) return;

    // Toggle solid background after scrolling past a small threshold.
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
    onScroll();

    // Highlight the nav link matching the section currently in view.
    if ('IntersectionObserver' in window && sections.length) {
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            links.forEach((link) => {
              link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

      sections.forEach((section) => navObserver.observe(section));
    }
  }

  /* ============================ 4. Mobile Menu =============================== */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    const closeMenu = () => {
      hamburger.classList.remove('is-active');
      navLinks.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    };

    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close the menu whenever a link is tapped (mobile UX nicety).
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  }

  /* ============================ 5. Theme Switcher ============================= */
  // Dark mode is the default. Preference is remembered with localStorage.
  function initThemeSwitcher() {
    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const saved = localStorage.getItem('gender-audit-theme');

    if (saved === 'light') root.setAttribute('data-theme', 'light');

    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      if (isLight) {
        root.removeAttribute('data-theme');
        localStorage.setItem('gender-audit-theme', 'dark');
        showToast('Switched to dark mode');
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('gender-audit-theme', 'light');
        showToast('Switched to light mode');
      }
    });
  }

  /* ===================== 6. Scroll Reveal (Intersection Observer) ============= */
  // Fades/slides elements marked [data-animate] into place as they enter view.
  function initScrollReveal() {
    const targets = document.querySelectorAll('[data-animate]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target); // animate once, then stop watching
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    targets.forEach((el) => revealObserver.observe(el));
  }

  /* ============================ 7. Animated Counters =========================== */
  // Counts each .stat__number up to its data-count value once it scrolls in.
  function initCounters() {
    const counters = document.querySelectorAll('.stat__number');
    if (!counters.length) return;

    const animateCount = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
      return;
    }

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ============================ 8. Typing Animation ============================ */
  // Types out the hero subtitle one character at a time.
  function initTypingAnimation() {
    const el = document.getElementById('typedSubtitle');
    if (!el) return;
    const fullText = el.textContent.trim();
    el.textContent = '';

    let i = 0;
    const type = () => {
      if (i <= fullText.length) {
        el.textContent = fullText.slice(0, i);
        i++;
        setTimeout(type, 55);
      }
    };
    setTimeout(type, 600); // small delay so it starts after the title fades in
  }

  /* ===================== 9. Four-Lens "Read More" Expand/Collapse ============= */
  function initLensToggles() {
    document.querySelectorAll('.lens-card__toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.lens-card');
        const expanded = card.classList.toggle('is-expanded');
        const label = btn.querySelector('.toggle-label');
        label.textContent = expanded ? 'Read Less' : 'Read More';
      });
    });
  }

  /* ================================ 10. FAQ Accordion =========================== */
  function initAccordion() {
    document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion__item');
        const isOpen = item.classList.contains('is-open');

        // Close every item, then open the clicked one (classic accordion behaviour).
        item.parentElement.querySelectorAll('.accordion__item').forEach((el) => {
          el.classList.remove('is-open');
          el.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ============================== 11. Ripple Effect ============================= */
  // Adds a Material-style ripple to any element with [data-ripple].
  function initRipple() {
    document.querySelectorAll('[data-ripple]').forEach((el) => {
      el.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);

        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }

  /* ============================== 12. Back To Top ================================ */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => btn.classList.toggle('is-visible', window.scrollY > 600));
    }, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ============================ 13. Toast Notifications ========================== */
  // Reusable toast function — call showToast('message') from anywhere in this file.
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<span class="toast__dot" aria-hidden="true"></span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-leaving');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
  }

  /* ========================== 14. Copy Email (Contact) ============================ */
  function initCopyEmail() {
    const btn = document.getElementById('copyEmailBtn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email');
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Copied ${email} to clipboard`);
      } catch (err) {
        showToast('Could not copy automatically — email: ' + email);
      }
    });
  }

  /* ========================= 15. Footer Year (auto-updates) ======================= */
  function initFooterYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ============================ 16. Floating Particles ============================= */
  // Generates a handful of small floating dots inside the hero background.
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const PARTICLE_COUNT = 18; // kept low on purpose for performance
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const dot = document.createElement('span');
      dot.className = 'particle';

      const size = Math.random() * 3 + 2; // 2–5px
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.bottom = `-${Math.random() * 20}px`;
      dot.style.animationDuration = `${Math.random() * 10 + 10}s`;
      dot.style.animationDelay = `${Math.random() * 10}s`;

      container.appendChild(dot);
    }
  }

  /* ======================== 17. Hero Parallax (mouse + scroll) ===================== */
  // Moves the blobs and aperture rings subtly for a sense of depth.
  function initParallax() {
    const hero = document.querySelector('.hero');
    const blobs = document.querySelectorAll('.blob');
    const aperture = document.querySelector('.aperture');
    if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Mouse-based parallax (desktop only)
    if (matchMedia('(hover: hover)').matches) {
      hero.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        requestAnimationFrame(() => {
          blobs.forEach((blob, i) => {
            const strength = (i + 1) * 6;
            blob.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
          });
          if (aperture) aperture.style.transform = `translateY(-50%) translate(${x * -10}px, ${y * -10}px)`;
        });
      });
    }

    // Scroll-based parallax: hero background drifts slower than the page.
    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const offset = window.scrollY * 0.25;
        const bg = document.querySelector('.hero__bg');
        if (bg && window.scrollY < window.innerHeight) {
          bg.style.transform = `translateY(${offset}px)`;
        }
      });
    }, { passive: true });
  }

  /* ============================= 18. Custom Cursor ================================== */
  function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const glow = document.getElementById('cursorGlow');
    if (!dot || !glow) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return; // skip on touch

    let glowX = 0, glowY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      targetX = e.clientX;
      targetY = e.clientY;
    });

    // Glow trails the cursor with slight easing for a soft, premium feel.
    const animateGlow = () => {
      glowX += (targetX - glowX) * 0.08;
      glowY += (targetY - glowY) * 0.08;
      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
      requestAnimationFrame(animateGlow);
    };
    animateGlow();

    // Slightly enlarge the dot over clickable elements.
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => dot.style.transform = 'translate(-50%, -50%) scale(2.2)');
      el.addEventListener('mouseleave', () => dot.style.transform = 'translate(-50%, -50%) scale(1)');
    });
  }

  /* ===================== 19. Auth, Guest Access & Admin Mode ======================
     A lightweight account system for a static, no-backend site.

     IMPORTANT LIMITATIONS (read before relying on this in production):
     - There is no server here, so everything is stored in THIS BROWSER's
       localStorage. It's per-device: an account made on one visitor's phone
       will not show up for another visitor, or in the admin panel on a
       different device. Real cross-visitor accounts and a real admin
       dashboard require a backend + database (e.g. a Vercel Serverless
       Function talking to Supabase/Firebase/Postgres).
     - Passwords are never stored or shown in plain text — only a SHA-256
       hash is kept, purely to check a login attempt. The admin panel can
       suspend, block or delete an account, but it cannot reveal anyone's
       actual password.
     - The admin login itself is a fixed username/password checked in this
       file, which — like anything client-side — is technically readable by
       anyone who views the page source. That's an inherent limit of a
       static site with no backend; treat it as a light lock, not a vault.
  ================================================================================= */
  function initAuthSystem() {
    const LS_USERS = 'gaUsers';
    const LS_MESSAGES = 'gaMessages';
    const LS_SESSION = 'gaSession';
    const ADMIN_USERNAME = 'itsnxvi';
    const ADMIN_PASSWORD = 'akoadmin';

    const accountBtn = document.getElementById('accountBtn');
    const authModal = document.getElementById('authModal');
    const adminModal = document.getElementById('adminModal');
    if (!accountBtn || !authModal || !adminModal) return;

    const authModalClose = document.getElementById('authModalClose');
    const adminModalClose = document.getElementById('adminModalClose');
    const authView = document.getElementById('authView');
    const authLoggedInView = document.getElementById('authLoggedInView');
    const authLoggedInName = document.getElementById('authLoggedInName');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    const authTabLogin = document.getElementById('authTabLogin');
    const authTabRegister = document.getElementById('authTabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');
    const authSkipBtn = document.getElementById('authSkipBtn');

    const adminTabUsers = document.getElementById('adminTabUsers');
    const adminTabMessages = document.getElementById('adminTabMessages');
    const adminPanelUsers = document.getElementById('adminPanelUsers');
    const adminPanelMessages = document.getElementById('adminPanelMessages');
    const adminUsersTable = document.getElementById('adminUsersTable');
    const adminMessagesTable = document.getElementById('adminMessagesTable');

    const messageForm = document.getElementById('messageForm');

    /* ---------- storage helpers ---------- */
    const getUsers = () => JSON.parse(localStorage.getItem(LS_USERS) || '[]');
    const saveUsers = (list) => localStorage.setItem(LS_USERS, JSON.stringify(list));
    const getMessages = () => JSON.parse(localStorage.getItem(LS_MESSAGES) || '[]');
    const saveMessages = (list) => localStorage.setItem(LS_MESSAGES, JSON.stringify(list));
    const getSession = () => JSON.parse(localStorage.getItem(LS_SESSION) || 'null');
    const setSession = (session) => localStorage.setItem(LS_SESSION, JSON.stringify(session));

    async function hashPassword(plain) {
      const bytes = new TextEncoder().encode(plain);
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    /* ---------- modal open/close ---------- */
    const openModal = (modal) => { modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); };
    const closeModal = (modal) => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); };

    function switchAuthTab(tab) {
      const isLogin = tab === 'login';
      authTabLogin.classList.toggle('is-active', isLogin);
      authTabRegister.classList.toggle('is-active', !isLogin);
      authTabLogin.setAttribute('aria-selected', String(isLogin));
      authTabRegister.setAttribute('aria-selected', String(!isLogin));
      loginForm.hidden = !isLogin;
      registerForm.hidden = isLogin;
      loginError.textContent = '';
      registerError.textContent = '';
    }
    authTabLogin.addEventListener('click', () => switchAuthTab('login'));
    authTabRegister.addEventListener('click', () => switchAuthTab('register'));

    function openAccount() {
      const session = getSession();
      if (session && session.type === 'admin') {
        renderAdminPanel();
        openModal(adminModal);
        return;
      }
      if (session && session.type === 'user') {
        authView.hidden = true;
        authLoggedInView.hidden = false;
        authLoggedInName.textContent = session.username;
      } else {
        authView.hidden = false;
        authLoggedInView.hidden = true;
        switchAuthTab('login');
      }
      openModal(authModal);
    }

    accountBtn.addEventListener('click', openAccount);
    authModalClose.addEventListener('click', () => closeModal(authModal));
    adminModalClose.addEventListener('click', () => closeModal(adminModal));
    [authModal, adminModal].forEach((modal) => {
      modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
    });

    authSkipBtn.addEventListener('click', () => {
      if (!getSession()) setSession({ type: 'guest' });
      closeModal(authModal);
    });

    /* ---------- nav button appearance ---------- */
    function refreshAccountButton() {
      const session = getSession();
      const isAdmin = !!(session && session.type === 'admin');
      accountBtn.classList.toggle('is-admin', isAdmin);
      if (isAdmin) accountBtn.setAttribute('aria-label', 'Admin mode');
      else if (session && session.type === 'user') accountBtn.setAttribute('aria-label', `Account: ${session.username}`);
      else accountBtn.setAttribute('aria-label', 'Log in');
    }

    /* ---------- login ---------- */
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.textContent = '';
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        setSession({ type: 'admin' });
        refreshAccountButton();
        closeModal(authModal);
        showToast('Welcome back — admin mode unlocked');
        loginForm.reset();
        return;
      }

      const user = getUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
      if (!user) { loginError.textContent = 'No account found with that username.'; return; }
      if (user.status === 'blocked') { loginError.textContent = 'This account has been blocked.'; return; }
      if (user.status === 'suspended') { loginError.textContent = 'This account is currently suspended.'; return; }

      const hash = await hashPassword(password);
      if (hash !== user.passHash) { loginError.textContent = 'Incorrect password.'; return; }

      setSession({ type: 'user', username: user.username });
      refreshAccountButton();
      closeModal(authModal);
      showToast(`Welcome back, ${user.username}`);
      loginForm.reset();
    });

    /* ---------- register ---------- */
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      registerError.textContent = '';
      const username = document.getElementById('registerUsername').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value;

      if (username.toLowerCase() === ADMIN_USERNAME) { registerError.textContent = 'That username is reserved.'; return; }
      const users = getUsers();
      if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
        registerError.textContent = 'That username is already taken.';
        return;
      }

      const passHash = await hashPassword(password);
      users.push({ username, email, passHash, status: 'active', createdAt: Date.now() });
      saveUsers(users);

      setSession({ type: 'user', username });
      refreshAccountButton();
      closeModal(authModal);
      showToast('Account created — you\'re logged in');
      registerForm.reset();
    });

    /* ---------- logout ---------- */
    logoutBtn.addEventListener('click', () => {
      setSession({ type: 'guest' });
      refreshAccountButton();
      closeModal(authModal);
      showToast('Logged out');
    });
    adminLogoutBtn.addEventListener('click', () => {
      setSession({ type: 'guest' });
      refreshAccountButton();
      closeModal(adminModal);
      showToast('Logged out of admin mode');
    });

    /* ---------- admin: tabs ---------- */
    function switchAdminTab(tab) {
      const isUsers = tab === 'users';
      adminTabUsers.classList.toggle('is-active', isUsers);
      adminTabMessages.classList.toggle('is-active', !isUsers);
      adminTabUsers.setAttribute('aria-selected', String(isUsers));
      adminTabMessages.setAttribute('aria-selected', String(!isUsers));
      adminPanelUsers.hidden = !isUsers;
      adminPanelMessages.hidden = isUsers;
    }
    adminTabUsers.addEventListener('click', () => switchAdminTab('users'));
    adminTabMessages.addEventListener('click', () => switchAdminTab('messages'));

    /* ---------- admin: render users ---------- */
    function renderAdminUsers() {
      const users = getUsers();
      if (!users.length) {
        adminUsersTable.innerHTML = '<p class="admin-row__empty">No visitors have registered an account on this device yet.</p>';
        return;
      }
      adminUsersTable.innerHTML = users.map((u, i) => `
        <div class="admin-row">
          <div class="admin-row__main">
            <div class="admin-row__title">${escapeHtml(u.username)} <span class="status-badge status-badge--${u.status}">${u.status}</span></div>
            <div class="admin-row__meta">${escapeHtml(u.email || 'no email on file')} &middot; joined ${new Date(u.createdAt).toLocaleDateString()}</div>
          </div>
          <div class="admin-row__actions">
            ${u.status === 'suspended'
              ? `<button data-action="reinstate" data-index="${i}">Reinstate</button>`
              : `<button data-action="suspend" data-index="${i}">Suspend</button>`}
            ${u.status === 'blocked'
              ? `<button data-action="unblock" data-index="${i}">Unblock</button>`
              : `<button data-action="block" data-index="${i}">Block</button>`}
            <button class="is-danger" data-action="delete" data-index="${i}">Delete</button>
          </div>
        </div>
      `).join('');
    }

    adminUsersTable.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const users = getUsers();
      const idx = Number(btn.getAttribute('data-index'));
      const user = users[idx];
      if (!user) return;
      const action = btn.getAttribute('data-action');

      if (action === 'suspend') user.status = 'suspended';
      if (action === 'reinstate') user.status = 'active';
      if (action === 'block') user.status = 'blocked';
      if (action === 'unblock') user.status = 'active';
      if (action === 'delete') {
        users.splice(idx, 1);
        saveUsers(users);
        renderAdminUsers();
        showToast('Account deleted');
        return;
      }
      saveUsers(users);
      renderAdminUsers();
      showToast(`Account ${action === 'reinstate' || action === 'unblock' ? 'restored' : action + 'ed'}`);
    });

    /* ---------- admin: render messages ---------- */
    function renderAdminMessages() {
      const messages = getMessages();
      if (!messages.length) {
        adminMessagesTable.innerHTML = '<p class="admin-row__empty">No messages submitted on this device yet.</p>';
        return;
      }
      adminMessagesTable.innerHTML = messages.slice().reverse().map((m, i) => {
        const realIndex = messages.length - 1 - i;
        return `
        <div class="admin-row">
          <div class="admin-row__main">
            <div class="admin-row__title">${escapeHtml(m.name)}</div>
            <div class="admin-row__meta">${escapeHtml(m.email)} &middot; ${new Date(m.date).toLocaleString()}</div>
            <div class="admin-row__meta">${escapeHtml(m.message)}</div>
          </div>
          <div class="admin-row__actions">
            <button data-copy-email="${escapeHtml(m.email)}">Copy Email</button>
            <button class="is-danger" data-delete-message="${realIndex}">Delete</button>
          </div>
        </div>`;
      }).join('');
    }

    adminMessagesTable.addEventListener('click', async (e) => {
      const copyBtn = e.target.closest('button[data-copy-email]');
      if (copyBtn) {
        const email = copyBtn.getAttribute('data-copy-email');
        try { await navigator.clipboard.writeText(email); showToast(`Copied ${email}`); }
        catch { showToast('Could not copy — email: ' + email); }
        return;
      }
      const delBtn = e.target.closest('button[data-delete-message]');
      if (delBtn) {
        const messages = getMessages();
        messages.splice(Number(delBtn.getAttribute('data-delete-message')), 1);
        saveMessages(messages);
        renderAdminMessages();
      }
    });

    function renderAdminPanel() {
      renderAdminUsers();
      renderAdminMessages();
      switchAdminTab('users');
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = String(str == null ? '' : str);
      return div.innerHTML;
    }

    /* ---------- contact "message us" form ---------- */
    if (messageForm) {
      messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('messageName').value.trim();
        const email = document.getElementById('messageEmail').value.trim();
        const body = document.getElementById('messageBody').value.trim();
        if (!name || !email || !body) return;

        const messages = getMessages();
        messages.push({ name, email, message: body, date: Date.now() });
        saveMessages(messages);

        messageForm.reset();
        showToast('Message sent — thanks for reaching out!');
      });
    }

    /* ---------- first-visit prompt ---------- */
    refreshAccountButton();
    if (!getSession()) {
      setTimeout(() => openAccount(), 1400);
    }
  }

  /* ================================== Init ========================================== */
  // Every feature is wired up here. Comment a line out to disable that feature.
  initPreloader();
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initThemeSwitcher();
  initScrollReveal();
  initCounters();
  initTypingAnimation();
  initLensToggles();
  initAccordion();
  initRipple();
  initBackToTop();
  initCopyEmail();
  initFooterYear();
  initParticles();
  initParallax();
  initCustomCursor();
  initAuthSystem();
});
