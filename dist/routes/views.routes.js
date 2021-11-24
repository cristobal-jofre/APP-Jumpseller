"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var router = (0, _express.Router)(); // Get render of views

router.get('/', function (req, res) {
  res.render('index');
});
router.get('/products', function (req, res) {
  res.render('products');
});
var _default = router;
exports["default"] = _default;