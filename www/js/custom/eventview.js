var eventview = (function() {
	var eventView = Backbone.View.extend({
			el: '#eventSummary',
			initialize: function() {
				this.template = this.template.event;
				this.target = this.$el.find('#projDetail');
				this.model = datamodel.getProjDetailModel();
				this.eventCollection = this.model.get('eventList');
				this.eventCollection.bind('reset', this.render, this);
				this.eventCollection.bind('add', this.updateEventList, this);
				this.model.bind('change:name', this.fetchEventList, this);
				
				this.addEventViewObj = new addEventView({
					model: this.model
				});
			},
			render: function() {
				this.target.html(this.template( {projData: this.model.toJSON(), eventList: this.eventCollection.toJSON() } ));
				util.transitPage( this.$el );
				this.eventListTarget = this.target.find('#eventlist');
			},
			updateEventList: function(newEvent, response) {
				if(newEvent.attributes.code !== 11000){
					this.eventListTarget.append( this.template( {projData: null, eventList: [newEvent.attributes]} ) );
				}
			},
			events: {
				'click #addIcon': 'addEvent'
			},
			addEvent: function() {
				var addProjPopup = $('#addEventPopup');
				addProjPopup.removeClass('scale0');
			},
			fetchEventList: function() {
				var model = this.model;
				model.get('eventList').fetch({
					data:{
						projName: model.get('name')
					},
					reset: true,
					success: function(model, response, options) {
					},
					error: function(model, response, options) {			
					}
				});
			}
		}),
		addEventView = Backbone.View.extend({
			el: '#addEventPopup',
			initialize: function(data) {
				this.eventCollection = this.model.get('eventList');
				this.eventCollection.bind('add', this.eventAdditionCallBack, this);
			},
			events: {
				'submit form': 'submitModelData',
				'click #closeIcon': 'closePopup'
			},
			submitModelData: function(event) {
				event.preventDefault();
				var	newEventData = util.getJSON( $(event.currentTarget).serializeArray() );
				newEventData.project = this.model.get('name');
				this.eventCollection.create(newEventData,{wait: true});
			},
			eventAdditionCallBack: function( data, response ) {
				if(data.attributes.code === 11000){
					alert('Duplicate Event...');
					this.clearFields();
				}else{
					alert('Event Added Successfully...');
					this.closePopup();
				}
			},
			clearFields: function() {
				this.$el.find('input[type="text"]').val('');
			},
			closePopup: function() {
				this.$el.addClass('scale0');
				this.clearFields();
			}
		});
	return{
		getEventView: function(params) {
			return new eventView(params)
		},
		getAddEventView: function(params) {
			return new addEventView(params)
		}
	}
})()