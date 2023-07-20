const conexion = require('../database/db');
const controller = {};

exports.guardarcliente = (req, res) => {
    const name = req.body.name;
    const apel = req.body.apellido;
    const dni = req.body.dni;
    const celu = req.body.celular;
    conexion.query('insert into cliente set?',
        { Nombres: name, Apellidos: apel, DNI: dni, Telefono: celu }, (error) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/cliente')
            }
        })

}

exports.updatecliente = (req, res) => {
    const cod = req.body.idcliente;
    const name = req.body.name;
    const apel = req.body.apellido;
    const dni = req.body.dni;
    const celu = req.body.celular;
    conexion.query('update cliente set? where IdCliente=?',
        [{IdCliente: cod, Nombres: name, Apellidos: apel, DNI: dni, Telefono: celu}, cod], (error) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/cliente')
            }
        })

}