# Formulario de Postulación - Desafío Territorial U. Aysén

Sistema de postulación web para el programa Desafío Territorial de la Universidad de Aysén.

## 🚀 Características

- **Frontend**: Formulario HTML5 con Bootstrap 5.3.0
- **Backend**: Servidor Node.js + Express
- **Almacenamiento**: Archivos JSON locales + Google Sheets (opcional)
- **Validación**: Cliente y servidor
- **Responsive**: Diseño adaptable a dispositivos móviles

## 📋 Requisitos

- Node.js 14 o superior
- npm (incluido con Node.js)
- Cuenta de Google (opcional, para integración con Sheets)

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/estebancofre-coy/formvcm.git
cd formvcm
```

2. Instalar dependencias:
```bash
npm install
```

## ▶️ Ejecución

### Opción 1: Servidor básico (solo almacenamiento local)

```bash
npm start
```

### Opción 2: Servidor con Google Sheets

```bash
npm run start:sheets
```

El servidor se iniciará en `http://localhost:3000`

## 📊 Integración con Google Sheets

Para guardar las postulaciones en Google Sheets en lugar de archivos locales:

### Configuración Rápida:

1. **Instalar dependencias adicionales** (ya incluidas):
   ```bash
   npm install
   ```

2. **Configurar Google Cloud**:
   - Sigue la guía completa en [setup-sheets.md](setup-sheets.md)
   - Descarga `credentials.json` de tu cuenta de servicio
   - Colócalo en la raíz del proyecto

3. **Crear y configurar la hoja**:
   ```bash
   npm run setup:sheets
   ```
   Este script te ayudará a crear la hoja automáticamente.

4. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   ```
   Edita `.env` y agrega tu `SPREADSHEET_ID`

5. **Iniciar el servidor**:
   ```bash
   npm run start:sheets
   ```

### Ventajas de Google Sheets:

- ✅ Acceso desde cualquier lugar
- ✅ Colaboración en tiempo real
- ✅ Fácil exportación a Excel/CSV
- ✅ Respaldo automático en la nube
- ✅ Almacenamiento local como fallback

**Documentación detallada**: Ver [setup-sheets.md](setup-sheets.md)

## 📝 Uso del Formulario

1. Abrir el navegador en `http://localhost:3000`
2. Completar las 5 secciones del formulario:
   - Identificación de la Institución u Organización
   - Identificación del Representante Legal
   - Supervisor del Profesional Alumni
   - Resumen de la Iniciativa
   - Financiamiento
3. Agregar objetivos específicos usando el botón "+ Agregar Objetivo Específico"
4. Hacer clic en "Enviar Postulación"

## 🗂️ Estructura del Proyecto

```
formvcm/
├── index.html                  # Formulario principal
├── server.js                   # Servidor Express (básico)
├── server-sheets.js            # Servidor con Google Sheets
├── create-sheet-template.js    # Script para configurar Sheets
├── setup-sheets.md            # Guía de configuración Sheets
├── package.json               # Dependencias del proyecto
├── .env.example               # Plantilla de variables de entorno
├── public/                    # Recursos estáticos
├── data/                      # Postulaciones guardadas localmente
└── README.md                  # Este archivo
```

## 💾 Almacenamiento de Datos

### Modo Local (server.js)
Las postulaciones se guardan en la carpeta `/data` como archivos JSON individuales:
- Formato: `POST-[timestamp].json`
- Ubicación: `/data/POST-1234567890.json`

### Modo Google Sheets (server-sheets.js)
Las postulaciones se guardan en:
1. **Google Sheets** (principal): Una fila por cada postulación
2. **Archivos JSON locales** (respaldo): En caso de fallo de Sheets

## 🔍 API Endpoints

### POST /api/postulacion
Envía una nueva postulación.

**Request Body:**
```json
{
  "inst_nombre": "Nombre de la institución",
  "inst_rut": "12.345.678-9",
  ...
}
```

**Response (modo básico):**
```json
{
  "success": true,
  "id": "POST-1234567890",
  "mensaje": "Postulación recibida exitosamente"
}
```

**Response (modo Sheets):**
```json
{
  "success": true,
  "id": "POST-1234567890",
  "mensaje": "Postulación recibida exitosamente",
  "storage": {
    "sheets": true,
    "local": true
  }
}
```

### GET /api/postulaciones
Lista todas las postulaciones guardadas localmente (endpoint administrativo).

## 🎨 Personalización

- **Colores institucionales**: Definidos en el CSS (#003366 - Azul U. Aysén)
- **Puerto del servidor**: Configurable mediante variable de entorno `PORT`
- **Almacenamiento**: Configurable entre local, Sheets, o ambos

## 🔒 Seguridad

- `credentials.json` está excluido en `.gitignore`
- Nunca subas credenciales de Google al repositorio
- Las variables de entorno se mantienen en `.env` (también excluido)

## 📄 Licencia

MIT
