var exec = require( "child_process" ).exec;
var async = require( "async" );


var readCPUTemperature = function ( done ) {
    exec( "vcgencmd measure_temp", function ( err, stdout, stderr ) {
        if ( err ) {
            return done( err );
        }

        var match = stdout.match(/\d+\.\d+|\d+/);

        if ( !match ) {
            return done( new Error( "No temp in stdout: " + stdout ) );
        }

        return done( null, parseFloat( match[ 0 ] ) );
    } );
};


exports.readSystemData = function ( cb ) {

};
