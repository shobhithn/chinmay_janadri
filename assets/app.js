// Mirror the artifact/system theme onto Bootstrap's own dark-mode attribute
(function () {
  var root = document.documentElement;
  function sync () {
    var explicit = root.getAttribute('data-theme');
    var dark = explicit ? explicit === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
  }
  sync();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync);
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
})();

// Scroll-reveal (text/card blocks + photography)
(function () {
  var items = document.querySelectorAll('.reveal, .reveal-img');
  if (!('IntersectionObserver' in window) || !items.length) {
    items.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

// Animated counters (e.g. "06 Integrated Practices") — fire once revealed
(function () {
  var counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;
  function animateCount (el) {
    var to = parseInt(el.getAttribute('data-count-to'), 10) || 0;
    var pad = parseInt(el.getAttribute('data-count-pad'), 10) || 0;
    var duration = 1100;
    var start = null;
    function step (ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * to);
      el.textContent = String(value).padStart(pad, '0');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!('IntersectionObserver' in window)) {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count-to'); });
    return;
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        cio.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { cio.observe(el); });
})();

// Navbar shadow once the page has scrolled past the top
(function () {
  var nav = document.querySelector('.navbar');
  if (!nav) return;
  function onScroll () {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Close mobile nav on link click
(function () {
  var nav = document.getElementById('mainNav');
  if (!nav) return;
  nav.querySelectorAll('a.nav-link, a.btn').forEach(function (a) {
    a.addEventListener('click', function () {
      if (nav.classList.contains('show') && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });
})();

// Mark the current page's nav link active (based on filename)
(function () {
  var links = document.querySelectorAll('.navbar .nav-link[href]');
  var here = (location.pathname.split('/').pop() || 'index.html');
  links.forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();
