'use strict';

//Load all Gulp modules
var gulp = 		 require( 'gulp' ),
	sass = 		 require( 'gulp-sass' ),
	plumber = 	 require( 'gulp-plumber' ),
	jshint = 	 require( 'gulp-jshint' ),
	stylish = 	 require( 'jshint-stylish' ),
	livereload = require( 'gulp-livereload' ),

	jsControllers = 'app/controllers/*.js',
	jsServices = 'app/services/*.js',
	jsServer = '*.js',
	jsApi = 'api/*.js',
	jsAngular = 'app/app.js',
	jsFiles = [ jsControllers,
				jsServices,
				jsServer,
				jsApi,
				jsAngular];


// Precompile Sass
gulp.task( 'sass', function() {

  gulp.src( 'app/styles/index.scss' )
    .pipe( plumber() )
    .pipe( sass() )
    .pipe( gulp.dest( 'app/styles' ) )
    .pipe( livereload() );
});

//Jshint all JS files
gulp.task( 'lint',function() {
	gulp.src( jsFiles )
	.pipe( jshint( {curly: true, globals: {
        'myApp': false,
        'angular': false,
    }}))
	.pipe( jshint.reporter(stylish) );
});

//update HTML with livereload
gulp.task( 'html', function() {
	  gulp.src( 'app/index.html' )
    	.pipe( plumber() )
    	.pipe( livereload() );
});

//watch task to re-run other tasks on save
gulp.task( 'watch', function() {
  gulp.watch( 'app/styles/*.scss', ['sass']);
  gulp.watch( ['app/index.html', 'app/views/*'], ['html'] );
  gulp.watch( jsFiles, ['lint'] );
});



//task to run all
gulp.task( 'default', [ 'sass', 'lint', 'watch' ]);