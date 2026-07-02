/* ============================================================
   OutBox Consultores, Landing de captação
   ============================================================ */
(function () {
  'use strict';

  /* ---- WhatsApp: monta o link com a mensagem ---- */
  var WPP_NUM = '5547996597775';
  var WPP_MSG = 'Olá, vi que quer se tornar um consultor(a), me diga seu nome por favor!';
  var wppLink = 'https://wa.me/' + WPP_NUM + '?text=' + encodeURIComponent(WPP_MSG);
  document.querySelectorAll('[data-wpp]').forEach(function (a) {
    a.href = wppLink;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---- Nav: condensa ao rolar ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Count up ---- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var dur = 1300;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---- Academy ring ---- */
  function fillRing() {
    var ring = document.getElementById('ring-fg');
    if (!ring) return;
    var pct = 90;
    var circ = 327; // 2*pi*52
    ring.style.strokeDashoffset = circ - (circ * pct) / 100;
  }

  /* ---- Reveal on scroll + trigger inner animations ---- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('in');

        // count-up inside
        el.querySelectorAll('[data-count]').forEach(function (c) {
          if (!c.dataset.done) { c.dataset.done = '1'; countUp(c); }
        });
        // ladder bars
        if (el.classList.contains('rung')) el.classList.add('in');
        // academy ring
        if (el.classList.contains('academy-stat')) fillRing();

        io.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    // separate observer for rungs (bar fill) even if not .reveal handled
    document.querySelectorAll('.rung').forEach(function (r) {
      var ro = new IntersectionObserver(function (es, obs) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); obs.disconnect(); } });
      }, { threshold: 0.4 });
      ro.observe(r);
    });
  } else {
    // no IO / reduced motion: show everything
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.rung').forEach(function (r) { r.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(function (c) {
      c.textContent = (c.getAttribute('data-prefix') || '') + c.getAttribute('data-count') + (c.getAttribute('data-suffix') || '');
    });
    fillRing();
  }

})();
