(function ($, Drupal, once) {

  Drupal.behaviors.curatedMaterialsAdmin = {
    attach: function (context, settings) {
      // Refresh Markdown editor when the parent details element is opened.
      once('curated-materials-admin', 'details').forEach(function (el) {
        $(el).on('toggle', function (e) {
          if (e.target.open) {
            $(e.target).find('.CodeMirror').each(function (i, el) {
              el.CodeMirror.refresh();
            });
          }
        });
      });
    }
  }

})(jQuery, Drupal, once);
