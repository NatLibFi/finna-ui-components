var mockTags = [{
  id: '1',
  value: 'Testing 1'
},
{
  id: '2',
  value: 'Testing 2'
}
];

$.mockjax([{
  url: '/finna/tags',
  type: 'GET',
  responseTime: 2000,
  response: function() {
    this.responseText = {
      'tags': mockTags
    };
  }
},
{
  url: '/finna/tags',
  type: 'POST',
  responseTime: 1000,
  response: function(settings) {
    mockTags.push({
      id: Math.floor(Math.random() * 100 + 1).toString(),
      value: JSON.parse(settings.data).tag
    });

    this.responseText = {
      'status': 'OK'
    };
  }
},
{
  url: '/finna/tags',
  type: 'DELETE',
  responseTime: 1000,
  response: function(settings) {
    var deleteTagId = JSON.parse(settings.data).id;

    var newTags = mockTags.filter(function(tag) {
      return tag.id !== deleteTagId;
    });

    mockTags = newTags.slice(0);

    this.responseText = {
      'status': 'OK'
    };
  }
}
]);
