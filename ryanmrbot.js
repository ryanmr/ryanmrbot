
var DEBUG = false;

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

	target_date: "2014-12-19 08:30:30",
	last_time: moment().subtract(3, 'hours'),

	interval: null,

	period: 60000

}

// using moment.js to handle these nice dates

Bot.prototype.tweet = function (status, callback) {
  if(typeof status !== 'string') {
    return callback(new Error('tweet must be of type String'));
  } else if(status.length > 140) {
    return callback(new Error('tweet is too long: ' + status.length));
  }
  this.twit.post('statuses/update', { status: status }, callback);
};

function perform_action() {

	var seed = Math.random();

	console.log("perform_action: seed = " + seed);

	if ( seed <= .20 ) {
		tweet_time_difference();
	} else {
		console.log("perform_action: no action selected");
	}


}

function tweet_time_difference() {

	console.log("tweet_time_difference: action");

	var now = moment();
	var then = moment(app.target_date);

	// if the last occurance was less than six hours ago, skip this
	var now_last_time_diff = now.diff(app.last_time, 'hours');
	if ( now_last_time_diff < 6 ) {
		console.log("tweet_time_difference: action window not open; diff = " + now_last_time_diff);
		return;
	}

	app.last_time = now;

	/*
		if the drop off date is exceeded, this section does not need to run anymore
	*/
	var then_now_diff = then.diff(now, 'seconds');
	if ( then_now_diff < 0 ) {
		console.log("tweet_time_difference: exceeded boundary; diff = " + now_then_diff);
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

	console.log("ryanmr bot started");

	var period = app.period;
	if ( DEBUG == true ) {
		period = 6000;
	}

	perform_action();
	app.interval = setInterval(function() {
		console.log("attempting to perform action...");
		perform_action();
	}, period);


}

init();