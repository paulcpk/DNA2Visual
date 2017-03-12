import Ember from 'ember';

export function containerClass(params) {
  let [hasError, finishedRender, isLoading] = params;
  if (hasError) {
  	return 'has-error';
  } else {
    if (finishedRender) {
    	return 'finished-render';
    } else if (isLoading) {
      return 'is-loading';
    }
  }
}

export default Ember.Helper.helper(containerClass);
