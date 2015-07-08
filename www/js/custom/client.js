( function( app, module ) {
	var clientModelOpts = {
			type: 'model',
			//	used to define any client side validations for the models saved in clientCollection.
			defaults: {
				name: '',
				eMail: '',
				info: ''
			}
		},
		clientCollectionOpts = {
			type: 'collection',
			url: '/client',
			model: module.getComponent( clientModelOpts, false )
		},
		clientViewOpts = {
			type: 'view',
			el: '#clientSummary',
			initialize: function( params ) {
				this.template = this.template.client;
				this.renderTarget = this.$el.find('#clientlist');
				this.collection = params.collection;
				this.collection.bind('reset', this.render, this );
				this.collection.bind('add', this.updateView, this );
			},
			events: {
				'click #addIcon': 'addClient',
				'click .js-editClient': 'editClient'
			},
			updateView: function(newClient, response) {
				if(newClient.attributes.code !== 11000){
					this.renderTarget.append( this.template( {clients: [newClient.attributes], lastIndex: this.collection.length -1 } ) );
				}
			},
			render: function() {
				this.renderTarget.html(this.template( {clients: this.collection.toJSON(), lastIndex: 0 } ));
			},
			addClient: function() {
				this.controller.publish('addIconTapped');
			},
			editClient: function(event) {
				var clientIndex = event.currentTarget.getAttribute('data-index'),
					targetClient = this.collection.at( clientIndex ),
					clientName = targetClient.get('name');
				
				this.controller.publish( 'editClient', clientName );
			}
		},
		addClientViewOpts = {
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
	app.register( 'client', {
		controllerOpts : {
			type: 'controller',
			events: {
				'showClientsList': 'showClientView',
				'addIconTapped': 'showAddClient',
				'showAddClientView': 'loadAddClientView',
				'closeIconTapped': 'closeHandler',
				'closeAddPopup': 'closePopup',
				'editClient': 'callEdit',
				'navBackToClients': 'backToClients'
			},
			loadClientView: function() {
				var views = this.parent.views;
				if( ! views.clientView ){
					var clientList = this.parent.collections.clientList = module.getComponent.call( this.parent, clientCollectionOpts );
					views.clientView = module.getComponent.call( this.parent, clientViewOpts, { collection: clientList } );
					if( App.getLaunchData ){
						clientList.reset( App.getLaunchData().clients );
					}else{
						clientList.fetch({reset: true});
					}
				}
			},
			showClientView: function() {
				this.loadClientView();
				util.transitPage( this.parent.views.clientView.$el );
				this.parent.router.updateRoute( 'summary' );
			},
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
			},
			callEdit: function( client ) {
				this.parent.router.replaceRoute( 'editSubRoute' );
				this.parent.router.triggerRoute( client + '/projects' );
			},
			backToClients: function() {
				var views = this.parent.views;
				if( ! views.clientView ){
					this.loadClientView();
				}
				util.transitPage( views.clientView.$el, { reverse: true } );
				this.parent.router.replaceRoute( 'summary' );
			}
		},
		routerOpts: {
			type: 'router',
			root: 'clients',
			routes: {
				'(clients/summary)': 'showClientsList',
				'(clients/add)': 'showAddClientView',
				'clients/editSubRoute': 'navBackToClients',
				'clients/addSubRoute': 'closeAddClientPopup'
			},
			closeAddClientPopup: function() {
				this.controller.publish('closeAddPopup');
			},
			showClientsList: function(){
				this.controller.publish('showClientsList');
			},
			showAddClientView: function(){
				this.controller.publish('showAddClientView');
			},
			navBackToClients: function() {
				this.controller.publish('navBackToClients');
			}
		}
	});
}( App, module ) );