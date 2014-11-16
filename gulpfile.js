var gulp 						= require('gulp')
	, jshint 					= require('gulp-jshint')
	, stylish 			 	= require('jshint-stylish')
	, concat 					= require('gulp-concat')
	, uglify 					= require('gulp-uglify')
	, minifyCSS 			= require('gulp-minify-css')
	, rename 					= require('gulp-rename')
	, spawn    				= require('child_process').spawn
	, node
	, jsLocations   = ['server.js'
		, 'app/**/**/*.js'
		, 'public/js/**/*.js']
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

gulp.task('uglify', function() {
	return gulp.src(jsLocations)
		.pipe(jshint({laxcomma:true}))
		.pipe(jshint.reporter(stylish));
});

gulp.task('css', function() {
	gulp.src(['./public/css/forms.css', 
		'./public/css/stuff.css'])
		.pipe(minifyCSS({keepBreaks:true}))
		.pipe(concat('style.min.css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./public/dist'));
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