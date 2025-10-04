const hero = document.getElementById("hero");
if (hero) {
  const onScroll = () => {
    const y = window.scrollY;
    // start fading after 20px, fully faded around 260px
    const opacity = Math.max(0, 1 - (y - 20) / 240);
    hero.style.opacity = String(Math.min(1, opacity));
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}