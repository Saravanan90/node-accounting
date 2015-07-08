( function( app, module ){
	var projSummaryModelOpts = {
			type: 'model',
			//	used to define any client side validations for the models saved in projCollection.
			defaults: {
				name: '',
				cost: '',
				client: ''
			}
		},
		projectCollectionOpts = {
			type: 'collection',
			url: '/project',
			model: module.getComponent( projSummaryModelOpts, false )
		},
		clientDetailModelOpts = {
			type: 'model',
			defaults: {
				name: '',
				eMail: '',
				info: '',
				projList: module.getComponent( projectCollectionOpts )
			}
		},
		projectViewOpts = {
			type: 'view',
			el: '#projSummary',
			initialize: function(options) {
				this.template = this.template.project;
				this.target = this.$el.find('#clientDetail');
				this.projCollection = this.model.get('projList');
				this.projCollection.bind('reset', this.render, this);
				this.projCollection.bind('add', this.updateProjList, this);
				this.model.bind('change:name', this.fetchProjList, this);
			},
			events: {
				'click #addIcon': 'addProject',
				'click .js-editClient': 'editProject'
			},
			render: function() {
				this.target.html(this.template( {clientData: this.model.toJSON(), projList: this.projCollection.toJSON(), lastIndex: 0 } ));
				this.projListTarget = this.target.find('#projlist');
			},
			updateProjList: function(newProj, response) {
				if(newProj.attributes.code !== 11000){
					this.projListTarget.append( this.template( {clientData: null, projList: [newProj.attributes], lastIndex: this.projCollection.length -1} ) );
				}
			},
			addProject: function() {
				this.controller.publish('addIconTapped');
			},
			editProject: function(event) {
				var projIndex = event.currentTarget.getAttribute('data-index'),
					targetProj = this.projCollection.at( projIndex ),
					projectName = targetProj.get('name');
				this.controller.publish( 'editClient', projectName );
			},
			fetchProjList: function() {
				var model = this.model;
				model.get('projList').fetch({
					data:{ 
						clientName: model.get('name')
					},
					reset: true,
					success: function(model, response, options) {
					},
					error: function(model, response, options) {			
					}
				});
			}
		},
		addProjectViewOpts = {
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
		};
	
	app.register( 'project', {
		controllerOpts : {
			type: 'controller',
			events: {
				'showClientDetails': 'showClientDetails',
				'addIconTapped': 'showAddProject',
				'closeIconTapped': 'closeHandler',
				'closeAddPopup': 'closePopup',
				'showAddProject': 'loadAddProjectView',
				'editClient': 'callEdit',
				'navBackToProjects': 'backToProjects'
			},
			loadClientDetails: function( clientName ) {
				var views = this.parent.views,
					projectView = views.projectView;
				if( ! projectView ){
					var clientDetail = this.parent.models.clientDetail = module.getComponent.call( this.parent, clientDetailModelOpts );
					projectView =  views.projectView = module.getComponent.call( this.parent, projectViewOpts, { model: clientDetail } );
				}
				if( app.getLaunchData ){
					var launchData = app.getLaunchData();
					projectView.model.set(launchData.client, {silent: true});
					projectView.projCollection.reset(launchData.projList);
				}else{
					projectView.model.set('name', clientName, {silent: true});
					projectView.model.trigger('change:name');
				}
				this.parent.router.updateRoot( clientName );
			},
			showClientDetails: function( clientName ) {
				this.loadClientDetails( clientName );
				util.transitPage( this.parent.views.projectView.$el );
				this.parent.router.replaceRoute( 'summary' );
			},
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
			callEdit: function( project ) {
				this.parent.router.replaceRoute( 'editSubRoute' );
				this.parent.router.triggerRoute( project + '/events' );
			},
			closeHandler: function() {
				window.history.back();
			},
			closePopup: function() {
				var addProjectView = this.parent.views.addProjectView;
				addProjectView.close();
				this.parent.router.replaceRoute( 'summary' );
			},
			backToProjects: function( clientName ) {
				var views = this.parent.views;
				if( ! views.projectView ){
					this.loadClientDetails( clientName );
				}
				util.transitPage( views.projectView.$el, { reverse: true } );
				this.parent.router.replaceRoute( 'summary' );
			}
		},
		routerOpts: {
			type: 'router',
			root: 'clients/:clientName/projects',
			routes: {
				'clients/:clientName/projects(/summary)': 'showClientDetails',
				'clients/:clientName/projects/add': 'showAddProjectPopup',
				'clients/:clientName/projects/addSubRoute': 'closeAddProjectPopup',
				'clients/:clientName/projects/editSubRoute': 'navBackToProjects'
			},
			showClientDetails: function( clientName ){
				this.controller.publish('showClientDetails', clientName);
			},
			updateRoot: function( clientName ){
				this.root = this.root.replace(/:clientName/, clientName);
			},
			showAddProjectPopup: function( clientName ) {
				this.controller.publish('showAddProject', clientName);
			},
			closeAddProjectPopup: function() {
				this.controller.publish('closeAddPopup');
			},
			navBackToProjects: function( clientName ) {
				this.controller.publish('navBackToProjects', clientName);
			}
		}
	});
} )( App, module );