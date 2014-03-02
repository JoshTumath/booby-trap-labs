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

      '<canvas id="game-canvas" width="640" height="480" hidden></canvas>' +

      '<div id="game-options" hidden>' +
      '  <h2>Options</h2>' +
      '  <label>' +
      '    <input type="checkbox">' +
      '    Mute audio' +
      '  </label>' +
      '</div>' +

      '<div id="game-help" hidden>' +
      '  <h2>Help</h2>' +
      '  <p>Foo</p>' +
      '</div>';
  
  // Instantiate the objects that deal with each element
  this._menu = new Menu(document.getElementById("game-menu"));
  this._game = new Game(document.getElementById("game-canvas"));
  this._options = new Dialog(document.getElementById("game-options"));
  this._help = new Dialog(document.getElementById("game-help"));
  
  // Start the system
  this._menu.initMenuEvents(this._game, this._options, this._help);
  this._menu.show();
}


/**
 * A class dealing with the main menu of the game. It includes buttons for
 * starting the game, viewing the options and viewing the help information.
 * @param {HTMLElement} element a placeholder element that will contain the
 *                              main menu of the game
 */
function Menu(element) {
  this._menuElement = element;
  this._menuElement.innerHTML = 
      '<h1>Booby Trap Tester</h1>' +

      '<ul>' +
      '  <li>' +
      '    <button type="button">Start</button>' +
      '  </li>' +
      '  <li>' +
      '    <button type="button">Options</button>' +
      '  </li>' +
      '  <li>' +
      '    <button type="button">Help</button>' +
      '  </li>' +
      '</ul>';
}

Menu.prototype = {
  show: function () {
    this._menuElement.hidden = false;
  },
  
  hide: function () {
    this._menuElement.hidden = true;
  },
  
  initMenuEvents: function (game, options, help) {
    var self = this;
    var buttons = this._menuElement.getElementsByTagName("button");
    
    // Game
    buttons[0].addEventListener("click", function () {
      self.hide();
      game.start();
    }, false);
    
    // Options
    buttons[1].addEventListener("click", function () {
      options.open();
    }, false);
    
    // Help
    buttons[2].addEventListener("click", function () {
      help.open();
    }, false);
  }
};


/**
 * A class that creates a simple dialog box that appears above what is currently
 * being displayed.
 * @param {HTMLElement} element an element containing the contents of the dialog
 *                              box
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


function Game() {
  // TODO
}

Game.prototype = {
  start: function () {
    // TODO
  }
};


// BEGIN SCRIPT
new GameManager(document.getElementById("game"));

})();