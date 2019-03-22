define([
  'underscore', 
  'backbone'
], function(_, Backbone){

  var SponsorView = Backbone.View.extend({
    initialize: function(options){
      this.template = _.template($('#sponsorBigViewTemplate').text());

      this.options = options;

      this.jsonFields = {totalRaisedPercentageOfFundraisingTarget: 0,
                        currencySymbol: '£',
                        totalRaisedOnline: 0,
                        fundraisingTarget: 0
                        }
    },

    getFields: function() {
      return this.jsonFields;
    },

    setFields: function(jsonFields) {
      this.jsonFields.totalRaisedPercentageOfFundraisingTarget = jsonFields.totalRaisedPercentageOfFundraisingTarget;
      this.jsonFields.currencySymbol = jsonFields.currencySymbol;;
      this.jsonFields.totalRaisedOnline = jsonFields.totalRaisedOnline;;
      this.jsonFields.fundraisingTarget = jsonFields.fundraisingTarget;;
    },
    
    render: function(jsonCurrGame){
      $(this.el).html(this.template({page: this.jsonFields, game: jsonCurrGame}));

      return this;
    }

  });

  return SponsorView;
});
