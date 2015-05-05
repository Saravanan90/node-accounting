var projectview = (function() {
	var projectView = Backbone.View.extend({
			el: '#projSummary',
			initialize: function(options) {
				this.template = this.template.project;
				this.target = this.$el.find('#clientDetail');
				this.model = datamodel.getClientDetailModel();
				this.projCollection = this.model.get('projList');
				this.projCollection.bind('reset', this.render, this);
				this.projCollection.bind('add', this.updateProjList, this);
				this.model.bind('change:name', this.fetchProjList, this);
				
				this.addProjViewObj = new addProjView({
					model: this.model
				});
			},
			render: function() {
				this.target.html(this.template( {clientData: this.model.toJSON(), projList: this.projCollection.toJSON(), lastIndex: 0 } ));
				util.transitPage( this.$el );
				this.projListTarget = this.target.find('#projlist');
			},
			updateProjList: function(newProj, response) {
				if(newProj.attributes.code !== 11000){
					this.projListTarget.append( this.template( {clientData: null, projList: [newProj.attributes], lastIndex: this.projCollection.length -1} ) );
				}
			},
			events: {
				'click #addIcon': 'addProject',
				'click .js-editClient': 'editProject'
			},
			addProject: function() {
				var addProjPopup = $('#addProjectPopup');
				addProjPopup.removeClass('scale0');
			},
			editProject: function(event) {
				router.appendUrlWithoutTriggerUpdate( this.el.id );
				var projIndex = event.currentTarget.getAttribute('data-index'),
					targetProj = this.projCollection.at( projIndex ),
					url = targetProj.get('name') + '/events';
				
				router.navigateTo( url );
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
		}),
		addProjView = Backbone.View.extend({
			el: '#addProjectPopup',
			initialize: function(data) {
				this.projCollection = this.model.get('projList');
				this.projCollection.bind('add', this.projAdditionCallBack, this);
			},
			events: {
				'submit form': 'submitModelData',
				'click #closeIcon': 'closePopup'
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
		getProjectView: function(params) {
			return new projectView(params)
		},
		getAddProjView: function(params) {
			return new addProjView(params)
		}
	}
})()