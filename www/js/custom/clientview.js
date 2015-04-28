var clientview = ( function(){
	var	clientView = Backbone.View.extend({
			el: '#clientSummary',
			initialize: function(data) {
				this.template = this.template.client;
				this.target = this.$el.find('#clientlist');
				this.collection.bind('reset', this.render, this );
				this.collection.bind('add', this.updateView, this );
			},
			updateView: function(newClient, response) {
				if(newClient.attributes.code !== 11000){
					this.target.append( this.template( {clients: [newClient.attributes], lastIndex: this.collection.length -1 } ) );
				}
			},
			render: function() {
				this.target.html(this.template( {clients: this.collection.toJSON(), lastIndex: 0 } ));
				router.setWindowHash( 'page/' + this.el.id);
			},
			events: {
				'click #addIcon': 'addClient',
				'click .js-editClient': 'editClient'
			},
			addClient: function() {
				var addClientPopup = $('#addClientPopup');
				addClientPopup.removeClass('scale0').addClass('activePopup');
			},
			editClient: function(event) {
				var clientIndex = event.currentTarget.getAttribute('data-index'),
					targetClient = this.collection.at( clientIndex );
				
				this.model.set( targetClient.toJSON() );
			}
		}),
		addClientView = Backbone.View.extend({
			el: '#addClientPopup',
			initialize: function(data) {
				this.collection.bind('add', this.clientAdditionCallBack, this );
			},
			events: {
				'submit form': 'submitModelData',
				'click #closeIcon': 'closePopup'
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
					this.closePopup();
				}
			},
			clearFields: function() {
				this.$el.find('input[type="text"]').val('');
			},
			closePopup: function() {
				this.$el.addClass('scale0').removeClass('activePopup');
				this.clearFields();
			}
		});
	return{
		getClientView: function(params) {
			return new clientView(params)
		},
		getAddClientView: function(params) {
			return new addClientView(params)
		}
	}

})()