/* ========================================================================
 * Main JS
 * ======================================================================== */

(function($) {

    // An object literal
    var DNA = {
        dnaString: '',
     
        convertStringToArray: function(string, bit) {
            // console.time('convert');
            var re = new RegExp('.{1,' + bit + '}', 'g');
            var cleanString = string.trim();
            console.log(cleanString.match(re));
            // console.timeEnd('convert');
        },
     
        init: function( settings ) {
          // set settings
          DNA.settings = settings;

          var form = $('#dnaForm');

          form.on('submit', function(e) {
            e.preventDefault();
            var result = form.serializeArray();
            DNA.convertStringToArray(result[1].value, result[0].value);
          });
        },
     
        readSettings: function() {
            console.log( DNA.settings );
        },

        executeD3: function() {
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
              value: [random(), random(), random()]
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

    DNA.executeD3();
  
    

})(jQuery); // Fully reference jQuery after this point.
