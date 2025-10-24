// src/scripts/init-scrollspy-client.ts
import initScrollSpy from './scroll-spy.ts';

window.addEventListener('astro:page-load', () => initScrollSpy()); // SPA nav
window.addEventListener('DOMContentLoaded', () => initScrollSpy()); // initial load
initScrollSpy(); // just in case (idempotent)