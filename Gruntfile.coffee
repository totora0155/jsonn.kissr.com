module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    dir:
      src: 'src'
      dist: 'dist'
      html: 'html'
      css: 'css'
      sass: 'sass'
      js: 'js'
      coffee: 'coffee'

    connect:
      def:
        options:
          port: 8080
          base: '<%= dir.dist %>'

    compass:
      def:
        options:
          config: 'config.rb'

    coffee:
      options:
        sourceMap: true
      def:
        expand: true
        cwd: '<%= dir.src %>/<%= dir.coffee %>'
        src: '**/*.coffee'
        dest: '<%= dir.dist %>/<%= dir.js %>'
        ext: '.js'

    watch:
      livereload:
        options:
          livereload: true
        files: [
          '<%= dir.dist %>/*.html',
          '<%= dir.dist %>/<%= dir.css %>/*.css',
          '<%= dir.dist %>/<%= dir.js %>/*.js'
        ]
      sass:
        files: ['<%= dir.src %>/<%= dir.sass %>/*.sass']
        tasks: 'compass:def'
      coffee:
        files: ['<%= dir.src %>/coffee/**/*.coffee']
        tasks: 'coffee:def'

    htmlmin:
      def:
        options:
          removeComments: true
          collapseWhitespace: true
          collapseBooleanAttributes: true
          removeRedundantAttributes: true
          removeOptionalTags: true
        expand: true
        cwd: '<%= dir.dist %>'
        src: '*.html'
        dest: '<%= dir.dist %>/<%= dir.html %>'
        ext: '.html'

    uglify:
      def:
        expand: true
        cwd: '<%= dir.dist %>/<%= dir.js %>'
        src: '*.js'
        dest: '<%= dir.dist %>/<%= dir.js %>'
        ext: '.min.js'

  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-htmlmin'
  grunt.loadNpmTasks 'grunt-contrib-compass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.registerTask 'default', ['connect:def', 'watch']
  grunt.registerTask 'min', ['htmlmin:def']
  grunt.registerTask 'ugl', ['uglify']