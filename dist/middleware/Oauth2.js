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
              //redirect_uri: 'https://localhost:8000/api/auth/Oauth2/callback',
              redirect_uri: 'https://jumpseller.herokuapp.com/api/auth/Oauth2/callback',
              scope: ['read_products', 'write_products']
            });
            return _context.abrupt("return", res.status(200).json({
              msg: 'exito',
              redirect: authorizationUri
            }));

          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", res.status(500).json({
              msg: 'Error al solicitar los permisos',
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
    var code, tokenParams, _yield$client$getToke, token;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            code = req.url.split('=')[1];
            tokenParams = {
              code: code,
              //redirect_uri: 'https://localhost:8000/api/auth/Oauth2/callback',
              redirect_uri: 'https://jumpseller.herokuapp.com/api/auth/Oauth2/callback',
              scope: ['read_products', 'write_products']
            };
            _context2.prev = 2;
            _context2.next = 5;
            return client.getToken(tokenParams);

          case 5:
            _yield$client$getToke = _context2.sent;
            token = _yield$client$getToke.token;
            res.cookie('auth', JSON.stringify(token)); //res.redirect('https://localhost:8000/products')

            res.redirect('https://jumpseller.herokuapp.com/products');
            _context2.next = 14;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](2);
            return _context2.abrupt("return", res.status(500).json({
              msg: 'Error al obtener el token',
              error: _context2.t0
            }));

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 11]]);
  }));

  return function getToken(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getToken = getToken;