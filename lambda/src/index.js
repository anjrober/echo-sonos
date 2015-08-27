'use strict';

var http = require('http');

var options = require('./options');

var AlexaSkill = require('./AlexaSkill');
var EchoSonos = function () {
    AlexaSkill.call(this, options.appid);
};

EchoSonos.prototype = Object.create(AlexaSkill.prototype);
EchoSonos.prototype.constructor = EchoSonos;

EchoSonos.prototype.intentHandlers = {
    // register custom intent handlers
    PlayIntent: function (intent, session, response) {
        console.log("PlayIntent received");
        options.path = '/preset/'+encodeURIComponent(intent.slots.Preset.value);
        httpreq(options, response, "Sonos Playing " + intent.slots.Preset.value);
    },
    PauseIntent: function (intent, session, response) {
        console.log("PauseIntent received");
        options.path = '/pauseall';
        httpreq(options, response, "Sonos Pausing");
    },
	ToggleIntent: function (intent, session, response) {
        console.log("ToggleIntent received");
        options.path = '/playpause';
        httpreq(options, response, "Sent to Sonos.");
    },
    
    LevelIntent: function (intent, session, response) {
        console.log("LevelIntent received");
        var level = intent.slots.levelNumber,
            levelValue;
        
        levelValue = parseInt(level.value);
        if (isNaN(levelValue)) {
            console.log('Invalid level value = ' + level.value);
            response.ask('sorry, I did not hear the desired volume, please say again?');
            return;
        }
        
        if ( levelValue > 100 || levelValue < 0 ) {
        	console.log('level value too high or low = ' + level.value);
            response.ask('sorry, volume has to be between 0 and 100, please say again?');
            return;
        }
        
        options.path = '/groupVolume/'+encodeURIComponent( levelValue );
        httpreq(options, response, "Sonos volume now " + levelValue );
    },    
    
    VolumeDownIntent: function (intent, session, response) {
        console.log("VolumeDownIntent received");
        options.path = '/groupVolume/-10';
        httpreq(options, response, "Sonos volume down");
    },
    VolumeUpIntent: function (intent, session, response) {
        console.log("VolumeUpIntent received");
        options.path = '/groupVolume/+10';
        httpreq(options, response, "Sonos volume up");
    },
    NextSongIntent: function (intent, session, response) {
        console.log("NextSongIntent received");
        options.path = '/next';
        httpreq(options, response, "Sonos playing next song");
    },
    PreviousSongIntent: function (intent, session, response) {
        console.log("PreviousSongIntent received");
        options.path = '/previous';
        httpreq(options, response, "Sonos playing previous song");
    },
  
    SpeakerVolDownIntent: function (intent, session, response) {
        var speakerDNName = intent.slots.speakerVDn.value;
        console.log("SpeakerVolumeDownIntent received - " + speakerDNName );
               
        if ( speakerDNName == "kitchen" ) {

            console.log('Speaker Name = ' + speakerDNName);
            options.path = '/kitchen/volume/-10';
	        httpreq(options, response, "Kitchen volume lowered");
            return;

        } else if ( speakerDNName == "stereo" ) {

            console.log('Speaker Name = ' + speakerDNName);
            options.path = '/stereo/volume/-10';
	        httpreq(options, response, "Stereo volume lowered");
            return;

        } else if (speakerDNName == "bedroom" ) {

            console.log('Speaker Name = ' + speakerDNName);
            options.path = '/bedroom/volume/-10';
	        httpreq(options, response, "Bedroom volume lowered");
            return;
            
        } else { 
        
            console.log('Invalid Speaker Name - ' + speakerDNName);
            response.ask('Sorry, the speaker name must be kitchen, stereo, or bedroom.  Please try again?');
            return;
            
        }
         
    },
    SpeakerVolUpIntent: function (intent, session, response) {
        var speakerUPName = intent.slots.speakerVUp.value;
        console.log("SpeakerVolumeUpIntent received");
                        
        if ( speakerUPName == "kitchen" ) {

            console.log('Speaker Name = ' + speakerUPName);
            options.path = '/kitchen/volume/+10';
	        httpreq(options, response, "Kitchen volume raised");
            return;

        } else if ( speakerUPName == "stereo" ) {

            console.log('Speaker Name = ' + speakerUPName);
            options.path = '/stereo/volume/+10';
	        httpreq(options, response, "Stereo volume raised");
            return;

        } else if (speakerUPName == "bedroom" ) {

            console.log('Speaker Name = ' + speakerUPName);
            options.path = '/bedroom/volume/+10';
	        httpreq(options, response, "Bedroom volume raised");
            return;
            
        } else { 
        
            console.log('Invalid Speaker Name - ' + speakerUPName);
            response.ask('Sorry, the speaker name must be kitchen, stereo, or bedroom.  Please try again?');
            return;
            
        }
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the EchoSonos skill.
    var echoSonos = new EchoSonos();
    echoSonos.execute(event, context);
};

function httpreq(options, alexaResponse, responseText) {
  console.log("Trying http request with responseText " + responseText);
  http.request(options, function(httpResponse) {
    console.log(httpResponse.body);
    if (responseText)
        alexaResponse.tell(responseText);
  }).end();
}
