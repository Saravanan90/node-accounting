module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jst: {
			compile: {
				options: {
					//amd: true,
					namespace: 'App.Templates',
					processName: function(filepath) {					
						return filepath.split('/').reverse()[0];
					}
				},
				files: {
					"www/js/custom/templates.js": "views/templates/*"
				}
			}
		},
		uglify: {
			options:{
				compress: true,
				preserveComments: false
			},
			build:{
				files: {
					'www/js/min/accounting.min.js': ['www/js/library/*.js', 'www/js/custom/*.js']
				}
			}
		}
	})
	grunt.loadNpmTasks('grunt-contrib-jst');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default',['jst','uglify']);
}