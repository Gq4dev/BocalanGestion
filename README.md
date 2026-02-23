# App Perros de Asistencia

Aplicación web responsive para gestionar la información de una asociación de perros de asistencia: cachorros en socialización, adolescentes en entrenamiento y graduados con sus usuarios. Incluye planillas de entrenamiento y ficha veterinaria por perro.

## Stack

- **Frontend:** Next.js 14 (React), TypeScript, Tailwind CSS. Diseño responsive (móvil, tablet, escritorio).
- **Backend:** Node.js, Express, MongoDB (Mongoose).

## Requisitos

- Node.js 18+
- MongoDB (local o Atlas)

## Instalación y ejecución

### 1. Backend

```bash
cd backend
cp .env.example .env
# Editar .env y configurar MONGODB_URI (ej: mongodb://localhost:27017/perros-asistencia)
npm install
npm run dev
```

El API quedará en **http://localhost:4000**.

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La web quedará en **http://localhost:3000**. Las peticiones a `/api/*` se redirigen al backend (configurado en `next.config.js`).

### Producción

- **Backend:** `npm start` (puerto por defecto 4000 o la variable `PORT`).
- **Frontend:** `npm run build` y `npm start`. Configurar `NEXT_PUBLIC_API_URL` con la URL pública del backend (ej: `https://tu-api.com`) para que el cliente llame al API correcto.

## Estructura de la app

### Perros por etapa

- **Cachorros:** datos del perro + familia de socialización asignada.
- **Adolescentes:** datos del perro + entrenador asignado + planillas de entrenamiento.
- **Graduados:** datos del perro + usuario/beneficiario.

### Por cada perro

- Datos básicos (nombre, raza, fecha nacimiento, sexo, chip, etc.).
- **Ficha veterinaria:** registros de vacunas, desparasitación, controles, enfermedades, cirugías (fecha, tipo, descripción, veterinario, próxima fecha).
- **Planillas de entrenamiento** (solo adolescentes): fecha, habilidades con nivel (no iniciado / en proceso / logrado / mantenido), notas y próximos objetivos. Formulario sencillo con opciones predefinidas.

### Maestros

- **Familias de socialización:** nombre, contacto, teléfono, email, dirección, ciudad.
- **Entrenadores:** nombre, teléfono, email.
- **Usuarios / beneficiarios:** nombre, condición/discapacidad, contacto, dirección.

## API (resumen)

| Recurso | Rutas |
|--------|--------|
| Perros | `GET/POST /api/dogs`, `GET/PUT/DELETE /api/dogs/:id`, `GET /api/dogs/by-stage/:stage` |
| Familias | `GET/POST /api/socialization-families`, `GET/PUT/DELETE /api/socialization-families/:id` |
| Entrenadores | `GET/POST /api/trainers`, `GET/PUT/DELETE /api/trainers/:id` |
| Beneficiarios | `GET/POST /api/beneficiaries`, `GET/PUT/DELETE /api/beneficiaries/:id` |
| Planillas | `GET/POST /api/training-sheets`, `GET /api/training-sheets/dog/:dogId`, `GET/PUT/DELETE /api/training-sheets/:id` |
| Veterinaria | `GET/POST /api/veterinary-records`, `GET /api/veterinary-records/dog/:dogId`, `GET/PUT/DELETE /api/veterinary-records/:id` |

## Uso en celulares y tablets

La interfaz usa Tailwind con breakpoints estándar y botones/inputs grandes. El menú de navegación se adapta (menos ítems visibles en pantallas chicas). Se puede usar desde el navegador del celular o tablet sin instalación adicional.
