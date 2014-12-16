
var DEBUG = false;

var fs = require('fs');
var Twit = require('./node_modules/twit/lib/twitter.js');
var moment = require('moment');
var config = require('./config');

var Bot = module.exports = function(config) { 
  this.twit = new Twit(config);
};

var bot = new Bot(config);

/*
	Global object to store the state.
*/
var app = {

	interval: null,

	period: 60000,

	repeat_frequency: 8, // hours

	target_date: "2014-12-19 08:30:30",
	last_time: null,

	state_file: "bot.data"

}

Bot.prototype.tweet = function (status, callback) {
  if(typeof status !== 'string') {
    return callback(new Error('tweet must be of type String'));
  } else if(status.length > 140) {
    return callback(new Error('tweet is too long: ' + status.length));
  }
  this.twit.post('statuses/update', { status: status }, callback);
};

function restore_state() {
	fs.readFile(app.state_file, 'utf8', function(error, data){
		// the file might not exist, but that is fine
		// we will use the defaults
		if ( error ) {
			if ( error.errno == 34 ) {
				console.log("restore_state: no data file present");
				return;
			}
			console.error(error);
			return;
		}

		// decode it
		var content = JSON.parse(data);

		var m = moment(content);

		console.log("restore_state: state restored (last action = " + content.last_time + ", " + m.fromNow() + ")");
		
		app.last_time = m;

	});
}

function save_state() {


	var time = app.last_time.valueOf();
	
	var obj = {last_time: time};
	var json = JSON.stringify(obj);

	fs.writeFile(app.state_file, json, function(error, data){
		if ( error ) {
			console.log("save_state: writing state file failed")
			console.error(error);
		}
		console.log("save_state: state saved (last action = " + time + ", " + app.last_time.fromNow() + ")");
	});

}

function perform_action() {

	console.log("");

	var seed = Math.random();

	console.log("perform_action: seed = " + seed);

	if ( seed <= .20 ) {
		tweet_time_difference();
	} else {
		console.log("perform_action: no action selected");
	}

	save_state();
	

}

function tweet_time_difference() {

	console.log("tweet_time_difference: action");

	var now = moment();
	var then = moment(app.target_date);

	// if the last occurance was less than repeat_frequency ago, skip this
	var now_last_time_diff = now.diff(app.last_time, 'hours');
	if ( now_last_time_diff < app.repeat_frequency ) {
		console.log("tweet_time_difference: action window not open; diff = " + now_last_time_diff);
		return;
	}

	app.last_time = now;

	/*
		if the drop off date is exceeded, this section does not need to run anymore
	*/
	var then_now_diff = then.diff(now, 'seconds');
	if ( then_now_diff < 0 ) {
		// any negative value will trigger this
		console.log("tweet_time_difference: exceeded boundary; diff = " + now_then_diff);
		// consider stopping the node script at this point, as well?
		return;
	}

	var until = moment(app.target_date).fromNow();

	var string = "The Nexus 6 @ryanmr ordered hopefully arrives " + until + "...";

	// tweet the message
  	bot.tweet(string, function(error, reply){

  		if (error) {
  			handleError("tweet_time_difference", error);
  			return;
  		}

  		console.log("tweet_time_difference: successful");
  		console.log(reply);
  	});

	console.log(string);

}

function init() {

	console.log("ryanmrbot: started");

	var period = app.period;
	if ( DEBUG == true ) {
		period = 6000;
	}

	// on start up, calculate a time the past
	app.last_time = moment().subtract(app.repeat_frequency / 3, 'hours');

	restore_state();

	setTimeout(perform_action, 10000);
	app.interval = setInterval(function() {
		console.log("attempting to perform action...");
		perform_action();
	}, period);


}

init();