var passport = require("passport");

module.exports = (app) => {
    const usuariosController = require('../controllers/UsuariosController.js');
    
    app.get('/usuarios', passport.authenticate('jwt', { session: false }), usuariosController.findAll);
    app.get('/usuarios/:id', passport.authenticate('jwt', { session: false }), usuariosController.findOne);
    
    //Segurizar una vez creado usuario admin
    app.post('/usuarios', usuariosController.create);
    
    app.put('/usuarios/:id', passport.authenticate('jwt', { session: false }), usuariosController.update);

    app.delete('/usuarios/:id', passport.authenticate('jwt', { session: false }), usuariosController.delete);
}