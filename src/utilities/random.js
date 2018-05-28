"use strict";
module.exports = {
  element(arr) {
    return arr[this.int(0, arr.length - 1)];
  },

  int(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
};
