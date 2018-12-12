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
        files: ['**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true, // needed to run LiveReload
        }
      },
      files: ['**/*.css'],
      tasks: ['cssmin'],
      staticassets: {
        files: ['**'],
        tasks: ['copy:staticassets']
      },
      locales: {
        files: ['**/*.json'],
        tasks: ['copy:locales']
      }
    },
    copy: {
      staticassets: {
        expand: true,
        cwd: 'src/static-assets/',
        src: '**',
        dest: 'static-assets/'
      },
      locales: {
        expand: true,
        cwd: 'src/locales/',
        src: '*.json',
        dest: 'locales/',
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