/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
"use strict";

/**
 * A class managing the creation and running of the game. When instanciated, it
 * creates all the elements required for the game to work.
 * @param {HTMLElement} element a placeholder element that will contain the
 *                              elements for the game
 */
function GameManager(element) {
  // Set up the elements used by the game
  this._gameManagerElement = element;
  this._gameManagerElement.innerHTML =
      '<div id="game-menu" hidden></div>' +
      
      '<div id="game-controls"></div>' +

      '<div id="game-game" hidden></div>' +

      '<div id="game-help" hidden>' +
      '  <h2>Help</h2>' +
      '  <p>Foo</p>' +
      '</div>';
  
  // Instantiate the objects that deal with each element
  this._menu = new Menu(document.getElementById("game-menu"));
  this._settings = new Settings(document.getElementById("game-controls"));
  this._game = new Game(document.getElementById("game-game"));
  this._help = new Dialog(document.getElementById("game-help"));
  
  // Configure the settings
  this._settings.initEvents(this._help);
  this._settings.setMusic("audio/music.mp3");
  
  // Start the system
  this._menu.initEvents(this._game);
  this._menu.show();
}


/**
 * A class dealing with the main menu of the game. It includes buttons for
 * starting the game, viewing the options and viewing the help information.
 * @param {HTMLElement} element an empty placeholder element that will contain
 *                              the main menu of the game
 */
function Menu(element) {
  this._menuElement = element;
  this._menuElement.innerHTML = 
      '<h1>The <strong>Booby Trap Labs</strong></h1>' +

      '<button type="button">Start</button>';
}

Menu.prototype = {
  show: function () {
    this._menuElement.hidden = false;
  },
  
  hide: function () {
    this._menuElement.hidden = true;
  },
  
  initEvents: function (game) {
    var self = this;
    
    this._menuElement.getElementsByTagName("button")[0].addEventListener("click", function () {
      self.hide();
      game.start();
    }, false);
  }
};


/**
 * A class that creates a simple dialog box that appears above what is currently
 * being displayed.
 * @param {HTMLElement} element an empty element containing the contents of the
 *                              dialog box
 */
function Dialog(element) {
  this._windowElement = element;
  
  this._windowElement.className = "game-dialog";
  this._windowElement.appendChild(this._createCloseButton());
}

Dialog.prototype = {
  open: function () {
    this._windowElement.hidden = false;
  },
  
  close: function () {
    this._windowElement.hidden = true;
  },
  
  _createCloseButton: function () {
    var self = this;
    
    var image = document.createElement("img");
    image.src = "images/close.png";
    image.alt = "Close dialog";
    
    var button = document.createElement("button");
    button.className = "game-dialog-close";
    button.appendChild(image);
    
    button.addEventListener("click", function () {
      self.close();
    }, false);
    
    return button;
  }
};


function Game(element) {
  this._gameElement = element;
  this._gameElement.innerHTML =
      '<canvas width="640" height="480" hidden></canvas>' +
      '<div id="game-time"></div>';
  
  this._time = new TimeCounter(document.getElementById("game-time"));
}

Game.prototype = {
  start: function () {
    this._gameElement.hidden = false;
    this._time.play();
    // TODO
  }
};


/**
 * A class managing settings including audio and displaying help information.
 * @param {HTMLElement} element an empty element containing a placeholder for
 *                              the audio controls
 */
function Settings(element) {
  this._controlsElement = element;
  this._controlsElement.innerHTML =
      '<button type="button">' +
      '  <img src="images/music.png" alt="Mute music">' +
      '</button>' +
      
      '<button type="button">' +
      '  <img src="images/help.png" alt="Help">' +
      '</button>';
  
  var buttons = this._controlsElement.getElementsByTagName("button");
  this._musicButton = buttons[0];
  this._helpButton = buttons[1];
  
  this._music = new Audio();
  this._music.loop = true;
}

Settings.prototype = {
  setMusic: function (file) {
    this._music.src = file;
    this._music.play();
  },
  
  isMuted: function () {
    return this._music.muted;
  },
  
  mute: function () {
    this._music.muted = true;
    
    var buttonImage = this._musicButton.getElementsByTagName("img")[0];
    buttonImage.src = "images/music-muted.png";
    buttonImage.alt = "Unmute music";
  },
  
  unmute: function () {
    this._music.muted = false;
    
    var buttonImage = this._musicButton.getElementsByTagName("img")[0];
    buttonImage.src = "images/music.png";
    buttonImage.alt = "Mute music";
  },
  
  initEvents: function (help) {
    var self = this;
    
    this._musicButton.addEventListener("click", function () {
      if (self.isMuted()) {
        self.unmute();
      } else {
        self.mute();
      }
    }, false);
    
    this._helpButton.addEventListener("click", function () {
      help.open();
    }, false);
  }
};


/**
 * A class managing a counter that can be stopped and started.
 * @param {HTMLElement} element an empty element containing a placeholder for
 *                              the timer
 */
function TimeCounter(element) {
  this._timeElement = element;
  this._timeElement.innerHTML = 'Time: <span>0</span>';
  this._counterElement = this._timeElement.getElementsByTagName("span")[0];
  
  this._seconds = 0;
}

TimeCounter.prototype = {
  play: function () {
    var self = this;
    
    self._interval = window.setInterval(function () {
      self._seconds++;
      self._writeTime();
    }, 1000);
  },
  
  pause: function () {
    window.clearInterval(this._interval);
  },
  
  reset: function () {
    this.pause();
    this._seconds = 0;
    this._writeTime();
  },
  
  _writeTime: function () {
    // XXX: Would be better if displayed minutes and seconds
    this._counterElement.innerHTML = this._seconds;
  }
};


// BEGIN SCRIPT
new GameManager(document.getElementById("game"));

})();