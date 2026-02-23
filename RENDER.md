# Deploy en Render

Un solo **Web Service** sirve la app (Next.js + API integrada).

## Opción A: Conectar repo y usar Blueprint

1. Entrá a [dashboard.render.com](https://dashboard.render.com) e **iniciá sesión** (o creá cuenta con GitHub).
2. **New +** → **Blueprint**.
3. Conectá el repo **Gq4dev/BocalanGestion** (autorizá Render en GitHub si hace falta).
4. Render va a detectar el `render.yaml` en la raíz y crear el servicio **bocalan-perros-asistencia**.
5. Antes del primer deploy, en el servicio → **Environment** agregá:
   - **MONGODB_URI**: tu cadena de MongoDB (Atlas o la que uses). Marcarla como **Secret**.
6. **Create / Deploy**. El primer build puede tardar unos minutos.

La URL quedará tipo: `https://bocalan-perros-asistencia.onrender.com`

---

## Opción B: Crear el servicio a mano (sin Blueprint)

1. **New +** → **Web Service**.
2. Repo: **Gq4dev/BocalanGestion**.
3. Configuración:
   - **Name**: `bocalan-perros-asistencia` (o el que quieras).
   - **Region**: la más cercana a tus usuarios.
   - **Root Directory**: `frontend`
   - **Runtime**: Node.
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. **Environment** → Add:
   - **MONGODB_URI** = `mongodb+srv://...` (o tu URI). Marcar como Secret.
5. **Create Web Service**.

---

## MongoDB en producción

Si usás **MongoDB Atlas**:

- Creá un cluster (free tier sirve).
- Database Access → usuario con contraseña.
- Network Access → permití `0.0.0.0/0` (o solo IPs de Render si las tenés).
- Connect → “Connect your application” → copiá la URI y usala como **MONGODB_URI** en Render.

---

## Avisos durante el build

- **npm audit**: Las vulnerabilidades que quedan suelen ser de ESLint (solo dev). Podés ignorarlas o ejecutar `npm audit fix --force` si querés actualizar ESLint (puede requerir ajustes de config).
- **No build cache found**: Es normal en el primer build. En Render cada deploy empieza sin caché; los siguientes builds en la misma máquina pueden usar caché si la plataforma persiste `.next/cache`.

## Después del deploy

- **Auto Deploy**: al hacer push a la rama por defecto (p. ej. `master`), Render vuelve a desplegar.
- La app funciona en **celular y PC** abriendo la URL de Render en el navegador.
- Si el servicio se “duerme” (plan free), la primera visita puede tardar ~30 s en despertar.
