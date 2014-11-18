var gulp 						= require('gulp')
	, jshint 					= require('gulp-jshint')
	, stylish 			 	= require('jshint-stylish')
	, uglify 					= require('gulp-uglify')
	, minifyCSS 			= require('gulp-minify-css')
	, concat 					= require('gulp-concat')
	, rename 					= require('gulp-rename')
	, livereload 			= require('gulp-livereload')
	, spawn    				= require('child_process').spawn
	, publicDir 			= './public/src/'
	, appDir 					= './app/'
	, node
	, jsLocations   = ['server.js'
		, appDir + '**/*.js'
		, appDir + '*.js'
		, publicDir + 'js/**/*.js']
	, jsCommon = [ publicDir + 'js/analytics/*.js'
		, publicDir + 'js/template/*.js']
	, jsPurchase = ['bower_components/jquery.payment/lib/jquery.payment.js'
		, publicDir + 'js/purchase/*.js']
  , cssLocations  = [ publicDir + 'css/*.css']
  , jadeLocations = [ appDir + 'view/**/*.jade'
  	, appDir + 'view/**/elements/*.jade'];

gulp.task('default',
 ['lint','css','js','server','watch']
);

gulp.task('js',
 ['commonjs','purchasejs']
);

gulp.task('lint', function() {
	return gulp.src(jsLocations)
		.pipe(jshint({laxcomma:true}))
		.pipe(jshint.reporter(stylish));
});

gulp.task('commonjs', function() {
	return gulp.src(jsCommon)
		.pipe(uglify())
		.pipe(concat('xl.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/dist'));
});

gulp.task('purchasejs', function() {
	return gulp.src(jsPurchase)
		.pipe(uglify())
		.pipe(concat('purchase.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/dist'));
});

gulp.task('css', function() {
	gulp.src(cssLocations)
		.pipe(minifyCSS({keepBreaks:false}))
		.pipe(concat('style.css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/dist'))
		.pipe(livereload({auto: false}));
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch(cssLocations, ['css']);
});

gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('nf', ['start','-x','8080','-e','lib/env/dev.env'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});