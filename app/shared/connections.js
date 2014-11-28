var jr = require( "jackrabbit" );
var loggly = require( "loggly" );


var logglyToken = process.env.LOGGLY_TOKEN;
var logglySubdomain = process.env.LOGGLY_SUBDOMAIN;
var rabbitURL = process.env.RABBIT_URL;


exports.jackrabbit = function () {
    return jr( rabbitURL, 1 );
};


exports.logger = function ( tags ) {
    return loggly.createClient( {
        token: logglyToken,
        subdomain: logglySubdomain,
        tags: tags
    } );
};
