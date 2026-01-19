# Formulario de Postulación Desafío Territorial - U. Aysén

Este proyecto es un formulario web para postulaciones al Desafío Territorial de la Universidad de Aysén. Incluye integración con Google Sheets y generación de PDF.

## Características

- ✅ Formulario HTML completo con validación
- ✅ Generación de PDF de la postulación
- ✅ Envío automático de datos a Google Sheets
- ✅ Diseño responsive con Bootstrap 5
- ✅ Contador de palabras en campos de texto
- ✅ Gestión dinámica de objetivos específicos
- ✅ Gestión dinámica de perfiles profesionales

## Tecnologías Utilizadas

- HTML5
- CSS3 (Bootstrap 5.3.0)
- JavaScript (Vanilla)
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) - Para generación de PDF
- Google Apps Script - Para integración con Google Sheets

## Configuración de Google Sheets

### Paso 1: Configurar el Google Apps Script

1. Abre tu Google Sheet con ID: `1j7m29A6LBV6s5PbHoKkQob3zZwcXi7egOcmENP_Lu5o`
   - URL directa: https://docs.google.com/spreadsheets/d/1j7m29A6LBV6s5PbHoKkQob3zZwcXi7egOcmENP_Lu5o/edit

2. En el menú, ve a **Extensiones** > **Apps Script**

3. Borra cualquier código existente y copia todo el contenido del archivo `google-apps-script.js`

4. Guarda el proyecto (Ctrl+S o Cmd+S) con un nombre descriptivo como "Formulario Postulación Handler"

5. Haz clic en el botón **Implementar** (arriba a la derecha) > **Nueva implementación**

6. En el diálogo de implementación:
   - Haz clic en el icono de engranaje junto a "Seleccionar tipo"
   - Selecciona **"Aplicación web"**
   - Configura:
     - **Descripción**: "Formulario Postulación V1"
     - **Ejecutar como**: "Yo (tu correo)"
     - **Quién tiene acceso**: "Cualquier usuario"
   
7. Haz clic en **Implementar**

8. La primera vez, te pedirá autorizar los permisos:
   - Haz clic en "Autorizar acceso"
   - Selecciona tu cuenta de Google
   - Haz clic en "Avanzado"
   - Haz clic en "Ir a [nombre del proyecto] (no seguro)"
   - Revisa los permisos y haz clic en "Permitir"

9. **Copia la URL de la aplicación web** que se genera (algo como: `https://script.google.com/macros/s/AKfycby.../exec`)

### Paso 2: Actualizar la URL en el formulario

1. Abre el archivo `index.html`

2. Busca la línea 545 (aproximadamente) que contiene:
   ```javascript
   const scriptUrl = 'https://script.google.com/macros/s/AKfycbxfgayUzzVfFkPhWr8hsEYVWXypzuiPU15m7zOcb2lnpnyD2TVIhHuSCpiVkl03H3th/exec';
   ```

3. Reemplaza la URL con la URL que copiaste en el Paso 1

4. Guarda el archivo

### Paso 3: Verificar la hoja de cálculo

1. En tu Google Sheet, asegúrate de que existe una hoja llamada **"Postulaciones"** (o modifica el nombre en `google-apps-script.js` línea 22)

2. Si no existe, el script la creará automáticamente con los encabezados correctos cuando reciba la primera postulación

## Uso del Formulario

### Llenar el Formulario

1. Abre `index.html` en un navegador web
2. Completa todos los campos requeridos del formulario:
   - Identificación de la Institución
   - Identificación del Representante Legal
   - Identificación del Supervisor del Alumni
   - Resumen de la Iniciativa y Diagnóstico
   - Objetivos, estrategias y resultados
   - Perfiles Profesionales y Plan de Formación
   - Financiamiento

### Generar PDF

1. Una vez completado el formulario, haz clic en el botón azul **"GUARDAR EN PDF POSTULACIÓN"**
2. El sistema generará automáticamente un PDF con el nombre `Postulacion_Desafio_Territorial.pdf`
3. El PDF se descargará a tu computadora
4. El PDF incluye todo el contenido del formulario excepto la sección de datos personales del postulante

### Enviar Postulación

1. Completa los campos de "Datos para el envío y registro":
   - Tu Nombre Completo
   - Tu Correo Electrónico
   
2. Haz clic en el botón verde **"FINALIZAR Y ENVIAR POSTULACIÓN"**

3. El sistema:
   - Validará que todos los campos estén completos
   - Enviará los datos a Google Sheets
   - Mostrará un mensaje de confirmación

## Estructura de Datos en Google Sheets

Los datos se almacenan en las siguientes columnas:

- **Fecha/Hora**: Timestamp de envío
- **Datos del Postulante**: Nombre y email
- **Datos de la Institución**: Nombre, RUT, tipo, dirección, email, teléfono
- **Datos del Representante Legal**: Nombre, RUN, cargo, email, teléfono
- **Datos del Supervisor**: Nombre, RUN, cargo, email, teléfono
- **Información de la Iniciativa**: Justificación, área estratégica, contribución
- **Objetivos**: Objetivo general y objetivos específicos (formato JSON)
- **Perfiles Profesionales**: Cantidad y detalles de cada perfil (formato JSON)
- **Financiamiento**: Montos de UAysén, socio y aportes no pecuniarios
- **Datos Completos**: JSON completo con toda la información

## Solución de Problemas

### El PDF no se genera correctamente

- Asegúrate de que todos los campos requeridos estén completos
- Verifica que tu navegador permita las descargas automáticas
- Intenta con un navegador diferente (Chrome o Firefox recomendados)

### Los datos no se envían a Google Sheets

1. Verifica que la URL del Google Apps Script sea correcta en `index.html`
2. Asegúrate de que el script esté implementado como "Aplicación web"
3. Verifica que el acceso esté configurado como "Cualquier usuario"
4. Revisa la consola del navegador (F12) para ver errores específicos
5. Verifica los permisos del Google Apps Script

### Error de CORS al enviar el formulario

- Esto es normal en algunos navegadores cuando se prueba localmente
- Sube el archivo a un servidor web o usa un servidor local (como `python -m http.server`)
- O prueba desde un hosting web

## Mantenimiento

### Actualizar el script después de cambios

Si actualizas el código del Google Apps Script:

1. Guarda los cambios en el editor de Apps Script
2. Ve a **Implementar** > **Administrar implementaciones**
3. Haz clic en el icono de lápiz (editar) en tu implementación activa
4. Cambia la versión a "Nueva versión"
5. Haz clic en **Implementar**
6. La URL permanecerá la misma

## Seguridad y Privacidad

- Los datos personales del postulante se almacenan en Google Sheets
- El PDF no incluye los datos personales del postulante (solo del proyecto)
- Asegúrate de que la Google Sheet tenga los permisos adecuados
- **Importante**: La URL del Google Apps Script está expuesta en el código del formulario. Esto es normal para aplicaciones web públicas, pero considera:
  - Implementar validación adicional en el script (e.g., verificar dominio de origen)
  - Monitorear el uso del script para detectar abusos
  - Implementar rate limiting si es necesario
- Considera implementar autenticación si el formulario debe ser de acceso restringido

## Soporte

Para problemas o preguntas, contacta al administrador del sistema.

## Licencia

Este proyecto es para uso interno de la Universidad de Aysén.
