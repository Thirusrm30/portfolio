(() => {
  const root = document.documentElement;
  const body = document.body;
  const toggle = document.querySelector('#theme-toggle');
  const menuToggle = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#site-nav');
  const progress = document.querySelector('#scroll-progress');

  const storedTheme = localStorage.getItem('portfolio-theme');
  if (storedTheme === 'dark') body.classList.add('dark');
  const updateThemeLabel = () => {
    const dark = body.classList.contains('dark');
    toggle?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    root.style.colorScheme = dark ? 'dark' : 'light';
  };
  updateThemeLabel();
  toggle?.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('portfolio-theme', body.classList.contains('dark') ? 'dark' : 'light');
    updateThemeLabel();
  });

  const setMenu = (open) => {
    nav?.classList.toggle('is-open', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.querySelector('b')?.replaceChildren(document.createTextNode(open ? 'Close navigation' : 'Open navigation'));
  };
  menuToggle?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, current) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); current.unobserve(entry.target); } });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (finePointer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('pointermove', (event) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
      const a = document.querySelector('.ambient-a');
      const b = document.querySelector('.ambient-b');
      if (a) a.style.transform = `translate(${event.clientX * -.018}px, ${event.clientY * .012}px)`;
      if (b) b.style.transform = `translate(${event.clientX * .012}px, ${event.clientY * -.01}px)`;
    }, { passive: true });

    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(900px) rotateX(${y * -2.5}deg) rotateY(${x * 3.5}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const trackedSections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-30% 0px -55% 0px' });
    trackedSections.forEach((section) => navObserver.observe(section));
  }

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
