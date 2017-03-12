import Ember from 'ember';

export default Ember.Controller.extend({
	dnaInput: '',
	isLoading: false,
	hasError: false,
	finishedRender: false,
	settings: {
		squareRoot: 200,
		sideLength: 800,
		maxLength: 3000000,
		mode: 'base-4',
		numBase: 4
	},
	actions: {
		renderData(data) {
			let base = this;
			// if result is valid 
			if (data.length > 0) {
				// clean error class
				base.set('hasError', false);
				base.set('finishedRender', false);

				let formatData = new Worker('/workers/format-data.js');
				// activate loading spinner
				base.set('isLoading', true);
				// Post DNA string to Worker
				formatData.postMessage([data, base.settings]);
				// return results
				formatData.onmessage = function(event) {
					// deactivate loading spinner
					base.set('isLoading', false);
					// changes the class and hides the intro text
					base.set('finishedRender', true);
					// update settings
					base.set('settings', event.data[1]);
					// execute canvas drawing
					base.send('drawCanvas', event.data[0]);
				};
			} else {
				base.set('hasError', true);
			}

		},

		drawCanvas(rgbArray) {
			let canvas =document.getElementById('dnaDisplay');
			let ctx = canvas.getContext('2d');
			let squareRoot = this.settings.squareRoot;
			let pixelSize = this.settings.sideLength / squareRoot;
			let k = 0;

			for (let i=0;i<squareRoot;i++) {
			  for (let j=0;j<squareRoot;j++) {
			    ctx.fillStyle = rgbArray[k];
					ctx.fillRect(j*pixelSize, i*pixelSize, pixelSize, pixelSize);
			    k++;
			  }
			}

		},

		logSelect(value) {
			this.set('settings.mode', value);
			let numBase = value === 'base-4' ? 4 : 3;
			this.set('settings.numBase', numBase);
		},

		downloadImage() {
			// when download button is clicked, provide PNG
		  let downloadStream = document.getElementById('dnaDisplay').toDataURL('image/png');
		  downloadStream = downloadStream.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
		  downloadStream = downloadStream.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
		  document.getElementById('downloadButton').setAttribute('href', downloadStream);
		}

	}
});
