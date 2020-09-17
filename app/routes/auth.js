var passport = require("passport");

module.exports = (app) => {
  const auth = require('../controllers/AuthController.js');

  app.post('/login', auth.login);
}