#!/usr/bin/env node

/**
 * Script para crear y configurar automáticamente una hoja de Google Sheets
 * para recibir postulaciones del formulario.
 * 
 * Uso:
 *   node create-sheet-template.js
 * 
 * Requisitos:
 *   - credentials.json en la raíz del proyecto
 *   - Variable de entorno SPREADSHEET_ID (opcional, si ya tienes una hoja)
 */

const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');

async function main() {
    console.log('\n========================================');
    console.log('  Configurador de Google Sheets');
    console.log('  FormVCM - Postulaciones');
    console.log('========================================\n');

    // Verificar credenciales
    if (!fs.existsSync('./credentials.json')) {
        console.error('❌ Error: No se encontró credentials.json');
        console.log('\nPor favor:');
        console.log('1. Crea una cuenta de servicio en Google Cloud Console');
        console.log('2. Descarga las credenciales como credentials.json');
        console.log('3. Coloca el archivo en la raíz del proyecto');
        console.log('\nConsulta setup-sheets.md para más detalles.');
        process.exit(1);
    }

    try {
        const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
        
        // Autenticación
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Preguntar si crear nueva hoja o configurar existente
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const spreadsheetId = await new Promise((resolve) => {
            rl.question('¿Tienes un SPREADSHEET_ID existente? (déjalo vacío para crear uno nuevo): ', (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });

        let finalSpreadsheetId;

        if (spreadsheetId) {
            // Configurar hoja existente
            console.log('\n📝 Configurando hoja existente...');
            finalSpreadsheetId = spreadsheetId;
        } else {
            // Crear nueva hoja
            console.log('\n📝 Creando nueva hoja de cálculo...');
            
            const createResponse = await sheets.spreadsheets.create({
                resource: {
                    properties: {
                        title: 'Postulaciones FormVCM - ' + new Date().toISOString().split('T')[0]
                    },
                    sheets: [{
                        properties: {
                            title: 'Postulaciones'
                        }
                    }]
                }
            });

            finalSpreadsheetId = createResponse.data.spreadsheetId;
            console.log(`✓ Hoja creada: ${finalSpreadsheetId}`);
        }

        // Agregar encabezados
        console.log('📋 Agregando encabezados...');
        
        const headers = [
            'ID',
            'Fecha Envío',
            'Institución',
            'RUT',
            'Tipo Institución',
            'Dirección',
            'Email Institucional',
            'Teléfono',
            'Rep. Nombre',
            'Rep. RUN',
            'Rep. Cargo',
            'Rep. Email',
            'Sup. Nombre',
            'Sup. RUN',
            'Sup. Cargo',
            'Sup. Email',
            'Justificación',
            'Área Estratégica',
            'Contribución',
            'Objetivos (JSON)',
            'Objetivo del Cargo',
            'Carrera Requerida',
            'Labores Específicas',
            'Competencias Técnicas',
            'Habilidades Blandas',
            'Impacto Territorial',
            'Sostenibilidad',
            'RRHH UAysén',
            'Operación Socio',
            'Capacitación UAysén',
            'Capacitación Socio'
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId: finalSpreadsheetId,
            range: 'Postulaciones!A1:AE1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [headers]
            }
        });

        // Aplicar formato a los encabezados
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: finalSpreadsheetId,
            resource: {
                requests: [
                    {
                        repeatCell: {
                            range: {
                                sheetId: 0,
                                startRowIndex: 0,
                                endRowIndex: 1
                            },
                            cell: {
                                userEnteredFormat: {
                                    backgroundColor: {
                                        red: 0.0,
                                        green: 0.2,
                                        blue: 0.4
                                    },
                                    textFormat: {
                                        foregroundColor: {
                                            red: 1.0,
                                            green: 1.0,
                                            blue: 1.0
                                        },
                                        bold: true
                                    }
                                }
                            },
                            fields: 'userEnteredFormat(backgroundColor,textFormat)'
                        }
                    },
                    {
                        updateSheetProperties: {
                            properties: {
                                sheetId: 0,
                                gridProperties: {
                                    frozenRowCount: 1
                                }
                            },
                            fields: 'gridProperties.frozenRowCount'
                        }
                    }
                ]
            }
        });

        console.log('✓ Encabezados configurados');

        // Obtener información de la cuenta de servicio
        const serviceAccountEmail = credentials.client_email;

        console.log('\n========================================');
        console.log('✅ Configuración completada!');
        console.log('========================================\n');
        console.log('📋 Información importante:\n');
        console.log(`1. SPREADSHEET_ID: ${finalSpreadsheetId}`);
        console.log(`2. URL de la hoja: https://docs.google.com/spreadsheets/d/${finalSpreadsheetId}/edit`);
        console.log(`3. Email de cuenta de servicio: ${serviceAccountEmail}`);
        console.log('\n⚠️  IMPORTANTE: Comparte la hoja con el email de la cuenta de servicio\n');
        console.log('Pasos para compartir:');
        console.log('1. Abre la hoja en tu navegador');
        console.log('2. Haz clic en "Compartir"');
        console.log(`3. Pega el email: ${serviceAccountEmail}`);
        console.log('4. Dale permisos de "Editor"');
        console.log('5. Haz clic en "Enviar"\n');
        console.log('📝 Actualiza tu archivo .env:');
        console.log(`SPREADSHEET_ID=${finalSpreadsheetId}`);
        console.log('GOOGLE_CREDENTIALS_PATH=./credentials.json\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 403) {
            console.log('\n⚠️  Error de permisos. Verifica que:');
            console.log('1. La API de Google Sheets está habilitada');
            console.log('2. Las credenciales son correctas');
        }
        process.exit(1);
    }
}

main();
