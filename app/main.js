var os = require( "os" );
var throng = require( "throng" );
var connections = require( "./shared/connections" );
var utils = require( "./shared/utils" );


var logger = connections.logger( [ "Pi-System-RPC-Service" ] );


var run = function () {
    logger.log( "Starting Pi-System-RPC-Service" );

    var serialPort = connections.serialport();
    var broker = connections.jackrabbit();

    var handleMessage = function ( message, ack ) {
    };

    var serve = function () {
        logger.log( "Broker ready" );
        broker.handle( "system.get", handleMessage );
    };

    var create = function () {
        logger.log( "Broker connected" );
        broker.create( "system.get", { prefetch: 5 }, serve );
    };

    process.once( "uncaughtException", function ( err ) {
        logger.log( "Stopping Pi-System-RPC-Service" );
        logger.log( err );
        process.exit();
    } );

    broker.once( "connected", create );
};


throng( run, {
    workers: os.cpus().length,
    lifetime: Infinity
} );
