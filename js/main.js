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
      var per = el.getAttribute('data-te-per') || 'word';
      var baseDelay = parseFloat(el.getAttribute('data-te-delay') || '0') / 1000;
      var stagger = parseFloat(el.getAttribute('data-te-stagger') || (per === 'char' ? '22' : '60')) / 1000;
      var lines = el.querySelectorAll('.te-line');
      var targets = lines.length ? lines : [el];
      var i = 0;
      targets.forEach(function (line) {
        var text = line.textContent;
        line.textContent = '';
        text.split(/(\s+)/).forEach(function (part) {
          if (part === '') return;
          if (part.trim() === '') {
            line.appendChild(document.createTextNode(part));
            return;
          }
          if (per === 'char') {
            // agrupa por palavra (inline-block) para não quebrar palavra no meio da linha
            var group = document.createElement('span');
            group.className = 'te-cgroup';
            part.split('').forEach(function (ch) {
              var c = document.createElement('span');
              c.className = 'te-word';
              c.textContent = ch;
              c.style.setProperty('--te-d', (baseDelay + i * stagger).toFixed(3) + 's');
              i++;
              group.appendChild(c);
            });
            line.appendChild(group);
          } else {
            var w = document.createElement('span');
            w.className = 'te-word';
            w.textContent = part;
            w.style.setProperty('--te-d', (baseDelay + i * stagger).toFixed(3) + 's');
            i++;
            line.appendChild(w);
          }
        });
      });
    });
  }
  initTextEffect();

  /* ---- Depoimentos (marquee 3D) ---- */
  var TESTI = [
    { n: 'Mariana Alves', r: 'Consultora, Curitiba PR', img: 'assets/testimonials/t1.jpg', q: 'Nunca tinha vendido nada na vida. Em três meses fechei meu primeiro site e a comissão caiu certinho. Aprendi do zero com a OutBox.' },
    { n: 'Rafael Nogueira', r: 'Consultor, Belo Horizonte MG', img: 'assets/testimonials/t2.jpg', q: 'Já vivia de vendas, mas aqui eu tenho produto bom pra oferecer e o sistema faz o resto. Minha comissão cresce todo mês.' },
    { n: 'Juliana Prado', r: 'Consultora, Recife PE', img: 'assets/testimonials/t3.jpg', q: 'O treinamento é de verdade. Os quizzes me deram segurança pra conversar com o cliente sem medo.' },
    { n: 'Diego Martins', r: 'Consultor, Porto Alegre RS', img: 'assets/testimonials/t4.jpg', q: 'Bati a meta do trimestre e escolhi receber o valor do prêmio em dinheiro. Caiu na conta como combinado.' },
    { n: 'Camila Ferreira', r: 'Consultora, Fortaleza CE', img: 'assets/testimonials/t5.jpg', q: 'O funil e os orçamentos dentro do sistema mudaram meu jogo. Fechei duas propostas na mesma semana.' },
    { n: 'Bruno Carvalho', r: 'Consultor, São Paulo SP', img: 'assets/testimonials/t6.jpg', q: 'Recorrência é o segredo. A hospedagem me paga todo mês sem eu precisar vender de novo.' },
    { n: 'Patrícia Ramos', r: 'Consultora, Goiânia GO', img: 'assets/testimonials/t7.jpg', q: 'Comecei desconfiada e hoje é a minha renda principal. O acompanhamento é nota dez.' },
    { n: 'Thiago Souza', r: 'Consultor, Salvador BA', img: 'assets/testimonials/t8.jpg', q: 'Passei no certificado, comecei a oferecer e não parei mais. Vale cada minuto de estudo.' },
    { n: 'Letícia Barros', r: 'Consultora, Florianópolis SC', img: 'assets/testimonials/t9.jpg', q: 'O que eu mais gosto é a transparência. Vejo minha comissão disponível em tempo real.' }
  ];

  function escapeHTML(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function testiCard(t) {
    var star = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.26 6.86.62-5.18 4.55 1.55 6.72L12 17.1l-6.13 3.65 1.55-6.72L2.24 8.88l6.86-.62z"/></svg>';
    var photo = t.img
      ? '<img src="' + escapeHTML(t.img) + '" alt="" onerror="this.remove()" />'
      : '';
    return '<article class="testi-card">' +
      '<div class="testi-head"><span class="testi-av">' + escapeHTML(t.n.charAt(0)) + photo + '</span>' +
      '<div class="testi-id"><strong>' + escapeHTML(t.n) + '</strong><span>' + escapeHTML(t.r) + '</span></div></div>' +
      '<div class="testi-stars">' + star + star + star + star + star + '</div>' +
      '<p class="testi-quote">' + escapeHTML(t.q) + '</p></article>';
  }

  function initTestimonials() {
    var host = document.getElementById('testi-cols');
    if (!host) return;
    var durs = ['36s', '48s', '40s', '52s', '44s', '56s'];
    var cols = 6;
    for (var c = 0; c < cols; c++) {
      var col = document.createElement('div');
      col.className = 'testi-col';
      var track = document.createElement('div');
      track.className = 'testi-track ' + (c % 2 ? 'down' : 'up');
      track.style.setProperty('--dur', durs[c]);
      var off = (c * 2) % TESTI.length;
      var items = TESTI.slice(off).concat(TESTI.slice(0, off));
      var html = items.map(testiCard).join('');
      track.innerHTML = html + html; // duplica para loop contínuo
      col.appendChild(track);
      host.appendChild(col);
    }
  }
  initTestimonials();

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
