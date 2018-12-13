define([
  'underscore', 
  'backbone',
  'bootstrap'
], function(_, Backbone, bootstrap){

  var RegisterGameCreateView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#registerGameCreateViewTemplate').text());

      this.options = options;
      this.bSponsoredDialogShown = false;

      this.jsonFields = {campaignID: 0,
                         ownerPlayerID: 0,
                         gameID: 0,
                         playerID: 0,
                         levelID: 0,
                         type: '',
                         season: 0,
                         gameStart: '',
                         gameEnd: '',
                         duration: 0,
                         multiplayer: 0}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.campaignID = jsonFields.campaignID;
    },

    createGamePlayer: function() {
      var self = this;

      var jsonData = {};

      var url = GAME_API_URL + 'game/' + this.jsonFields.gameID + '/player/' + this.jsonFields.playerID;
//      console.log(url);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: JSON.stringify(jsonData),
        error: function(data) {
          console.log('error');
          console.log(data);
        },
        success: function(data) {
          $('.create-btn', $(self.el)).button('reset');
          
//          console.log('success');
//          console.log(data);

          // fire event
          app.dispatcher.trigger("RegisterGameCreateView:gameCreated");
        }
      });
    },

    createGame: function() {
      var self = this;

      $('.err', $(this.el)).hide();
      $('.err .msg', $(this.el)).hide();

      this.jsonFields.gameStart = $.format.date(this.startDate.date.valueOf(), 'yyyy-MM-dd');

      var jsonData = {campaignID: this.jsonFields.campaignID,
                      ownerPlayerID: this.jsonFields.playerID,
                      season: this.jsonFields.season,
                      type: this.jsonFields.type,
                      gameStart: this.jsonFields.gameStart,
                      gameDaysDuration: this.jsonFields.duration,
                      levelID: this.jsonFields.level};

      var url = GAME_API_URL + 'game';
//      console.log(url);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: JSON.stringify(jsonData),
        error: function(data) {
          $('.create-btn', $(self.el)).button('reset');

          console.log('error');
          console.log(data);
        },
        success: function(data) {
//          console.log('success');
//          console.log(data);

          if (data.length) {
            self.jsonFields.gameID = data[0].id;
            self.jsonFields.gameEnd = data[0].game_end;
            self.jsonFields.multiplayer = data[0].multiplayer;

            self.createGamePlayer();
          }
        }
      });
    },

    render: function(options){
      var self = this;

      function pillSelected(elPill) {
        var elParent = elPill.closest('.pills');
        if (!elPill.hasClass('active')) {
          $('.pill', elParent).removeClass('active');
          elPill.addClass('active');

          // is this is a sponsored item?
          if (elPill.attr('data-sponsored') && !self.bSponsoredDialogShown) {
            self.bSponsoredDialogShown = true;

            // fire event
            app.dispatcher.trigger("RegisterGameCreateView:sponsoredGameSelected");
          }
        }

        switch (elParent.attr('data-id')) {
          case 'level':
            self.jsonFields.level = elPill.attr('data-id');
            self.jsonFields.season = elPill.attr('data-season-id');
            break;

          case 'type':
            self.jsonFields.type = elPill.attr('data-id');
            break;

          case 'duration':
            self.jsonFields.duration = elPill.attr('data-id');
            break;
        }
      }

      $(this.el).html(this.template({ gameLevels: options.gameLevels, gameOptions: options.gameOptions }));

      // get defaults
      $('.pill.active').each(function(index){
        pillSelected($(this));
      });

      var nowTemp = new Date();
      var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
      this.startDate = $('#dpd1').datepicker({
        format: 'dd/mm/yyyy',
        onRender: function(date) {
          return date.valueOf() < now.valueOf() ? 'disabled' : '';
        }
      }).on('changeDate', function(ev) {
        self.startDate.hide();
      }).data('datepicker');

      // def start today
      var dtStart = now;
      dtStart.setDate(dtStart.getDate());
      this.startDate.setValue(dtStart);

      $('.pill', $(self.el)).click(function(evt){
        pillSelected($(this));
      });

      var elForm = $('form', $(this.el));
      elForm.submit(function(evt){
        evt.preventDefault();

        var bValid = validateForm($(this));
        if (bValid) {
          $('.create-btn', $(self.el)).button('loading');

          self.createGame();
        }
      });

      return this;
    }

  });

  return RegisterGameCreateView;
});
