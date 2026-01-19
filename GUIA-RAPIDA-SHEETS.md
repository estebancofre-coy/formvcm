# Guía Rápida: Integración con Google Drive/Sheets

## 📊 Resumen

Esta solución te permite guardar las postulaciones del formulario directamente en Google Sheets, permitiendo acceso desde cualquier lugar y facilitando el trabajo colaborativo.

## 🚀 Inicio Rápido (5 pasos)

### 1️⃣ Instalar dependencias

```bash
npm install
```

### 2️⃣ Obtener credenciales de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita "Google Sheets API"
4. Crea una "Cuenta de Servicio"
5. Descarga las credenciales como `credentials.json`
6. Coloca `credentials.json` en la raíz del proyecto

### 3️⃣ Crear la hoja automáticamente

```bash
npm run setup:sheets
```

Este script:
- Crea una nueva hoja de Google Sheets
- Configura los encabezados automáticamente
- Te da el SPREADSHEET_ID

### 4️⃣ Configurar variables de entorno

Copia y edita el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita `.env` y agrega:
```
SPREADSHEET_ID=tu_spreadsheet_id_aqui
GOOGLE_CREDENTIALS_PATH=./credentials.json
```

### 5️⃣ ¡Listo! Iniciar el servidor

```bash
npm run start:sheets
```

Abre http://localhost:3000

## 📝 ¿Qué hace la solución?

✅ **Recibe** las postulaciones del formulario web
✅ **Guarda** cada postulación como una fila en Google Sheets
✅ **Respaldo** local en archivos JSON si falla Sheets
✅ **Organiza** los datos en columnas estructuradas

## 🔍 Estructura de la Hoja

Cada postulación se guarda en una fila con 31 columnas:

| Columna | Campo | Descripción |
|---------|-------|-------------|
| A | ID | Identificador único |
| B | Fecha | Timestamp del envío |
| C-H | Institución | Datos de la organización |
| I-L | Representante | Datos del representante legal |
| M-P | Supervisor | Datos del supervisor |
| Q-T | Iniciativa | Justificación y objetivos |
| U-AA | Perfil | Objetivo, carrera, competencias |
| AB-AE | Financiamiento | Montos UAysén y Socio |

## 💡 Ventajas vs. Almacenamiento Local

| Característica | Local | Google Sheets |
|----------------|-------|---------------|
| Acceso remoto | ❌ | ✅ |
| Trabajo colaborativo | ❌ | ✅ |
| Backup automático | ❌ | ✅ |
| Exportar a Excel | Manual | ✅ 1 clic |
| Búsqueda/Filtrado | ❌ | ✅ |
| Gráficos/Análisis | ❌ | ✅ |

## 🔧 Solución de Problemas

### ❌ "Forbidden" o "Permission denied"
**Solución**: Comparte la hoja con el email de la cuenta de servicio
- Email está en `credentials.json` → campo `client_email`
- Dale permisos de "Editor"

### ❌ "Spreadsheet not found"
**Solución**: Verifica que el `SPREADSHEET_ID` es correcto
- Lo encuentras en la URL de la hoja
- Formato: `https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit`

### ❌ "Invalid credentials"
**Solución**: Regenera `credentials.json`
- Ve a Google Cloud Console
- Crea una nueva clave para la cuenta de servicio
- Descarga y reemplaza el archivo

## 📊 Ejemplo de Datos en la Hoja

```
ID                  | Fecha Envío          | Institución        | RUT          | ...
POST-1768832717460  | 2026-01-19T14:22:39Z | U. de Aysén       | 12.345.678-9 | ...
POST-1768832718523  | 2026-01-19T14:25:18Z | Municipalidad     | 98.765.432-1 | ...
```

## 🔐 Seguridad

⚠️ **IMPORTANTE**:
- ✅ `credentials.json` está en `.gitignore` (no se sube a Git)
- ✅ `.env` está en `.gitignore` (no se sube a Git)
- ✅ Nunca compartas tus credenciales públicamente
- ✅ Limita los permisos de la cuenta de servicio

## 📚 Documentación Completa

Para más detalles, consulta:
- [setup-sheets.md](setup-sheets.md) - Guía paso a paso detallada
- [README.md](README.md) - Documentación general del proyecto

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs del servidor (console)
2. Verifica los permisos en Google Sheets
3. Consulta `setup-sheets.md` para troubleshooting detallado
