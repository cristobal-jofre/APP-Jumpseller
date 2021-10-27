"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _Oauth = require("../middleware/Oauth2");

var router = (0, _express.Router)(); // Get

router.get('/Oauth2', _Oauth.authentication);
router.get('/Oauth2/callback', _Oauth.getToken);
var _default = router;
exports["default"] = _default;