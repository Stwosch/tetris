const gulp = require('gulp'),
	$ = require('gulp-load-plugins')({
		lazy: true
	}),
	browserSync = require('browser-sync').create(),
	del = require('del'),
	runSequence = require('run-sequence'),
	pump = require('pump'),
	ftp = require('vinyl-ftp'),
	argv = require('yargs').argv,
	browserify = require("browserify"),
	source = require('vinyl-source-stream'),
	tsify = require("tsify");

const tsBaseDir = 'source/ts/';

gulp.task('sass', () => {

	return gulp.src('source/sass/**/*.scss')
		.pipe($.plumber())
		.pipe($.sass.sync({
			outputStyle: 'compressed'
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({
			browsers: ['last 5 versions', 'IE 9']
		}))
		.pipe(gulp.dest('source/css'))
		.pipe(browserSync.stream());
});

gulp.task('watch', () => {

	gulp.watch('source/sass/**/*.scss', ['sass']);
	gulp.watch('source/*.html', browserSync.reload);
	gulp.watch('source/ts/**/*.ts', ['ts', browserSync.reload]);
});

gulp.task('browser-sync', () => {

    browserSync.init({
        server: {
            baseDir: 'source'
        }
    });
});

gulp.task('default', ['sass', 'browser-sync', 'ts', 'watch']);

// Optimization distribution version

gulp.task('clean', () => {

	return del('public/');
});

gulp.task('copy', () => {

	return gulp.src(['source/css/**/*.css', 'source/js/plugins/*', 'source/tools/**/*'], {
		base: 'source'
	})
		.pipe(gulp.dest('public/'));
});

gulp.task('imgmin', () => {

	return gulp.src('source/img/*')
		.pipe($.imagemin())
		.pipe(gulp.dest('public/img'));
});

gulp.task("ts",  () => {
   return browserify({
        basedir: '.',
        debug: true,
        entries: [
			tsBaseDir + 'controller/index.ts',
			tsBaseDir + 'model/index.ts',
			tsBaseDir + 'view/index.ts',
			tsBaseDir + 'main.ts',
			tsBaseDir + 'board/index.ts',
			tsBaseDir + 'dom-elements/index.ts',
			tsBaseDir + 'useful-functions/index.ts',
			tsBaseDir + 'block/index.ts',
			tsBaseDir + 'vector/index.ts'
		],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest("source/js"));
});

gulp.task('jsmin', cb => {
    pump([
	    	gulp.src('source/js/**/*.js'),
	        $.babel({
	            presets: ['es2015']
	        }),
	        $.uglify(),
	        gulp.dest('public/js')
        ],
        cb);
});

gulp.task('htmlmin', () => {
  return gulp.src('source/*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public'));
});

// Build queue

gulp.task('build', () => {

	runSequence('clean', 'copy', 'imgmin', 'jsmin', 'htmlmin', 'upload');
});


// Upload to server

gulp.task('upload', () => {

	const conn = ftp.create({
		host:     'mywebsite.tld',
        user:     'me',
        password: 'mypass'
	});

	return gulp.src('public/**/*')
		.pipe($.if(argv.upload, conn.dest('public_html/')));
});
