var fs = require('fs');
var hjson = require('hjson');



module.exports = {
  read: function( fname ){
    console.log( 'Eading ' + fname );
    var data = fs.readFileSync( fname, 'utf-8' );
    return hjson.parse( data );
  },

  write: function( fname, data ){
    var content = hjson.stringify( data );
    return fs.writeFileSync( fname, content, 'utf-8' );
  }
};
