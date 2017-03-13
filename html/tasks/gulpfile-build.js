module.exports = function(gulp, plugins) {

    var argv = require('yargs').argv,
        del = require('del'),
        moment = require('moment'),
        multiSprite = require('multi-sprite'),
        browserSync = require('browser-sync'),
        md5 = require('gulp-md5-plus'),
        transport = require("gulp-seajs-transport"),
        concat = require("gulp-seajs-concat"),
        log = console.log;

    var that = this;
    that.port = +argv.p || 3000;
    var pkg = require('../package.json');
    var banner = '/*!' + '\n * @project : ' + pkg.name + '\n * @version : ' + pkg.version + '\n * @author  : ' + pkg.author + '\n * @update  : ' + moment().format('YYYY-MM-DD h:mm:ss a') + '\n */\r';

    gulp.task('build_sass', function() {
        function sassCompile4nix(){
            function handler(){
                return plugins.notify.onError({
                    title:'sass编译错误',
                    message:'<%=error.message%>'
                })
            }
            return plugins.sass().on('error', handler())
        }
        return gulp.src('src/sass/*.scss')
            .pipe(plugins.sourcemaps.init())
            .pipe(sassCompile4nix())
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.autoprefixer( {browsers: ['> 0%']} ))
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(gulp.dest('src/css'))
    })
    gulp.task('build_css', ['build_sass','build_html'], function() {
        return gulp.src('src/css/**/*.css')
            .pipe(plugins.minifyCss({"compatibility":"ie7"}))
            .pipe(plugins.header(banner, { pkg : pkg } ))
            .pipe(md5(10, 'dest/**/*.html'))
            .pipe(gulp.dest('dest/css'))
    })

    gulp.task('build_slice', function() {
        return gulp.src(['src/slice/**'])
            .pipe(gulp.dest('dest/slice'))
    })
    gulp.task('build_sprite', ['build_slice', 'build_css'], function() {
        return multiSprite({
            srcCss: 'dest/css',
            srcImg: 'dest/slice',
            destCss: 'dest/css',
            destImg: 'dest/img/sprite',
            'algorithm': 'binary-tree',
            'padding': 4,
            'exportOpts': {
                'format': 'png',
                'quality': 70
            },
            successCB: function(){
                del(['dest/slice/**'])

                // 给css文件的图片请求加上时间戳
                var timestamp = +new Date
                gulp.src(['dest/css/**/*.css'])
                    .pipe(plugins.replace(/(\/[\w-]*\.(jpg|jpeg|gif|png|bmp|tiff|otf|ttf|woff|svg|webp|swf|htc))/ig, '$1?'+timestamp))

                    .pipe(gulp.dest('dest/css'));
            }
        })
    })
    var config = {
        mangle: {except: ['define', 'require', 'module', 'exports']},
        compress: false
    };

    gulp.task('build_libjs', function() {
        return gulp.src(['src/js/plugins/*.js'])
            .pipe(plugins.uglify(config))
            .pipe(plugins.header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dest/js/plugins'))
    })
    gulp.task('concat_js',function () {
        return gulp.src(['src/js/**/*.js','!src/js/plugins/*.js'])
            .pipe(transport())
            .pipe(concat({
                base:'src/js'
            }))
            .pipe(plugins.uglify(config))
            .pipe(plugins.header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dest/js'))
    })
    var timestamp2 = +new Date
    gulp.task('build_js', ['build_sprite','build_libjs','concat_js'], function() {
        return gulp.src(['dest/js/**/*.js','!dest/js/app/*.js'])
            .pipe(plugins.uglify(config))
            .pipe(plugins.header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dest/js'))
    })

    gulp.task('md5_js', ['build_js'], function() {
        return gulp.src(['dest/js/**/*.js','!dest/js/app/*.js','!dest/js/deps/*.js','!dest/js/sea.js','!dest/js/plugins/*.js'])
            .pipe(md5(10, 'dest/**/*.html'))
            .pipe(gulp.dest('dest/js'))
    })
    gulp.task('build_img', function() {
        return gulp.src(['src/img/**', '!src/img/**/*.psd', '!src/slice/**'])
            .pipe(plugins.imagemin({
                progressive: true
            }))
            .pipe(gulp.dest('dest/img'))
    })
    gulp.task('build_svgslice', function() {
        function renameSvg(p){
            p.basename = 'symbols'
        }
        return gulp.src('src/svg/slice/*.svg')
            .pipe(plugins.svgSymbols({templates: ['default-svg']}))
            .pipe(plugins.rename(renameSvg))
            .pipe(gulp.dest('src/svg'))
    })
    gulp.task('build_svg', ['build_svgslice'], function() {
        return gulp.src(['src/svg/**', '!src/svg/slice/**', '!src/svg/slice/'])
            .pipe(gulp.dest('dest/svg'))
    })
    gulp.task('build_html', ['build_ejs'], function() {
        return gulp.src(['src/**/*.html'])
            .pipe(gulp.dest('dest'))
    })
    gulp.task('build_ejs', function() {
        return gulp.src(['src/tpl/*.ejs','!src/tpl/partial/*.ejs'])
            .pipe(plugins.ejs().on('error', console.log))
            .pipe(gulp.dest('src/'))
    })
    gulp.task('build_clean', function() {
        del.sync(['dest/**'])
    })

    gulp.task('build', ['build_clean', 'md5_js','build_img','build_js'], function(){
        browserSync({
            ui:false,
            server: {
                baseDir: "dest",
                directory: true
            },
            notify: false,
            ghostMode:false,
            codeSync: false,
            port: that.port,
            open: "external"
        },function(err, arg){
            if (argv.q) {
                var url = arg.options.get('urls').get('external')
                var qrcode = require('qrcode-terminal')
                qrcode.generate(url);
            }

        })
    })
    gulp.task('dest', function(){
        browserSync({
            ui:false,
            server: {
                baseDir: "dest",
                directory: true
            },
            notify: false,
            ghostMode:false,
            codeSync: false,
            port: that.port,
            open: "external",
            browser: "/Applications/Google\ Chrome.app/"
        },function(err, arg){
            if (argv.q) {
                var url = arg.options.get('urls').get('external')
                var qrcode = require('qrcode-terminal')
                qrcode.generate(url);
            }

        })
    })

}
