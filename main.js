/* DRK Digital – Verhalten: Header-Schatten, Mobile-Menü, Scroll-Einblendung.
   Kein Tracking, keine externen Aufrufe. Läuft unter strikter CSP (script-src 'self'). */
(function () {
  'use strict';

  var BREAKPOINT = '(min-width: 901px)'; /* muss zum Header-Breakpoint in styles.css passen */

  /* Sticky-Header: Schatten beim Scrollen */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () { header.classList.toggle('header--scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile-Menü */
  var btn = document.querySelector('.mobile-menu-btn');
  var nav = document.getElementById('mobile-nav');
  if (btn && nav) {
    var isOpen = function () { return nav.classList.contains('open'); };
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    };
    btn.addEventListener('click', function () { setOpen(!isOpen()); });
    nav.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { setOpen(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (isOpen() && !nav.contains(e.target) && !btn.contains(e.target)) setOpen(false);
    });
    var mq = window.matchMedia(BREAKPOINT);
    var onChange = function (ev) { if (ev.matches && isOpen()) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }

  /* Scroll-Einblendung (.fade-up). Nach der Einblendung werden die Klassen entfernt,
     damit Hover-Effekte der Karten wieder ihre eigenen Transitions nutzen. */
  var faders = document.querySelectorAll('.fade-up');
  if (!faders.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var settle = function (el) { el.classList.remove('fade-up', 'visible'); };
  if (!('IntersectionObserver' in window) || reduce) {
    faders.forEach(settle);
    return;
  }
  var reveal = function (el) {
    var done = false;
    var finish = function () { if (!done) { done = true; settle(el); } };
    el.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 1500);
    el.classList.add('visible');
  };
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { reveal(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  faders.forEach(function (el) { obs.observe(el); });
})();
