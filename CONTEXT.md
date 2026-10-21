# Contexto del proyecto ECCO

Trabajo de grado (UMSS): app móvil de IHC Afectiva que fomenta micro interacciones sociales positivas entre jóvenes de 16 a 28 años. Se empareja a dos personas con intereses en común; tienen 7 días para conversar, con 5 mensajes al día cada una. Una planta crece los días en que ambas se escriben, y al final cada una decide en privado si quiere seguir. La documentación está en `trabajo_de_grado_micro_interacciones.md`. Las decisiones de diseño y su sustento académico están en `docs/decisiones_de_diseno.md`: **todo cambio de diseño debe justificarse ahí**. `docs/actualizacion_documento_tesis.md` resume todos los cambios para que la autora actualice la tesis en Claude web: hay que mantenerlo al día cuando cambie algo relevante.

- **Frontend:** Expo 55 + React Native, expo-router, NativeWind 4.2.7 (Tailwind 3), Reanimated, react-native-svg, expo-secure-store, expo-image.
- **Backend:** FastAPI async + SQLAlchemy + PostgreSQL (psycopg), Alembic, JWT (7 días), Mailpit para correos en desarrollo.
- **Figma:** https://www.figma.com/design/Qght10FTdpM2wPuOaY5oJ3 (equipo "MI APP"). Páginas Portada, Fundamentos (57 variables: Color, Radius y Spacing, más 14 estilos de texto), Componentes (Botón, Chip, Aviso, Tarjeta, Burbuja de chat, Campo de texto, Barra de pestañas, Opción de ánimo y 34 íconos Ionicons), Recursos (Planta, Cara de ánimo, Avatar/Ánimo, Avatar/Estilo, Semilla y Fondo Inicio) y Pantallas (21 pantallas en 5 secciones). Si cambia la UI, hay que actualizar Figma también.

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
| `users` | `GET/PUT /users/me`: username, avatar (config), intereses, `interestDetails`, `termsAccepted`, `shareMood`. `UserOut` devuelve `interestDetails` y `onboarded` (si completó el onboarding). |
| `moods` | `POST /moods`, `GET /moods/me?days=7` |
| `matches` | `GET /matches/current`, `POST /matches`, `GET/DELETE /matches/search`, `GET /matches/{id}`, `POST /matches/{id}/decision`, `POST /matches/{id}/end` (salir o reportar) |
| `chat` | `GET /matches/{id}/messages?after=`, `POST /matches/{id}/messages` |
| `garden` | `GET /garden` |
| `suggestions` | `GET /suggestions?q=&interest=`: autocompletado con Google Knowledge Graph Search |
| `health` | `GET /health`, `/health/db` |

### Reglas (`modules/matches/constants.py` y `service.py`)

- El avatar es un `AvatarConfig` validado (`users/avatar.py`): kind (girl/boy), skin, hair (22, incluido `bald`), bangs (19 más `none`), hairColor, facialHair (none/goatee/full/chinstrap/short), glasses (none/round/square/wide), earrings (none/hoops/small/studs), headband, freckles, mole, outfit (tee/tank/strap/vneck/shirt/tie/vneckWide/raglan/jersey/hoodie/crew), top (color de la prenda, del 1 al 10) y background. Un validador traduce los avatares viejos (`short/long/curly/bun/buzz` y `earring` booleano; la chompa `sweater`, que se retiró, pasa a `tee`).
- Los temas de la búsqueda (`hobbies`, máximo 3) deben estar entre los intereses del usuario; si no, `start_search` responde 400. Ya no existe la lista fija de 6 temas.
- `interestDetails` = `{interés: {subtema | "general": [ejemplos]}}`. Se limpia en `users/details.py`: espacios, duplicados sin importar mayúsculas ni tildes, máximo 15 subtemas y 15 ejemplos por grupo, 80 caracteres por ejemplo. Enviar `interestDetails` reemplaza todos los detalles.
- Emparejamiento: puntaje = temas en común × 3 + intereses en común × 1 + subtemas en común × 2 + ejemplos en común × 4 (`affinity`). La comparación ignora mayúsculas y tildes. `MatchOut.sharedFavorites` lista los subtemas y ejemplos compartidos.
- Sugerencias (`modules/suggestions`): el backend llama a `kgsearch.googleapis.com` con `prefix=true`, `languages=es` y tipos schema.org según el interés (`catalog.py`). Reutiliza una sola conexión HTTP con Google, que se cierra en el `lifespan` de `main.py`. Guarda en caché 24 h, limita a 60 consultas por minuto por usuario y requiere `GOOGLE_KG_API_KEY` en `backend/.env`. Sin clave devuelve `[]` y la app sigue funcionando con texto libre. Nunca se repite una pareja. `pg_advisory_xact_lock` evita emparejamientos dobles. La búsqueda dura 24 h.
- `status_for` (desde la perspectiva de cada usuario): `active` → `deciding` (desde el día 7 hasta el 10) → `waiting` / `bloomed` (ambos siguen) / `rested`. `closed` significa que alguien salió o reportó. Un "no" de la otra persona no se revela mientras tú esperas.
- La planta (`stage`, de 0 a 5) = días en que ambos escribieron. Con `bloomed` queda en 5.
- Moderación (`core/moderation.py`): `classify(text)` devuelve `ok`, `mild` o `severe` usando listas de expresiones en español. Normaliza minúsculas, tildes, leet (1→i, 3→e…), signos, letras separadas y repeticiones de 3 o más. Al enviar un mensaje, `severe` responde 400 con `code: "blocked"` y `mild` sin `confirmed: true` responde 409 con `code: "gentle_check"`; ninguno descuenta del límite. `AppError` acepta `code`, y el frontend lo lee en `ApiError.code`. Los nombres y usernames con `classify != ok` se rechazan.
- Se puede escribir en `active` y `deciding` hasta el día 7; en `bloomed`, siempre. Tope de `MESSAGES_PER_DAY = 5` por persona y día.
- La pareja ve tu ánimo de las últimas 24 h en tu avatar si `share_mood` está activo.
- `GET /garden` oculta los matches que tú cerraste.

