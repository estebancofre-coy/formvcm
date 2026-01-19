const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Servir el archivo index.html desde la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para recibir postulaciones
app.post('/api/postulacion', (req, res) => {
    const postulacion = req.body;
    
    // Validar datos requeridos
    if (!postulacion.inst_nombre || !postulacion.inst_rut) {
        return res.status(400).json({ 
            error: 'Faltan datos requeridos: nombre e institución' 
        });
    }

    // Generar ID único basado en timestamp
    const id = `POST-${Date.now()}`;
    postulacion.id = id;
    postulacion.fecha_envio = new Date().toISOString();

    // Crear directorio de datos si no existe
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    // Guardar postulación en archivo JSON
    const filename = path.join(dataDir, `${id}.json`);
    try {
        fs.writeFileSync(filename, JSON.stringify(postulacion, null, 2));
        
        console.log(`✓ Nueva postulación guardada: ${id}`);
        console.log(`  Institución: ${postulacion.inst_nombre}`);
        console.log(`  RUT: ${postulacion.inst_rut}`);
        
        res.status(200).json({ 
            success: true,
            id: id,
            mensaje: 'Postulación recibida exitosamente' 
        });
    } catch (error) {
        console.error('Error al guardar postulación:', error);
        res.status(500).json({ 
            error: 'Error al guardar la postulación' 
        });
    }
});

// Endpoint para listar todas las postulaciones (opcional, para administración)
app.get('/api/postulaciones', (req, res) => {
    const dataDir = path.join(__dirname, 'data');
    
    if (!fs.existsSync(dataDir)) {
        return res.json({ postulaciones: [] });
    }

    try {
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        const postulaciones = files.map(file => {
            const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
            return JSON.parse(content);
        });
        
        res.json({ 
            total: postulaciones.length,
            postulaciones: postulaciones 
        });
    } catch (error) {
        console.error('Error al leer postulaciones:', error);
        res.status(500).json({ 
            error: 'Error al obtener postulaciones' 
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`  Servidor de Postulaciones iniciado`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`========================================\n`);
});
