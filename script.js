document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const modal = document.getElementById('achievementModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalClose = document.querySelector('.modal-close');
  let lastModalTrigger = null;

  const setTheme = theme => {
    const isDark = theme === 'dark';
    if (isDark) html.setAttribute('data-theme', 'dark');
    else html.removeAttribute('data-theme');
    themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    themeToggle.setAttribute('aria-label', isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
    themeToggle.title = isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap';
  };

  const savedTheme = localStorage.getItem('theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(savedTheme || systemTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  });

  const setMenuState = isOpen => {
    hamburger.classList.toggle('active', isOpen);
    navMenu.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  };

  hamburger.addEventListener('click', () => setMenuState(!navMenu.classList.contains('active')));
  document.querySelectorAll('.nav-menu a').forEach(link => link.addEventListener('click', () => setMenuState(false)));

  const openAchievementModal = trigger => {
    const card = trigger.closest('.achievement-card');
    modalImage.src = card.dataset.image;
    modalImage.alt = card.dataset.title;
    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.description;
    lastModalTrigger = trigger;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modalClose.focus());
  };

  const closeAchievementModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastModalTrigger) lastModalTrigger.focus();
  };

  document.querySelectorAll('.achievement-card').forEach(card => {
    card.querySelectorAll('.preview-btn, .achievement-preview-btn').forEach(trigger => {
      trigger.addEventListener('click', () => openAchievementModal(trigger));
    });
  });

  modalClose.addEventListener('click', closeAchievementModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeAchievementModal();
  });

  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('active')) return;
    if (event.key === 'Escape') closeAchievementModal();
    if (event.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const revealElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(element => observer.observe(element));
  } else revealElements.forEach(element => element.classList.add('visible'));

  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const navSections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

  const updateActiveNav = () => {
    let activeId = navSections[0]?.id;
    navSections.forEach(section => {
      if (section.getBoundingClientRect().top <= 120) activeId = section.id;
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`));
  };

  updateActiveNav();
  window.addEventListener('scroll', updateActiveNav, { passive: true });
});
