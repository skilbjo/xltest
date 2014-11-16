var gulp 						= require('gulp')
	, jshint 					= require('gulp-jshint')
	, stylish 			 	= require('jshint-stylish')
	, uglify 					= require('gulp-uglify')
	, minifyCSS 			= require('gulp-minify-css')
	, concat 					= require('gulp-concat')
	, rename 					= require('gulp-rename')
	, spawn    				= require('child_process').spawn
	, node
	, jsLocations   = ['server.js'
		, 'app/**/*.js'
		, 'app/*.js'
		, 'public/js/**/*.js']
	, publicJSLocations = ['public/js/purchase/*.js'
		, 'public/js/template/*.js']
  , cssLocations  = ['public/css/*.css']
  , jadeLocations = ['app/view/**/*.jade'
  	, 'app/view/**/elements/*.jade'];

gulp.task('default',
 ['lint','css']
);

gulp.task('lint', function() {
	return gulp.src(jsLocations)
		.pipe(jshint({laxcomma:true}))
		.pipe(jshint.reporter(stylish));
});

gulp.task('js', function() {
	return gulp.src(publicJSLocations)
		.pipe(uglify())
		.pipe(concat('xl.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/dist'));
});

gulp.task('css', function() {
	gulp.src(cssLocations)
		.pipe(minifyCSS({keepBreaks:false}))
		.pipe(concat('style.css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/dist'));
});

// not working because env variables haven't been loaded
// mabye change it like so
// node = spawn('nf start -x 8080 -e env/dev.env')
gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('node', ['server.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});