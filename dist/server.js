"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _methodOverride = _interopRequireDefault(require("method-override"));

var _path = _interopRequireDefault(require("path"));

var _cors = _interopRequireDefault(require("cors"));

var _config = require("./config.json");

var _views = _interopRequireDefault(require("./routes/views.routes"));

var _Oauth = _interopRequireDefault(require("./routes/Oauth2.routes"));

var app = (0, _express["default"])();
app.set('PORT', process.env.PORT || 8000);
app.set('view engine', 'ejs');
app.set('views', _path["default"].join(__dirname, 'views'));
app.use(_express["default"]["static"](_path["default"].join(__dirname, 'static')));
app.use((0, _methodOverride["default"])());
app.use((0, _cors["default"])());
app.use(_bodyParser["default"].urlencoded({
  extended: false,
  limit: "50mb",
  parameterLimit: 50000
}));
app.use("".concat(_config.basename), _views["default"]);
app.use("".concat(_config.basename, "/api/auth"), _Oauth["default"]);
var PORT = app.get('PORT');
app.listen(PORT, function () {
  console.log("Server on port ".concat(PORT));
});