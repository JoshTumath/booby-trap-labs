/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
"use strict";

var SPRITE_IMAGE;
var TILE_SIZE = 64;

var Tiles = {
  floor: { x: 0, y: 0 },
  block: { x: 0, y: 64 }
};

var Background = {
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

function initialize() {
  SPRITE_IMAGE = new Image(64, 128);
  SPRITE_IMAGE.src = "images/sprites.png";
}

initialize();

})();