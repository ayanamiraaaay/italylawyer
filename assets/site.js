/* LazioEU — site behaviour. No third-party code, no cookies, no tracking. */
(function () {
  'use strict';

  /* Mobile menu */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 960 && nav.classList.contains('open')) setMenu(false); });
  }

  /* Mobile sticky CTA: show after the first screen, hide while the contact form is visible */
  var mcta = document.querySelector('.mcta');
  if (mcta && 'IntersectionObserver' in window) {
    var top = document.querySelector('.hero, .page-hero');
    var contact = document.querySelector('#lead-form, .next');
    var pastTop = !top, atContact = false;
    var update = function () { mcta.classList.toggle('show', pastTop && !atContact); };
    if (top) new IntersectionObserver(function (e) { pastTop = !e[0].isIntersecting; update(); }).observe(top);
    if (contact) new IntersectionObserver(function (e) { atContact = e[0].isIntersecting; update(); }, { rootMargin: '0px 0px -30% 0px' }).observe(contact);
  } else if (mcta) {
    mcta.classList.add('show');
  }

  /* Grants catalog: filters + search (works without JS: all cards visible) */
  var catalog = document.getElementById('catalog');
  if (catalog) {
    var cards = Array.prototype.slice.call(catalog.querySelectorAll('.gcard'));
    var countEl = document.getElementById('count');
    var emptyEl = document.getElementById('empty');
    var searchEl = document.getElementById('q');
    var state = { theme: 'all', who: 'all', q: '' };
    var words = (countEl && countEl.dataset) || {};

    var apply = function () {
      var n = 0;
      cards.forEach(function (c) {
        var okTheme = state.theme === 'all' || (' ' + c.dataset.theme + ' ').indexOf(' ' + state.theme + ' ') > -1;
        var okWho = state.who === 'all' || (' ' + c.dataset.who + ' ').indexOf(' ' + state.who + ' ') > -1;
        var okQ = !state.q || (c.textContent + ' ' + (c.dataset.kw || '')).toLowerCase().indexOf(state.q) > -1;
        var show = okTheme && okWho && okQ;
        c.hidden = !show;
        if (show) n++;
      });
      if (countEl) countEl.textContent = n + ' ' + (n === 1 ? words.one : words.many);
      if (emptyEl) emptyEl.hidden = n !== 0;
    };

    catalog.querySelectorAll('.fgroup').forEach(function (group) {
      var key = group.dataset.key;
      group.addEventListener('click', function (e) {
        var b = e.target.closest('.fbtn');
        if (!b) return;
        group.querySelectorAll('.fbtn').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        state[key] = b.dataset.value;
        apply();
      });
    });

    var searchForm = document.getElementById('search');
    if (searchForm && searchEl) {
      var onSearch = function (e) {
        if (e) e.preventDefault();
        state.q = searchEl.value.trim().toLowerCase().slice(0, 80);
        apply();
      };
      searchForm.addEventListener('submit', onSearch);
      searchEl.addEventListener('input', onSearch);
    }
    apply();
  }

  /* Quick check (quiz): 5 answers -> suggested programmes. Static texts only, built with textContent. */
  var quiz = document.getElementById('quiz');
  if (quiz) {
    var it = document.documentElement.lang !== 'en';
    var T = it ? {
      title: 'Programmi da valutare per la tua impresa',
      noItaly: 'Al momento lavoriamo solo con imprese registrate in Italia.',
      noItalyText: 'Se stai aprendo una società in Italia, scrivici comunque: ti diciamo cosa serve per partecipare.',
      idea: 'Anche un’idea va bene: la strutturiamo insieme in base ai requisiti del bando.',
      cofin: 'Molti bandi richiedono un cofinanziamento: ne parliamo nella verifica gratuita.',
      big: 'Per le grandi imprese i programmi diretti passano quasi sempre da progetti in partenariato.',
      cta: 'Richiedi la verifica gratuita', all: 'Vedi tutti i programmi',
      note: 'Orientamento indicativo: la verifica gratuita conferma requisiti, bandi aperti e scadenze.',
      summary: 'Verifica rapida dal sito', areaL: 'Ambito', typeL: 'Tipo', progL: 'Programmi suggeriti',
      area: { innov: 'innovazione e tecnologia', green: 'ambiente ed energia', digit: 'digitale', cult: 'cultura e creatività' },
      type: { startup: 'startup', pmi: 'PMI', grande: 'grande impresa' },
      p: {
        eic: ['EIC Accelerator', 'Innovazioni ad alto impatto di startup e PMI, anche senza partner.'],
        horizon: ['Horizon Europe', 'Progetti di innovazione con partner europei.'],
        life: ['LIFE', 'Ambiente, clima ed economia circolare.'],
        digital: ['Digital Europe', 'Intelligenza artificiale, dati e cybersecurity.'],
        creative: ['Creative Europe', 'Cultura, media e creatività, in partenariato.']
      }
    } : {
      title: 'Programmes worth checking for your company',
      noItaly: 'For now we only work with companies registered in Italy.',
      noItalyText: 'If you are setting up a company in Italy, write to us anyway: we’ll tell you what you need to apply.',
      idea: 'An idea is fine too: we shape it together around the requirements of the call.',
      cofin: 'Many calls require co-financing: we discuss it in the free check.',
      big: 'For large companies, direct programmes almost always mean projects in partnership.',
      cta: 'Request your free check', all: 'See all programmes',
      note: 'Indicative guidance: the free check confirms eligibility, open calls and deadlines.',
      summary: 'Quick check from the website', areaL: 'Field', typeL: 'Type', progL: 'Suggested programmes',
      area: { innov: 'innovation and technology', green: 'environment and energy', digit: 'digital', cult: 'culture and creativity' },
      type: { startup: 'startup', pmi: 'SME', grande: 'large company' },
      p: {
        eic: ['EIC Accelerator', 'High-impact innovation by startups and SMEs, no partners needed.'],
        horizon: ['Horizon Europe', 'Innovation projects with European partners.'],
        life: ['LIFE', 'Environment, climate and circular economy.'],
        digital: ['Digital Europe', 'Artificial intelligence, data and cybersecurity.'],
        creative: ['Creative Europe', 'Culture, media and creativity, in partnership.']
      }
    };
    var res = document.getElementById('quiz-res');
    var qerr = document.getElementById('quiz-err');
    var el = function (tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
    var val = function (name) { var c = quiz.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : null; };

    quiz.addEventListener('submit', function (e) {
      e.preventDefault();
      var a = { q1: val('q1'), q2: val('q2'), q3: val('q3'), q4: val('q4'), q5: val('q5') };
      if (!a.q1 || !a.q2 || !a.q3 || !a.q4 || !a.q5) { qerr.hidden = false; return; }
      qerr.hidden = true;
      while (res.firstChild) res.removeChild(res.firstChild);

      var progs = [];
      if (a.q1 !== 'no') {
        if (a.q3 === 'innov') { if (a.q4 !== 'grande') progs.push('eic'); progs.push('horizon'); }
        if (a.q3 === 'green') { progs.push('life', 'horizon'); }
        if (a.q3 === 'digit') { progs.push('digital', 'horizon'); }
        if (a.q3 === 'cult') { progs.push('creative'); }
        res.appendChild(el('h3', '', T.title));
        var ul = el('ul');
        progs.forEach(function (k) { var li = el('li'); var d = el('div'); d.appendChild(el('b', '', T.p[k][0])); d.appendChild(el('span', '', T.p[k][1])); li.appendChild(d); ul.appendChild(li); });
        res.appendChild(ul);
        if (a.q2 === 'idea') res.appendChild(el('p', 'muted', T.idea));
        if (a.q4 === 'grande') res.appendChild(el('p', 'muted', T.big));
        if (a.q5 === 'nonso') res.appendChild(el('p', 'muted', T.cofin));
      } else {
        res.appendChild(el('h3', '', T.noItaly));
        res.appendChild(el('p', 'muted', T.noItalyText));
      }
      var row = el('div', 'cta-row');
      // The contact form lives on its own page: pass the suggested programmes in the URL (?p=...)
      var go = el('a', 'btn', T.cta);
      go.href = quiz.dataset.contact + (progs.length ? '?p=' + encodeURIComponent(progs.map(function (k) { return T.p[k][0]; }).join(', ')) : '');
      row.appendChild(go);
      var all = el('a', '', T.all); all.href = quiz.dataset.catalog; row.appendChild(all);
      res.appendChild(row);
      res.appendChild(el('p', 'muted', T.note));
      res.hidden = false;
      res.focus({ preventScroll: true });
      res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* Lead form: validates, then opens the visitor's email app with a prefilled message.
     Nothing is sent to or stored on this website. */
  var form = document.getElementById('lead-form');
  if (form) {
    var d = form.dataset;
    var project = form.querySelector('#f-project');

    // Prefill programme of interest when arriving from the catalog (?p=...)
    try {
      var p = new URLSearchParams(window.location.search).get('p');
      if (p && project && !project.value) {
        p = p.replace(/[^\w\s+.,\-]/g, '').slice(0, 120);
        if (p) project.value = d.prefill + ' ' + p + '\n';
      }
    } catch (e) { /* old browser: no prefill */ }

    var setErr = function (input, msg) {
      var box = document.getElementById(input.id + '-err');
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (box) { box.textContent = msg || ''; box.hidden = !msg; }
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('.hp input').value) return; // bot trap
      var name = form.querySelector('#f-name');
      var email = form.querySelector('#f-email');
      var phone = form.querySelector('#f-phone');
      var ok = form.querySelector('#f-ok');
      var bad = null;

      setErr(name, name.value.trim().length < 2 ? d.errName : '');
      if (name.value.trim().length < 2) bad = bad || name;
      var em = email.value.trim();
      var emOk = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/.test(em) && em.length < 120;
      setErr(email, emOk ? '' : d.errEmail);
      if (!emOk) bad = bad || email;
      setErr(project, project.value.trim().length < 10 ? d.errProject : '');
      if (project.value.trim().length < 10) bad = bad || project;
      setErr(ok, ok.checked ? '' : d.errOk);
      if (!ok.checked) bad = bad || ok;
      if (bad) { bad.focus(); return; }

      var clean = function (s, max) { return String(s).replace(/[\r\n]+/g, ' ').trim().slice(0, max); };
      var body =
        d.lName + ': ' + clean(name.value, 100) + '\n' +
        d.lEmail + ': ' + clean(em, 120) + '\n' +
        d.lPhone + ': ' + (clean(phone.value, 40) || '-') + '\n\n' +
        d.lProject + ':\n' + String(project.value).trim().slice(0, 3000);
      var href = 'mailto:' + d.to +
        '?subject=' + encodeURIComponent(d.subject + ' – ' + clean(name.value, 60)) +
        '&body=' + encodeURIComponent(body);
      window.location.href = href;
      var done = document.getElementById('form-done');
      if (done) done.hidden = false;
    });
  }
})();
