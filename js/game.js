/*jslint vars: true */
/*jslint browser: true, nomen: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function () {
  "use strict";

  var SPRITESHEET_URL = "images/sprites.png";
  
  var GRID_SIZE = 10;
  var TILE_SIZE = 64;

  /**
   * Constructs a new object containing x and y coordinates of the top left
   * corner of a sprite in the sprite sheet.
   * 
   * Coordinate numbers entered into the constructor should not be pixel
   * coordinates. Rather, they should be the coordinates of the tile grid.
   * @param {number} x the x coordinate of the sprite in the spritesheet
   * @param {number} y the y coordinate of the sprite in the spritesheet
   */
  function Point(x, y) {
    this.x = TILE_SIZE * x;
    this.y = TILE_SIZE * y;
  }

  var TILES = {
    floor: new Point(0, 0),
    block: new Point(1, 0),
    player: {
      up: [
        new Point(0, 1),
        new Point(1, 1),
        new Point(2, 1),
        new Point(3, 1),
        new Point(4, 1),
        new Point(5, 1),
        new Point(6, 1),
        new Point(7, 1),
        new Point(8, 1)
      ],
      left: [
        new Point(0, 2),
        new Point(1, 2),
        new Point(2, 2),
        new Point(3, 2),
        new Point(4, 2),
        new Point(5, 2),
        new Point(6, 2),
        new Point(7, 2),
        new Point(8, 2)
      ],
      down: [
        new Point(0, 3),
        new Point(1, 3),
        new Point(2, 3),
        new Point(3, 3),
        new Point(4, 3),
        new Point(5, 3),
        new Point(6, 3),
        new Point(7, 3),
        new Point(8, 3)
      ],
      right: [
        new Point(0, 4),
        new Point(1, 4),
        new Point(2, 4),
        new Point(3, 4),
        new Point(4, 4),
        new Point(5, 4),
        new Point(6, 4),
        new Point(7, 4),
        new Point(8, 4)
      ]
    }
  };

  var BACKGROUND_GRID_LAYOUT = {
    1: [
      [TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block]
    ]
  };

  var menu, settings, game, help;
  var spritesheet;


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
  
  
  /**
   * 
   * @param {CanvasRenderingContext2D} context
   */
  function BackgroundGrid(context) {
    this._graphics = context;
  }

  BackgroundGrid.prototype = {
    draw: function (level) {
      for (var x = 0; x < GRID_SIZE; x++) {
        for (var y = 0; y < GRID_SIZE; y++) {
          this._graphics.drawImage(
              spritesheet,
              BACKGROUND_GRID_LAYOUT[level][x][y].x, BACKGROUND_GRID_LAYOUT[level][x][y].y, TILE_SIZE, TILE_SIZE,
              x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  };
  
  
  /**
   * 
   * @param {CanvasRenderingContext2D} context
   */
  function ForegroundGrid(context) {
    this._graphics = context;
    this._playerCoordinates = new Point(5, 5);
  }
  
  ForegroundGrid.prototype = {
    // XXX
    draw: function () {
      var self = this;
      var currentFrame = 0;
      
      function animation(timestamp) {
        window.setTimeout(function () {
          window.requestAnimationFrame(animation);
          
          self._graphics.clearRect(
              0, 0,
              self._graphics.canvas.width, self._graphics.canvas.height);

          self._graphics.drawImage(
              spritesheet,
              TILES.player.left[currentFrame].x, TILES.player.left[currentFrame].y, TILE_SIZE, TILE_SIZE,
              5 * TILE_SIZE, 5 * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          console.log("Length:" + TILES.player.left.length);
          console.log("currentFrame:" + currentFrame);
          if (currentFrame >= TILES.player.left.length) {
            currentFrame = 0;
          } else {
            currentFrame++;
          }
        }, 50);
      }
      animation();
    }
  };

  
  /**
   * 
   * @param {HTMLElement} element
   */
  function Game(element) {
    this._gameElement = element;
    this._gameElement.innerHTML =
        '<canvas id="game-background" width="640" height="640"></canvas>' +
        '<canvas id="game-foreground" width="640" height="640"></canvas>' +
        '<div id="game-time"></div>';

    this._backgroundElement = document.getElementById("game-background");
    this._foregroundElement = document.getElementById("game-foreground");
    
    this._background = new BackgroundGrid(this._backgroundElement.getContext("2d"));
    this._foreground = new ForegroundGrid(this._foregroundElement.getContext("2d"));

    this._currentLevel = 1;
    
    this._preload();
  }

  Game.prototype = {
    start: function () {
      this._gameElement.hidden = false;
      this._background.draw(this._currentLevel);
      this._foreground.draw();
      // TODO
    },

    _preload: function () {
      spritesheet = new Image(128, 64);

      spritesheet.onload = function () {
        var startButton = menu._menuElement.getElementsByTagName("button")[0];
        startButton.disabled = false;
        startButton.addEventListener("click", function () {
          menu.hide();
          game.start();
        }, false);
      };

      spritesheet.src = SPRITESHEET_URL;
    }
  };


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
   * The main function managing the creation and running of the game.
   */
  (function () {
    // Set up the elements used by the game
    document.getElementById("game").innerHTML =
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
    // XXX: settings.setMusic("audio/music.mp3");

    // Start the system
    menu.show();
  })();
})();