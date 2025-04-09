//Jalo la libreria express
const express = require('express');
//jalo la conexion a la base de datos
const connection = require('./db');


//aqui vamos a poder usar express por medio de esta variable app
const app = express();


//Encargado de parsear todo alos json
app.use(express.json());

//Para que me lea las direcciones URL
app.use(express.urlencoded({extended:true}));

app.get('/api/prueba', (req, res)=>{
    res.send('estoy respondiendo por la api')
});

app.get('/api/prueba2',(req, res)=>{
    res.status(200).json({
        message:'api funciona bien',
        port:PORT,
        status:'exitoso'

    });

});
//Crear puerto de conexion del servidor
const PORT = 3000;

//La conexion la va a escuchar por el puerto 3000 y si 
app.listen(PORT, ()=>{
    console.log('El servidor esta corriendo');

});

//Crear registro en la base de datos
app.post('/api/guardar', (req, res) => {
    const { cedula, nombre, edad, profesion } = req.body;
    const query = 'INSERT INTO persona (cedula, nombre, edad, profesion) VALUES ($1, $2, $3, $4)';

    connection.query(query, [cedula, nombre, edad, profesion], (error, result) => {
        if (error) {
            res.status(500).json({
                message: 'ERROR CREANDO EL USUARIO',
                error
            });
        } else {
            res.status(201).json({ cedula, nombre, edad, profesion });
        }
    });
});


//Obtener registros de la base de datos

app.get('/api/obtener', (req, res) => {
    const query = 'SELECT * FROM persona';

    connection.query(query, (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: "Error al recuperar los datos",
                details: error.message
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Datos de la tabla",
                details: result
            });
        }
    });
});

//API para eliminar registro

app.delete('/api/eliminar/:cedula', (req, res) => {
    const { cedula } = req.params;
    const query = 'DELETE FROM persona WHERE cedula = $1';

    connection.query(query, [cedula], (error, result) => {

        if (error) {
            res.status(500).json({
                success: false,
                message: "Error al eliminar el registro",
                details: error.message
            });
        } else if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No existe el registro ${cedula}`,
                
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Dato eliminado de la tabla",
                details: result
                
            });
        }
    });
});


// API para actualizar un registro
app.put('/api/actualizar/:cedula', (req, res) => {
    const { cedula } = req.params;
    const { nombre, edad, profesion } = req.body;

    const query = 'UPDATE persona SET nombre = $1, edad = $2, profesion = $3 WHERE cedula = $4';

    connection.query(query, [nombre, edad, profesion, cedula], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el registro',
                details: error.message
            });
        } else if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No se encontró ningún registro con la cédula ${cedula}`
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Registro actualizado correctamente',
                updated: {
                    cedula,
                    nombre,
                    edad,
                    profesion
                }
            });
        }
    });
});
