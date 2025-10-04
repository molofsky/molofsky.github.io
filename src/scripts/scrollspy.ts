(() => {
  const nav = document.getElementById("topnav");
  if (!nav) return;

  const links = Array.from(
    nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
  );

  const sectionIds = links
    .map((a) => a.getAttribute("href"))
    .filter(Boolean)
    .map((h) => h!.slice(1));

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => !!el);

  const hero = document.getElementById("hero");

  const setActive = (id: string | null) => {
    links.forEach((l) => l.setAttribute("data-active", "false"));
    if (!id) return;
    const link = nav.querySelector<HTMLAnchorElement>(`a[href="#${id}"]`);
    if (link) link.setAttribute("data-active", "true");
  };

  // Track visibility ratios so we can pick the dominant section
  const visibleRatios = new Map<string, number>();

  const pickAndSet = () => {
    if (visibleRatios.size === 0) return;
    let bestId = "";
    let bestRatio = 0;
    for (const [id, r] of visibleRatios) {
      if (r > bestRatio) {
        bestRatio = r;
        bestId = id;
      }
    }
    if (bestId) {
      setActive(bestId);
      history.replaceState(null, "", `#${bestId}`);
    }
  };

  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        // If the HERO is visible, clear all highlights (we’re “above sections”)
        if (e.target.id === "hero") {
          if (e.isIntersecting && e.intersectionRatio > 0.25) {
            visibleRatios.clear();
            setActive(null);
            history.replaceState(null, "", "#");
          }
          continue;
        }

        // Track ratios for non-hero sections
        const id = (e.target as HTMLElement).id;
        if (e.isIntersecting) {
          visibleRatios.set(id, e.intersectionRatio);
        } else {
          visibleRatios.delete(id);
        }
      }
      pickAndSet();
    },
    {
      // Bias toward the middle of the viewport
      rootMargin: "-40% 0px -50% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    }
  );

  // Observe hero (to clear) and each content section (to highlight)
  if (hero) obs.observe(hero);
  sections.forEach((s) => obs.observe(s));

  // Extra safety: at the very top, clear everything
  const onScrollTopClear = () => {
    if (window.scrollY < 8) {
      visibleRatios.clear();
      setActive(null);
    }
  };
  window.addEventListener("scroll", onScrollTopClear, { passive: true });
  onScrollTopClear();
})();