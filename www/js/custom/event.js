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
			url: '/event',
			defaults: {
				name: '',
				cost: '',
				client: '',
				eventList: module.getComponent( eventCollectionOpts )
			},
			parse: function( data, options ){
				this.set( data.project );
				this.get('eventList').reset( data.eventList );
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
				model.fetch({
					data:{
						projName: model.get('name')
					},
					reset: true
				});
			}
		};
	
	app.register( 'event', {
		controllerOpts : {
			type: 'controller',
			events: {
				'showProjDetails': 'showProjDetails'
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
			}
		},
		routerOpts: {
			type: 'router',
			rootPath: 'projects/:projName/events',
			routes: {
				'(*url/)projects/:projName/events(/summary)': 'showProjDetails'
			},
			showProjDetails: function( url, projName ){
				this.controller.publish('showProjDetails', projName);
			},
			updateRoot: function( projName ){
				this.root = this.rootPath.replace(/:projName/, projName);
			}
		}
	});
} )( App, module );