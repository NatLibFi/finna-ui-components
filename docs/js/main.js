var finna = (function finnaModule() {
  return {
    init: function init() {
      var modules = [
        'mdEditable',
      ];

      $.each(modules, function initModule(index, module) {
        if (typeof finna[module] !== 'undefined') {
          finna[module].init();
        }
      });
    }
  };
})();

$(document).ready(function onReady() {
  finna.init();
});

/* global VuFind */

$(document).ready(function onTruncateTagReady() {
  VuFind.truncate.initTruncate('.finna-truncate');
});

/* global VuFind, finna, EasyMDE */

/**
 * Finna Markdown editable.
 *
 * @param {jQuery} element
 * @constructor
 */
function FinnaMdEditable(element) {
  this.element = element;
  this.container = this.element.find('.finna-editable-container');
  this.preview = true === this.container.data('preview');
  this.emptyHtml = this.container.data('empty-html');
  this.editor = null;

  this.element.on('click.finnaEditable', { editable: this }, function onClickFinnaEditable(event) {
    event.stopPropagation();
    if (event.target.nodeName === 'A') {
      // Do not open the editor when a link within the editable area was clicked.
      return;
    }
    event.data.editable.openEditable();
  });

  this.element.addClass('inited');
}

FinnaMdEditable.prototype.eventOpenEditable = 'finna:openEditable';
FinnaMdEditable.prototype.eventEditableClosed = 'finna:editableClosed';

FinnaMdEditable.prototype.busyClass = 'finna-editable-busy';
FinnaMdEditable.prototype.openClass = 'finna-editable-open';

/**
 * Returns the open state of the editable.
 *
 * @returns {boolean}
 */
FinnaMdEditable.prototype.isOpen = function isOpen() {
  return this.element.hasClass(this.openClass);
};

/**
 * Returns the busy state of the editable.
 *
 * @returns {boolean}
 */
FinnaMdEditable.prototype.isBusy = function isBusy() {
  return this.element.hasClass(this.busyClass);
};

/**
 * Conditionally sets the busy state of the editable.
 *
 * An opened editable can not be set busy.
 *
 * @param {boolean} busy Busy state to set.
 *
 * @returns {FinnaMdEditable}
 */
FinnaMdEditable.prototype.setBusy = function setBusy(busy) {
  if (this.isOpen()) {
    return this;
  }
  if (this.isBusy()) {
    if (!busy) {
      this.element.removeClass(this.busyClass);
    }
  }
  else if (busy) {
    this.element.addClass(this.busyClass);
  }
  return this;
};

/**
 * Conditionally opens the editable.
 *
 * A busy editable can not be opened.
 *
 * @returns {FinnaMdEditable}
 */
