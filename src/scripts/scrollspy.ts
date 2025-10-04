// Adds .active to the nav link whose section is in view
const nav = document.getElementById("topnav");
if (nav) {
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a[href^='#']"));
  const ids = links.map(a => a.getAttribute("href")!.slice(1));
  const sections = ids
    .map(id => document.getElementById(id))
    .filter(Boolean) as HTMLElement[];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      const link = nav.querySelector<HTMLAnchorElement>(`a[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        // update hash without jumping
        history.replaceState(null, "", `#${id}`);
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}