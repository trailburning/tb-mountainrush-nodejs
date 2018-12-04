module.exports = function(grunt) {  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'static-assets/sass/',
          src: ['**/*.scss'],
          dest: 'static-assets/css/',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      target: {
        files: {
          'static-assets/css/dist.min.css': ['static-assets/css/fonts_radikal.css', 'static-assets/css/fonts_din.css', 'static-assets/css/web_platform.css']
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
      tasks: ['cssmin']
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['sass', 'cssmin', 'watch']);
};