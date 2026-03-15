/* ============================================================
   BIEA BOXING — Cookie Consent
   ============================================================ */

(function () {
  const STORAGE_KEY = 'biea-cookie-consent';
  const banner = document.getElementById('cookie-banner');

  if (!banner) return;

  // Already decided — stay hidden
  if (localStorage.getItem(STORAGE_KEY)) return;

  // Show after a short delay so the page loads first
  setTimeout(function () {
    banner.classList.add('is-visible');
  }, 800);

  banner.querySelector('.cookie-banner__accept').addEventListener('click', function () {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    dismiss();
  });

  banner.querySelector('.cookie-banner__decline').addEventListener('click', function () {
    localStorage.setItem(STORAGE_KEY, 'declined');
    dismiss();
  });

  function dismiss() {
    banner.classList.remove('is-visible');
    banner.addEventListener('transitionend', function () {
      banner.remove();
    }, { once: true });
  }
})();
