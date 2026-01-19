# Configuración de Google Sheets para Postulaciones

Esta guía te ayudará a configurar Google Sheets como almacenamiento alternativo para las postulaciones del formulario.

## 📋 Requisitos Previos

1. Una cuenta de Google
2. Acceso a Google Cloud Console
3. Node.js instalado

## 🔧 Pasos de Configuración

### Paso 1: Crear un Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el nombre del proyecto

### Paso 2: Habilitar la API de Google Sheets

1. En Google Cloud Console, ve a "APIs y servicios" > "Biblioteca"
2. Busca "Google Sheets API"
3. Haz clic en "Habilitar"

### Paso 3: Crear una Cuenta de Servicio

1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "Cuenta de servicio"
3. Completa los detalles:
   - Nombre: `formvcm-service-account`
   - Descripción: `Cuenta para guardar postulaciones en Sheets`
4. Haz clic en "Crear y continuar"
5. En "Función", selecciona "Editor" (opcional, para desarrollo)
6. Haz clic en "Continuar" y luego "Listo"

### Paso 4: Descargar las Credenciales

1. En la lista de cuentas de servicio, encuentra la que acabas de crear
2. Haz clic en los tres puntos (⋮) > "Administrar claves"
3. Haz clic en "Agregar clave" > "Crear clave nueva"
4. Selecciona el formato **JSON**
5. Descarga el archivo y guárdalo como `credentials.json` en la raíz del proyecto

⚠️ **IMPORTANTE**: Nunca subas este archivo a Git. Ya está incluido en `.gitignore`

### Paso 5: Crear la Hoja de Cálculo

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala "Postulaciones FormVCM"
4. Crea una hoja llamada "Postulaciones" (o usa "Hoja 1" y renómbrala)
5. **Agrega los encabezados en la primera fila** (ver tabla abajo)
6. Copia el ID de la hoja de cálculo desde la URL:
   - URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_AQUI/edit`
   - El ID está entre `/d/` y `/edit`

### Paso 6: Compartir la Hoja con la Cuenta de Servicio

1. En tu hoja de Google Sheets, haz clic en "Compartir"
2. Pega el email de la cuenta de servicio (lo encuentras en `credentials.json`, campo `client_email`)
3. Dale permisos de "Editor"
4. Haz clic en "Compartir"

### Paso 7: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
SPREADSHEET_ID=tu_spreadsheet_id_aqui
GOOGLE_CREDENTIALS_PATH=./credentials.json
PORT=3000
```

### Paso 8: Instalar Dependencias

```bash
npm install googleapis dotenv
```

### Paso 9: Usar el Servidor con Google Sheets

En lugar de usar `server.js`, usa `server-sheets.js`:

```bash
node server-sheets.js
```

O actualiza el `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "start:sheets": "node server-sheets.js"
  }
}
```

Luego ejecuta:

```bash
npm run start:sheets
```

## 📊 Estructura de la Hoja de Cálculo

La primera fila debe contener estos encabezados (columnas A-AE):

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| ID | Fecha Envío | Institución | RUT | Tipo | Dirección | Email | Teléfono |

| I | J | K | L |
|---|---|---|---|
| Rep. Nombre | Rep. RUN | Rep. Cargo | Rep. Email |

| M | N | O | P |
|---|---|---|---|
| Sup. Nombre | Sup. RUN | Sup. Cargo | Sup. Email |

| Q | R | S | T |
|---|---|---|---|
| Justificación | Área Estratégica | Contribución | Objetivos (JSON) |

| U | V | W | X | Y | Z | AA |
|---|---|---|---|---|---|---|
| Objetivo Cargo | Carrera | Labores | Comp. Técnicas | Hab. Blandas | Impacto | Sostenibilidad |

| AB | AC | AD | AE |
|---|---|---|---|
| RRHH UAysén | Op. Socio | Cap. UAysén | Cap. Socio |

## 🔍 Verificación

1. Inicia el servidor: `node server-sheets.js`
2. Deberías ver:
   ```
   ✓ Google Sheets API inicializada correctamente
   ```
3. Envía una postulación de prueba
4. Verifica que aparezca en tu hoja de Google Sheets

## 🛡️ Seguridad

- ✅ `credentials.json` está en `.gitignore`
- ✅ Nunca compartas tus credenciales
- ✅ Usa variables de entorno en producción
- ✅ Limita los permisos de la cuenta de servicio

## 🔄 Almacenamiento Dual

El servidor guarda las postulaciones en:
1. **Google Sheets** (principal)
2. **Archivos JSON locales** (respaldo)

Si Google Sheets falla, los datos se guardan localmente de todos modos.

## ❓ Solución de Problemas

### Error: "Forbidden" o "Permission denied"
- Verifica que compartiste la hoja con el email de la cuenta de servicio
- Verifica que la cuenta tiene permisos de "Editor"

### Error: "Spreadsheet not found"
- Verifica que el SPREADSHEET_ID es correcto
- Verifica que la hoja está compartida con la cuenta de servicio

### Error: "Invalid credentials"
- Verifica que `credentials.json` es correcto
- Verifica que la API de Google Sheets está habilitada

### Las postulaciones no aparecen en Sheets
- Verifica que el nombre de la hoja es "Postulaciones"
- Verifica que la primera fila tiene los encabezados correctos
- Revisa los logs del servidor para ver errores específicos

## 📞 Soporte

Si tienes problemas, revisa:
1. Los logs del servidor (`console.log`)
2. La consola de Google Cloud para errores de API
3. Los permisos de la hoja de cálculo
