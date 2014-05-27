module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    sass:
      dropdown:
        options:
          style: 'expanded'
          bundleExec: true
        files:
          'lib/dropdown.css': 'src/dropdown.scss'

    coffee:
      dropdown:
        files:
          'lib/dropdown.js': 'src/dropdown.coffee'
      spec:
        files:
          'spec/dropdown-spec.js': 'spec/dropdown-spec.coffee'

    watch:
      styles:
        files: ['src/*.scss']
        tasks: ['sass']
      scripts:
        files: ['src/*.coffee', 'spec/*.coffee']
        tasks: ['coffee']
      jasmine:
        files: [
          'lib/dropdown.css',
          'lib/dropdown.js',
          'specs/*.js'
        ],
        tasks: 'jasmine:test:build'

    jasmine:
      test:
        src: ['lib/dropdown.js']
        options:
          outfile: 'spec/index.html'
          styles: [
            'lib/dropdown.css',
            'vendor/bower/fontawesome/css/font-awesome.min.css'
          ]
          specs: 'spec/dropdown-spec.js'
          vendor: [
            'vendor/bower/jquery/dist/jquery.min.js',
            'vendor/bower/simple-module/lib/module.js',
            'vendor/bower/simple-util/lib/util.js',
            'vendor/bower/ejs/ejs.min.js'
          ]

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.registerTask 'default', ['coffee', 'jasmine:test:build', 'watch']
