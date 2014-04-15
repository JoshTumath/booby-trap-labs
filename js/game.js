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
  var MOVEMENT_SPEED = 4; // Must be a factor of the TILE_SIZE

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
  
  Point.prototype = {
    getX: function () {
      return this.x / TILE_SIZE;
    },
    
    getY: function () {
      return this.y / TILE_SIZE;
    },
    
    setPoint: function (x, y) {
      this.x = TILE_SIZE * x;
      this.y = TILE_SIZE * y;
    }
  };

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
    ],
    2: [
      [TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.block, TILES.floor, TILES.floor, TILES.block, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.block, TILES.floor, TILES.floor, TILES.block, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block]
    ],
    3: [
      [TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.block],
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
  function PlayerGrid(context) {
    this._graphics = context;
    this._position = new Point(4, 4);
    this._currentlyMoving = false;
  }
  
  PlayerGrid.prototype = {
    drawFrame: function (index, direction) {
      this._graphics.clearRect(
          0, 0,
          this._graphics.canvas.width, this._graphics.canvas.height);

      this._graphics.drawImage(
          spritesheet,
          TILES.player[direction][index].x, TILES.player[direction][index].y, TILE_SIZE, TILE_SIZE,
          this._position.x, this._position.y, TILE_SIZE, TILE_SIZE);
    },
    
    _getExpectedPosition: function (direction) {
      switch (direction) {
        case "up":
          return new Point(this._position.getX(), this._position.getY() - 1);
        case "right":
          return new Point(this._position.getX() + 1, this._position.getY());
        case "down":
          return new Point(this._position.getX(), this._position.getY() + 1);
        case "left":
          return new Point(this._position.getX() - 1, this._position.getY());
        default:
          return null;
      }
    },
    
    _moveToExpectedPosition: function (direction) {
      switch (direction) {
        case "up":
          this._position.y -= MOVEMENT_SPEED;
          break;
        case "right":
          this._position.x += MOVEMENT_SPEED;
          break;
        case "down":
          this._position.y += MOVEMENT_SPEED;
          break;
        case "left":
          this._position.x -= MOVEMENT_SPEED;
          break;
      }
    },
    
    move: function (direction) {
      if (this._currentlyMoving) {
        return;
      } else {
        this._currentlyMoving = true;
      }
      
      var currentFrame = 1;
      var newPosition = this._getExpectedPosition(direction);
      
      var requestId;
      var self = this;
      function playAnimation() {
        window.setTimeout(function () {
          requestId = window.requestAnimationFrame(playAnimation);
          
          if (newPosition.x === self._position.x
              && newPosition.y === self._position.y) {
            self.drawFrame(0, direction);
            this._currentlyMoving = false;
            window.cancelAnimationFrame(requestId);
          } else {
            if (currentFrame >= TILES.player.left.length - 1) {
              currentFrame = 1;
            } else {
              currentFrame++;
            }
            
            self._moveToExpectedPosition(direction);
            self.drawFrame(currentFrame, direction);
          }
        }, 50); // Frame rate of 20 fps
      }
      
      this.drawFrame(currentFrame, direction);
      playAnimation();
    }
  };


  /**
   * 
   * @param {CanvasRenderingContext2D} context
   */
  function TrapsGrid(context) {
    this._graphics = context;
  }

  
  /**
   * 
   * @param {HTMLElement} element
   */
  function Game(element) {
    this._gameElement = element;
    this._gameElement.innerHTML =
        '<canvas id="game-background" width="640" height="640"></canvas>' +
        '<canvas id="game-player" width="640" height="640"></canvas>' +
        '<canvas id="game-traps" width="640" height="640"></canvas>' +
        '<div id="game-time"></div>';

    this._backgroundLayer = document.getElementById("game-background");
    this._playerLayer = document.getElementById("game-player");
    this._trapsLayer = document.getElementById("game-traps");
    
    this._background = new BackgroundGrid(this._backgroundLayer.getContext("2d"));
    this._player = new PlayerGrid(this._playerLayer.getContext("2d"));
    this._traps = new TrapsGrid(this._playerLayer.getContext("2d"));

    this._currentLevel = 1;
    
    this._preload();
  }

  Game.prototype = {
    start: function () {
      this._gameElement.hidden = false;
      this._background.draw(this._currentLevel);
      this._player.drawFrame(0, "down");
      
      var self = this;
      document.onkeypress = function (event) {
        switch (event.keyCode) {
          case 37: // Left arrow
            self._player.move("left");
            break;
          case 38: // Up arrow
            self._player.move("up");
            break;
          case 39: // Right arrow
            self._player.move("right");
            break;
          case 40: // Down arrow
            self._player.move("down");
            break;
        }
      };
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