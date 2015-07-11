( function( app, module ) {
	var addClientViewOpts = {
			type: 'view',
			el: '#addClientPopup',
			initialize: function(data) {
				this.collection.bind('add', this.clientAdditionCallBack, this );
			},
			events: {
				'submit form': 'submitModelData',
				'click #closeIcon': 'triggerClose'
			},
			submitModelData: function(event) {
				event.preventDefault();
				var	newClientData = util.getJSON( $(event.currentTarget).serializeArray() );
				this.collection.create(newClientData,{wait: true});
			},
			clientAdditionCallBack: function( data, response ) {
				if(data.attributes.code === 11000){
					alert('Duplicate Client...');
					this.clearFields();
				}else{
					alert('Client Added Successfully...');
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
	app.extendModule( 'client', {
		controllerOpts : {
			events: {
				'addIconTapped': 'showAddClient',
				'showAddClientView': 'loadAddClientView',
				'closeIconTapped': 'closeHandler',
				'closeAddPopup': 'closePopup'
			},
			eventHandlers: {
				loadAddClientView: function() {
					var views = this.parent.views;
					if( ! views.clientView ){
						this.loadClientView();
					}
					var addClientView = views.addClientView;
					if( !addClientView ){
						views.addClientView = addClientView = module.getComponent.call( this.parent, addClientViewOpts, { collection: this.parent.collections.clientList } );
					}
					addClientView.open();
				},
				showAddClient: function() {
					this.parent.router.replaceRoute( 'addSubRoute' );
					this.loadAddClientView();
					this.parent.router.updateRoute( 'add' );
				},
				closeHandler: function() {
					window.history.back();
				},
				closePopup: function() {
					var addClientView = this.parent.views.addClientView;
					addClientView.close();
					this.parent.router.replaceRoute( 'summary' );
				}
			}
		},
		routerOpts: {
			routes: {
				'(clients/add)': 'showAddClientView',
				'clients/addSubRoute': 'closeAddClientPopup'
			},
			routeHandlers: {
				closeAddClientPopup: function() {
					this.controller.publish('closeAddPopup');
				},
				showAddClientView: function(){
					this.controller.publish('showAddClientView');
				}
			}
		}
	});
}( App, module ) );