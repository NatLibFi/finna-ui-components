/* global finna */
finna.layout = (function finnaLayout() {
  var currentOpenTooltips = [];

  function initToolTips(_holder) {
    var holder = typeof _holder === 'undefined' ? $(document) : _holder;
    // other tooltips
    holder.find('[data-toggle="tooltip"]')
      .on('show.bs.tooltip', function onShowTooltip() {
        var self = $(this);
        $(currentOpenTooltips).each(function hideOtherTooltips() {
          if ($(this)[0] !== self[0]) {
            $(this).tooltip('hide');
          }
        });
        currentOpenTooltips = [self];
      })
      .on('hidden.bs.tooltip', function onHideTooltip(e) {
        $(e.target).data('bs.tooltip').inState.click = false;
      })
      .tooltip({trigger: 'click', viewport: '.container'});
    // prevent link opening if tooltip is placed inside link element
    holder.find('[data-toggle="tooltip"] > i').on('click', function onClickTooltip(event) {
      event.preventDefault();
    });
    // close tooltip if user clicks anything else than tooltip button
    $('html').on('click', function onClickHtml(e) {
      if (typeof $(e.target).parent().data('original-title') == 'undefined' && typeof $(e.target).data('original-title') == 'undefined') {
        $('[data-toggle="tooltip"]').tooltip('hide');
        currentOpenTooltips = [];
      }
    });
  }

  var my = {
    initToolTips: initToolTips,
    init: function init() {
      initToolTips();
    }
  };

  return my;
})();
