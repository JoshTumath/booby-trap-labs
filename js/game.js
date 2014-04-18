/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function () {
  "use strict";
  
  // Balance variables /////////////////////////////////////////////////////////
  var MAX_TRAPS = 32;
  var MAX_SHADOWS = 2;
  
  
  // Sprite data ///////////////////////////////////////////////////////////////
  var SPRITESHEET_URL = "images/sprites.png";
  
  var GRID_SIZE = 10;
  var TILE_SIZE = 64;
  var MOVEMENT_SPEED = 8; // Must be a factor of the TILE_SIZE
  var FRAME_RATE = 1000 / 30;
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
    },
    
    equals: function (other) {
      return this.x === other.x && this.y === other.y;
    }
  };

  var TILES = {
    floor: new Point(0, 0),
    block: new Point(1, 0),
    controllerButtons: new Point(2, 0),
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
    },
    trapShadow: [
      new Point(0, 5),
      new Point(1, 5),
      new Point(2, 5),
      new Point(3, 5),
      new Point(4, 5)
    ],
    trap: [
      new Point(0, 6),
      new Point(1, 6),
      new Point(2, 6),
      new Point(3, 6),
      new Point(4, 6)
    ]
  };
  
  
  // Level data ////////////////////////////////////////////////////////////////
  var TOTAL_LEVELS = 4;

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
    ],
    4: [
      [TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block],
      [TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.floor, TILES.block],
      [TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block],
      [TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block, TILES.block]
    ]
  };
  
  var MAX_STEPS = {
    1: 35,
    2: 100,
    3: 150,
    4: 70
  };

  var menu, help, settings, game;
  var spritesheet;

  //////////////////////////////////////////////////////////////////////////////

  /**
   * Creates a board showing statistics for the current level, steps to go to
   * complete the level and the player health.
   * @param {HTMLElement} element an empty element containing a placeholder for
   *                              the statistics
   */
  function Statistics(element) {
    this._statisticsElement = element;
    this._statisticsElement.innerHTML =
        '<p><strong>Level:</strong> <span></span> (highest ever: <span></span>)' +
        '<p><strong>Steps to go:</strong> <span></span>' +
        '<p><strong>Health:</strong> <span>100</span>%</p>';
    this._levelElement = this._statisticsElement.getElementsByTagName("span")[0];
    this._highestLevelElement = this._statisticsElement.getElementsByTagName("span")[1];
    this._stepsToGoElement = this._statisticsElement.getElementsByTagName("span")[2];
    this._healthElement = this._statisticsElement.getElementsByTagName("span")[3];
    
    this.level = 0;
    this._highestLevel = this._loadHighestLevel();
    this.stepsToGo = 0;
    this._health = 100;
  }

  Statistics.prototype = {
    _loadHighestLevel: function () {
      // If this is a first run, there will be no highest level saved.
      if (!window.localStorage || !window.localStorage.highestLevel) {
        return 0;
      }
      
      return parseInt(window.localStorage.highestLevel);
    },
    
    saveHighestLevel: function () {
      if (window.localStorage) {
        window.localStorage.highestLevel = this._highestLevel;
      }
    },
    
    _updateLevelElement: function () {
      this._levelElement.innerHTML = this.level;
    },
    
    _updateHighestLevelElement: function () {
      this._highestLevelElement.innerHTML = this._highestLevel;
    },
    
    _updateStepsToGoElement: function () {
      this._stepsToGoElement.innerHTML = this.stepsToGo;
    },
    
    _updateHealthElement: function () {
      this._healthElement.innerHTML = this._health;
    },
    
    increaseLevel: function () {
      this.level++;
      this._updateLevelElement();
      
      // Make sure the highscore isn't lower than the current level
      if (this._highestLevel < this.level) {
        this._highestLevel = this.level;
        this._updateHighestLevelElement();
      }
    },
    
    reduceSteps: function () {
      this.stepsToGo--;
      this._updateStepsToGoElement();
      
      if (this.stepsToGo <= 0) {
        return true;
      } else {
        return false;
      }
    },
    
    reduceHealth: function () {
      this._health -= 20;
      this._updateHealthElement();
      
      if (this._health <= 0) {
        return true;
      } else {
        return false;
      }
    },
    
    reset: function () {
      this.stepsToGo = MAX_STEPS[this.level];
      this._health = 100;
      this._updateHealthElement();
      this._updateStepsToGoElement();
    },
    
    resetAll: function () {
      this.reset();
      this.level = 0;
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
              BACKGROUND_GRID_LAYOUT[level][y][x].x, BACKGROUND_GRID_LAYOUT[level][y][x].y, TILE_SIZE, TILE_SIZE,
              x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  };


  /**
   * 
   * @param {CanvasRenderingContext2D} context
   */
  function Traps(context) {
    this._graphics = context;
    this._trapsOnGrid = [];
    this._lastTrapPosition = null;
  }
  
  Traps.prototype = {
    _isPositionAlreadyOnGrid: function (position) {
      for (var i in this._trapsOnGrid) {
        if (position.equals(this._trapsOnGrid[i])) {
          return true;
        }
      }
      
      return false;
    },
    
    isTrapAt: function (position) {
      if (this._trapsOnGrid.length < MAX_SHADOWS) {
        return false;
      }
      
      for (var i = 0; i < this._trapsOnGrid.length - MAX_SHADOWS; i++) {
        if (position.equals(this._trapsOnGrid[i])) {
          return true;
        }
      }
    },
    
    /**
     * Selects a random point in the grid that is a floor tile and doesn't have
     * another trap on it.
     * @returns {Point} a random point in the grid
     */
    _selectRandomPoint: function () {
      var x, y;
      var randomPoint;
      
      while (true) {
        x = Math.floor(Math.random() * (GRID_SIZE));
        y = Math.floor(Math.random() * (GRID_SIZE));
        
        randomPoint = new Point(x, y);
        
        if (BACKGROUND_GRID_LAYOUT[game.statistics.level][randomPoint.getY()][randomPoint.getX()] !== TILES.block
            && !this._isPositionAlreadyOnGrid(randomPoint)) {
          return randomPoint;
        }
      }
    },
    
    _clearFrame: function (position) {
      this._graphics.clearRect(
          position.x, position.y,
          TILE_SIZE, TILE_SIZE);
    },
    
    _drawTrapShadowFrame: function (index, position) {
      this._clearFrame(position);
      
      this._graphics.drawImage(
          spritesheet,
          TILES.trapShadow[index].x, TILES.trapShadow[index].y, TILE_SIZE, TILE_SIZE,
          position.x, position.y, TILE_SIZE, TILE_SIZE);
    },
    
    _drawTrapFrame: function (index, position) {
      this._clearFrame(position);
      
      this._graphics.drawImage(
          spritesheet,
          TILES.trap[index].x, TILES.trap[index].y, TILE_SIZE, TILE_SIZE,
          position.x, position.y, TILE_SIZE, TILE_SIZE);
    },
    
    _animateTraps: function () {
      var currentFrame = 0;
      var requestId;
      var self = this;
      function animate() {
        window.setTimeout(function () {
          requestId = window.requestAnimationFrame(animate);
          
          if (currentFrame >= TILES.trap.length - 1) {
            window.cancelAnimationFrame(requestId);
          } else {
            currentFrame++;
      
            self._drawTrapShadowFrame(currentFrame, self._trapsOnGrid[self._trapsOnGrid.length - 1]);
            if (self._trapsOnGrid.length > MAX_SHADOWS) {
              self._drawTrapFrame(currentFrame, self._trapsOnGrid[self._trapsOnGrid.length - MAX_SHADOWS - 1]);
            }
          }
        }, FRAME_RATE);
      }
      
      this._drawTrapShadowFrame(0, this._trapsOnGrid[this._trapsOnGrid.length - 1]);
      if (this._trapsOnGrid.length > MAX_SHADOWS) {
        this._drawTrapFrame(0, this._trapsOnGrid[this._trapsOnGrid.length - MAX_SHADOWS - 1]);
        settings.playTrapSfx();
      }
      
      animate();
    },
    
    addTrap: function () {
      this._trapsOnGrid.push(this._selectRandomPoint());
      
      // We need to remove traps if there's too many
      if (this._trapsOnGrid.length > MAX_TRAPS) {
        this._clearFrame(this._trapsOnGrid.shift());
      }
      
      if (game.statistics.stepsToGo > 1) {
        this._animateTraps();
      }
    },
    
    reset: function () {
      this._trapsOnGrid = [];
      
      this._graphics.clearRect(
          0, 0,
          this._graphics.canvas.width, this._graphics.canvas.height);
    }
  };
  
  
  /**
   * 
   * @param {CanvasRenderingContext2D} context
   */
  function Player(context) {
    this._graphics = context;
    this.position = new Point(4, 4);
    this._currentlyMoving = false;
  }
  
  Player.prototype = {
    drawFrame: function (index, direction) {
      this._graphics.clearRect(
          0, 0,
          this._graphics.canvas.width, this._graphics.canvas.height);

      this._graphics.drawImage(
          spritesheet,
          TILES.player[direction][index].x, TILES.player[direction][index].y, TILE_SIZE, TILE_SIZE,
          this.position.x, this.position.y, TILE_SIZE, TILE_SIZE);
    },
    
    _getExpectedPosition: function (direction) {
      switch (direction) {
        case "up":
          return new Point(this.position.getX(), this.position.getY() - 1);
        case "right":
          return new Point(this.position.getX() + 1, this.position.getY());
        case "down":
          return new Point(this.position.getX(), this.position.getY() + 1);
        case "left":
          return new Point(this.position.getX() - 1, this.position.getY());
        default:
          return null;
      }
    },
    
    _moveToExpectedPosition: function (direction) {
      switch (direction) {
        case "up":
          this.position.y -= MOVEMENT_SPEED;
          break;
        case "right":
          this.position.x += MOVEMENT_SPEED;
          break;
        case "down":
          this.position.y += MOVEMENT_SPEED;
          break;
        case "left":
          this.position.x -= MOVEMENT_SPEED;
          break;
      }
    },
    
    move: function (direction) {
      // Prevent the user from trying to move when they're currently already
      // moving.
      if (this._currentlyMoving) {
        return null;
      }
      
      // Frame 0 is the idle animation, so we need to start at , which is the
      // first sprite of the walking animation.
      var currentFrame = 1;
      var newPosition = this._getExpectedPosition(direction);
      
      // Don't let the user walk onto blocks.
      if (BACKGROUND_GRID_LAYOUT[game.statistics.level][newPosition.getY()][newPosition.getX()] === TILES.block) {
        return null;
      }
      
      var requestId;
      var self = this;
      function animate() {
        window.setTimeout(function () {
          requestId = window.requestAnimationFrame(animate);
          
          if (newPosition.x === self.position.x
              && newPosition.y === self.position.y) {
            self.drawFrame(0, direction);
            self._currentlyMoving = false;
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
        }, FRAME_RATE);
      }
      
      if (game.statistics.stepsToGo > 1) {
        this._currentlyMoving = true;
        this.drawFrame(currentFrame, direction);
        animate();
      }
      
      return newPosition;
    },
    
    reset: function () {
      this.position = new Point(4, 4);
      this.drawFrame(0, "down");
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
        '<canvas id="game-traps" width="640" height="640"></canvas>' +
        '<canvas id="game-player" width="640" height="640"></canvas>' +
        '<canvas id="game-controller" width="640" height="640"></canvas>' +
        '<div id="game-stats"></div>' +
        '<section id="game-message" hidden></section>';

    this._backgroundLayer = document.getElementById("game-background");
    this._trapsLayer = document.getElementById("game-traps");
    this._playerLayer = document.getElementById("game-player");
    this._controllerLayer = document.getElementById("game-controller");
    
    this._background = new BackgroundGrid(this._backgroundLayer.getContext("2d"));
    this._traps = new Traps(this._trapsLayer.getContext("2d"));
    this._player = new Player(this._playerLayer.getContext("2d"));
    
    this.statistics = new Statistics(document.getElementById("game-stats"));
    
    this._preload();
  }

  Game.prototype = {
    _showMessage: function (message, submessage, duration, callback) {
      var messageElement = document.getElementById("game-message");
      messageElement.innerHTML = "<h1>" + message + "</h1>";
      
      if (submessage !== null) {
        messageElement.innerHTML += "<p>" + submessage + "</p>";
      }
      
      messageElement.hidden = false;
      
      if (callback) {
        var self = this;
        window.setTimeout(function () {
          messageElement.hidden = true;
          callback(self);
        }, duration);
      } else {
        window.setTimeout(function () {
          messageElement.hidden = true;
        }, duration);
      }
    },
    
    _gameOver: function () {
      this._disableController();
      this._showMessage(
          "Game Over",
          "Better luck next time, Test Subject #7...",
          5000,
          this.end);
    },
    
    _victory: function () {
      this._disableController();
      this._showMessage(
          "You escaped the traps!",
          "How did our traps fail to kill you? This is impossible!",
          5000,
          this.end);
    },
    
    _startNextLevel: function () {
      function setUpKeyboardMovement(self) {
        self._enableController();
      }
      
      if (this.statistics.level >= TOTAL_LEVELS) {
        this._disableController();
        this._victory();
      } else {
        this._disableController();
        
        this.statistics.increaseLevel();
        this.statistics.reset();

        this._background.draw(this.statistics.level);
        this._traps.reset();
        this._player.reset();
        
        switch (this.statistics.level) {
          case 1:
            this._showMessage(
                "Level 1",
                "Welcome, Test Subject #7. Let's start off with a practice. " +
                "We've given you some armour to protect yourself. Think you " +
                "can avoid our traps?",
                8000,
                setUpKeyboardMovement);
            break;
          case 2:
            this._showMessage(
                "Level 2",
                "We won't go easy on you now, Test Subject #7. We calculate " +
                "your chances of survival are... zero.",
                5000,
                setUpKeyboardMovement);
            break;
          default:
            this._showMessage(
                "Level " + this.statistics.level,
                "Feeling the pain, yet, Test Subject #7?",
                3000,
                setUpKeyboardMovement);
            break;
        }
      }
    },
    
    _movePlayer: function (direction) {
      // We need to make sure the move worked before we do anything else.
      var newPlayerPosition = this._player.move(direction);
      
      if (newPlayerPosition !== null) {
        this._traps.addTrap();
        
        // Penalise the player if they walk on a trap
        if (this._traps.isTrapAt(newPlayerPosition)) {
          // Check that there's no health left
          var isGameOver = this.statistics.reduceHealth();
          settings.playPainSfx();
          
          if (isGameOver) {
            this._gameOver();
          }
        }
        
        // Is the player ready to move on to the next level?
        if (this.statistics.reduceSteps()) {
          this._startNextLevel();
        }
      }
    },
    
    _keyboardMovement: function (event) {
      var direction;

      switch (event.keyCode) {
        case 37: // Left arrow
          direction = "left";
          break;
        case 38: // Up arrow
          direction = "up";
          break;
        case 39: // Right arrow
          direction = "right";
          break;
        case 40: // Down arrow
          direction = "down";
          break;
        default: // Abort if another key is pressed
          return;
      }

      game._movePlayer(direction);
    },
    
    _clickMovement: function (event) {
      function isPointInSubTile(pointX, pointY, subTileX, subTileY) {
        if (subTileX < pointX && pointX < subTileX + (TILE_SIZE / 2)
            && subTileY < pointY && pointY < subTileY + (TILE_SIZE / 2)) {
          return true;
        }
        
        return false;
      }
      
      var boundingBox = game._controllerLayer.getBoundingClientRect();
      var mouseX = (event.clientX - boundingBox.left) * (game._controllerLayer.width / boundingBox.width);
      var mouseY = (event.clientY - boundingBox.top) * (game._controllerLayer.height / boundingBox.height);
      
      var TILE_POSITION_X = (GRID_SIZE - 1) * TILE_SIZE;
      var TILE_POSITION_Y = (GRID_SIZE - 1) * TILE_SIZE;
      
      var direction;
      
      if (isPointInSubTile(mouseX, mouseY, TILE_POSITION_X, TILE_POSITION_Y)) {
        direction = "up";
      } else if (isPointInSubTile(mouseX, mouseY, TILE_POSITION_X + (TILE_SIZE / 2), TILE_POSITION_Y)) {
        direction = "right";
      } else if (isPointInSubTile(mouseX, mouseY, TILE_POSITION_X, TILE_POSITION_Y + (TILE_SIZE / 2))) {
        direction = "left";
      } else if (isPointInSubTile(mouseX, mouseY, TILE_POSITION_X + (TILE_SIZE / 2), TILE_POSITION_Y + (TILE_SIZE / 2))) {
        direction = "down";
      } else {
        return;
      }
      
      game._movePlayer(direction);
    },
    
    _enableController: function () {
      document.onkeyup = this._keyboardMovement;
      this._controllerLayer.onclick = this._clickMovement;
    },
    
    _disableController: function () {
      document.onkeyup = null;
      this._controllerLayer.onclick = null;
    },
    
    _drawMouseControls: function () {
      var position = new Point(GRID_SIZE - 1, GRID_SIZE - 1);
      
      this._controllerLayer.getContext("2d").drawImage(
          spritesheet,
          TILES.controllerButtons.x, TILES.controllerButtons.y, TILE_SIZE, TILE_SIZE,
          position.x, position.y, TILE_SIZE, TILE_SIZE);
    },
    
    start: function () {
      this._gameElement.hidden = false;
      this._drawMouseControls();
      this._startNextLevel();
      settings.setMusic("audio/game.mp3");
    },
    
    end: function (self) {
      self._gameElement.hidden = true;
      self.statistics.saveHighestLevel();
      self.statistics.resetAll();
      
      menu.show();
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
      settings.setMusic("audio/menu.mp3");
    },

    hide: function () {
      this._menuElement.hidden = true;
    }
  };


  /**
   * A class that creates a simple dialog box that appears above what is
   * currently being displayed.
   * @param {HTMLElement} element an empty element containing the contents of
   *                              the dialog box
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
    
    this._trapSfx = new Audio("audio/spike.mp3");
    this._painSfx = new Audio("audio/pain.mp3");
    
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

  Settings.prototype = {
    setMusic: function (file) {
      this._music.src = file;
      this._music.play();
    },
    
    playTrapSfx: function () {
      // Don't play if audio is muted
      if (!this.isMuted()) {
        this._trapSfx.currentTime = 0;
        this._trapSfx.play();
      }
    },
    
    playPainSfx: function () {
      // Don't play if audio is muted
      if (!this.isMuted()) {
        this._painSfx.currentTime = 0;
        this._painSfx.play();
      }
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
      this._mutedSfx = false;

      var buttonImage = this._musicButton.getElementsByTagName("img")[0];
      buttonImage.src = "images/music.png";
      buttonImage.alt = "Mute music";
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
        '  <p>You have been abducted and taken to a testing facility in an ' +
        '  unknown location. You can\'t remember how you got here. You ' +
        '  can\'t even remember your name! You\'re only known as "Test ' +
        '  Subject #7".</p>' +
        
        '  <p>The testing facilty creates booby traps for state-of-the-art ' +
        '  temples and palaces. Their newest trap is the DeathTrap 3000, a' +
        '  hidden trap that shoots spikes out of the floor.</p>' +
        
        '  <p><strong>Stay alive as long as you can. Use the <em>arrow ' +
        '  keys</em> or <em>click the arrow buttons in the bottom right' +
        '  corner</em> to move Test Subject #7.</strong> Keep and eye on your' +
        '  health.</p>' +
        '</div>';

    // Instantiate the objects that deal with each element
    menu = new Menu(document.getElementById("game-menu"));
    help = new Dialog(document.getElementById("game-help"));
    settings = new Settings(document.getElementById("game-controls"));
    game = new Game(document.getElementById("game-game"));

    // Start the system
    menu.show();
  })();
})();