const Usuario = require('../models/UsuarioModel.js');
const bcrypt = require('bcrypt');

exports.create = (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "No se enviaron datos"
        });
    }

    const usuario = new Usuario(req.body);

    bcrypt.hash(usuario.password, 10, function (err, hash) {
        usuario.password = hash;

        usuario.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Ocurio un error al guardar usuario."
                });
            });
    });
};

exports.findAll = (req, res) => {
    Usuario.find()
        .then(usuarios => {
            res.send(usuarios);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Ocurrio un error al recuperar usuarios."
            });
        });
};

exports.findOne = (req, res) => {
    Usuario.findById(req.params.id)
        .then(usuario => {
            if (!usuario) {
                return res.status(404).send({
                    message: "No se encontró usuario con id " + req.params.id
                });
            }
            res.send(usuario);
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

exports.update = (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "No se recibieron datos"
        });
    }

    Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(usuario => {
            if (!usuario) {
                return res.status(404).send({
                    message: "No se encontro el usuario con id " + req.params.id
                });
            }
            res.send(usuario);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Error al obtener el usuario con id " + req.params.id
                });
            }
            return res.status(500).send({
                message: err.message || "Error al actualizar usuario"
            });
        });
};

exports.delete = (req, res) => {
    Usuario.findByIdAndRemove(req.params.id)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "No se encontro el usuario con id " + req.params.id
                });
            }
            res.send({ message: "Usuario eliminado" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "No se encontro usuario con id" + req.params.id
                });
            }
            return res.status(500).send({
                message: err.message || "No se pudo eliminar usuario"
            });
        });
};
