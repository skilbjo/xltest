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
	, jsCommon = ['public/js/analytics/*.js'
		, 'public/js/template/*.js']
	, jsPurchase = ['bower_components/jquery.payment/lib/jquery.payment.js'
		, 'public/js/purchase/*.js']
  , cssLocations  = ['public/css/*.css']
  , jadeLocations = ['app/view/**/*.jade'
  	, 'app/view/**/elements/*.jade'];

gulp.task('default',
 ['lint','css','js','server']
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
		.pipe(gulp.dest('public/dist'));
});

gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('nf', ['start','-x','8080','-e','env/dev.env'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});