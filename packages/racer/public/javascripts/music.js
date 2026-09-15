var beatOffset = 0; // used for manipulating sprite-positions based on beat

(function () {
  var AUDIO_FILE = '/music/racer';
  var dancer = null;
  var started = false; // music only starts with the first user gesture
  var playing = true;  // ...and it is on by default

  if (!Dancer.isSupported()) {
    console.log("Dancer: no audio support, racing without music");
    Dom.get('mute').style.display = 'none';
    return;
  }

  // Dancer.js magic
  Dancer.setOptions({
    flashSWF : '/music/soundmanager2.swf',
    flashJS  : '/music/soundmanager2.js'
  });

  dancer = new Dancer(AUDIO_FILE, ['ogg', 'mp3']);
  dancer.createBeat({
    onBeat: function () {
      beatOffset = 100;
    },
    offBeat: function () {
    }
  }).on();

  dancer.bind('loaded', function () {
    if (started && playing) {
      playMusic();
    } else {
      beatOffset = 0;
    }
  });

  var resumeContext = function () {
    var context = dancer.audioAdapter && dancer.audioAdapter.context;
    if (context && context.state === 'suspended' && context.resume) {
      context.resume();
    }
  };

  var playMusic = function () {
    resumeContext();
    dancer.play();
  };

  /* Switching the music off also stops the beat detection, so the background
     stops reacting to the music instead of just going silent */
  var setMusic = function (on) {
    playing = on;
    Dom.toggleClassName('mute', 'on', !on);

    if (!started) { return; }

    if (on) {
      if (dancer.isLoaded()) { playMusic(); }
    } else {
      dancer.stop();
      beatOffset = 0;
    }
  };

  /* Browsers keep the audio context suspended until the page got a user
     gesture, so the race (and the beat the background reacts to) only starts
     once the player clicked "Rennen starten!" */
  window.startMusic = function () {
    if (started) { return; }
    started = true;
    setMusic(playing);
  };

  window.toggleMusic = function () {
    setMusic(!playing);
  };

  Dom.on('mute', 'click', function () {
    window.toggleMusic();
  });

  setMusic(playing); // the icon starts out as "music on"

  // For debugging
  window.dancer = dancer;
})();
