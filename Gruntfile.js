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
        tasks: ['sass', 'copy:staticassets_css'],
        options: {
          livereload: true, // needed to run LiveReload
        }
      },
      staticassets_js: {
        files: ['src/static-assets/js/**/*.js'],
        tasks: ['copy:staticassets_js']
      },
      locales: {
        files: ['src/static-assets/locales/**/*.json'],
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

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['sass', 'cssmin', 'copy', 'watch']);
};