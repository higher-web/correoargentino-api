const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    nombre: String,
    apellido: String,
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true}
}, {
    timestamps: true
});

UsuarioSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
 }, 'Email no valido')

module.exports = mongoose.model('Usuarios', UsuarioSchema);