## Frontend (`frontend/src/`)

- `app/`: rutas de expo-router. `_layout` restaura la sesión (token en SecureStore, o `localStorage` en web) antes de mostrar nada. `index` redirige según el estado `onboarded`: con sesión y onboarding completo va a `/welcome` (la bienvenida con la semilla, que aparece cada vez que se abre la app), y si no, a `/onboarding`. `(tabs)/`: home, garden, exchange, profile y settings. Otras rutas: `conversation/[id]` (conexiones florecidas), `resetPassword`, `terms`, `avatarEditor` y `editInterests`.
- `features/`:
  - `auth`: login, registro, recuperar y restablecer contraseña.
  - `onboarding`: acuerdos → avatar → intereses → detalles → diapositivas, y al final guarda todo en un solo `PUT /users/me`. `interestDetailsEditor` muestra por interés los subtemas (de `constants/interestTaxonomy.ts`, que cubre los 77 intereses), los ejemplos por subtema y los ejemplos generales. `itemInput` ofrece autocompletado: espera 250 ms y pide al menos 2 letras. Guarda en el teléfono las respuestas ya recibidas y, mientras llega la nueva, muestra al instante las que coinciden con un prefijo ya consultado. Google tarda ~1 s en responder. `editInterests` reutiliza los dos pasos.
  - `exchange`:
    - `exchangeFlow` retoma una búsqueda en curso.
    - `themeSelectionScreen` muestra solo los intereses del usuario, agrupados por categoría.
    - `useMatching` consulta el estado de la búsqueda cada 3 s.
    - `conversationScreen` + `useConversation` consultan el match y los mensajes cada 4 s, solo con la pantalla enfocada.
    - `sparks.ts` genera las ideas para conversar: primero los gustos concretos compartidos (`sharedFavorites`), luego los temas y su categoría.
    - `matchFoundScreen` destaca "¡Coinciden en algo muy suyo!".
    - `safetySheet` maneja salir y reportar.
    - `conversationScreen` muestra la hoja "¿Lo reformulamos?" (Editar / Enviar igual) ante `gentle_check` y un aviso ante `blocked`; en ambos casos devuelve el texto al campo. `useConversation.send` devuelve un `SendOutcome`.
    - `decisionCard` y `outcomeScreen` cubren el cierre de la semana.
  - `garden`: grupos "Siguen floreciendo", "Creciendo ahora" y "Recuerdos".
  - `home`: check-in de ánimo (con respiración guiada si el ánimo es bajo) y tarjetas de estado.
  - `profile`: avatar, "Tu semana" y `avatarCustomizer`.
  - `settings`: compartir ánimo, acuerdos y cerrar sesión.
