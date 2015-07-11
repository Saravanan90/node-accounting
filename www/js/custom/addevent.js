( function( app, module ) {
	var addEventViewOpts = {
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
		}
	app.extendModule( 'event', {
		controllerOpts : {
			events: {
				'addIconTapped': 'showAddEvent',
				'closeIconTapped': 'closeHandler',
				'closeAddPopup': 'closePopup',
				'showAddEvent': 'loadAddEventView'
			},
			eventHandlers: {
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
			}
		},
		routerOpts: {
			routes: {
				'projects/:projName/events/add': 'showAddEventPopup',
				'projects/:projName/events/addSubRoute': 'closeAddEventPopup'
			},
			routeHandlers: {
				showAddEventPopup: function( projName ) {
					this.controller.publish('showAddEvent', projName);
				},
				closeAddEventPopup: function() {
					this.controller.publish('closeAddPopup');
				}
			}
		}
	});
}( App, module ) );