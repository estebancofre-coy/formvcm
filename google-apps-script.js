/**
 * Google Apps Script para recibir datos del formulario y almacenarlos en Google Sheets
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 1. Abre tu Google Sheet (ID: 1j7m29A6LBV6s5PbHoKkQob3zZwcXi7egOcmENP_Lu5o)
 * 2. Ve a Extensiones > Apps Script
 * 3. Copia y pega este código completo
 * 4. Guarda el proyecto (Ctrl+S o Cmd+S)
 * 5. Haz clic en "Implementar" > "Nueva implementación"
 * 6. Selecciona "Aplicación web"
 * 7. Configura:
 *    - Descripción: "Formulario Postulación"
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquier usuario"
 * 8. Haz clic en "Implementar"
 * 9. Copia la URL generada y reemplázala en index.html línea 498
 * 10. Autoriza los permisos cuando se te solicite
 */

// ID de la hoja de cálculo de destino
const SPREADSHEET_ID = '1j7m29A6LBV6s5PbHoKkQob3zZwcXi7egOcmENP_Lu5o';
const SHEET_NAME = 'Postulaciones'; // Cambia este nombre si tu hoja se llama diferente

/**
 * Maneja las solicitudes POST desde el formulario HTML
 */
function doPost(e) {
  try {
    // Parse los datos recibidos
    const data = JSON.parse(e.postData.contents);
    
    // Obtener la hoja de cálculo
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Si la hoja no existe, créala
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Agregar encabezados
      sheet.appendRow([
        'Fecha/Hora',
        'Nombre Postulante',
        'Email Postulante',
        'Institución Nombre',
        'Institución RUT',
        'Institución Tipo',
        'Institución Dirección',
        'Institución Email',
        'Institución Teléfono',
        'Representante Nombre',
        'Representante RUN',
        'Representante Cargo',
        'Representante Email',
        'Representante Teléfono',
        'Supervisor Nombre',
        'Supervisor RUN',
        'Supervisor Cargo',
        'Supervisor Email',
        'Supervisor Teléfono',
        'Justificación',
        'Área Estratégica',
        'Contribución',
        'Objetivo General',
        'Objetivos Específicos',
        'Cantidad Profesionales',
        'Perfiles Profesionales',
        'Monto UAysén',
        'Monto Socio RRHH',
        'Monto Socio Operación',
        'Aportes No Pecuniarios',
        'Datos Completos (JSON)'
      ]);
    }
    
    // Preparar los datos para la fila
    const timestamp = new Date();
    
    // Extraer objetivos específicos
    let objetivos = [];
    for (let i = 1; i <= 4; i++) {
      if (data[`obj_desc_${i}`]) {
        objetivos.push({
          descripcion: data[`obj_desc_${i}`] || '',
          actividades: data[`obj_act_${i}`] || '',
          resultados: data[`obj_res_${i}`] || '',
          metodologia: data[`obj_met_${i}`] || ''
        });
      }
    }
    
    // Extraer perfiles profesionales
    let perfiles = [];
    const cantidadProf = parseInt(data.selector_cantidad) || 1;
    for (let i = 1; i <= cantidadProf; i++) {
      perfiles.push({
        numero: i,
        carrera: data[`perfil_${i}_carrera`] || '',
        objetivo: data[`perfil_${i}_objetivo`] || '',
        labores: data[`perfil_${i}_labores`] || '',
        tecnica: data[`perfil_${i}_tecnica`] || '',
        blanda: data[`perfil_${i}_blanda`] || '',
        impacto: data[`perfil_${i}_impacto`] || '',
        sostenibilidad: data[`perfil_${i}_sostenibilidad`] || ''
      });
    }
    
    // Agregar nueva fila con los datos
    sheet.appendRow([
      timestamp,
      data.postulanteNombre || '',
      data.postulanteEmail || '',
      data.inst_nombre || '',
      data.inst_rut || '',
      data.inst_tipo || '',
      data.inst_direccion || '',
      data.inst_email || '',
      data.inst_fono || '',
      data.rep_nombre || '',
      data.rep_run || '',
      data.rep_cargo || '',
      data.rep_email || '',
      data.rep_fono || '',
      data.sup_nombre || '',
      data.sup_run || '',
      data.sup_cargo || '',
      data.sup_email || '',
      data.sup_fono || '',
      data.justificacion || '',
      data.area || '',
      data.contribucion || '',
      data.objetivo_general || '',
      JSON.stringify(objetivos, null, 2),
      cantidadProf,
      JSON.stringify(perfiles, null, 2),
      data.monto_uaysen_calculado || '',
      data.monto_socio_rrhh || '',
      data.monto_socio_operacion || '',
      data.no_pecuniarios || '',
      JSON.stringify(data, null, 2)
    ]);
    
    // Enviar respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'mensaje': 'Tu postulación ha sido recibida correctamente. Recibirás una confirmación por correo electrónico.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Enviar respuesta de error
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'mensaje': 'Error al procesar la postulación: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Maneja las solicitudes GET (opcional, para probar que el script está funcionando)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      'status': 'online',
      'mensaje': 'El servicio está funcionando correctamente'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
