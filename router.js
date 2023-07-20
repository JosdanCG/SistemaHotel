const express = require('express');
const router = express.Router();
const conexion = require('./database/db');
const nodemailer = require('nodemailer');


const crud = require('./Controllers/habitacionController')
const clienteController= require('./Controllers/clienteController')
  
router.get('/api', (req, res) => {
    res.send('testing api')
})

///////////////ruta principal
router.get('/', (req, res) => {
    res.render('login')
})

router.get('/index', (req,res) => {
    res.render('index');
})



/****************************************** Clientes ********************************/
////////////////////ruta para Clientes
router.get('/cliente',(req, res)=>{
    conexion.query('select * from cliente',(error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('cliente',{results:results});
        }
    })
})

/////////////////////ruta para el modal editar clientes
router.get('/editarclientes/:IdCliente',(req, res)=>{
    const IdCliente=req.params.IdCliente;
    conexion.query('select * from cliente  where IdCliente=?',[IdCliente],(error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('editarcliente',{cliente:results[0]});
        }
    })
})

////////////////////ruta para eliminarClientes
router.get('/eliminarclientes/:IdCliente',(req, res) => {
    const IdCliente=req.params.IdCliente;
    conexion.query('delete from cliente  where IdCliente=?',[IdCliente],(error)=>{
        if(error){
            throw error;
        }else{
            res.redirect('/cliente');
        }
    })
})
//-----------------------------------------------------------------------------------





/****************************************** HABITACION ********************************/
////////////////////ruta para dashboard habitaciones
router.get('/dashboard', (req, res) => {
    conexion.query('select * from dhabitacion', (error, resultdash) => {
        if (error) {
            throw error
        } else {
            res.render('dashboard',{resultdash:resultdash});
        }
    })
})
/////////////////////ruta para mostrar las habitaciones
router.get('/habitaciones', (req, res) => {
    conexion.query('select * from dhabitacion inner join ehabitacion on dhabitacion.IdEstadoH=ehabitacion.IdEstadoH inner join thabitacion on dhabitacion.IdTipoH=thabitacion.IdTipoH group by dhabitacion.IdHabitacion', (error, result) => {
        if (error) {
            throw error;
        } else {

            res.render('habitaciones', { result: result });
        }
    })
})
////////////////////////ruta para Reservar habitaciones
router.get('/reservaHab/:IdHabitacion', (req, res) => {
    const IdHabitacion=req.params.IdHabitacion
    conexion.query('select * from dhabitacion inner join ehabitacion on dhabitacion.IdEstadoH=ehabitacion.IdEstadoH inner join thabitacion on dhabitacion.IdTipoH=thabitacion.IdTipoH where IdHabitacion=?',[IdHabitacion],(error, results) => {
        const habitacionInfo = results[0];
        if (error) {
            throw error;
        } else {
            res.render('reservaHab', { habitacion: habitacionInfo,  cliente: null });
        }
    })
});
////////////////////////ruta para buscar un cliente por su DNI
router.get('/buscarCliente', (req, res) => {
    const clientId = req.query.idcliente; // El ID se pasa como parámetro en la URL, por ejemplo: /buscarCliente?id=3

    // Realizar consulta para buscar al cliente por su ID (Supongamos que está en la tabla "cliente")
    conexion.query('SELECT * FROM cliente WHERE IdCliente = ?', [clientId], (err, results) => {
        if (err) throw err;

        // Obtener información del cliente
        const clienteInfo = results[0];

        const IdHabitacion = req.query.idhabi;
        conexion.query('select * from dhabitacion inner join ehabitacion on dhabitacion.IdEstadoH=ehabitacion.IdEstadoH inner join thabitacion on dhabitacion.IdTipoH=thabitacion.IdTipoH where IdHabitacion=?', [IdHabitacion], (error, results) => {
            if (error) {
                throw error;
            } else {
                
                const habitacionInfo = results[0];
                // Renderizar la vista "reservaHab.ejs" y pasar la información del cliente y la habitación en el contexto
                res.render('reservaHab', { habitacion: habitacionInfo, cliente: clienteInfo });
            }
        });
    });
});

//--------------------------------------------------------------------------------








////////////////////RECUPERAR CONTRASEÑA
//ruta para laa vista confirmar correo
router.get('/Password/correoConfirmacion', (req, res) => {
    res.render("Password/correoConfirmacion")
})//

/* Ruta para procesar el formulario de recuperar contraseña
app.post('/Password/correoConfirmacion', (req, res) => {
    const email = req.body.emailr;

    // Generar un token de recuperación
    const token = crypto.randomBytes(20).toString('hex');

    // Enlace de recuperación de contraseña
    const recoveryLink = `http://localhost:3000/cambiar-contrasena?token=${token}`;

    // Configura el transporte de correo utilizando nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'josedanielgalindo2003@gmail.com',
            pass: 'chepcito2003',
        }
    });

    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Correo electrónico enviado: ' + info.response);
    }
    });
})

// Ruta para mostrar la vista de cambio de contraseña
app.get('/cambiar-contrasena', (req, res) => {
    const token = req.query.token;
    res.render('cambiarcontrasena', { token });
});

// Ruta para procesar el formulario de cambio de contraseña
app.post('/cambiar-contrasena', (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const token = req.body.token;
  
});*/




router.post('/guardareservaH', crud.guardareservaH);


router.post('/guardarcliente', clienteController.guardarcliente)
router.post('/updatecliente', clienteController.updatecliente)

module.exports = router;