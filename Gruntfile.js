module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      target: {
        files: {
          'static-assets/css/dist.min.css': ['static-assets/css/fonts_radikal.css', 'static-assets/css/fonts_din.css', 'static-assets/css/web_platform.css']
        }
      }
    },
    watch: {
      files: ['**/*.css'],
      tasks: ['cssmin']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['cssmin', 'watch']);
};