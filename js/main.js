(() => {
  const root = document.documentElement;
  const body = document.body;
  const toggle = document.querySelector('#theme-toggle');
  const menuToggle = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#site-nav');
  const progress = document.querySelector('#scroll-progress');

  if (localStorage.getItem('portfolio-theme') === 'dark') body.classList.add('dark');
  const updateThemeLabel = () => toggle?.setAttribute('aria-label', body.classList.contains('dark') ? 'Switch to light mode' : 'Switch to dark mode');
  updateThemeLabel();
  toggle?.addEventListener('click', () => { body.classList.toggle('dark'); localStorage.setItem('portfolio-theme', body.classList.contains('dark') ? 'dark' : 'light'); updateThemeLabel(); });

  const setMenu = (open) => { nav?.classList.toggle('is-open', open); menuToggle?.setAttribute('aria-expanded', String(open)); menuToggle?.querySelector('b')?.replaceChildren(document.createTextNode(open ? 'Close navigation' : 'Open navigation')); };
  menuToggle?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  const updateProgress = () => { const max = document.documentElement.scrollHeight - window.innerHeight; if (progress) progress.style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`; };
  window.addEventListener('scroll', updateProgress, { passive: true }); updateProgress();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) { const observer = new IntersectionObserver((entries, current) => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); current.unobserve(entry.target); } }), { threshold: .1 }); revealItems.forEach(item => observer.observe(item)); } else revealItems.forEach(item => item.classList.add('visible'));

  const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) { const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) links.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`)); }), { rootMargin: '-25% 0px -65% 0px' }); sections.forEach(section => navObserver.observe(section)); }

  const year = document.querySelector('#year'); if (year) year.textContent = new Date().getFullYear();
})();
