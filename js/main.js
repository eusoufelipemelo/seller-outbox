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

  /* ---- Text effect: quebra headline em palavras com stagger ---- */
  function initTextEffect() {
    document.querySelectorAll('[data-te]').forEach(function (el) {
      if (el.dataset.teReady) return;
      el.dataset.teReady = '1';
      var baseDelay = parseFloat(el.getAttribute('data-te-delay') || '0') / 1000;
      var stagger = parseFloat(el.getAttribute('data-te-stagger') || '60') / 1000;
      var lines = el.querySelectorAll('.te-line');
      var targets = lines.length ? lines : [el];
      var wordIndex = 0;
      targets.forEach(function (line) {
        var text = line.textContent;
        line.textContent = '';
        text.split(/(\s+)/).forEach(function (part) {
          if (part === '') return;
          if (part.trim() === '') {
            line.appendChild(document.createTextNode(part));
            return;
          }
          var w = document.createElement('span');
          w.className = 'te-word';
          w.textContent = part;
          w.style.setProperty('--te-d', (baseDelay + wordIndex * stagger).toFixed(3) + 's');
          wordIndex++;
          line.appendChild(w);
        });
      });
    });
  }
  initTextEffect();

  // Dispara os headlines que já estão na dobra sem depender de IO, garantindo que o
  // hero acima da dobra nunca fique em branco. rAF anima suave no load normal; o
  // setTimeout é rede de segurança caso o rAF esteja pausado (aba em segundo plano).
  function revealTeInView() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('[data-te]').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add('te-in');
    });
  }
  requestAnimationFrame(function () { requestAnimationFrame(revealTeInView); });
  setTimeout(revealTeInView, 350);

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

    // headlines com efeito de texto
    var teIo = new IntersectionObserver(function (es, obs) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('te-in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('[data-te]').forEach(function (el) { teIo.observe(el); });

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
    document.querySelectorAll('[data-te]').forEach(function (el) { el.classList.add('te-in'); });
    document.querySelectorAll('.rung').forEach(function (r) { r.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(function (c) {
      c.textContent = (c.getAttribute('data-prefix') || '') + c.getAttribute('data-count') + (c.getAttribute('data-suffix') || '');
    });
    fillRing();
  }

})();
