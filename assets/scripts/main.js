/* ========================================================================
 * Main JS
 * ======================================================================== */

(function($) {

    // An object literal
    var DNA = {
        dnaString: '',
        squareRoot: 200,
        sideLength: 800,
        maxLength: 3000000,
        mode: 'base-4',
        numBase: 4,
        canvas: document.getElementById('dnaDisplay'),

        init: function( settings ) {
          // set settings
          DNA.settings = settings;

          var form = $('#dnaForm');
          var displayContainer = $('#dnaDisplayContainer');
          var downloadButton = $('#downloadButton');
          var canvas = $('#dnaDisplay');
          var introduction = $('#introduction');
          var exampleLinks = $('.example-link');
          var examplesModal = $('#examplesModal');
          var aminoacidTypes = $('#aminoacidTypes');

          form.on('submit', function(e) {
            e.preventDefault();

            var result = form.serializeArray();

            // if result is valid 
            if (result[1].value.length > 0) {

              introduction.hide();
              form.find('textarea').removeClass('error');

              DNA.mode = result[0].value;
              DNA.numBase = result[0].value === 'base-4' ? 4 : 3;

              var rgbArray = DNA.convertStringToArray(result[1].value);

              if (DNA.mode === 'base-4') {
                aminoacidTypes.hide();
                // downloadButton.show();
                DNA.executeColor(rgbArray);
              } else {
                aminoacidTypes.show();
                // downloadButton.hide();
                DNA.executeCodons(rgbArray);
              }

              displayContainer.show();
            } else {
              displayContainer.hide();
              introduction.show();
              form.find('textarea').addClass('error');
            }

          });

          // when download button is clicked, provide PNG
          downloadButton.on('click', function(e) {
            // e.preventDefault();
            var downloadStream = DNA.canvas.toDataURL('image/png');
            downloadStream = downloadStream.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
            downloadStream = downloadStream.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
            downloadButton.attr('href', downloadStream);
          });

          // close example modale when user clicks link
          exampleLinks.on('click', function(e) {
            examplesModal.modal('hide');
          });

        },
     
        convertStringToArray: function(string) {
            console.time('convert');
            var cleanString = string.trim().toUpperCase().replace(/(\r\n|\n|\r)/gm,'').slice(0, DNA.maxLength);

            if (DNA.mode === 'base-4') {
              cleanString = DNA.convertToNumbers(cleanString);
              DNA.squareRoot = Math.floor(Math.sqrt(cleanString.length / DNA.numBase / 3));
            } else {
              DNA.squareRoot = Math.floor(Math.sqrt(cleanString.length / DNA.numBase));
            }

            var re = new RegExp('.{1,' + DNA.numBase + '}', 'g');
            var returnArray = cleanString.match(re);
            
            // console.log(returnArray);
            return returnArray;
        },

        convertValueToRgb: function(string) {
            return parseInt(string, DNA.numBase);
        },

        convertValueToCodon: function(string) {
            var mapObj = {
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
            hexString = string.replace(/TTT|TTC|TTA|TTG|CTT|CTC|CTA|CTG|ATT|ATC|ATA|ATG|GTT|GTC|GTA|GTG|CCT|CCC|CCA|CCG|GCT|GCC|GCA|GCG|TGG|GGT|GGC|GGA|GGG|TCT|TCC|TCA|TCG|AGT|AGC|ACT|ACC|ACA|ACG|TAT|TAC|CAA|CAG|AAT|AAC|TGT|TGC|CAT|CAC|AAA|AAG|CGT|CGC|CGA|CGG|AGA|AGG|GAT|GAC|GAA|GAG|TAA|TGA|TAG/gi, function(matched){
              return mapObj[matched];
            });
            return hexString;
        },

        convertToNumbers: function(string) {
          var mapObj = {
             A:"0",
             C:"1",
             G:"2",
             T:"3",
             U:"3"
          };
          numberString = string.replace(/A|C|G|T|U/gi, function(matched){
            return mapObj[matched];
          });
          return numberString;
        },
     
        readSettings: function() {
            console.log( DNA.settings );
        },

        executeColor: function(rgbArray) {
          var ctx = DNA.canvas.getContext('2d');
          var squareRoot = DNA.squareRoot;
          var pixelSize = DNA.sideLength / squareRoot;
          var k = 0;
          for (var i=0;i<squareRoot;i++) {
            for (var j=0;j<squareRoot;j++) {
              ctx.fillStyle = 'rgb(' + 
                               DNA.convertValueToRgb(rgbArray[k]) + ',' +
                               DNA.convertValueToRgb(rgbArray[k+1]) + ',' +
                               DNA.convertValueToRgb(rgbArray[k+2]) + ')';

              ctx.fillRect(j*pixelSize, i*pixelSize, pixelSize, pixelSize);

              k = k+3;
            }
          }

          console.timeEnd('convert');
        },

        executeCodons: function(rgbArray) {
          var ctx = DNA.canvas.getContext('2d');
          var squareRoot = DNA.squareRoot;
          var pixelSize = DNA.sideLength / squareRoot;
          var k = 0;
          for (var i=0;i<squareRoot;i++) {
            for (var j=0;j<squareRoot;j++) {
              ctx.fillStyle = DNA.convertValueToCodon(rgbArray[k]);

              ctx.fillRect(j*pixelSize, i*pixelSize, pixelSize, pixelSize);

              k++;
            }
          }

          console.timeEnd('convert');
        }
        
    };

    DNA.init();
  
    

})(jQuery); // Fully reference jQuery after this point.