FinnaMdEditable.prototype.openEditable = function openEditable() {
  if (this.isOpen() || this.isBusy()) {
    return this;
  }
  var editableEvent = $.Event(this.eventOpenEditable, { editable: this });
  $(document).trigger(editableEvent);
  if (editableEvent.isDefaultPrevented()) {
    return this;
  }
  this.element.addClass(this.openClass);

  // Hide container and insert textarea for editor.
  this.container.hide();
  var textArea = $('<textarea/>');
  var currentVal = this.container.data('markdown');
  textArea.text(currentVal);
  textArea.insertAfter(this.container);

  var editable = this;

  // Create editor.
  var toolbar = [
    {
      name: 'bold',
      action: EasyMDE.toggleBold,
      className: 'fa fa-bold',
      title: VuFind.translate('editor_format_bold')
    },
    {
      name: 'italic',
      action: EasyMDE.toggleItalic,
      className: 'fa fa-italic',
      title: VuFind.translate('editor_format_italic')
    },
    {
      name: 'heading',
      action: EasyMDE.toggleHeadingSmaller,
      className: 'fa fa-header fa-heading',
      title: VuFind.translate('editor_format_heading')
    },
    '|',
    {
      name: 'quote',
      action: EasyMDE.toggleBlockquote,
      className: 'fa fa-quote-left',
      title: VuFind.translate('editor_format_quote')
    },
    {
      name: 'unordered-list',
      action: EasyMDE.toggleUnorderedList,
      className: 'fa fa-list-ul',
      title: VuFind.translate('editor_format_unordered_list')
    },
    {
      name: 'ordered-list',
      action: EasyMDE.toggleOrderedList,
      className: 'fa fa-list-ol',
      title: VuFind.translate('editor_format_ordered_list')
    },
    '|',
    {
      name: 'link',
      action: EasyMDE.drawLink,
      className: 'fa fa-link',
      title: VuFind.translate('editor_create_link')
    },
    {
      name: 'image',
      action: EasyMDE.drawImage,
      className: 'fa fa-image',
      title: VuFind.translate('editor_insert_image')
    },
    '|',
    {
      name: 'other',
      className: 'fa fa-plus-small',
      title: VuFind.translate('editor_other_commands'),
      children: [
        {
          name: 'panel',
          action: function toolbarPanelAction() {
            editable._insertPanel();
          },
          className: 'fa details-icon',
          title: VuFind.translate('editor_insert_panel')
        },
        {
          name: 'truncate',
          action: function toolbarTruncateAction() {
            editable._insertTruncate();
          },
          className: 'fa fa-pagebreak',
          title: VuFind.translate('editor_insert_truncate')
        }
      ]
    },
    {
      name: 'close',
      action: function toolbarCloseAction() {
        editable.closeEditable();
      },
      className: 'fa fa-times editor-toolbar-close',
      title: VuFind.translate('editor_close_editor')
    }
  ];
  var promptTexts = {
    link: VuFind.translate('editor_prompt_link'),
    image: VuFind.translate('editor_prompt_image')
  };
  var settings = {
    autoDownloadFontAwesome: false,
    autofocus: true,
    element: textArea[0],
    indentWithTabs: false,
    promptTexts: promptTexts,
    promptURLs: true,
    toolbar: toolbar,
    spellChecker: false,
    status: false
  };
  this.editor = new EasyMDE(settings);

  this.element.find('.CodeMirror-code').focus();

  // Prevent clicks within the editor area from bubbling up.
  this.element.find('.EasyMDEContainer').unbind('click').click(function onClickEditor() {
    return false;
  });

  // Preview
  if (this.preview) {
    var html = this.editor.options.previewRender(this.editor.value());
    $('.markdown-preview').remove();
    var preview = $('<div/>').addClass('markdown-preview')
      .html($('<div/>').addClass('data').html(html));
    $('<div/>').addClass('preview').text(VuFind.translate('preview').toUpperCase()).prependTo(preview);
    preview.appendTo(this.element);

    this.editor.codemirror.on('change', function onChangeEditor() {
      var result = editable.editor.options.previewRender(editable.editor.value());
      preview.find('.data').html(result);
    });
  }

  return this;
};

/**
 * Closes the editable.
 *
 * A busy editable can not be opened.
 *
 * @returns {FinnaMdEditable}
 */
FinnaMdEditable.prototype.closeEditable = function closeEditable() {
  if (null !== this.editor) {
    var markdown = this.editor.value();
    var resultHtml = this.editor.options.previewRender(markdown);

    this.editor.toTextArea();
    this.editor = null;
    this.element.removeClass(this.openClass).find('textarea').remove();

    this.container.show();
    this.container.data('markdown', markdown);

    if (markdown.length === 0) {
      resultHtml = this.emptyHtml;
    }

    this.container.html(resultHtml);

    if (this.preview) {
      this.element.find('.markdown-preview').remove();
    }
  }

  var editableEvent = $.Event(this.eventEditableClosed, { editable: this });
  $(document).trigger(editableEvent);

  return this;
};

FinnaMdEditable.prototype._insertElement = function _insertElement(element, cursorLineOffset, cursorCh) {
  var doc = this.editor.codemirror.getDoc();
  doc.replaceRange(element, doc.getCursor());
  this.editor.codemirror.focus();
  var cursor = doc.getCursor();
  cursor.line = cursor.line + cursorLineOffset;
  cursor.ch = cursorCh;
  doc.setCursor(cursor);
};

FinnaMdEditable.prototype._insertPanel = function _insertPanel() {
  var headingPlaceholder = VuFind.translate('details_summary_placeholder');
  var panelElement = '\n<finna-panel>\n'
    + '  <span slot="heading">' + headingPlaceholder + '</span>\n\n'
    + '  ' + VuFind.translate('details_text_placeholder') + '\n'
    + '</finna-panel>\n';
  this._insertElement(panelElement, -4, 23 + headingPlaceholder.length);
};

FinnaMdEditable.prototype._insertTruncate = function _insertTruncate() {
  var labelPlaceholder = VuFind.translate('details_summary_placeholder');
  var truncateElement = '\n<finna-truncate>\n'
    + '  <span slot="label">' + labelPlaceholder + '</span>\n\n'
    + '  ' + VuFind.translate('details_text_placeholder') + '\n'
    + '</finna-truncate>\n';
  this._insertElement(truncateElement, -4, 21 + labelPlaceholder.length);
};

