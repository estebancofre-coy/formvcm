# Formulario de Postulación - Desafío Territorial U. Aysén

Sistema de postulación web para el programa Desafío Territorial de la Universidad de Aysén.

## 🚀 Características

- **Frontend**: Formulario HTML5 con Bootstrap 5.3.0
- **Backend**: Servidor Node.js + Express
- **Almacenamiento**: Archivos JSON (sin necesidad de base de datos)
- **Validación**: Cliente y servidor
- **Responsive**: Diseño adaptable a dispositivos móviles

## 📋 Requisitos

- Node.js 14 o superior
- npm (incluido con Node.js)

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

Iniciar el servidor:
```bash
npm start
```

El servidor se iniciará en `http://localhost:3000`

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
├── index.html          # Formulario principal
├── server.js           # Servidor Express
├── package.json        # Dependencias del proyecto
├── public/             # Recursos estáticos
├── data/               # Postulaciones guardadas (generado automáticamente)
└── README.md          # Este archivo
```

## 💾 Almacenamiento de Datos

Las postulaciones se guardan en la carpeta `/data` como archivos JSON individuales con el formato:
- `POST-[timestamp].json`

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

**Response:**
```json
{
  "success": true,
  "id": "POST-1234567890",
  "mensaje": "Postulación recibida exitosamente"
}
```

### GET /api/postulaciones
Lista todas las postulaciones guardadas (endpoint administrativo).

## 🎨 Personalización

- **Colores institucionales**: Definidos en el CSS (#003366 - Azul U. Aysén)
- **Puerto del servidor**: Configurable mediante variable de entorno `PORT`

## 📄 Licencia

MIT
