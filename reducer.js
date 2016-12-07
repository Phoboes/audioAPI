var dataSort = {

  sum: function( input ){
    var total = 0;
    for( var i = 0; i < input.length; i++ ){
      console.log(i)
      total += input[i];
    }
    return total;
  },

  avg: function( input ){
    return this.sum( input ) / input.length;
  },

  mode: function( input ){
    if ( !input.length ){ 
      return 0; 
    }

    var counts = {};
    var mode = null;
    var max = 0;

    for( var i = 0; i < input.length; i++ ){
      var value = Math.round( input[i] * 10 ) / 10;
      if( Math.round( input[i] * 10 ) / 10 === Infinity ){
        console.log(input[i])
        debugger
      }
      counts[ value ] = ( counts[value] || 0 ) + 1;
      if ( counts[value] > max ) {
        max = counts[value];
        mode = value;
      }
    };
    return mode;
  },

  median: function( input ) {
    if ( !this.input.length ) return 0;
    var midPoint = Math.floor( input.length / 2 );
    return input[ midPoint ];
  },

  emptyArray: function( input ){
    input.length = 0;
  }

}