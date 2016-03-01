/* ========================================================================
 * Main JS
 * ======================================================================== */

(function($) {

    // An object literal
    var DNA = {
        dnaString: '',
        squareRoot: 80,
        numBase: 4,
     
        convertStringToArray: function(string) {
            console.time('convert');
            console.log(DNA.numBase);
            var baseValue = parseInt(DNA.numBase);
            var rootSquared = DNA.squareRoot * DNA.squareRoot;
            var numOfPixels = rootSquared * baseValue * 3;
            var cleanString = string.trim().slice(0, numOfPixels);
            // var re = new RegExp('.{1,' + bit + '}', 'g');
            // var returnArray = cleanString.match(re);
            var returnArray = [];
            for (i = 0; i <= rootSquared; i++) {
              var rgb = DNA.convertValueToRgb(cleanString.substr(baseValue * i, baseValue));
              returnArray.push(rgb);
            }

            console.timeEnd('convert');
            return returnArray;
        },

        convertValueToRgb: function(string) {
            console.log(DNA.stringToNumbers(string));
            return [250,100,0];
        },

        stringToNumbers: function(string) {
          var tempString;
          // for (i=0; i < string.length; i++) {
          //   console.log(string[i]);
          //   switch(string[i]) {
          //     case 'A':
          //       tempString += '0'
          //       break;
          //     case 'T':
          //       tempString += '1'
          //       break;
          //     case 'G':
          //       tempString += '2'
          //       break;
          //     case 'C':
          //       tempString += '3'
          //       break;
          //     default:
          //       return
          //   }
          }
          // console.log(tempString);
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

            DNA.executeD3(rgbArray);
          });
        },
     
        readSettings: function() {
            console.log( DNA.settings );
        },

        executeD3: function(rgbArray) {

          console.log(rgbArray);
          var 
            n = 80, // square root of number of nodes
            m = 1500, // number of data
            d = 1, // dimension of data 
            sen = 10, //size of each node (pixel)
            nodes = [],
            data = []
          ; 
           
          function random(){
            return Math.floor(Math.random() * 256);
          }
           
          // generate data
          for(var i = 0; i < m; i++){
            data.push([random(), random(), random()]);
          }
           
          // initialize nodes
          for(var i = 0; i < n * n; i++){
            nodes.push({
              x: i % n,
              y: Math.floor(i / n),
              value: rgbArray[i]
            });
          }
           
          function rgb(array){
            return 'rgb('+ array.map(function(r){return Math.round(r);}).join(',') +')';
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
