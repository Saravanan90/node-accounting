( function( app, module ) {
	var addProjectViewOpts = {
			type: 'view',
			el: '#addProjectPopup',
			initialize: function(data) {
				this.projCollection = this.model.get('projList');
				this.projCollection.bind('add', this.projAdditionCallBack, this);
			},
			events: {
				'submit form': 'submitModelData',
				'click #closeIcon': 'triggerClose'
			},
			submitModelData: function(event) {
				event.preventDefault();
				var	newProjData = util.getJSON( $(event.currentTarget).serializeArray() );
				newProjData.client = this.model.get('name');
				this.projCollection.create(newProjData,{wait: true});
			},
			projAdditionCallBack: function( data, response ) {
				if(data.attributes.code === 11000){
					alert('Duplicate Project...');
					this.clearFields();
				}else{
					alert('Project Added Successfully...');
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
	app.extendModule( 'project', {
		controllerOpts : {
			events: {
				'addIconTapped': 'showAddProject',
				'closeIconTapped': 'closeHandler',
				'closeAddPopup': 'closePopup',
				'showAddProject': 'loadAddProjectView',
			},
			eventHandlers: {
				loadAddProjectView: function( clientName ) {
					var views = this.parent.views;
					if( ! views.projectView ){
						this.loadClientDetails( clientName );
						util.transitPage( views.projectView.$el );
					}
					var addProjectView = views.addProjectView;
					if( !addProjectView ){
						views.addProjectView = addProjectView = module.getComponent.call( this.parent, addProjectViewOpts, { model: this.parent.models.clientDetail } );
					}
					addProjectView.open();
				},
				showAddProject: function( clientName ) {
					this.parent.router.replaceRoute( 'addSubRoute' );
					this.loadAddProjectView( clientName );
					this.parent.router.updateRoute( 'add' );
				},
				closeHandler: function() {
					window.history.back();
				},
				closePopup: function() {
					var addProjectView = this.parent.views.addProjectView;
					addProjectView.close();
					this.parent.router.replaceRoute( 'summary' );
				}
			}
		},
		routerOpts: {
			routes: {
				'clients/:clientName/projects/add': 'showAddProjectPopup',
				'clients/:clientName/projects/addSubRoute': 'closeAddProjectPopup'
			},
			routeHandlers: {
				showAddProjectPopup: function( clientName ) {
					this.controller.publish('showAddProject', clientName);
				},
				closeAddProjectPopup: function() {
					this.controller.publish('closeAddPopup');
				}
			}
		}
	});
}( App, module ) );