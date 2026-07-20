/* ========================================
   PORTOFOLIO - INTERAKSI & ANIMASI
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== DARK / LIGHT MODE =====
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Cek localStorage atau preferensi sistem
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    html.setAttribute('data-theme', 'dark');
  }
  
  themeToggle.addEventListener('click', () => {
    if (html.getAttribute('data-theme') === 'dark') {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
  
  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Tutup menu saat link diklik (mobile)
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
  
  // ===== SCROLL ANIMATION (Fade In) =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
  
  // ===== NAVBAR ACTIVE STATE =====
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const navSections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const updateActiveNav = () => {
    let activeId = navSections[0]?.id;

    navSections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;

      if (sectionTop <= 120) {
        activeId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
  };

  updateActiveNav();
  window.addEventListener('scroll', updateActiveNav);
  
});
