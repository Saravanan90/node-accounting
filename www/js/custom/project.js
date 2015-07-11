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
			url: '/project',
			defaults: {
				name: '',
				eMail: '',
				info: '',
				projList: module.getComponent( projectCollectionOpts )
			},
			parse: function( data, options ){
				this.set( data.client );
				this.get('projList').reset( data.projList );
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
				model.fetch({
					data:{ 
						clientName: model.get('name')
					},
					reset: true
				});
			}
		};
	
	app.register( 'project', {
		controllerOpts : {
			type: 'controller',
			events: {
				'showClientDetails': 'showClientDetails',
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
			callEdit: function( project ) {
				this.parent.router.replaceRoute( 'editSubRoute' );
				this.parent.router.triggerRoute( project + '/events' );
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
			rootPath: 'clients/:clientName/projects',
			routes: {
				'clients/:clientName/projects(/summary)': 'showClientDetails',
				'clients/:clientName/projects/editSubRoute': 'navBackToProjects'
			},
			showClientDetails: function( clientName ){
				this.controller.publish('showClientDetails', clientName);
			},
			updateRoot: function( clientName ){
				this.root = this.rootPath.replace(/:clientName/, clientName);
			},
			navBackToProjects: function( clientName ) {
				this.controller.publish('navBackToProjects', clientName);
			}
		}
	});
} )( App, module );