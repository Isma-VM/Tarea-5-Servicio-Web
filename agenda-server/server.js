/* ============================================================
   AGENDA SERVER — server.js
   Servicio Web con Express que consume raydelto.org/agenda.php
   ============================================================ */

const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;
const API_URL = 'http://www.raydelto.org/agenda.php';

/* ------------------------------------------------------------
   MIDDLEWARES
   ------------------------------------------------------------ */

// Permite leer el body de las peticiones en formato JSON
app.use(express.json());


/* ------------------------------------------------------------
   RUTAS
   ------------------------------------------------------------ */

/**
 * GET /contactos
 * --------------
 * Lista todos los contactos obtenidos desde raydelto.org
 */
app.get('/contactos', async (req, res) => {
    try {
        const respuesta = await fetch(API_URL, { method: 'GET' });

        if (!respuesta.ok) {
            throw new Error(`Error externo HTTP ${respuesta.status}`);
        }

        const contactos = await respuesta.json();
        res.status(200).json(contactos);

    } catch (error) {
        console.error('Error al obtener contactos:', error.message);
        res.status(500).json({
            error: 'No se pudieron obtener los contactos.',
            detalle: error.message
        });
    }
});


/**
 * POST /contactos
 * ---------------
 * Almacena un nuevo contacto enviándolo a raydelto.org
 *
 * Body esperado (JSON):
 *   { "nombre": "...", "apellido": "...", "telefono": "..." }
 */
app.post('/contactos', async (req, res) => {
    const { nombre, apellido, telefono } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido || !telefono) {
        return res.status(400).json({
            error: 'Los campos nombre, apellido y telefono son obligatorios.'
        });
    }

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido, telefono })
        });

        if (!respuesta.ok) {
            throw new Error(`Error externo HTTP ${respuesta.status}`);
        }

        res.status(201).json({
            mensaje: 'Contacto guardado exitosamente.',
            contacto: { nombre, apellido, telefono }
        });

    } catch (error) {
        console.error('Error al guardar contacto:', error.message);
        res.status(500).json({
            error: 'No se pudo guardar el contacto.',
            detalle: error.message
        });
    }
});


/* ------------------------------------------------------------
   INICIAR SERVIDOR
   ------------------------------------------------------------ */
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`  GET  http://localhost:${PORT}/contactos`);
    console.log(`  POST http://localhost:${PORT}/contactos`);
});