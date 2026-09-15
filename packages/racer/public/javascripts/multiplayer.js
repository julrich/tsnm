var PLAYER_ID_KEY   = 'lambdaracer.player_id';
var PLAYER_NAME_KEY = 'lambdaracer.player_name';

/* The server knows us by this id, so two racers can share a name without
   overwriting each other's best time. It lives in localStorage, the name
   only has to be typed once. */
var player = { id: null, name: null };
var started = false;
var socket = io();

var createPlayerId = function () {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'p' + Date.now() + '-' + Math.random().toString(36).slice(2);
};

var cleanName = function (raw) {
  return String(raw == null ? '' : raw).replace(/\s+/g, ' ').trim().slice(0, 16);
};

/* Player names travel through the leaderboard as html, so they get escaped */
var escapeHtml = function (value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
  });
};

player.id   = Dom.storage[PLAYER_ID_KEY] || createPlayerId();
player.name = cleanName(Dom.storage[PLAYER_NAME_KEY]) || null;

Dom.storage[PLAYER_ID_KEY] = player.id;

var joinRace = function () {
  if (socket.connected && player.name) {
    socket.emit('join', { id: player.id, name: player.name });
  }
};

/* Called by the start form on the intro overlay */
var startRace = function (rawName) {
  var name = cleanName(rawName);

  if (!name) {
    $('#start_hint').text('Bitte einen Namen eingeben, sonst wissen wir nicht wem die Zeit gehört ;)');
    Dom.get('nickname').focus();
    return;
  }

  player.name = name;
  Dom.storage[PLAYER_NAME_KEY] = name;
  started = true;

  $('#start_hint').text('');
  $('#howto').hide();
  Dom.get('nickname').blur();

  joinRace();
  if (window.startMusic) { startMusic(); }

  addInfo('Du hast ein Rennen gestartet!');
  window.scrollTo(0, 0);
};

$(function () {
  Dom.get('nickname').value = player.name || '';
});

/* Socket event bindings */
socket.on('connect', function () {
  // a player reading the intro is not racing yet, so only a reconnect
  // (or the join in startRace) announces a racer to the others
  if (started) { joinRace(); }
});

socket.on('init', function (data) {
  updateLeaderBoard(data);
});

socket.on('ready', function (data) {
  console.log("server signalled ready");
});

socket.on('update leaderboard', function (data) {
  updateLeaderBoard(data);
});

socket.on('player connected', function (data) {
  addInfo(escapeHtml(data.name) + ' hat ein Rennen gestartet!');
});

socket.on('new laptime', function (data) {
  addInfo(escapeHtml(data.name) + ' hat eine neue Rundenzeit gefahren: ' + formatTime(data.lapTime));
});

socket.on('new personal laptime', function (data) {
  updatePersonalBoard(
    "Neue Rundenzeit: " + formatTime(data.lapTime),
    "Leider keine neue persönliche Bestzeit, vielleicht diese Runde wieder? ;)"
  );
});

socket.on('new best time', function (data) {
  addInfo(escapeHtml(data.name) + ' hat eine neue persönliche Bestzeit gefahren: ' + formatTime(data.lapTime));
});

socket.on('new personal best time', function (data) {
  if (data.lapTime < 120) {
    updatePersonalBoard(
      "EINTRITT FREI!",
      "Das war unter 2 Minuten, damit wärste am 21.07. umsonst drin gewesen, schade! ;)"
    );
  } else {
    updatePersonalBoard(
      "Neue persönliche Bestzeit!",
      "Jetzt noch unter 2.00.0 kommen, und der Eintritt am 21.07. wäre frei gewesen! ;)"
    );
  }
});

socket.on('error', function (data) {
  console.log("Leider gab es einen Fehler :/");
  console.log(data);
});

/* Function declarations */
var updateScoreOnServer = function (newLapTime) {
  socket.emit('update laptime', { lapTime: newLapTime });
};

var addInfo = function (string) {
  var $ul = $('#info ul');
  $ul.append('<li class="new_info" style="color: #F6358A">' + string + '</li>');
  $ul.children('li:last').animate({ color: "#000000" }, 5000, function () {
    $('.new_info').removeClass('new_info');
  });

  if ($ul.children('li').length > 7) {
    $ul.children('li:first').remove();
  }
};

var updateLeaderBoard = function (data) {
  console.log(data);
  var $leaderboard = $('#leaderboard'),
      players = data.result || [],
      me = data.player,
      underTwo = [],
      bestFive = [],
      html = "";

  players.sort(sortByTime);
  console.log(players);

  $.each(players, function (index, player) {
    if (player.time < 120) {
      underTwo.push(player);
    } else if (bestFive.length < 5) {
      bestFive.push(player);
    }
  });

  var row = function (index, player) {
    var classes = (me && me.id === player.id) ? " class='new_record' style='color: #F6358A'" : "";
    return "<li" + classes + ">" + (index + 1) + ". " + escapeHtml(player.name) +
           ": <span class='time'>" + formatTime(player.time) + "</span></li>";
  };

  html += "<span>Unter 2 Minuten*:</span><ul>";
  html += underTwo.map(function (player, index) { return row(index, player); }).join("");
  html += "</ul>";

  html += "<span>Beste 5 über 2 Minuten*:</span><ul>";
  html += bestFive.map(function (player, index) { return row(index, player); }).join("");
  html += "</ul><span>*Eintritt+1 frei</span>";

  $leaderboard.html(html);

  $('.new_record').animate({ color: "#000000" }, 5000, function () {
    $('.new_record').removeClass('new_record');
  });
};

var sortByTime = function (a, b) {
  return a.time - b.time;
};

var updatePersonalBoard = function (headline, text) {
  var $personalBoard = $('#personalboard');
  $personalBoard.html("<h1>" + headline + "</h1><p>" + text + "</p>");
  $personalBoard.show();

  $personalBoard.fadeOut(10000);
};
