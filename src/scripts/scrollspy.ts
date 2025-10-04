// src/scripts/scrollspy.ts
(() => {
  const nav = document.getElementById('topnav') as HTMLElement | null;
  if (!nav) return;

  const links = Array.from(
    nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
  );
  const ids = links.map(a => a.getAttribute('href')!.slice(1));
  const sections = ids
    .map(id => document.getElementById(id))
    .filter((el): el is HTMLElement => !!el);

  const clear = () => links.forEach(l => l.setAttribute('data-active', 'false'));

  const onIntersect: IntersectionObserverCallback = (entries) => {
    // while near the very top, keep nothing highlighted
    if (window.scrollY < 200) { clear(); return; }

    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const link = nav.querySelector<HTMLAnchorElement>(`a[href="#${e.target.id}"]`);
      if (!link) continue;
      clear();
      link.setAttribute('data-active', 'true');
      // update hash without creating history entries
      history.replaceState(null, '', `#${e.target.id}`);
    }
  };

  const obs = new IntersectionObserver(onIntersect, {
    rootMargin: '-45% 0px -50% 0px',
    threshold: 0,
  });

  sections.forEach(s => obs.observe(s));
})();