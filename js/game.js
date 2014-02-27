/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
"use strict";


/**
 * A class managing the creation and running of the game. When instanciated, it
 * creates all the elements required for the game to work.
 * @param {HTMLElement} element A placeholder element where the game will be
 *                              created within
 */
function Game(element) {
  this._gameElement = element;
  this._gameElement.innerHTML =
          '<div id="game-menu" hidden>' +
          '  <h1>Untitled game</h1>' +

          '  <ul>' +
          '    <li>' +
          '      <button type="button">Play</button>' +
          '    </li>' +
          '    <li>' +
          '      <button type="button">Options</button>' +
          '    </li>' +
          '    <li>' +
          '      <button type="button">Help</button>' +
          '    </li>' +
          '  </ul>' +
          '</div>' +
          
          '<canvas id="game-canvas" width="640" height="480" hidden></canvas>' +

          '<div id="game-options" class="game-dialog" hidden>' +
          '  <h2>Options</h2>' +
          '  <label>' +
          '    <input type="checkbox">' +
          '    Mute audio' +
          '  </label>' +
          '</div>' +

          '<div id="game-help" class="game-dialog" hidden>' +
          '  <h2>Help</h2>' +
          '  <p>Foo</p>' +
          '</div>';
  
  this._gameMenuElement = document.getElementById("game-menu");
  this._gameOptionsElement = document.getElementById("game-options");
  this._gameHelpElement = document.getElementById("game-help");
  this._gameCanvasElement = document.getElementById("game-canvas");
}

Game.prototype.showMenu = function() {
  // TODO: Destroy current game
  this._gameMenuElement.hidden = false;
};

Game.prototype.showHelpDialog = function() {
  this._gameHelpElement.hidden = false;
};


function Grid() {
  this._tiles; // TODO
}


function Tile() {
  this._image; // TODO
}


function main() {
  var game = new Game(document.getElementById("game"));
  game.showMenu();
}

main();
})();