/**
 * Load modules for application
 */

angular
    
.module('stockMonitoringApp', ['ui.router',
        'stockMonitoringApp.homeServices',
		'underscore'
])


.constant('CONFIG', 
{
	DebugMode: true,
	StepCounter: 0,
	APIHost: 'http://localhost:12017'
}); 

 