const conexion = require('../database/db');
const moment = require('moment');

exports.guardareservaH=(req, res)=>{
    const fechaentrada= req.body.fechaentrada;
    const fechasalida = req.body.fechasalida;
    const fent = moment(req.body.fechaentrada);
    const fsal = moment(req.body.fechasalida);
    const totalp = req.body.preciohabita;
    const tipop = req.body.tipopago;
    const  idhab = req.body.idhabita;
    const  idcli = req.body.idclient;


    // Calcular la diferencia en días
    const diferenciaDias = fsal.diff(fent, 'days');

    
    const aver = parseFloat(req.body.preciohabita.replace((',', '.')));
    // Calcular el total a pagar
    const totalAPagar = aver * diferenciaDias;

    console.log("hola", fechasalida);
    console.log("fentra:", fechaentrada);
    console.log("icli:", idcli);
    console.log("icli:", idhab);
    console.log("icli:", totalp);
    console.log("diferencia:", diferenciaDias);
    console.log("icli:", totalAPagar);
    conexion.query('insert into reservahab set?',
    {IdHabitacion:idhab,IdCliente: idcli, FEntrada: fechaentrada, FSalida: fechasalida, TotalP: totalAPagar},(error)=>{
        if(error){
            console.log(error);
        } else {
            const estadoH = 'EHA01';
            conexion.query('UPDATE dhabitacion SET IdEstadoH = ? WHERE IdHabitacion = ?', [estadoH, idhab], (updateError, updateResult) => {
                if (updateError) {
                    console.log(updateError);
                }
                res.redirect('/habitaciones');
            });
        }
    })
}



