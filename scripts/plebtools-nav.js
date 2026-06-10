(function () {
  'use strict';

  function initNav() {
    var toolsBtn = document.getElementById('toolsBtn');
    var toolsContent = document.getElementById('toolsContent');
    var toolsDropdown = document.getElementById('toolsDropdown');
    if (!toolsBtn || !toolsContent || !toolsDropdown) return;

    var isOpen = false;

    function openMenu() {
      toolsContent.style.display = 'block';
      toolsDropdown.classList.add('active');
      requestAnimationFrame(function () {
        toolsContent.classList.add('show');
      });
      isOpen = true;
    }

    function closeMenu() {
      toolsContent.classList.remove('show');
      toolsDropdown.classList.remove('active');
      setTimeout(function () {
        if (!isOpen) toolsContent.style.display = 'none';
      }, 200);
      isOpen = false;
    }

    toolsBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) closeMenu();
      else openMenu();
    });

    document.addEventListener('click', function (e) {
      if (!toolsDropdown.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
