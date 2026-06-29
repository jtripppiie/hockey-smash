(function () {
  const params = new URLSearchParams(window.location.search);
  const computerMode = params.get('computerMode') === '1';

  function onReady() {
    document.body.classList.toggle('hockey-computer-mode', computerMode);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
