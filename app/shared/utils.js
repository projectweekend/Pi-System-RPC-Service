var exec = require( "child_process" ).exec;
var async = require( "async" );


exports.readSystemData = function ( cb ) {
    var asyncTasks = {
        cpuTemperature: function ( done ) {
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
        },
        gpuMemory: function ( done ) {
            exec( "vcgencmd gpu", function ( err, stdout, stderr ) {
                if ( err ) {
                    return done( err );
                }

                var match = stdout.match(/\d+[A-Z]/);
                if ( !match ) {
                    return done( new Error( "No gpu mem in stdout: " + stdout ) );
                }

                return done( null, match );
            } );
        },
        armMemory: function ( done ) {
            exec( "vcgencmd arm", function ( err, stdout, stderr ) {
                if ( err ) {
                    return done( err );
                }

                var match = stdout.match(/\d+[A-Z]/);
                if ( !match ) {
                    return done( new Error( "No arm mem in stdout: " + stdout ) );
                }

                return done( null, match );
            } );
        }
    };

    async.parallel( asyncTasks, function ( err, data ) {
        if ( err ) {
            return cb( err );
        }
        return cb( null, data );
    } );
};
