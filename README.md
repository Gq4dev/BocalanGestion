# App Perros de Asistencia

Aplicación web responsive para gestionar la información de una asociación de perros de asistencia: cachorros en socialización, adolescentes en entrenamiento y graduados con sus usuarios. Incluye planillas de entrenamiento y ficha veterinaria por perro.

## Stack

- **Frontend:** Next.js 15 (React), TypeScript, Tailwind CSS. Diseño responsive (móvil, tablet, escritorio).
- **API:** Integrada en Next (Route Handlers en `/api/*`) con Mongoose y MongoDB. Un solo despliegue.

## Requisitos

- Node.js 18+
- MongoDB (local o Atlas)

## Instalación y ejecución

### Modo unificado (recomendado: frontend + API en Next)

```bash
cd frontend
cp .env.local.example .env.local
# Editar .env.local y configurar MONGODB_URI (ej: mongodb://localhost:27017/perros-asistencia)
npm install
npm run dev
```

La app quedará en **http://localhost:3000**. La API se sirve en el mismo origen (`/api/dogs`, `/api/beneficiaries`, etc.). No hace falta `NEXT_PUBLIC_API_URL` en local.

### Producción (un solo servicio)

- Desplegar solo **frontend** (ej. Render): Root Directory `frontend`, Build `npm install && npm run build`, Start `npm start`.
- Variable de entorno: `MONGODB_URI` con la cadena de conexión (Atlas o tu Mongo).
- No es necesario `NEXT_PUBLIC_API_URL`: la API y la UI corren en el mismo dominio.

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
