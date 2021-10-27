"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToken = exports.authentication = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _simpleOauth = require("simple-oauth2");

var _config = require("../config.json");

var HOST = 'https://accounts.jumpseller.com/oauth/authorize';
var config = {
  client: {
    id: _config.cliente_id,
    secret: _config.app_secret
  },
  auth: {
    tokenHost: HOST
  }
};
var client = new _simpleOauth.AuthorizationCode(config);

var authentication = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var authorizationUri;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            authorizationUri = client.authorizeURL({
              redirect_uri: 'http://localhost:8000/api/auth/Oauth2/callback',
              scope: ['read_orders']
            });
            return _context.abrupt("return", res.status(200).json({
              msg: 'exito',
              redirect: authorizationUri
            }));

          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", res.status(500).json({
              msg: 'malo',
              error: _context.t0
            }));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 5]]);
  }));

  return function authentication(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.authentication = authentication;

var getToken = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var code, tokenParams, data;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            code = req.url.split('=')[1];
            tokenParams = {
              code: code,
              redirect_uri: 'http://localhost:8000/api/auth/Oauth2/callback',
              scope: ['read_orders']
            };
            _context2.prev = 2;
            _context2.next = 5;
            return client.getToken(tokenParams);

          case 5:
            data = _context2.sent;
            console.log(data);
            res.redirect('http://localhost:8000/xd');
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](2);
            return _context2.abrupt("return", res.status(500).json({
              msg: 'malo',
              error: _context2.t0
            }));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 10]]);
  }));

  return function getToken(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getToken = getToken;