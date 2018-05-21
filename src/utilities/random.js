"use strict";
module.exports = {
  element(arr) {
    return arr[~~(Math.random() * arr.length)];
  }
};
