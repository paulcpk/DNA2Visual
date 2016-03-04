/* ========================================================================
 * Main JS
 * ======================================================================== */

(function($) {

    // An object literal
    var DNA = {
        dnaString: '',
        squareRoot: 250,
        sideLength: 800,
        numBase: 4,
        canvas: document.getElementById('dnaDisplay'),
     
        convertStringToArray: function(string) {
            console.time('convert');
            var baseValue = parseInt(DNA.numBase);
            var rootSquared = DNA.squareRoot * DNA.squareRoot;
            var numOfPixels = rootSquared * baseValue * 3;
            var cleanString = string.trim().slice(0, numOfPixels);
                // if (cleanString.length < numOfPixels)
                cleanString = DNA.convertToBase4(cleanString);

            var re = new RegExp('.{1,' + baseValue + '}', 'g');
            var returnArray = cleanString.match(re);
            
            console.log(returnArray);
            return returnArray;
        },

        convertValueToRgb: function(string) {
            return parseInt(string, DNA.numBase);
        },

        convertToBase4: function(string) {
          var mapObj = {
             A:"0",
             C:"1",
             G:"2",
             T:"3"
          };
          numberString = string.replace(/A|C|G|T/gi, function(matched){
            return mapObj[matched];
          });
          return numberString;
        },

        init: function( settings ) {
          // set settings
          DNA.settings = settings;

          var form = $('#dnaForm');
          var displayContainer = $('#dnaDisplayContainer');
          var downloadButton = $('#downloadButton');
          var canvas = $('#dnaDisplay');

          form.on('submit', function(e) {
            e.preventDefault();

            var result = form.serializeArray();
            DNA.numBase = parseInt(result[0].value);

            var rgbArray = DNA.convertStringToArray(result[1].value);

            DNA.executeD3(rgbArray);

            displayContainer.slideDown(250);
          });

          // when download button is clicked, provide PNG
          downloadButton.on('click', function(e) {
            var downloadStream = DNA.canvas.toDataURL('image/png');
            // Change MIME type to trick the browser to downlaod the file instead of displaying it and define HTTP-style headers
            downloadStream = downloadStream.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
            downloadStream = downloadStream.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
            downloadButton.attr('href', downloadStream);
          });

        },
     
        readSettings: function() {
            console.log( DNA.settings );
        },

        executeD3: function(rgbArray) {
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
        }
    };

    DNA.init();
  
    

})(jQuery); // Fully reference jQuery after this point.
