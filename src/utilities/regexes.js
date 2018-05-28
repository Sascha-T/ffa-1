"use strict";
module.exports = {
  discrim: /^\d{4}$/,
  id: /^\d{14,20}$/,
  formatting: /[<@!#&>:_~*`\\]/g,
  mention: /^<@!?(\d{14,20})>$/,
  uppercase: /\b[a-z]|\B[A-Z]/g
};
