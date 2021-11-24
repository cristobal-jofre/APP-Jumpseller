"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _products = require("../controllers/products.controller");

var router = (0, _express.Router)(); // Get

router.get('/', _products.getProducts);
var _default = router;
exports["default"] = _default;