'use strict';

//Load Modules
var mongoose   = require('mongoose'),
	express    = require('express'),
	bodyParser = require('body-parser'),
	path       = require('path'),
	routes     = require('./api/routes'),
	auth       = require('./api/authentication'),
	User       = require('./models/user'),

//Load Authentication Modules
 	session = require('express-session'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,

//Express setup
	app = express();
app.set( 'port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use( bodyParser.json() );
app.use( express.static( path.join( __dirname, 'app' ) ) );
app.use( session({ secret: 'Needs more cowbell' }) );
app.use( passport.initialize() );
app.use( passport.session() );


//Database Connection
mongoose.connect( process.env.MONGODB_URL );

mongoose.connection.on( 'connected',function() {
	console.log( 'Connection successful' );

});

mongoose.connection.on( 'error', function( error ) {
	console.log( 'error' + error );
});

//Authentication
auth.load( passport, User, LocalStrategy );

//Routes
routes.load( app, passport, User );

//Start server
app.listen( app.get( 'port' ),function() {
	console.log( 'Listening on port: ' + app.get( 'port' ));
});
