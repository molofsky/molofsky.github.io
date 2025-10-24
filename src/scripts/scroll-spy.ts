// src/scripts/scroll-spy.ts
let _installed = false;

export default function initScrollSpy() {
  if (_installed) return; // idempotent
  _installed = true;

  const sections = Array.from(
    document.querySelectorAll<HTMLElement>('section[id][data-spy="section"]')
  );
  const linkMap = new Map<string, HTMLAnchorElement>();

  document.querySelectorAll<HTMLAnchorElement>('a[data-scrollspy]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) linkMap.set(href.slice(1), a);
  });

  const setActive = (id?: string) => {
    // clear all
    linkMap.forEach((a) => a.setAttribute('data-active', 'false'));
    // set chosen
    if (id && linkMap.get(id)) linkMap.get(id)!.setAttribute('data-active', 'true');
  };

  const getOffsetTop = (el: HTMLElement) => {
    // robust offsetTop (handles nested offsets)
    let top = 0;
    let node: HTMLElement | null = el;
    while (node) {
      top += node.offsetTop || 0;
      node = node.offsetParent as HTMLElement | null;
    }
    return top;
  };

  // recompute section tops on resize/content changes
  let tops: { id: string; top: number }[] = [];
  const recompute = () => {
    tops = sections.map((s) => ({ id: s.id, top: getOffsetTop(s) }));
    tops.sort((a, b) => a.top - b.top);
  };
  recompute();

  // The “focus line”: a point in the viewport we use for deciding which section is active.
  // 35% down from the top feels natural with a sticky header.
  const FOCUS_RATIO = 0.30;

  const update = () => {
    const focusY = window.scrollY + window.innerHeight * FOCUS_RATIO;

    // pick the last section whose top is above the focus line
    let currentId: string | undefined = undefined;
    for (const s of tops) {
      if (focusY >= s.top) currentId = s.id;
      else break;
    }

    setActive(currentId);
  };

  // Initial paint
  update();

  // Events
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => {
    recompute();
    update();
  });

  // Hash navigation support
  window.addEventListener('hashchange', () => {
    // allow browser to jump, then recompute and update
    requestAnimationFrame(() => {
      recompute();
      update();
    });
  });

  // If content loads later (fonts/images), re-measure once more
  window.addEventListener('load', () => {
    recompute();
    update();
  });

  // Debug (optional)
  // console.log('[scroll-spy] sections:', sections.length, 'links:', linkMap.size);
}