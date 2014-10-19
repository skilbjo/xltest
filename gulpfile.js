var gulp 						= require('gulp')
	, jshint 					= require('gulp-jshint')
	, stylish 			 	= require('jshint-stylish')
	, spawn    				= require('child_process').spawn
	, node
	, jsLocations   = ['server.js'
		, 'app/**/**/*.js'
		, 'public/js/merchant/*.js'
		, 'public/js/transaction/*.js']
  , cssLocations  = ['public/css/*.css']
  , jadeLocations = ['app/view/**/*.jade']
  , viewLocations = ['app/view/**/.html'];

gulp.task('default',
 ['lint']
);

gulp.task('lint', function() {
	return gulp.src(jsLocations)
		.pipe(jshint({laxcomma:true}))
		.pipe(jshint.reporter(stylish));
});

// not working because env variables haven't been loaded
gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('node', ['server.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});