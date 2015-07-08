( function( app, module ){
	var eventSummaryModelOpts = {
			type: 'model',
			//	used to define any client side validations for the models saved in eventCollection.
			defaults: {
				name: '',
				time: '',
				project: ''
			}
		},
		eventCollectionOpts = {
			type: 'collection',
			url: '/event',
			model: module.getComponent( eventSummaryModelOpts, false )
		},
		projDetailModelOpts = {
			type: 'model',
			defaults: {
				name: '',
				cost: '',
				client: '',
				eventList: module.getComponent( eventCollectionOpts )
			}
		},
		eventViewOpts = {
			type: 'view',
			el: '#eventSummary',
			initialize: function() {
				this.template = this.template.event;
				this.target = this.$el.find('#projDetail');
				this.eventCollection = this.model.get('eventList');
				this.eventCollection.bind('reset', this.render, this);
				this.eventCollection.bind('add', this.updateEventList, this);
				this.model.bind('change:name', this.fetchEventList, this);
			},
			events: {
				'click #addIcon': 'addEvent'
			},
			render: function() {
				this.target.html(this.template( {projData: this.model.toJSON(), eventList: this.eventCollection.toJSON() } ));
				this.eventListTarget = this.target.find('#eventlist');
			},
			updateEventList: function(newEvent, response) {
				if(newEvent.attributes.code !== 11000){
					this.eventListTarget.append( this.template( {projData: null, eventList: [newEvent.attributes]} ) );
				}
			},
			addEvent: function() {
				this.controller.publish('addIconTapped');
			},
			fetchEventList: function() {
				var model = this.model;
				model.get('eventList').fetch({
					data:{
						projName: model.get('name')
					},
					reset: true
				});
			}
		},
		addEventViewOpts = {
			type: 'view',
			el: '#addEventPopup',
			initialize: function(data) {
				this.eventCollection = this.model.get('eventList');
				this.eventCollection.bind('add', this.eventAdditionCallBack, this);
			},
			events: {
				'submit form': 'submitModelData',
				'click #closeIcon': 'triggerClose'
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
					this.triggerClose();
				}
			},
			triggerClose: function() {
				this.controller.publish('closeIconTapped');
			},
			clearFields: function() {
				this.$el.find('input[type="text"]').val('');
			},
			open: function() {
				this.$el.removeClass('scale0');
			},
			close: function() {
				this.$el.addClass('scale0');
				this.clearFields();
			}
		};
	
	app.register( 'event', {
		controllerOpts : {
			type: 'controller',
			events: {
				'showProjDetails': 'showProjDetails',
				'addIconTapped': 'showAddEvent',
				'closeIconTapped': 'closeHandler',
				'closeAddPopup': 'closePopup',
				'showAddEvent': 'loadAddEventView'
			},
			loadProjDetails: function( projName ) {
				var views = this.parent.views,
					eventView = views.eventView;
				if( ! eventView ){
					var projDetail = this.parent.models.projDetail = module.getComponent.call( this.parent, projDetailModelOpts );
					eventView =  views.eventView = module.getComponent.call( this.parent, eventViewOpts, { model: projDetail } );
				}
				if( app.getLaunchData ){
					var launchData = app.getLaunchData();
					eventView.model.set(launchData.project, {silent: true});
					eventView.eventCollection.reset(launchData.eventList);
				}else{
					eventView.model.set('name', projName, {silent: true});
					eventView.model.trigger('change:name');
				}
				util.transitPage( eventView.$el );
				this.parent.router.updateRoot( projName );
			},
			showProjDetails: function( projName ) {
				this.loadProjDetails( projName );
				this.parent.router.replaceRoute( 'summary' );
			},
			loadAddEventView: function( projName ) {
				var views = this.parent.views;
				if( ! views.eventView ){
					this.loadProjDetails( projName );
				}
				var addEventView = views.addEventView;
				if( !addEventView ){
					views.addEventView = addEventView = module.getComponent.call( this.parent, addEventViewOpts, { model: this.parent.models.projDetail } );
				}
				addEventView.open();
			},
			showAddEvent: function( projName ) {
				this.parent.router.replaceRoute( 'addSubRoute' );
				this.loadAddEventView( projName );
				this.parent.router.updateRoute( 'add' );
			},
			closeHandler: function() {
				window.history.back();
			},
			closePopup: function() {
				var addEventView = this.parent.views.addEventView;
				addEventView.close();
				this.parent.router.replaceRoute( 'summary' );
			}
		},
		routerOpts: {
			type: 'router',
			root: 'projects/:projName/events',
			routes: {
				'(*url/)projects/:projName/events(/summary)': 'showProjDetails',
				'projects/:projName/events/add': 'showAddEventPopup',
				'projects/:projName/events/addSubRoute': 'closeAddEventPopup',
			},
			showProjDetails: function( url, projName ){
				this.controller.publish('showProjDetails', projName);
			},
			updateRoot: function( projName ){
				this.root = this.root.replace(/:projName/, projName);
			},
			showAddEventPopup: function( projName ) {
				this.controller.publish('showAddEvent', projName);
			},
			closeAddEventPopup: function() {
				this.controller.publish('closeAddPopup');
			}
		}
	});
} )( App, module );