finna.mdEditable = (function finnaMdEditable() {
  var editables = [];

  var my = {
    editables: editables,
    init: function init() {
      $('.finna-md-editable:not(.inited)').each(function initFinnaMdEditable() {
        editables.push(new FinnaMdEditable($(this)));
      });
    }
  };

  return my;
})();

$(document).ready(function onFinnaTabsNavReady() {
  $('.finna-tabs-nav').each(function doFinnaTabsNavLayout() {
    var activeUl = $(this).find(
      '.finna-nav > li.active > ul, .finna-nav > li.active-trail > ul'
    );
    if (activeUl.length > 0 && $(this).height() > 0) {
      $(this).css('height', $(this).children('.finna-nav').height() + activeUl.height());
    }
  });
});

/*global finna */
finna.layout = (function finnaLayout(_holder) {
  var initToolTips = function initToolTips() {
    var $holder = _holder ? _holder : $(document);

    var currentOpenTooltips = [];

    $holder.find('[data-toggle="tooltip"]')
      .on('show.bs.tooltip', function onShowTooltip() {
        var $this = $(this);

        $(currentOpenTooltips).each(function hideOtherTooltips() {
          if ($(this)[0] !== $this[0]) {
            $(this).tooltip('hide');
          }
        });

        currentOpenTooltips = [$this];
      })
      .on('hidden.bs.tooltip', function onHideTooltip(event) {
        $(event.target).data('bs.tooltip').inState.click = false;
      })
      .tooltip({ trigger: 'click', viewport: '.pl-js-pattern-example' });

    $holder.find('[data-toggle="tooltip"] > i').on('click', function onClickTooltip(event) {
      event.preventDefault();
    });

    $('html').on('click', function onClickHtml(event) {
      if (typeof $(event.target).parent().data('original-title') == 'undefined' && typeof $(event.target).data('original-title') == 'undefined') {
        $('[data-toggle="tooltip"]').tooltip('hide');
        currentOpenTooltips = [];
      }
    })
  };

  var isTouchDevice = function isTouchDevice() {
    return (('ontouchstart' in window)
      || (navigator.maxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0)); // IE10, IE11, Edge
  };

  return {
    isTouchDevice: isTouchDevice,
    initToolTips: initToolTips,
    init: function init() {
      initToolTips();
    }
  }
})();

$(document).ready(function onDocumentReady() {
  finna.layout.init();
});

/* global VuFind */

