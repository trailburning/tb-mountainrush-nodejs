module.exports = function(grunt) {  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/static-assets/sass/',
          src: ['**/*.scss'],
          dest: 'src/static-assets/css/',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      target: {
        files: {
          'src/static-assets/css/dist.min.css': ['src/static-assets/css/fonts_radikal.css', 'src/static-assets/css/fonts_din.css', 'src/static-assets/css/web_platform.css']
        }
      }
    },
    watch: {
      source: {
        files: ['src/static-assets/sass/**/*.scss'],
        tasks: ['sass', 'cssmin', 'copy:staticassets_css'],
        options: {
          livereload: true, // needed to run LiveReload
        }
      },
      staticassets_js: {
        files: ['src/static-assets/js/**/*.js'],
        tasks: ['copy:staticassets_js']
      },
      staticassets_img: {
        files: ['src/static-assets/images/**'],
        tasks: ['copy:staticassets_img']
      },
      views: {
        files: ['src/views/**'],
        tasks: ['copy:views']
      },
      locales: {
        files: ['src/locales/**'],
        tasks: ['copy:locales']
      }      
    },
    copy: {
      staticassets_css: {
        expand: true,
        cwd: 'src/static-assets/css/',
        src: '**',
        dest: 'dist/static-assets/css/'
      },
      staticassets_js: {
        expand: true,
        cwd: 'src/static-assets/js/',
        src: '**',
        dest: 'dist/static-assets/js/'
      },
      staticassets_img: {
        expand: true,
        cwd: 'src/static-assets/images/',
        src: '**',
        dest: 'dist/static-assets/images/'
      },
      views: {
        expand: true,
        cwd: 'src/views/',
        src: '**',
        dest: 'dist/views/'
      },
      locales: {
        expand: true,
        cwd: 'src/locales/',
        src: '*.json',
        dest: 'dist/locales/',
        flatten: true,
        filter: 'isFile'
      }      
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['watch', 'sass', 'cssmin', 'copy']);
};