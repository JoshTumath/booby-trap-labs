/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
"use strict";

var SPRITES_URL = "images/sprites.png";
var TILE_SIZE = 64;
var GRID_SIZE = 10;

var Tiles = {
  floor: { x:  0, y: 0 },
  block: { x: 64, y: 0 }
};

var BackgroundGrid = {
  1: [
    [Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block],
    [Tiles.block, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.block],
    [Tiles.block, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.block],
    [Tiles.block, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.block],
    [Tiles.block, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.block],
    [Tiles.block, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.block],
    [Tiles.block, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.block],
    [Tiles.block, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.block],
    [Tiles.block, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.floor, Tiles.block],
    [Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block, Tiles.block]
  ]
};

var menu, settings, game, help;
var spritesImage;

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

      '<div id="game-game" hidden></div>' +
      
      '<div id="game-controls"></div>' +

      '<div id="game-help" hidden>' +
      '  <h2>Help</h2>' +
      '  <p>Foo</p>' +
      '</div>';
  
  // Instantiate the objects that deal with each element
  menu = new Menu(document.getElementById("game-menu"));
  settings = new Settings(document.getElementById("game-controls"));
  game = new Game(document.getElementById("game-game"));
  help = new Dialog(document.getElementById("game-help"));
  
  // Configure the settings
  settings.initEvents();
  //settings.setMusic("audio/music.mp3");
  
  // Start the system
  menu.preload();
  menu.show();
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

      '<button type="button" disabled>Start</button>';
}

Menu.prototype = {
  show: function () {
    this._menuElement.hidden = false;
  },
  
  hide: function () {
    this._menuElement.hidden = true;
  },
  
  preload: function () {
    spritesImage = new Image(128, 64);
    
    var self = this;
    spritesImage.onload = function () {
      var startButton = self._menuElement.getElementsByTagName("button")[0];
      startButton.disabled = false;
      startButton.addEventListener("click", function () {
        self.hide();
        game.start();
      }, false);
    };
    
    spritesImage.src = SPRITES_URL;
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
      '<canvas id="game-background" width="640" height="640"></canvas>' +
      '<canvas id="game-foreground" width="640" height="640"></canvas>' +
      '<div id="game-time"></div>';
  
  this._backgroundElement = document.getElementById("game-background");
  this._background = this._backgroundElement.getContext("2d");
  this._foregroundElement = document.getElementById("game-foreground");
  this._foreground = this._foregroundElement.getContext("2d");
  
  this._time = new TimeCounter(document.getElementById("game-time"));
  
  this._currentLevel = 1;
}

Game.prototype = {
  start: function () {
    this._gameElement.hidden = false;
    this._time.play();
    this._drawBackground();
    // TODO
  },
  
  _drawBackground: function () {
    for (var x = 0; x < GRID_SIZE; x++) {
      for (var y = 0; y < GRID_SIZE; y++) {
        this._background.drawImage(
            spritesImage,
            BackgroundGrid[this._currentLevel][x][y].x, BackgroundGrid[this._currentLevel][x][y].y, TILE_SIZE, TILE_SIZE,
            x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
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
  
  initEvents: function () {
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