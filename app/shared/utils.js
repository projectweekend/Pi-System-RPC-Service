var exec = require( "child_process" ).exec;


exports.readCPUTemperature = function ( done ) {
    exec( "vcgencmd measure_temp", function ( err, stdout, stderr ) {
        if ( err ) {
            return done( err );
        }

        var match = stdout.match(/\d+\.\d+|\d+/);
        if ( !match ) {
            return done( new Error( "No temp in stdout: " + stdout ) );
        }

        var tempC = parseFloat( match[ 0 ] );
        var tempF = tempC * (9/5) + 32;

        return done( null, {
            celsius: tempC,
            fahrenheit: tempF
        } );
    } );
};
