/* ========================================================================
 * Main JS
 * ======================================================================== */

(function($) {

    // An object literal
    var DNA = {
        dnaString: '',
        squareRoot: 200,
        sideLength: 800,
        numBase: 4,
     
        convertStringToArray: function(string) {
            console.time('convert');
            console.log(DNA.numBase);
            var baseValue = parseInt(DNA.numBase);
            var rootSquared = DNA.squareRoot * DNA.squareRoot;
            var numOfPixels = rootSquared * baseValue * 3;
            var cleanString = DNA.convertToBase4(string.trim().slice(0, numOfPixels));
            // var re = new RegExp('.{1,' + bit + '}', 'g');
            // var returnArray = cleanString.match(re);
            var returnArray = [];
            var tempString = '';
            
            var rgbChunk = [];
            for (i = 1; i <= rootSquared; i++) {
              var rgb = DNA.convertValueToRgb(cleanString.substr(baseValue * i, baseValue));
              returnArray.push(rgb);
              // rgbChunk.push(rgb);
              // if (i % 3 === 0) {
              //   returnArray.push(rgbChunk);
              //   rgbChunk = [];
              // }
            }

            console.timeEnd('convert');
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

        stringToNumbers: function(string) {
          return string;
        },

        init: function( settings ) {
          // set settings
          DNA.settings = settings;

          var form = $('#dnaForm');

          form.on('submit', function(e) {
            e.preventDefault();

            var result = form.serializeArray();
            DNA.numBase = parseInt(result[0].value);

            var rgbArray = DNA.convertStringToArray(result[1].value);

            // DNA.executeD3(rgbArray);
          });
        },
     
        readSettings: function() {
            console.log( DNA.settings );
        },

        executeD3: function(rgbArray) {

          var 
            n = DNA.squareRoot, // square root of number of nodes
            m = n * n, // number of data
            d = 1, // dimension of data 
            sen = 10, //size of each node (pixel)
            nodes = [],
            data = []
          ; 
           
          // initialize nodes
          for(var i = 0; i < n * n; i++){
            nodes.push({
              x: i % n,
              y: Math.floor(i / n),
              value: rgbArray[i]
            });
          }
           
          function rgb(array){
            console.log(array);
            // return 'rgb('+ array.map(function(r){return Math.round(r);}).join(',') +')';
          }
           
          var 
            svg = d3.select('#dnaDisplay').append('svg').attr('width', 800).attr('height', 800),
            margin = 30,
            width = n * sen,
            height = n * sen
          ;
           
          var 
            rgb_nodes = svg.append('g').attr('class','nodes all');
           
          rgb_nodes
            .selectAll('rect')
            .data(nodes)
            .enter().append('rect')
              .attr('x', function(node){return node.x * sen;})
              .attr('y', function(node){return node.y * sen;})
              .attr('width', sen)
              .attr('height', sen)
              .style('fill', function(node){return rgb(node.value);})
           
           
           
        }
    };

    DNA.init();
  
    

})(jQuery); // Fully reference jQuery after this point.
