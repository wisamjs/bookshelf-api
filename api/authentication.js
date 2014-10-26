'use strict';

module.exports = {
	load: function( passport, User, LocalStrategy ) {

		//Passport methods to keep you signed in

		passport.serializeUser(function( user,done ) {
			done( null, user.id );
		});
		//Passport methods to keep you signed in.
		passport.deserializeUser(function( id, done ) {
  			User.findById( id, function( err, user ) {
  				done( err, user );
			});
		});

		//local strategy for local signin
		passport.use( new LocalStrategy( { usernameField: 'email' } ,function( email, password, done ) {
			User.findOne({ email: email }, function( err, user ) {
		    	if ( err ) {
		    		return done(err);
		    	}
		    	if ( !user ) {
		    		return done( null, false );
		    	}

			    user.comparePassword( password, function( err, isMatch ) {

			      	if ( err ) {
			      		return done( err );
			      	}
			      	if ( isMatch ) {
			      		return done( null, user );
			      	}
			      	return done( null, false );
			    });
		  	});
		}));
	}
};