VuFind.register('truncate', function Truncate() {
  const defaultSettings = {
    'btn-class': '',
    'in-place-toggle': false,
    'label': null,
    'less-label': VuFind.translate('show_less'),
    'more-label': VuFind.translate('show_more'),
    'rows': 3,
    'top-toggle': Infinity,
    'wrapper-class': '', // '' will glean from element, false or null will exclude a class
    'wrapper-tagname': null, // falsey values will glean from element
  };

  function initTruncate(_container, _element, _fill) {
    var zeroHeightContainers = [];

    $(_container).not('.truncate-done').each(function truncate() {
      var container = $(this);
      var settings = Object.assign({}, defaultSettings, container.data('truncate'));

      var element = typeof _element !== 'undefined'
        ? container.find(_element)
        : (typeof settings.element !== 'undefined')
          ? container.find(settings.element)
          : false;
      var fill = typeof _fill === 'undefined' ? function fill(m) { return m; } : _fill;
      var maxRows = parseFloat(settings.rows);
      var moreLabel, lessLabel;
      moreLabel = lessLabel = settings.label;
      if (moreLabel === null) {
        moreLabel = settings['more-label'];
        lessLabel = settings['less-label'];
      }
      var btnClass = settings['btn-class'] ? ' ' + settings['btn-class'] : '';
      var topToggle = settings['top-toggle'];
      var inPlaceToggle = (element && settings['in-place-toggle'])
        ? settings['in-place-toggle']
        : false;

      var parent, numRows, shouldTruncate, truncatedHeight;
      var wrapperClass = settings['wrapper-class'];
      var wrapperTagName = settings['wrapper-tagname'];
      var toggleElements = [];

      if (element) {
        // Element-based truncation
        parent = element.parent();
        numRows = container.find(element).length || 0;
        shouldTruncate = numRows > maxRows;

        if (wrapperClass === '') {
          wrapperClass = element.length ? element.prop('class') : '';
        }
        if (!wrapperTagName) {
          wrapperTagName = element.length && element.prop('tagName').toLowerCase();
        }

        if (shouldTruncate) {
          element.each(function hideRows(i) {
            if (i === maxRows) {
              $(this).addClass('truncate-start');
            }
            if (i >= maxRows) {
              $(this).hide();
              toggleElements.push(this);
            }
          });
        }
      } else {
        // Height-based truncation
        parent = container;
        var rowHeight;
        if (container.children().length > 0) {
          // Use first child as the height element if available
          var heightElem = container.children().first();
          var display = heightElem.css('display');
          if ((heightElem.is('div') || heightElem.is('span'))
            && (display === 'block' || display === 'inline-block')
          ) {
            rowHeight = parseFloat(heightElem.outerHeight());
          } else {
            rowHeight = parseFloat(heightElem.css('line-height').replace('px', ''));
          }
        } else {
          rowHeight = parseFloat(container.css('line-height').replace('px', ''));
        }
        numRows = container.height() / rowHeight;
        // Truncate only if it saves at least 1.5 rows. This accounts for the room
        // the more button takes as well as any fractional imprecision.
        shouldTruncate = maxRows === 0 || maxRows !== 0 && numRows > maxRows + 1.5;

        if (shouldTruncate) {
          truncatedHeight = maxRows * rowHeight;
          container.css('height', truncatedHeight + 'px');
        }
      }

      if (shouldTruncate) {
        var btnMore = '<button type="button" class="btn more-btn' + btnClass + '">' + moreLabel + ' <i class="fa fa-arrow-down" aria-hidden="true"></i></button>';
        var btnLess = '<button type="button" class="btn less-btn' + btnClass + '">' + lessLabel + ' <i class="fa fa-arrow-up" aria-hidden="true"></i></button>';

        wrapperClass = wrapperClass ? ' ' + wrapperClass : '';
        wrapperTagName = wrapperTagName || 'div';
        var btnWrapper = $('<' + wrapperTagName + ' class="more-less-btn-wrapper' + wrapperClass + '"></' + wrapperTagName + '>');
        var btnWrapperBtm = btnWrapper.clone().append(fill(btnMore + btnLess));
        var btnWrapperTop = (numRows > topToggle) ? btnWrapper.clone().append(fill(btnLess)) : false;

        // Attach show/hide buttons to the top and bottom or display in place
        if (btnWrapperTop) {
          if (element) {
            btnWrapperTop.prependTo(parent);
          } else {
            btnWrapperTop.insertBefore(parent);
          }
        }
        if (inPlaceToggle) {
          btnWrapperBtm.insertBefore(parent.find('.truncate-start'));
        } else if (element) {
          btnWrapperBtm.appendTo(parent);
        } else {
          btnWrapperBtm.insertAfter(parent);
        }

        btnWrapperBtm.find('.less-btn').hide();
        if (btnWrapperTop) {
          btnWrapperTop.hide();
        }

        var onClickLessBtnHandler = function onClickLessBtn(/*event*/) {
          btnWrapperBtm.find('.less-btn').hide();
          if (btnWrapperTop) {
            btnWrapperTop.hide();
          }
          btnWrapperBtm.find('.more-btn').show();
          if (element) {
            toggleElements.forEach(function hideToggles(toggleElement) {
              $(toggleElement).toggle();
            });
          } else if (truncatedHeight === 0) {
            container.hide();
          } else {
            container.css('height', truncatedHeight + 'px');
          }
          btnWrapperBtm.find('.more-btn').focus();
        };
        btnWrapperBtm.find('.less-btn').click(onClickLessBtnHandler);
        if (btnWrapperTop) {
          btnWrapperTop.find('.less-btn').click(onClickLessBtnHandler);
        }

        btnWrapperBtm.find('.more-btn').click(function onClickMoreBtn(/*event*/) {
          $(this).hide();
          btnWrapperBtm.find('.less-btn').show();
          if (btnWrapperTop) {
            btnWrapperTop.show();
            btnWrapperTop.find('.less-btn').focus();
          } else {
            btnWrapperBtm.find('.less-btn').focus();
          }
          if (element) {
            toggleElements.forEach(function showToggles(toggleElement) {
              $(toggleElement).toggle();
            });
          } else if (truncatedHeight === 0) {
            container.show();
          } else {
            container.css('height', 'auto');
          }
        });
      }

      container.addClass('truncate-done');

      if (truncatedHeight === 0) {
        zeroHeightContainers.push(container);
      }
    });

    // Hide zero-height containers. They are not hidden immediately to allow for
    // height calculation of nested containers.
    zeroHeightContainers.forEach(function hideContainer(container) {
      container.hide();
      container.css('height', 'auto');
    });
  }

  return {
    initTruncate: initTruncate
  };
});