- `components/avatar/avatar.tsx`: avatar por capas a partir de los dibujos de la autora en `assets/svg/avatars/` (`base/skinTones.svg`, `girl/styles1-3.svg` y `boy/stylesBoy1-3.svg`, hojas con 4 figuras cada una). `parts.ts` guarda los trazos del pelo de atrás (`BACK_HAIR`: 12 de chica, 9 de chico y `bald` vacío), el flequillo (`FRONT_HAIR`: 9 de chica y 10 de chico, combinable con cualquier peinado del mismo grupo), las barbas (`BEARD_PATHS`), la ropa como capas (`OUTFIT_LAYERS`: `fill: "main"` toma el color elegido, `"shade"` una versión más oscura, y el resto son detalles con color fijo, como el cuello, la corbata o los cordones), los lentes, la diadema, las orejas y los aretes, ya llevados al marco de la primera figura de `skinTones.svg` (cabeza en 57, 41.5). Se generó con un script que traslada los paths. Si cambian las hojas, hay que regenerarlo. Orden de capas: pelo de atrás, cara, barba, ropa, lentes, flequillo (los lentes van debajo, como en `styles1.svg`), diadema y aretes. `kind` (`girl`/`boy`) decide qué peinados, flequillos, ropa, barba, diadema y aretes ofrece el editor (`forKind`); al cambiarlo se aplica `KIND_LOOK`. Los aretes son solo de chica (decisión de la autora) y no se dibujan si `kind` es `boy`. Piel, lentes, pecas, lunar y fondo son comunes. La barba usa `BEARD`: con el cabello negro toma el café del diseño (`#411B10`) y con los demás colores, el del cabello. La ropa tiene 10 colores (`TOP`, del 7 al 10 salen de los dibujos de chicos). `SKIN` tiene `base/blush/line/mouth`: los tonos 1–4 son los del diseño y 5–6 se agregaron. La boca usa `mouth`, que es más oscuro que el contorno, para que el ánimo se lea a 40 px. La expresión depende del ánimo (`mood`): ojos abiertos, felices o cerrados, y cinco bocas. `avatarCustomizer` muestra peinado, flequillo y ropa como miniaturas del propio avatar; elegir un peinado aplica su flequillo sugerido (`HAIR_STYLES[].bangs`).
- Los archivos de recursos se nombran en inglés.
- `components/avatar/moodFace.tsx`: muestra las caras de ánimo propias de `assets/svg/emotions/` con `expo-image`. Mapeo: fatal → `awful.svg`, mal → `bad.svg`, normal → `okay.svg`, bien → `good.svg`, feliz → `happy.svg` (los `MoodId` del código y de la API siguen en español).
- `components/layout/scenery.tsx`: fondo de Inicio y de la conversación activa con `assets/svg/background/home.svg` (hoy 495×996). Ocupa el ancho completo y el alto se calcula con la proporción real de la imagen, leída en `onLoad`, así que se puede reemplazar el SVG sin tocar código y el resto se rellena de blanco. Sobre él, `AppHeader onScenery` usa `primary-darker` por contraste. En Inicio el contenido va en una sola columna y ocupa todo el ancho (decisión de la autora: que se estire al ensanchar la ventana). La tarjeta de la conversación activa conserva un máximo de 560 px. Se usa en el selector de ánimo de Inicio y en "Tu semana" del Perfil.
- `welcomeScreen` usa `components/illustrations/welcomeSeed.tsx`: el dibujo de `assets/svg/semilla.svg` pasado a `react-native-svg` y separado en capas (raíces, brote, cuerpo y ojos), animadas con Reanimated. Llega con rebote junto con sus hojas, saluda, parpadea y flota. Los destellos están desactivados con `SHOW_SPARKLES = false`. Los pivotes se calculan con `translate` para que funcionen igual en web y nativo (no se usa `transformOrigin`), y se usan `ClipPath` en vez de `Mask`. Respeta `useReducedMotion`. El texto entra con `FadeInDown`/`FadeIn` escalonados. Si cambia `semilla.svg`, hay que actualizar los paths de este componente. Rive se probó y se retiró.
- `components/ui/`: `Button` (etiquetas con contraste AA), `Chip`, `Sheet` y `ConfirmSheet`. No uses `Alert`, que no funciona en web.
- `lib/nativewindInterop.ts`: registra `Animated.View`/`Animated.Text` de Reanimated para que acepten `className`. Sin esto, las clases no se aplican.
- `services/`: un servicio por módulo; ya no hay mocks. `api.ts` agrega el Bearer y limpia la sesión ante un 401.

## Convenciones de diseño

- Texto sobre fondos de la paleta: usar los tonos `dark-hover` / `dark-active` / `darker`. Nunca `text-white` sobre `*-normal`, ni `text-primary-normal(-active)` como color de texto (no pasan WCAG AA).
- Objetivos táctiles de al menos 40–48 px; el texto, de al menos 12 px.
- Sin métricas públicas, rachas ni notificaciones de enganche.
