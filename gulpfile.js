'use strict';

// Include gulp
var gulp = require('gulp'),
	rename = require('gulp-rename'),
	sassLint = require('gulp-sass-lint');
var ts = require("gulp-typescript");
var tsProject = ts.createProject('tsconfig.json');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var plumber = require('gulp-plumber');
var eslint = require('gulp-eslint');
var browserSync = require('browser-sync');
var htmlInjector = require("bs-html-injector");
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


// browserSync HTML injection
browserSync.use(htmlInjector, {
	// Files to watch that will trigger the injection
	files: '*.html'
});

// Start browserSync server
gulp.task('browser-sync', function () {
	browserSync.init({
		notify: false,
		open: false,
		server: {
			baseDir: './'
		}
	});
});

// SASS lint
gulp.task('lint', function () {
	return gulp.src('src/scss/**/*.s+(a|c)ss')
		.pipe(sassLint({
			options: {
				formatter: 'stylish',
				'merge-default-rules': true
			},
			rules: {
				'no-ids': 1,
				'no-mergeable-selectors': 1
			},
			configFile: 'config/sass-lint/.sass-lint.yml'
		}))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError())
});

// Styles task
gulp.task('styles', function () {
	gulp.src('src/scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('dist/css/'))
		.pipe(browserSync.stream());
});

// ESLint Task
gulp.task('eslint', function () {
	gulp.src('src/scripts/**/*.ts')
		.pipe(eslint({
			options: {
				configFile: '.eslintrc'
			}
		}))
		.pipe(eslint.format('stylish'));
});

// Scripts Task (experimental)
gulp.task('scripts', function () {
	return browserify()
		.add('./src/scripts/main.ts')
		.plugin(tsify)
		.bundle()
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(gulp.dest('dist/scripts/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Scripts Task (old)
// gulp.task('scripts', function () {
// 	gulp.src('src/scripts/main.ts')
// 		.pipe(plumber({
// 			errorHandler: function (error) {
// 				console.log(error.message);
// 				this.emit('end');
// 			}
// 		})) 
// 		.pipe(jshint())
// 		.pipe(jshint.reporter('default'))
// 		.pipe(concat('main.js'))
// 		.pipe(rename({ suffix: '.min' }))
// 		.pipe(uglify())
// 		.pipe(gulp.dest('dist/scripts/'))
// 		.pipe(browserSync.reload({ stream: true }))
// 		return tsProject.src()
//         .pipe(tsProject())
//         .js.pipe(gulp.dest("dist/scripts/"));
// });

// Default task
gulp.task('default', ['browser-sync'], function () {
	defaultFunction();
});

function defaultFunction() {
	gulp.watch('src/scss/**/*.s+(a|c)ss', ['lint']);
	gulp.watch('src/scss/**/*.scss', ['styles']);
	gulp.watch('src/scripts/**/*.ts', ['eslint']);
	gulp.watch('src/scripts/**/*.ts', ['scripts']);
	gulp.watch('*.html', ['styles']);
}