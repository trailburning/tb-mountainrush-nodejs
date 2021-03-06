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
      this.currGame = null;

      this.jsonFields = {campaignID: 0,
                        campaignStartDate: '',
                        campaignEndDate: '',
                         ownerPlayerID: 0,
                         gameID: 0,
                         playerID: 0,
                         levelID: 0,
                         type: '',
                         season: 0,
                         gameStart: '',
                         gameEnd: '',
                         duration: 0,
                         multiplayer: 0,
                         content: 0,
                         games: null}
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.campaignID = jsonFields.campaignID;
      this.jsonFields.campaignStartDate = jsonFields.campaignStartDate;
      this.jsonFields.campaignEndDate = jsonFields.campaignEndDate;

      // see if there's an active game
      this.currGame = _.where(this.jsonFields.games, {game_state:'active'})[0];
      if (!this.currGame) {
        this.currGame = _.where(this.jsonFields.games, {game_state:'pending'})[0];
      }
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
            self.jsonFields.content = data[0].content;

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
//            app.dispatcher.trigger("RegisterGameCreateView:sponsoredGameSelected");
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

      $(this.el).html(this.template({ currGame: self.currGame, gameLevels: options.gameLevels, gameSelLevel: LEVEL_ID, gameOptions: options.gameOptions }));

      // get defaults
      $('.pill.active').each(function(index){
        pillSelected($(this));
      });

      var dtTemp = new Date();
      // do we have a campaign start date?
      if (this.jsonFields.campaignStartDate) {
        dtTemp = new Date(this.jsonFields.campaignStartDate);
      }
      var dtMinStart = new Date(dtTemp.getFullYear(), dtTemp.getMonth(), dtTemp.getDate(), 0, 0, 0, 0);

      var dtMaxStart = null;
      // do we have a campaign end date?
      if (this.jsonFields.campaignEndDate) {
        dtMaxStart = new Date(this.jsonFields.campaignEndDate);
        dtMaxStart = new Date(dtMaxStart.getFullYear(), dtMaxStart.getMonth(), dtMaxStart.getDate(), 0, 0, 0, 0);
      }

      this.startDate = $('#dpd1').datepicker({
        format: 'dd/mm/yyyy',
        onRender: function(date) {
          if (dtMaxStart) {
            return (date.valueOf() < dtMinStart.valueOf() || date.valueOf() > dtMaxStart.valueOf()) ? 'disabled' : '';
          }
          else {
            return date.valueOf() < dtMinStart.valueOf() ? 'disabled' : '';
          }
        }
      }).on('changeDate', function(ev) {
        self.startDate.hide();
      }).data('datepicker');

      // def start today
      if (this.startDate) {
        var dtStart = dtMinStart;
        dtStart.setDate(dtStart.getDate());
        this.startDate.setValue(dtStart);
      }

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
