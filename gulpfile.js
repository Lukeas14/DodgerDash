var gulp = require('gulp'),
	less = require('gulp-less'),
	config = {
		lessMainFile: './css/style.less',
		lessPaths: [
			'./css',
			'./bower_components/bootstrap/less'
		],
		lessDest: './public/build'
	};

gulp.task('less', function(){
	return gulp.src(config.lessMainFile)
		.pipe(less({
			paths: config.lessPaths
		}))
		.pipe(gulp.dest(config.lessDest));
});

gulp.task('default', ['less']);