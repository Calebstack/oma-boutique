/* ================================================================
   OMA BOUTIQUE — MAIN JAVASCRIPT
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------  PRELOADER  --------- */
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('hidden'), 600);

  /* ---------  AOS INIT  --------- */
  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 800,
      easing: 'ease-out-cubic',
      offset: 60,
    });
  }

  /* ---------  NAVBAR SCROLL  --------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------  BACK TO TOP  --------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------  MOBILE MENU  --------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------  ACTIVE NAV HIGHLIGHT  --------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---------  COUNTER ANIMATION  --------- */
  const counters = document.querySelectorAll('.stat-number');
  const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    update();
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ---------  GALLERY FILTER  --------- */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryGrid  = document.getElementById('galleryGrid');

  const filterGallery = (category) => {
    galleryItems.forEach(item => {
      const match = category === 'all' || item.dataset.category === category;
      if (match) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      filterGallery(btn.dataset.filter);
    });
  });

  // Allow service cards to trigger filter
  document.querySelectorAll('.service-card[data-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      const target = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
      if (target) {
        target.classList.add('active');
        filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === target)));
      }
      filterGallery(cat);
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------  LIGHTBOX  --------- */
  const lightbox        = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose   = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-zoom').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.gallery-card');
      const image = card.querySelector('.gallery-img');
      const title = card.querySelector('.gallery-overlay h3').textContent;
      const desc = card.querySelector('.gallery-overlay p').textContent;
      const enlargedImage = document.createElement('img');
      enlargedImage.src = image.src;
      enlargedImage.alt = image.alt;
      const heading = document.createElement('h3');
      heading.textContent = title;
      const description = document.createElement('p');
      description.textContent = desc;
      lightboxContent.replaceChildren(enlargedImage, heading, description);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------  TESTIMONIALS SLIDER  --------- */
  const track    = document.getElementById('testimonialTrack');
  const cards    = track.querySelectorAll('.testimonial-card');
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  let current    = 0;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show client review ${i + 1}`);
    dot.setAttribute('aria-current', String(i === 0));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.slider-dot');

  const goTo = (index) => {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === current)));
  };

  prevBtn.addEventListener('click', () => goTo(current > 0 ? current - 1 : cards.length - 1));
  nextBtn.addEventListener('click', () => goTo(current < cards.length - 1 ? current + 1 : 0));

  // Auto-slide
  let autoSlide = setInterval(() => {
    goTo(current < cards.length - 1 ? current + 1 : 0);
  }, 5000);

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      goTo(current < cards.length - 1 ? current + 1 : 0);
    }, 5000);
  });

  /* ---------  SMOOTH SCROLL FOR ALL ANCHORS  --------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------  CONTACT FORM  --------- */
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #4CAF50, #388E3C)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });

});
