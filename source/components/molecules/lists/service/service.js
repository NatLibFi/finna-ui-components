/*global finna */
finna.organisationServicesList = (function organisationServicesList(root) {
  var $holder, $list, $loader;
  var service;

  var appendServiceItems = function appendServiceItems(data) {
    data.forEach(function forEachService(item) {
      var $li = $('<li/>').addClass('service-list-item');

      var titleString = '<span>' + item['0'] + '</span>';
      var $serviceItem, tooltipString;

      if (item.shortDesc || item.desc) {
        $serviceItem = $('<button/>')
          .addClass('btn btn-link')
          .html(titleString);

        $serviceItem
          .attr('data-toggle', 'tooltip')
          .attr('data-placement', 'bottom')
          .attr('data-html', true);

        var description;

        if (item.desc) {
          description = item.desc;
        } else {
          description = item.shortDesc;
        }

        tooltipString = '<h4>' + item['0'] + '</h4>' + description;

        $serviceItem.attr('data-original-title', tooltipString);
      } else {
        $serviceItem = titleString;
      }

      $li.append($serviceItem);
      $li.appendTo($list);
    });

    if (finna.layout && finna.layout.initToolTips) {
      finna.layout.initToolTips($list);
    }

    $loader.addClass('hide');
    $list.removeClass('hide');
  };

  var getOrganisations = function getOrganisations(parent) {
    var deferred = $.Deferred();

    service.getOrganisations('page', parent, [], {}, function onOrganisationsLoaded(res) {
      if (res) {
        deferred.resolve(res);
      } else {
        deferred.reject();
      }
    });

    return deferred.promise();
  };

  var getSchedules = function getSchedules(parent, id) {
    var deferred = $.Deferred();

    service.getSchedules('page', parent, id, null, null, true, true, function onSchedulesLoaded(res) {
      if (res) {
        deferred.resolve(res);
      } else {
        deferred.reject();
      }
    });

    return deferred.promise();
  };

  var getServices = function getServices() {
    $holder.removeClass('hide');
    $loader.removeClass('hide');
    $list.addClass('hide');

    var parent = $holder.data('parent');
    var id = $holder.data('organisation-id');
    var dataKey = $list.data('list-key');

    getOrganisations(parent)
      .then(function onOrganisationsResolve() {
        getSchedules(parent, id)
          .then(function onSchedulesResolve() {
            var data = service.getDetails(id);

            if (data.details.allServices && data.details.allServices[dataKey]) {
              var services = data.details.allServices[dataKey];

              appendServiceItems(services);
            } else {
              $loader.addClass('hide');
              $holder.addClass('hide');
            }
          });
      });
  };

  return {
    getServices: getServices,
    init: function init(_holder, _list, _service) {
      $holder = _holder;
      $list = _list;
      $loader = $holder.find('.js-loader');

      service = _service;

      $(root).on('mapWidget:selectServicePoint', function onMapWidgetSelect(_, data) {
        $holder.data('organisation-id', data);
        $list.empty();

        getServices();
      });
    }
  }
});
