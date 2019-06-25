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

      function updateDetails(elForm) {
        var strTeamName = $('#fundraising-team-name', elForm).val();
        var strTeamDescription = $('#fundraising-team-msg', elForm).val();

        var jsonData = {name: strTeamName, description: strTeamDescription};

        var url = GAME_API_URL + 'campaign/' + CAMPAIGN_ID + '/game/' + GAME_ID + '/update';
//        console.log(url);
        $.ajax({
          type: 'post',
          dataType: 'json',
          url: url,
          data: JSON.stringify(jsonData),
          error: function(data) {
            $('.update-btn', $(self.el)).button('reset');

            console.log('error');
            console.log(data);  
          },
          success: function(data) {
            $('.update-btn', $(self.el)).button('reset');

            console.log('success');
            console.log(data);
          }
        });
      }

      function uploadMedia(elForm) {
        var bar = $('.bar', elForm);
        var percent = $('.percent', elForm);

        $('form', $(self.el)).ajaxForm({
          beforeSubmit: function() {
            $('.progress', elForm).show();
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

            location.reload();                        
          }
        }); 
      }

      function removeMedia(mediaID) {
        var url = GAME_API_URL + 'campaign/' + CAMPAIGN_ID + '/game/' + GAME_ID + '/media/' + mediaID;
        console.log(url);
        $.ajax({
          type: 'delete',
          dataType: 'json',
          url: url,
          error: function(data) {
            $('.remove-btn', $(self.el)).button('reset');

            console.log('error');
            console.log(data);  
          },
          success: function(data) {
            $('.remove-btn', $(self.el)).button('reset');

            console.log('success');
            console.log(data);

            location.reload();            
          }
        });
      }      

      $(this.el).html(this.template({ game: this.options.jsonGame }));

      $('.update-btn', $(this.el)).click(function(evt){
        evt.preventDefault();

        $(this).button('loading');

        var elForm = $(this).closest('form');
        updateDetails(elForm);
      });

      $('.remove-btn', $(this.el)).click(function(evt){
        $(this).button('loading');

        removeMedia($(this).attr('data-id'));
      });

      $('.upload-btn', $(this.el)).click(function(evt){
        $(this).button('loading');

        var elForm = $(this).closest('form');
        uploadMedia(elForm);
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
