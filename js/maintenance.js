/* ============================================================
   BIEA BOXING — COMING SOON REDIRECT
   ============================================================
   Reads SITE_CONFIG.comingSoon (set in config.js).
   Each page includes this script and passes its own key.
   If the flag for that page is true, redirects to coming-soon.html.
   Must be loaded AFTER config.js.
   ============================================================ */

(function (pageKey) {
  if (
    typeof SITE_CONFIG !== 'undefined' &&
    SITE_CONFIG.comingSoon &&
    SITE_CONFIG.comingSoon[pageKey] === true
  ) {
    window.location.replace('coming-soon.html');
  }
})(document.currentScript.dataset.page);
