define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var GameDetailsModalView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#gameDetailsModalViewTemplate').text());

      this.options = options;
    },

    render: function(){
      var self = this;

      function uploadMedia() {
        var bar = $('.bar', $(self.el));
        var percent = $('.percent', $(self.el));

        $('form', $(self.el)).ajaxForm({
          beforeSubmit: function() {
            $('.progress', $(self.el)).show();
            var percentVal = '0%';
            bar.width(percentVal)
            percent.html(percentVal);
          },

          uploadProgress: function(event, position, total, percentComplete) {
            console.log('uploadProgress');
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
          },
          
          success: function() {
            console.log('success');
            var percentVal = '100%';
            bar.width(percentVal)
            percent.html(percentVal);

            $('.progress', $(self.el)).hide();
          },

          complete: function(xhr) {
            console.log('complete');

            $('.upload-btn', $(self.el)).button('reset');

            if (xhr.responseText) {
              console.log(xhr.responseText);
            }
          }
        }); 
      }
      
      $(this.el).html(this.template({ game: this.options.jsonCurrGame }));

      $('.upload-btn', $(this.el)).click(function(evt){
        $(this).button('loading');

        uploadMedia();
      });

      $('.big-close-btn', $(this.el)).click(function(evt){
        $('.modal', $(self.el)).modal('hide');
      });

      return this;
    },

    show: function(){
      $('.modal', $(this.el)).modal();
    }

  });

  return GameDetailsModalView;
});
