const express = require('express');
const bodyParser = require('body-parser');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const AuthParams = require('./config/auth');
const Usuario = require('./app/models/UsuarioModel');
const dbConfig = require('./config/database.js');
const mongoose = require('mongoose');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = AuthParams.secret;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log("Conexión BD: OK");
}).catch(err => {
    console.log('Conexión BD: ERROR ', err);
    process.exit();
});

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    Usuario.findById(jwt_payload.id)
        .then(usuario => {
            if (usuario) {
                next(null, usuario);
            } else {
                next(null, false);
            }
        }).catch(err => {
            next(null, false);
        });
});

passport.use(strategy);

app.use(passport.initialize());

require('./app/routes/auth.js')(app);
require('./app/routes/usuarios.js')(app);

app.listen(3000, () => {
    console.log("Servidor escuchando en puerto 3000");
});