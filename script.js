/* ============================================================
   VANTARIA PVT. LTD. — CORPORATE JAVASCRIPT
   Interactive Navigation, Scroll Animations, & Form Handling
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ----- Loading Overlay -----
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  });
  // Fallback if load event already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  }

  // ----- Navbar Scroll Effect -----
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Navbar solid background on scroll
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link based on scroll position
    updateActiveNavLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ----- Back to Top -----
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----- Mobile Navigation -----
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Mobile dropdown toggle
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const hasDropdown = item.querySelector('.mega-menu') || item.querySelector('.dropdown-menu');

    if (hasDropdown && link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          item.classList.toggle('mobile-open');
          // Close other open items
          navItems.forEach(other => {
            if (other !== item) other.classList.remove('mobile-open');
          });
        }
      });
    }
  });

  // Close mobile menu on link click
  navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ----- Smooth Scroll for Anchor Links -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = 80; // Nav height
        const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ----- Active Nav Link -----
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // ----- Scroll Reveal Animations (Intersection Observer) -----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ----- Counter Animation (Hero Stats) -----
  function animateCounters() {
    const counters = document.querySelectorAll('.hero-stat .number');
    counters.forEach(counter => {
      const text = counter.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      let current = 0;
      const increment = Math.ceil(target / 40);
      const duration = 1500;
      const step = duration / (target / increment);

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = current + suffix;
      }, step);
    });
  }

  // Trigger counter animation when hero section is visible
  const heroSection = document.querySelector('.hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        heroObserver.unobserve(heroSection);
      }
    }, { threshold: 0.3 });
    heroObserver.observe(heroSection);
  }

  // ----- Parallax Effect on Hero Background -----
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
      }
    }, { passive: true });
  }

});

// ----- Contact Form Handler -----
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const originalText = btn.innerHTML;

  // Simulate submission
  btn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="animation: spin 1s linear infinite;">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="50 20" fill="none"/>
    </svg>
    Submitting...
  `;
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" style="fill: #10b981;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
      Inquiry Submitted Successfully
    `;
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    btn.style.opacity = '1';

    // Reset after 3s
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
      e.target.reset();
    }, 3000);
  }, 1500);
}

// Add spin animation dynamically
const style = document.createElement('style');
style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(style);
