'use strict';

module.exports = {
	load: function( app,passport,User ) {

		//load modules
		var Book  = require('../models/book'),
			https = require('https');

		//middleware to enable CORS
		app.all( '/book', function( req, res, next ) {
    		res.header( 'Access-Control-Allow-Origin', '*' );
    		res.header( 'Access-Control-Allow-Headers', 'X-Requested-With' );
    		next();
		});

		//Protect routes from unauthenticated requests
		var auth = function ensureAuthenticated( req, res, next ) {
  			if ( req.isAuthenticated() ) {
  				next();
  			}
  			else {
  				res.send( 401 );
  			}
		};


		//signup
		app.post( '/signup', function( req, res, next ) {

			var user = new User({
				email: req.body.email,
				password: req.body.password
			});

			user.save(function( err ) {
				if ( err ) {
					return next( err );
				}
				res.send( 200 );
			});
		});

		//login
		app.post( '/login', passport.authenticate('local'), function( req, res ) {
  			res.cookie( 'user', JSON.stringify(req.user) );
  			res.send( req.user );
		});

		//logout
		app.get( '/logout', function( req, res ) {
			req.logout();
			res.send( 200 );
		});

		//check if user is logged in or not
		app.get( '/loggedin', function( req, res ) {

			res.send( req.isAuthenticated() ? req.user : '0' );
		});


		//add book
		app.post( '/book', function( req, res ) {

			var book = new Book({
				_id   : req.body._id,
				name  : req.body.name,
				author: req.body.author,
				rating: req.body.rating,
				genre : req.body.genre,
				poster: req.body.poster
			});



			User.findOne({ _id: req.user._id }, function( err, user ) {

				if ( !err ) {
					user.books.push(book);
					user.save(function( err ) {
						if ( !err ) {
							res.json({ message: 'Book created' });
						}
					});
				}
			});
		});

		//get all books
		app.get( '/books', auth, function( req, res ) {

			User.findOne({ _id : req.user._id}, function( err, user ) {
				if ( !err ){
					res.json( user.books );
				}
			});
		});


		//get book info from Google Books Api
		app.get( '/search' , function( req, res ) {

			var respData = '',
				apiHostname = 'www.googleapis.com',
				apiPath = '/books/v1/volumes?key=' + process.env.API_KEY+ '&q=',

				//name param is encoded to be URI syntax friendly
				options = {
  					hostname: apiHostname,
  					path: apiPath + encodeURIComponent( req.query.name )
				};


			https.request( options, function( response ) {

  				//add chunk of data
  				response.on( 'data', function( chunk ) {
    				respData += chunk;
  				});

  				//response has been received
  				response.on( 'end', function () {
  					res.send( respData );
  				});

			}).end();


		});

		//remove a book from Users books
		app.delete( '/remove/:id', function( req, res ) {

			User.findOne({ _id : req.user._id }, function( err, user ) {
				if ( !err ) {
					user.books.id(req.params.id).remove();
					user.save( function( err ){
						if ( !err ) {
							res.send({ message: 'deleted' });
						}
					});
				}
			});
		});


	}
};

