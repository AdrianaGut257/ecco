# Publicar ECHOOM

Todo funciona con planes gratuitos y sin tarjeta.

| Parte | Servicio | Dirección |
|---|---|---|
| Base de datos (PostgreSQL) | [Neon](https://neon.tech) | — |
| Backend (FastAPI) | [Render](https://render.com), servicio `echoom-api` | `https://echoom-api.onrender.com/api` |
| App web | Render, servicio `echoom-web` | `https://echoom-web.onrender.com` |
| Correos con códigos | [Brevo](https://www.brevo.com) (300 al día) | — |
| App Android (APK) | [EAS Build de Expo](https://expo.dev) | Enlace de descarga |

La receta de Render está en `render.yaml` y la del APK en `frontend/eas.json`. La base de datos de producción empieza vacía: las cuentas de prueba se crean de nuevo.

## 1. Subir el código a GitHub

Render publica desde GitHub. Sube los cambios a la rama que vayas a usar (por ejemplo `master`).

## 2. Base de datos en Neon

1. Entra con GitHub y crea un proyecto `echoom`. En la región elige **AWS US East 1 (N. Virginia)**, la misma que el backend.
2. En **Connect**, desactiva **Connection pooling**.
3. Copia la cadena de conexión, que empieza con `postgresql://…`. Es secreta.

## 3. Correo en Brevo

1. Crea la cuenta.
2. Ve a **Senders, Domains & Dedicated IPs → Senders → Add a sender**. Pon tu Gmail y confírmalo con el correo que te llega.
3. Ve a **SMTP & API → API Keys → Generate a new API key** y copia la clave. Es secreta.

> Como el remitente es un Gmail enviado desde Brevo, algunos correos pueden llegar a spam. Las pantallas de la app ya piden revisar ahí.

## 4. Backend y web en Render

1. Entra con GitHub y elige **New → Blueprint**.
2. Elige el repositorio `ecco` y la rama. Render lee `render.yaml` y muestra los dos servicios.
3. Escribe tú los valores secretos:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | La cadena de Neon |
| `CORS_ORIGINS` | `https://echoom-web.onrender.com` |
| `SMTP_FROM` | El Gmail que confirmaste en Brevo |
| `BREVO_API_KEY` | La clave de Brevo |
| `GOOGLE_KG_API_KEY` | La misma de `backend/.env` |
| `EXPO_PUBLIC_API_URL` | `https://echoom-api.onrender.com/api` |

4. Pulsa **Apply** y espera a que los dos servicios queden en verde (unos minutos).
5. Revisa que funcione:
   - `https://echoom-api.onrender.com/api/health` debe responder `{"status":"ok"}`.
   - Luego abre `https://echoom-web.onrender.com`.

`JWT_SECRET_KEY` la genera Render solo. Al arrancar, el backend crea las tablas con las migraciones.

**Si Render le pone otro nombre a un servicio** (por ejemplo `echoom-api-x1y2`, porque el nombre ya estaba usado), hay que cambiar la dirección en tres lugares:
- `CORS_ORIGINS` del backend;
- `EXPO_PUBLIC_API_URL` de la web, y después elegir **Manual Deploy** en `echoom-web`, porque la dirección se fija al construir;
- `frontend/eas.json`.

## 5. APK para Android

En la carpeta `frontend`:

```
npx eas-cli login
npx eas-cli init
npx eas-cli build -p android --profile preview
```

1. `init` enlaza el proyecto con tu cuenta de Expo y agrega su id a `app.json`.
2. La compilación ocurre en los servidores de Expo y tarda entre 10 y 20 minutos en el plan gratis.
3. Al terminar, te da un enlace y un QR para descargar el APK.
4. Al instalarlo, Android pide permitir "apps de origen desconocido".

## Cómo actualizar

- **Backend y web:** se publican solos cada vez que subes cambios a la rama elegida en GitHub.
- **APK:** hay que generarlo de nuevo (paso 5) cuando cambie la app.

## Limitaciones del plan gratis

- El backend se duerme tras 15 minutos sin uso. La primera petición después tarda de 30 a 50 segundos. Antes de una sesión de prueba, abre `/api/health` para despertarlo.
- En iPhone no se puede instalar sin la cuenta de Apple (99 USD al año). Quienes tengan iPhone usan la versión web desde Safari.
- Brevo envía hasta 300 correos al día y Neon guarda hasta 0,5 GB. Ambos alcanzan de sobra para la evaluación.
