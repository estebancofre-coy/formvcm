const express = require('express');
const { google } = require('googleapis');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Configuración de Google Sheets
let sheets;
let spreadsheetId;

// Inicializar Google Sheets API
async function initializeGoogleSheets() {
    try {
        // Leer credenciales desde archivo o variables de entorno
        const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json';
        
        if (!fsSync.existsSync(credentialsPath)) {
            console.warn('⚠️  No se encontraron credenciales de Google. Usando solo almacenamiento local.');
            return false;
        }

        const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
        
        // Autenticación con Service Account
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        sheets = google.sheets({ version: 'v4', auth });
        spreadsheetId = process.env.SPREADSHEET_ID;

        if (!spreadsheetId) {
            console.warn('⚠️  SPREADSHEET_ID no configurado. Usando solo almacenamiento local.');
            return false;
        }

        console.log('✓ Google Sheets API inicializada correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar Google Sheets:', error.message);
        return false;
    }
}

// Guardar postulación en Google Sheets
async function saveToGoogleSheets(postulacion) {
    if (!sheets || !spreadsheetId) {
        return { success: false, error: 'Google Sheets no configurado' };
    }

    try {
        // Preparar datos para la hoja
        const row = [
            postulacion.id,
            postulacion.fecha_envio,
            postulacion.inst_nombre || '',
            postulacion.inst_rut || '',
            postulacion.inst_tipo || '',
            postulacion.inst_direccion || '',
            postulacion.inst_email || '',
            postulacion.inst_fono || '',
            postulacion.rep_nombre || '',
            postulacion.rep_run || '',
            postulacion.rep_cargo || '',
            postulacion.rep_email || '',
            postulacion.sup_nombre || '',
            postulacion.sup_run || '',
            postulacion.sup_cargo || '',
            postulacion.sup_email || '',
            postulacion.justificacion || '',
            postulacion.area_estrategica || '',
            postulacion.contribucion_area || '',
            JSON.stringify(postulacion.objetivos || []),
            postulacion.perfil_objetivo || '',
            postulacion.perfil_carrera || '',
            postulacion.perfil_labores || '',
            postulacion.plan_tecnico || '',
            postulacion.plan_blando || '',
            postulacion.impacto || '',
            postulacion.sostenibilidad || '',
            postulacion.monto_uaysen_rrhh || '',
            postulacion.monto_socio_op || '',
            postulacion.monto_uaysen_cap || '',
            postulacion.monto_socio_cap || ''
        ];

        // Agregar fila a la hoja
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Postulaciones!A:AE', // Ajusta el nombre de la hoja según necesites
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [row]
            }
        });

        console.log(`✓ Postulación ${postulacion.id} guardada en Google Sheets`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error al guardar en Google Sheets:', error.message);
        return { success: false, error: error.message };
    }
}

// Guardar postulación en archivo JSON local (fallback)
async function saveToLocalFile(postulacion) {
    const dataDir = path.join(__dirname, 'data');
    if (!fsSync.existsSync(dataDir)) {
        fsSync.mkdirSync(dataDir, { recursive: true });
    }

    const filename = path.join(dataDir, `${postulacion.id}.json`);
    try {
        await fs.writeFile(filename, JSON.stringify(postulacion, null, 2));
        console.log(`✓ Postulación ${postulacion.id} guardada localmente`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error al guardar localmente:', error.message);
        return { success: false, error: error.message };
    }
}

// Servir el archivo index.html desde la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para recibir postulaciones
app.post('/api/postulacion', async (req, res) => {
    const postulacion = req.body;
    
    // Validar datos requeridos
    if (!postulacion.inst_nombre || !postulacion.inst_rut) {
        return res.status(400).json({ 
            error: 'Faltan datos requeridos: nombre de institución y RUT' 
        });
    }

    // Generar ID único basado en timestamp
    const id = `POST-${Date.now()}`;
    postulacion.id = id;
    postulacion.fecha_envio = new Date().toISOString();

    // Intentar guardar en Google Sheets primero
    const sheetsResult = await saveToGoogleSheets(postulacion);
    
    // Guardar localmente como respaldo
    const localResult = await saveToLocalFile(postulacion);

    // Determinar respuesta
    if (sheetsResult.success || localResult.success) {
        console.log(`✓ Postulación guardada: ${id}`);
        console.log(`  Institución: ${postulacion.inst_nombre}`);
        console.log(`  RUT: ${postulacion.inst_rut}`);
        console.log(`  Google Sheets: ${sheetsResult.success ? '✓' : '✗'}`);
        console.log(`  Local: ${localResult.success ? '✓' : '✗'}`);
        
        res.status(200).json({ 
            success: true,
            id: id,
            mensaje: 'Postulación recibida exitosamente',
            storage: {
                sheets: sheetsResult.success,
                local: localResult.success
            }
        });
    } else {
        res.status(500).json({ 
            error: 'Error al guardar la postulación en todos los destinos'
        });
    }
});

// Endpoint para listar todas las postulaciones locales
app.get('/api/postulaciones', async (req, res) => {
    const dataDir = path.join(__dirname, 'data');
    
    if (!fsSync.existsSync(dataDir)) {
        return res.json({ postulaciones: [] });
    }

    try {
        const files = await fs.readdir(dataDir);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        const postulaciones = await Promise.all(
            jsonFiles.map(async file => {
                const content = await fs.readFile(path.join(dataDir, file), 'utf8');
                return JSON.parse(content);
            })
        );
        
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
(async () => {
    const sheetsEnabled = await initializeGoogleSheets();
    
    app.listen(PORT, () => {
        console.log(`\n========================================`);
        console.log(`  Servidor de Postulaciones iniciado`);
        console.log(`  URL: http://localhost:${PORT}`);
        console.log(`  Google Sheets: ${sheetsEnabled ? '✓ Habilitado' : '✗ Deshabilitado'}`);
        console.log(`  Almacenamiento local: ✓ Habilitado`);
        console.log(`========================================\n`);
    });
})();
