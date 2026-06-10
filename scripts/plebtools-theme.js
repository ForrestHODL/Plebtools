(function () {
  'use strict';

  localStorage.setItem('theme', 'dark');
  localStorage.removeItem('light-ranking');

  function applyDarkOnly() {
    if (!document.body) return;
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme', 'light-ranking');
  }

  function removeThemeToggles() {
    document.querySelectorAll(
      '#theme-toggle-container, #themeToggle, #themeFab, .theme-toggle, .theme-fab'
    ).forEach(function (el) {
      if (el.id === 'currencyToggle') return;
      el.remove();
    });

    document.querySelectorAll('.nav-theme-wrap').forEach(function (wrap) {
      if (wrap.querySelector('#currencyToggle')) return;
      wrap.remove();
    });
  }

  function init() {
    applyDarkOnly();
    removeThemeToggles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
