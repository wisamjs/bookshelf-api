'use strict';

var mongoose = require( 'mongoose' ),
    bcrypt = require( 'bcryptjs' ),
    // bookSchema = require('./book.js'),
    // var mongoose = require( 'mongoose' ),
    bookSchema = new mongoose.Schema({
        _id   : String,
        name  : String,
        author: String,
        rating: Number,
        genre : String,
        poster: String,
    }),

    userSchema = new mongoose.Schema({
        email: { type: String, unique: true },
        password: String,
        books: [bookSchema]
    });

//Mongoose pre-middleware - hash password
userSchema.pre( 'save', function(next) {
    var user = this;

    //only hash password if modified or new password
    if ( ! user.isModified('password') ){
        return next();
    }

    // generate a salt
    bcrypt.genSalt( 10, function( err, salt ) {
        if ( err ) {
            return next( err );
        }
        // hash the password along with our new salt
        bcrypt.hash( user.password, salt, function( err, hash ){
            user.password = hash;
            next();
        });
    });

});

//Password verification
userSchema.methods.comparePassword = function( candidatePassword, cb ){
    bcrypt.compare( candidatePassword, this.password, function( err, isMatch ){
        if ( err ) {
            return cb( err );
        }
        cb( null, isMatch );
    });

};

module.exports = mongoose.model( 'User' , userSchema );