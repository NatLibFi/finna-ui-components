/* global finna */
finna.keywords = (function keywords() {
  var $wrapper = $('.js-keywords-wrapper');
  var $controls = $('.js-controls');
  var $current = $('.js-current');
  var $counter = $('.js-keywords-counter');
  var $keywordsList = $('.js-keywords-list');
  var $loader = $('.js-spinner');

  var updateCounter = function updateCounter() {
    var $keywords = $('.js-keyword');

    $counter.text($keywords.length);
  };

  var getTags = function getTags() {
    $loader.show();

    $.ajax({
      url: '/finna/tags',
      method: 'GET'
    }).done(function onRequestDone(response) {
      $keywordsList.empty();

      $.each(response.tags, function appendKeyword(index, tag) {
        var $newKeyword = $(
          '<button data-tag-id="' +
            tag.id +
            '" class="btn keyword js-keyword"><span class="keyword__button-text">' +
            tag.value +
            '</span><i class="fa fa-times keyword__button-icon" aria-hidden="true"></i></button>'
        );

        $keywordsList.append($newKeyword);
        $newKeyword.on('click', deleteKeyword);
      });

      updateCounter();

      $loader.hide();
    });
  };

  var deleteKeyword = function deleteKeyword() {
    var editMode = $wrapper.hasClass('open');

    if (editMode) {
      $loader.show();

      var data = {
        id: $(this).data('tag-id').toString()
      };

      $.ajax({
        url: '/finna/tags',
        method: 'DELETE',
        data: JSON.stringify(data)
      }).done(function onRequestDone() {
        getTags();
      });
    }
  };

  var initAddKeyword = function initAddKeyword() {
    var $input = $wrapper.find('input[id="keyword"]');
    var $form = $('.js-add-keyword');

    $input.one('blur keydown', function onInputTouched() {
      $(this).addClass('touched');
    });

    $form.on('submit', function onSubmit(event) {
      event.preventDefault();

      $form.removeClass('invalid');

      if ($form[0].checkValidity()) {
        $loader.show();

        $.ajax({
          url: '/finna/tags',
          method: 'POST',
          data: JSON.stringify({tag: $input.val()})
        }).done(function onRequestDone() {
          getTags();
        });
      } else {
        $form.addClass('invalid');
      }
    });
  };

  var initToggle = function initToggle() {
    var $toggleModuleButton = $('.js-toggle-keywords');

    $toggleModuleButton.on('click', function onToggleModule() {
      $(this).toggleClass('open');
      $wrapper.toggleClass('open');
      $controls.toggleClass('open');
      $current.toggleClass('open');
    });
  };

  var initKeywords = function initKeywords() {
    getTags();
  };

  var init = function init() {
    initKeywords();
    initToggle();
    initAddKeyword();
  };

  return {
    init: init
  };
})();
