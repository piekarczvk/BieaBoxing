/* ============================================================
   BIEA BOXING — SITE CONFIGURATION
   ============================================================
   Feature flags and global site settings.

   ⚠️  MAINTENANCE MODE
   Set maintenanceMode to true to redirect all pages to the
   "Coming Soon" page. Set back to false to restore the site.
   ============================================================ */

const SITE_CONFIG = {

  // -----------------------------------------------------------
  // 🔧 COMING SOON — per page
  // Set a page to true to redirect it to coming-soon.html
  //
  // Pages: index, gallery, schedule
  // -----------------------------------------------------------
  comingSoon: {
    index:    false,
    gallery:  false,
    schedule: false,
  },

};
