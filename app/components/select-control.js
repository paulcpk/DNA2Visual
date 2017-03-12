import Ember from 'ember';

export default Ember.Component.extend({
	tagName: '',
	currentValue: 'base-4',
	selectId: null,
	init() {
		this._super(...arguments);
		this.sendAction('update', this.selectId, this.currentValue);
	},
	actions: {
		getSelectValue(currentValue) {
			this.sendAction('update', this.selectId, currentValue);
		}
	}
});
