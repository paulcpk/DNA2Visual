// Web-Worker for formatting data

// init setting variable
let settings;

// create utility functions
const Util = {

	convertStringToArray(string) {
	    let cleanString = string.trim().toUpperCase().replace(/(\r\n|\n|\r)/gm,'').slice(0, settings.maxLength);

	    if (settings.mode === 'base-4') {
				cleanString = Util.convertToNumbers(cleanString);
				settings.squareRoot = Math.floor(Math.sqrt(cleanString.length / settings.numBase / 3));
	    } else if (settings.mode === 'amino-acids') {
	    	settings.squareRoot = Math.floor(Math.sqrt(cleanString.length / settings.numBase));
	    }

	    let re = new RegExp('.{1,' + settings.numBase + '}', 'g');

	    return cleanString.match(re);
	},

	convertValueToRgb(string) {
	    return parseInt(string, settings.numBase);
	},

	convertValueToCodon(string) {
	    let mapObj = {
	       TTT: '#FFE75F',
	       TTC: '#FFE75F',
	       TTA: '#FFE75F',
	       TTG: '#FFE75F',
	       CTT: '#FFE75F',
	       CTC: '#FFE75F',
	       CTA: '#FFE75F',
	       CTG: '#FFE75F',
	       ATT: '#FFE75F',
	       ATC: '#FFE75F',
	       ATA: '#FFE75F',
	       ATG: '#FFE75F',
	       GTT: '#FFE75F',
	       GTC: '#FFE75F',
	       GTA: '#FFE75F',
	       GTG: '#FFE75F',
	       CCT: '#FFE75F',
	       CCC: '#FFE75F',
	       CCA: '#FFE75F',
	       CCG: '#FFE75F',
	       GCT: '#FFE75F',
	       GCC: '#FFE75F',
	       GCA: '#FFE75F',
	       GCG: '#FFE75F',
	       TGG: '#FFE75F',
	       GGT: '#FFE75F',
	       GGC: '#FFE75F',
	       GGA: '#FFE75F',
	       GGG: '#FFE75F',
	       TCT: '#B3DEC0',
	       TCC: '#B3DEC0',
	       TCA: '#B3DEC0',
	       TCG: '#B3DEC0',
	       AGT: '#B3DEC0',
	       AGC: '#B3DEC0',
	       ACT: '#B3DEC0',
	       ACC: '#B3DEC0',
	       ACA: '#B3DEC0',
	       ACG: '#B3DEC0',
	       TAT: '#B3DEC0',
	       TAC: '#B3DEC0',
	       CAA: '#B3DEC0',
	       CAG: '#B3DEC0',
	       AAT: '#B3DEC0',
	       AAC: '#B3DEC0',
	       TGT: '#B3DEC0',
	       TGC: '#B3DEC0',
	       CAT: '#BBBFE0',
	       CAC: '#BBBFE0',
	       AAA: '#BBBFE0',
	       AAG: '#BBBFE0',
	       CGT: '#BBBFE0',
	       CGC: '#BBBFE0',
	       CGA: '#BBBFE0',
	       CGG: '#BBBFE0',
	       AGA: '#BBBFE0',
	       AGG: '#BBBFE0',
	       GAT: '#F8B7D3',
	       GAC: '#F8B7D3',
	       GAA: '#F8B7D3',
	       GAG: '#F8B7D3',
	       TAA: '#333333',
	       TGA: '#333333',
	       TAG: '#333333'
	    };
	    let hexString = string.replace(/TTT|TTC|TTA|TTG|CTT|CTC|CTA|CTG|ATT|ATC|ATA|ATG|GTT|GTC|GTA|GTG|CCT|CCC|CCA|CCG|GCT|GCC|GCA|GCG|TGG|GGT|GGC|GGA|GGG|TCT|TCC|TCA|TCG|AGT|AGC|ACT|ACC|ACA|ACG|TAT|TAC|CAA|CAG|AAT|AAC|TGT|TGC|CAT|CAC|AAA|AAG|CGT|CGC|CGA|CGG|AGA|AGG|GAT|GAC|GAA|GAG|TAA|TGA|TAG/gi, function(matched) {
	      return mapObj[matched];
	    });
	    return hexString;
	},

	convertToNumbers(string) {
	  let mapObj = {
	     A:"0",
	     C:"1",
	     G:"2",
	     T:"3",
	     U:"3"
	  };
	  let numberString = string.replace(/A|C|G|T|U/gi, function(matched) {
	    return mapObj[matched];
	  });
	  return numberString;
	},

	convertColor(rgbArray) {
		let canvasValues = [];
		for (let i=0;i<rgbArray.length;i = i+3) {
				canvasValues.push('rgb(' + 
							Util.convertValueToRgb(rgbArray[i]) + ',' +
							Util.convertValueToRgb(rgbArray[i+1]) + ',' +
							Util.convertValueToRgb(rgbArray[i+2]) + ')');
		}
		return canvasValues;
	},

	convertCodons(rgbArray) {
		let canvasValues = [];
		for (let i=0;i<rgbArray.length;i++) {
			canvasValues.push(Util.convertValueToCodon(rgbArray[i]));
		}
		return canvasValues;
	}

};

onmessage = function(event) {
	// cache data
	let data = event.data[0];
	let mainSettings = event.data[1];
	// set local variable to settings from main thread
	settings = mainSettings;

	let valueArray = Util.convertStringToArray(data);
	let rgbArray;

	// do differend conversions based on the mode selected
	if (settings.mode === 'base-4') {
  	rgbArray = Util.convertColor(valueArray);
	} else if (settings.mode === 'amino-acids') {
  	rgbArray = Util.convertCodons(valueArray);
	}

  	//communicate with the main thread
	postMessage([rgbArray, settings]);
};
