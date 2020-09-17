const Usuario = require('../models/UsuarioModel.js');
const AuthParams = require('../../config/auth');
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const bcrypt = require("bcrypt");

var ExtractJwt = passportJWT.ExtractJwt;
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = AuthParams.secret;

exports.login = (req, res) => {

    if(!req.body.email){
        return res.status(400).send({
            message: "Campo email obligatorio"
        });
    }
    if(!req.body.password){
        return res.status(400).send({
            message: "Campo contraseña obligatorio"
        });
    }

    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
    }

    Usuario.findOne({ email: email })
        .then(usuario => {
            if (!usuario) {
                return res.status(401).send({
                    message: "No se encontró usuario"
                });
            }

            bcrypt.compare(password, usuario.password, function (err, result) {
                if (err || !result) {
                    return res.status(500).send({
                        message: 'Contraseña invalida'
                    });
                }

                if (result) {
                    var payload = { id: usuario.id };
                    var token = jwt.sign(payload, jwtOptions.secretOrKey);
                    res.json({ success: true, token: token });
                }
            });

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "No se encontró usuario con id " + req.params.id
                });
            }
            return res.status(500).send({
                message: err.message || "Error al obtener usuario"
            });
        });
};