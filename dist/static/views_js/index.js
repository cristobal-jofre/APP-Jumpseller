"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var authorizationOauth2 = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var dataRaw, _yield$dataRaw$json, redirect;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch("./api/auth/Oauth2");

          case 3:
            dataRaw = _context.sent;

            if (!(dataRaw.status === 200)) {
              _context.next = 13;
              break;
            }

            _context.next = 7;
            return dataRaw.json();

          case 7:
            _yield$dataRaw$json = _context.sent;
            redirect = _yield$dataRaw$json.redirect;
            console.log(redirect);
            window.open(redirect, '_self');
            _context.next = 14;
            break;

          case 13:
            throw new Error("Error en la autenticación");

          case 14:
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 16]]);
  }));

  return function authorizationOauth2() {
    return _ref.apply(this, arguments);
  };
}();

$("#app").on("click", authorizationOauth2);