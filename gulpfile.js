var gulp = require('gulp'),
	less = require('gulp-less'),
	concat = require('gulp-concat'),
	config = {
		buildDir: './public/build',
		lessMainFile: './css/style.less',
		lessPaths: [
			'./css',
			'./bower_components/bootstrap/less'
		],
		lessFiles: './css/**/*.less',
		jsFiles: [
			'./bower_components/lodash/lodash.js',
			'./bower_components/jquery/dist/jquery.js',
			'./bower_components/classnames/index.js',
			'./bower_components/moment/moment.js',
			'./bower_components/react/react.js',
			'./public/build/react/components/**/*.js',
			'./public/build/react/dashboard.js'
		]
	};

gulp.task('css', function(){
	return gulp.src(config.lessMainFile)
		.pipe(less({
			paths: config.lessPaths
		}))
		.pipe(gulp.dest(config.buildDir));
});

gulp.task('js', function(){
	return gulp.src(config.jsFiles)
		.pipe(concat('script.js'))
		.pipe(gulp.dest(config.buildDir))
});

gulp.task('watch', function(){
	gulp.watch(config.jsFiles, ['js']);
	gulp.watch(config.lessFiles, ['css']);
});

gulp.task('default', ['css', 'js', 'watch']);
