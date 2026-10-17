# Contexto del proyecto ECCO

Trabajo de grado (UMSS): app móvil de IHC Afectiva que fomenta micro interacciones sociales positivas entre jóvenes de 16 a 28 años. Se empareja a dos personas con intereses en común; tienen 7 días para conversar, con 5 mensajes al día cada una. Una planta crece los días en que ambas se escriben, y al final cada una decide en privado si quiere seguir. La documentación está en `trabajo_de_grado_micro_interacciones.md`. Las decisiones de diseño y su sustento académico están en `docs/decisiones_de_diseno.md`: **todo cambio de diseño debe justificarse ahí**.

- **Frontend:** Expo 55 + React Native, expo-router, NativeWind 4.2.7 (Tailwind 3), Reanimated, react-native-svg, expo-secure-store, expo-image.
- **Backend:** FastAPI async + SQLAlchemy + PostgreSQL (psycopg), Alembic, JWT (7 días), Mailpit para correos en desarrollo.

## Cómo levantar todo

1. `docker compose up -d` en la raíz (PostgreSQL 18 + Mailpit en http://localhost:8025).
2. Backend: `cd backend`, `.venv\Scripts\python -m alembic upgrade head`, `.venv\Scripts\uvicorn src.main:app --reload --host 0.0.0.0`.
3. Frontend: `cd frontend`, `npx expo start` (web: `--web`, puerto 8081). En un teléfono con Expo Go, la app usa automáticamente la IP de la PC en lugar de `localhost`.
4. Pruebas: `cd backend` y `.venv\Scripts\python -m pytest -q` (usa la base `postgres_app_test`).

## Backend (`backend/`)

- `src/main.py`: crea la app, configura CORS y los manejadores de errores, y monta las rutas bajo `/api`.
- `src/core/`: seguridad (JWT/hash), `deps.py` (`CurrentUser`, `DbSession`), errores amigables en español, envío de correo, límite de peticiones y `utcnow`.
- `src/modules/<modulo>/`: `router`, `schemas`, `models` y, a veces, `service`. Los esquemas heredan de `CamelModel`, así que la API entra y sale en camelCase.
- `alembic/versions/`: esquema inicial y `b41c7e2a9f10` (avatar JSON, `share_mood`, `matches.ended_at/ended_by_id`, tabla `reports`).
- `pytest.ini`: `asyncio_mode=auto`. En Windows, `conftest.py` fuerza `WindowsSelectorEventLoopPolicy` (psycopg async lo requiere).

| Módulo | Endpoints |
|---|---|
| `auth` | `POST /auth/register`, `/login`, `/forgot-password`, `/reset-password` |
| `users` | `GET/PUT /users/me`: username, avatar (config), intereses, `interestDetails`, `termsAccepted`, `shareMood`. `UserOut.onboarded` indica si completó el onboarding. |
| `moods` | `POST /moods`, `GET /moods/me?days=7` |
| `matches` | `GET /matches/current`, `POST /matches`, `GET/DELETE /matches/search`, `GET /matches/{id}`, `POST /matches/{id}/decision`, `POST /matches/{id}/end` (salir o reportar) |
| `chat` | `GET /matches/{id}/messages?after=`, `POST /matches/{id}/messages` |
| `garden` | `GET /garden` |
| `health` | `GET /health`, `/health/db` |

### Reglas (`modules/matches/constants.py` y `service.py`)

- El avatar es un `AvatarConfig` validado (`users/avatar.py`): skin, hair, hairColor, glasses, freckles, mole, earring, top y background.
- Los temas de la búsqueda (`hobbies`, máximo 3) deben estar entre los intereses del usuario; si no, `start_search` responde 400. Ya no existe la lista fija de 6 temas.
- Emparejamiento: puntaje = temas en común × 3 + intereses en común. Nunca se repite una pareja. `pg_advisory_xact_lock` evita emparejamientos dobles. La búsqueda dura 24 h.
- `status_for` (desde la perspectiva de cada usuario): `active` → `deciding` (desde el día 7 hasta el 10) → `waiting` / `bloomed` (ambos siguen) / `rested`. `closed` significa que alguien salió o reportó. Un "no" de la otra persona no se revela mientras tú esperas.
- La planta (`stage`, de 0 a 5) = días en que ambos escribieron. Con `bloomed` queda en 5.
- Se puede escribir en `active` y `deciding` hasta el día 7; en `bloomed`, siempre. Tope de `MESSAGES_PER_DAY = 5` por persona y día.
- La pareja ve tu ánimo de las últimas 24 h en tu avatar si `share_mood` está activo.
- `GET /garden` oculta los matches que tú cerraste.

## Frontend (`frontend/src/`)

- `app/`: rutas de expo-router. `_layout` restaura la sesión (token en SecureStore, o `localStorage` en web) antes de mostrar nada. `index` redirige según el estado `onboarded`. `(tabs)/`: home, garden, exchange, profile y settings. Otras rutas: `conversation/[id]` (conexiones florecidas), `resetPassword`, `terms`, `avatarEditor` y `editInterests`.
- `features/`:
  - `auth`: login, registro, recuperar y restablecer contraseña.
  - `onboarding`: acuerdos → avatar → intereses → detalles → diapositivas, y al final guarda todo en un solo `PUT /users/me`.
  - `exchange`:
    - `exchangeFlow` retoma una búsqueda en curso.
    - `themeSelectionScreen` muestra solo los intereses del usuario, agrupados por categoría.
    - `useMatching` consulta el estado de la búsqueda cada 3 s.
    - `conversationScreen` + `useConversation` consultan el match y los mensajes cada 4 s, solo con la pantalla enfocada.
    - `sparks.ts` genera las ideas para conversar a partir de los temas y de la categoría de cada uno.
    - `safetySheet` maneja salir y reportar.
    - `decisionCard` y `outcomeScreen` cubren el cierre de la semana.
  - `garden`: grupos "Siguen floreciendo", "Creciendo ahora" y "Recuerdos".
  - `home`: check-in de ánimo (con respiración guiada si el ánimo es bajo) y tarjetas de estado.
  - `profile`: avatar, "Tu semana" y `avatarCustomizer`.
  - `settings`: compartir ánimo, acuerdos y cerrar sesión.
- `components/avatar/avatar.tsx`: un solo SVG configurable con expresión según el ánimo (`mood`).
- Los archivos de recursos se nombran en inglés.
- `components/avatar/moodFace.tsx`: muestra las caras de ánimo propias de `assets/svg/emotions/` con `expo-image`. Mapeo: fatal → `awful.svg`, mal → `bad.svg`, normal → `okay.svg`, bien → `good.svg`, feliz → `happy.svg` (los `MoodId` del código y de la API siguen en español).
- `components/layout/scenery.tsx`: fondo de Inicio y de la conversación activa con `assets/svg/background/home.svg` (hoy 495×996). Ocupa el ancho completo y el alto se calcula con la proporción real de la imagen, leída en `onLoad`, así que se puede reemplazar el SVG sin tocar código y el resto se rellena de blanco. Sobre él, `AppHeader onScenery` usa `primary-darker` por contraste. En Inicio el contenido va en una sola columna y ocupa todo el ancho (decisión de la autora: que se estire al ensanchar la ventana). La tarjeta de la conversación activa conserva un máximo de 560 px. Se usa en el selector de ánimo de Inicio y en "Tu semana" del Perfil.
- `welcomeScreen` muestra `assets/svg/semilla.svg` con `expo-image`, que dibuja SVG en Android, web y Expo Go. Rive se probó y se retiró.
- `components/ui/`: `Button` (etiquetas con contraste AA), `Chip`, `Sheet` y `ConfirmSheet`. No uses `Alert`, que no funciona en web.
- `lib/nativewindInterop.ts`: registra `Animated.View`/`Animated.Text` de Reanimated para que acepten `className`. Sin esto, las clases no se aplican.
- `services/`: un servicio por módulo; ya no hay mocks. `api.ts` agrega el Bearer y limpia la sesión ante un 401.

## Convenciones de diseño

- Texto sobre fondos de la paleta: usar los tonos `dark-hover` / `dark-active` / `darker`. Nunca `text-white` sobre `*-normal`, ni `text-primary-normal(-active)` como color de texto (no pasan WCAG AA).
- Objetivos táctiles de al menos 40–48 px; el texto, de al menos 12 px.
- Sin métricas públicas, rachas ni notificaciones de enganche.
