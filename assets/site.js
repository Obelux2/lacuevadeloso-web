(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  let revealObserver;
  if ('IntersectionObserver' in window && !reduced.matches) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('pending');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .08 });
    revealItems.forEach(item => {
      item.classList.add('pending');
      revealObserver.observe(item);
    });
  }
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    revealItems.forEach(item => item.classList.remove('pending'));
    revealObserver?.disconnect();
  });

  const contact = document.querySelector('.contact');
  if (contact && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
    }).observe(contact);
  }

  function setupDemo(stage) {
    const replay = document.querySelector('.replay');
    const messages = [...stage.querySelectorAll('[data-message]')];
    const result = stage.querySelector('.demo-result');
    const steps = [...stage.querySelectorAll('.flow li')];
    let timers = [];
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
    const markStep = index => steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
      if (i === index) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
    function finish() {
      clearTimers();
      stage.classList.remove('running');
      messages.forEach(message => message.classList.add('shown'));
      result.classList.add('shown');
      markStep(2);
    }
    function play() {
      clearTimers();
      if (reduced.matches || document.hidden) { finish(); return; }
      stage.classList.add('running');
      messages.forEach(message => message.classList.remove('shown'));
      result.classList.remove('shown');
      markStep(0);
      messages.forEach((message, i) => {
        timers.push(setTimeout(() => {
          message.classList.add('shown');
          if (i > 0) markStep(1);
        }, 400 + i * 1050));
      });
      timers.push(setTimeout(finish, 4700));
    }
    replay.hidden = false;
    replay.addEventListener('click', play);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          play();
          observer.disconnect();
        }
      }, { threshold: .4 });
      observer.observe(stage);
    } else finish();
    reduced.addEventListener('change', () => { if (reduced.matches) finish(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
  }
  const stage = document.querySelector('.demo-stage');
  if (stage) setupDemo(stage);

  const lightbox = document.querySelector('#lightbox');
  if (lightbox) {
    const image = lightbox.querySelector('img');
    const caption = lightbox.querySelector('#lightbox-caption');
    let trigger;
    function open(item) {
      trigger = item;
      const source = item.querySelector('img');
      image.src = source.src;
      image.alt = source.alt;
      caption.textContent = item.querySelector('figcaption')?.textContent || '';
      if (!lightbox.open) lightbox.showModal();
    }
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => open(item));
      item.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        open(item);
      });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', event => {
      const box = lightbox.getBoundingClientRect();
      if (event.target === lightbox && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) lightbox.close();
    });
    lightbox.addEventListener('close', () => trigger?.focus());
  }
})();
