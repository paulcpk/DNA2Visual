import Ember from 'ember';

export default Ember.Service.extend({
	init() {
	    this._super(...arguments);
	    this.set('items', []);
	},

	exec() {

	}

});
