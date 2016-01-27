'use strict'

var _ = require('lodash');
var async = require('async');
var seneca = require('seneca')({
	timeout: 10 * 60 * 1000
});

var config = require('../config/config.js')();
seneca.options(config);
seneca.use('postgresql-store');
seneca.ready(function(){
	function run(cb){
		var eventsEntity = seneca.make$('cd/events');
		async.waterfall([
			function(done){
				eventsEntity.list$({fields:['dates']}, {limit$: 'NULL'}, done);
			},
			function(events, done){ 
				async.eachSeries(events, function(event, done)){
					var dates_obj = JSON.parse(eventsEntity);
					var dates_json = JSON.stringify(dates_obj);
					eventsEntity = dates_json; 
					event.save$(eventsEntity, done);
				}
			}
		], cb);
	}
}
run(function (err)){
	if(err){
		console.log('error', err);
	}
	console.log("Done");
	seneca.close();
};