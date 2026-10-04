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

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
