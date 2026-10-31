# ECHOOM: cambios del prototipo para actualizar el documento de tesis

> **Para el asistente que lea este archivo.** Este documento acompaña al trabajo de grado *"Desarrollo de una aplicación móvil orientada a fomentar micro interacciones sociales positivas a través de mensajes breves"* (UMSS, 2026). Resume lo que se diseñó e implementó en el prototipo después de las fases Empatizar y Definir (capítulos 4 y 5), con el sustento de cada decisión. Úsalo para:
>
> 1. Redactar el **Capítulo 6 (Idear)** y el **Capítulo 7 (Prototipar)**.
> 2. Corregir las secciones del documento que ya no coinciden con el prototipo (sección 7 de este archivo).
> 3. Preparar el **Capítulo 8 (Testear)**, sin inventar resultados: la prueba piloto todavía no se realizó.
>
> Mantén el formato APA 7.ª edición y el estilo del documento original. Las citas aquí mencionadas ya están en el documento, salvo las de la sección 8.

---

## 1. Resumen del prototipo

ECHOOM es una aplicación móvil que empareja a dos jóvenes con gustos en común para conversar durante **siete días**, con **diez mensajes por persona al día**. Cada pareja cuida una **planta** que crece solo los días en que ambas personas se escriben. Al final de la semana, cada una decide en privado si quiere seguir en contacto; si ambas dicen que sí, la planta florece y la conversación continúa.

La aplicación no tiene likes, seguidores, contadores públicos ni rankings. Cada persona se representa con un **avatar ilustrado y personalizable** (nunca con una foto), que además refleja su estado de ánimo del día.

### Flujo principal

1. **Registro** (nombre, correo y contraseña).
2. **Onboarding:**
   1. "Un lugar seguro": acuerdos de convivencia y privacidad.
   2. Creación del avatar y del nombre visible.
   3. Elección de intereses (mínimo 3, de un catálogo de 77 en 11 categorías).
   4. "Cuéntanos más": subtemas y ejemplos concretos de cada interés (opcional).
   5. Tres diapositivas que explican cómo funciona la app.
3. **Ánimo al entrar e Inicio:** la primera vez del día, antes de entrar, una pantalla sobre el paisaje con sol pregunta "¿Cómo te sientes hoy?" (se puede saltar con "Ahora no"). Al tocar una cara se pide confirmar ("¿Así te sientes?" · "Sí, guardar" / "Elegir otra"), porque los registros no se pueden borrar (prevención de errores, Nielsen). En Inicio, el ánimo se puede actualizar durante el día y la tarjeta "Tu día" muestra el historial de hoy: una cinta con el color de cada registro y una línea de tiempo con la cara, el nombre y la hora (se ven 5 y el resto se desliza). También da acceso a la conversación y al jardín.
4. **Buscar a alguien:** se eligen hasta 3 temas de la semana entre los propios intereses, y el sistema busca a la persona más afín.
5. **Presentación:** "Esta semana conversarás con…" muestra el avatar de la otra persona y lo que tienen en común.
6. **Conversación de 7 días** con ideas para romper el hielo, el contador de mensajes y la planta.
7. **Decisión privada** a partir del día 7 (con 3 días de gracia) y pantalla de cierre.
8. **Jardín:** colección de las plantas de todas las conversaciones.

---

## 2. Cambios a la metodología (sección 1.6 y Cuadros 1.1 y 1.2)

El documento planteaba Unity, MongoDB y Blender. El prototipo se construyó con otras tecnologías:

| Componente | Planteado en el documento | Implementado | Motivo |
|---|---|---|---|
| Aplicación móvil | Unity | **React Native con Expo** (TypeScript) | Framework pensado para apps de interfaz (no para videojuegos); permite probar en el teléfono con Expo Go sin compilar, lo que facilita las pruebas piloto. También corre en navegador para pruebas. |
| Servidor (backend) | No especificado | **FastAPI** (Python) | API REST asíncrona, validación automática de datos y documentación interactiva de los endpoints. |
| Base de datos | MongoDB | **PostgreSQL** | Los datos son relacionales (usuarios, conversaciones, mensajes, decisiones). PostgreSQL además permite bloquear el emparejamiento para que dos búsquedas simultáneas no formen parejas duplicadas. |
| Avatares | Modelos 3D en Blender | **Avatar 2D vectorial (SVG)**, generado por código a partir de rasgos | Liviano, se personaliza en tiempo real y no requiere un motor 3D en el teléfono. |
| Ilustraciones | — | SVG propios de la autora (semilla de bienvenida, caras de ánimo, fondo de Inicio) | Identidad visual propia y coherente. |
| Autocompletado de gustos | — | **Google Knowledge Graph Search API** | Fuente externa y siempre actualizada de películas, series, bandas, videojuegos, libros, equipos y lugares. |
| Moderación | "APIs de moderación" | **Moderación local antes de enviar** (dos niveles) más reporte manual | Las APIs de moderación con clasificador (Google Cloud Natural Language) requieren cuenta de facturación, y Perspective API cierra en diciembre de 2026. Se implementó un detector local en español; el clasificador automático queda como trabajo futuro. |

**Plataforma:** el objetivo sigue siendo Android, según el alcance. La misma base de código funciona en navegador, lo que se aprovechó para pruebas internas.

**Calidad del software:** el servidor cuenta con **68 pruebas automatizadas** que verifican autenticación, perfil, emparejamiento, chat, reglas de la semana, jardín, reportes, sugerencias y moderación. Además, el flujo completo se probó con dos usuarios simulados en el navegador.

---

## 3. Capítulo 6: Idear

### 3.1. Técnica y criterio de selección

A partir de las preguntas **"¿Cómo podríamos...?"** (Figura 5.6) se generaron ideas para cada conocimiento. Siguiendo a Vargas Márquez et al. (2021), no todas se llevaron al prototipo: se seleccionaron las que cumplían tres criterios:

1. **Responden a un hallazgo consistente** de Empatizar y Definir: el Mapa de Motivaciones (tema en común 13/15, avatar 12/15, entorno sin hostilidad 6/15) o un factor del Capítulo 3.
2. **Tienen respaldo** en la literatura del marco teórico.
3. **No agregan carga cognitiva innecesaria** (Ley de Hick y Ley de Tesler; Yablonski, 2020). Las ideas que sumaban opciones sin resolver un dolor central se pospusieron.

### 3.2. Ideas seleccionadas

| Conocimiento (Fig. 5.6) | Pregunta | Idea seleccionada | Sustento |
|---|---|---|---|
| Compartir gustos para iniciar y sostener la conversación | ¿Cómo podríamos identificar los intereses antes de emparejar? | Elección de intereses en el onboarding; antes de cada búsqueda se eligen hasta 3 temas **solo entre los propios intereses**. | Mapa de Motivaciones (13/15); Liu et al. (2026); Usuarios 1 y 5. |
| ídem | ¿Cómo podríamos emparejar por gustos específicos? | **Jerarquía de intereses:** categoría → interés → subtema (género, estilo, liga…) → ejemplos concretos (una película, una banda). El emparejamiento da más peso a lo más específico. | Usuario 4 buscaba gustos "específicos y particulares"; el único contacto positivo que recordaba el Usuario 1 fue con alguien con su mismo videojuego. |
| ídem | ¿Cómo podríamos mostrar qué tienen en común antes de chatear? | Pantalla de presentación con los temas, los intereses y los gustos concretos compartidos ("¡Coinciden en algo muy suyo!"). | Causa raíz de los 5 ¿Por qué? (Usuario 1): "no sé de qué hablar". |
| ídem | ¿Cómo podríamos sugerir temas basados en gustos compartidos? | **Ideas para romper el hielo:** 3 sugerencias por día basadas en lo que comparten. Al tocarlas se escriben en el campo para editarlas; no se envían solas. | Usuario 1; personalización como factor principal del engagement, 27 % (Vakili, 2024); Ley de Hick (solo 3). |
| Avatar en vez de foto | ¿Cómo podríamos permitir que el avatar refleje la identidad real? | Avatar ilustrado por la autora y armado por capas. Primero se elige Chica (12 peinados, 9 flequillos, aretes, diadema y 7 prendas) o Chico (9 peinados más "Sin cabello", 10 flequillos, 4 barbas y 7 prendas). Para ambos: 6 tonos de piel, 6 colores de cabello, 3 lentes, pecas, lunar, 8 colores de ropa por grupo (los de chico, sin rosas ni lilas) y fondo. En el editor, los colores y las miniaturas van en una cuadrícula de 4 columnas para que se vean y se toquen con facilidad (Ley de Fitts). | Usuario 4 ("lentes, pelo largo, lunares, piercings"); Mapa de Motivaciones (12/15). |
| ídem | ¿Cómo podríamos hacer el avatar entretenido? | Botón "Sorpréndeme" y animación de respuesta en cada cambio. | Faceta "deseable" de Morville (2005); Efecto de Usabilidad Estética. |
| ídem (y comunicación "plana") | ¿Cómo podríamos compensar la falta de expresiones? | **El avatar muestra el ánimo del día** (ojos y boca). La otra persona lo ve, salvo que se desactive. | Causa raíz del Usuario 1: "no puedo ver expresiones, es muy plano"; Picard (1997). |
| ídem | ¿Cómo podríamos hacer que los mensajes no se sientan como texto plano? | **Tono del mensaje (opcional):** *con cariño, en broma, para animarte, con curiosidad, con gratitud* o *en serio*. La burbuja toma un tinte suave, una etiqueta con ícono y un gesto al llegar. | Causa raíz del Usuario 1; Picard (1997); Kruger et al. (2005): el tono escrito se entiende mucho peor de lo que cree quien escribe, sobre todo las bromas. |
| ídem | ¿Cómo podríamos responder a un mensaje sin gastar palabras? | **Reacciones con las cinco caras de la app** (*Me alegra, Me gusta, Entiendo, Lo siento, Te abrazo*), al mantener presionado un mensaje recibido. No descuentan de los 5 mensajes del día. | Deseo del Usuario 1 ("reacciones más variadas"); Derks et al. (2008); Ley de Hick (las opciones aparecen solo al pedirlas). |
| Temor a la hostilidad | ¿Cómo podríamos dar reporte y bloqueo sin interrumpir? | Ícono de escudo en la conversación → "Tu bienestar es primero": salir o reportar con motivo. La otra persona no ve el motivo y no vuelven a coincidir. | Mapa de Motivaciones (6/15); Usuarios 4 y 5; Shneiderman (manejo amable de errores). |
| ídem | ¿Cómo podríamos reducir el hate o la toxicidad dentro de la app? | **Moderación antes de enviar en dos niveles:** pausa amable "¿Lo reformulamos?" para lo leve y bloqueo para lo grave. | Katsaros et al. (2022); Gross (1998); Shneiderman. Garantiza que las micro interacciones sean *positivas*, como dice el objetivo general. |
| ídem | ¿Cómo podríamos transmitir confianza antes de la primera conversación? | Pantalla "Un lugar seguro" con acuerdos breves y recordatorio de que se puede salir cuando se quiera. | Síntesis de Empatizar (4.4), necesidad (d). |
| Pocos vínculos pero significativos | ¿Cómo podríamos priorizar la calidad sobre la cantidad? | Una conversación a la vez, 7 días, 10 mensajes por día (hasta 500 caracteres). | Takano (2018); "número razonable de mensajes", 15 % (Vakili, 2024); Saffer (2013). Los 500 caracteres atienden la reserva del Usuario 4. |
| ídem | ¿Cómo podríamos hacer que cada mensaje se sienta significativo? | **Planta que crece solo los días en que ambos escriben**, con una micro-interacción al crecer. Nunca se marchita. | Godard y Holtzman (2024): el uso activo y recíproco se asocia con bienestar (r = 0,15) y apoyo percibido (r = 0,34). |
| ídem | ¿Cómo podríamos sostener un vínculo esporádico? | Decisión privada al final; si ambos siguen, la planta florece y la conversación queda abierta. | POV; Regla del Pico-Final (se cuida el cierre). |
| ídem | ¿Cómo podríamos medir el éxito en bienestar y no en uso? | Registro diario del ánimo y vista privada "Tu semana". Sin rachas ni notificaciones de enganche. | Feng et al. (2026); Gross (1998); insumo para la prueba piloto. |
| Mensajes positivos sin métricas | ¿Cómo podríamos sugerir mensajes positivos cuando no se sabe qué decir? | Frases de validación mezcladas en las ideas ("Gracias por quedarte en la conversación"). | Pedido explícito del Usuario 1; Clark, Algoe y Green (2018). |
| ídem | ¿Cómo podríamos evitar métricas de comparación? | Ningún contador público: el jardín muestra plantas, no números. | Factor 4 del Capítulo 3; límites del alcance. |
| ídem | ¿Cómo podríamos hacer que la app acompañe en un mal día? | Respuestas empáticas al ánimo y, si es bajo, una **pantalla de respiración guiada** (3 respiraciones lentas, unos 30 s, en el color de la emoción) que se abre antes de seguir y se puede saltar. | Eisenstadt et al. (2021): regulación emocional instantánea. |

### 3.3. Ideas descartadas o pospuestas

| Idea | Decisión | Razón |
|---|---|---|
| "Mundo de conexiones" con estadísticas globales | Descartada | Introducía métricas públicas y comparación social (factor 4). |
| Notificaciones push y rachas diarias | Descartada | Pueden fomentar el uso compulsivo, asociado a la soledad (Feng et al., 2026). |
| Mensajes largos tipo "story time" (Usuario 4) | Atendida parcialmente | 500 caracteres por mensaje, sin un formato especial que rompa la micro-interacción. |
| Debates de opinión (Usuario 4) | Descartada | Fuera del alcance (sin comunicación grupal). |
| Avatar 3D | Reemplazada | Avatar 2D en SVG (ver sección 2). |
| Lista fija de 6 temas para buscar pareja | Reemplazada | Mostraba temas que la persona no eligió; ahora se usan sus propios intereses. |

---

## 4. Capítulo 7: Prototipar

### 4.1. Arquitectura

Arquitectura cliente-servidor (figura en `docs/figures/architecture.png`; su fuente editable es `architecture.html`):

- **Cliente:** aplicación React Native (Expo) organizada por funcionalidades: autenticación, onboarding, inicio, conversación, jardín, perfil y ajustes.
- **Servidor:** API REST en FastAPI, organizada en módulos: autenticación, usuarios, ánimo, emparejamiento, chat, jardín y sugerencias.
- **Base de datos:** PostgreSQL, con migraciones versionadas (Alembic).
- **Servicio externo:** Google Knowledge Graph Search, consultado solo desde el servidor para proteger la clave.

La app consulta al servidor cada pocos segundos para recibir mensajes nuevos y saber si ya se encontró pareja (cada 4 s en la conversación y cada 3–5 s durante la búsqueda), y solo mientras la pantalla está visible.

**Despliegue (para la evaluación con participantes):** todo en planes gratuitos y sin tarjeta de crédito. Detalles en `docs/despliegue.md`.
- La API y la versión web se publican en Render, que las vuelve a publicar con cada cambio en GitHub.
- La base de datos está en Neon (PostgreSQL administrado).
- Los correos con códigos se envían con la API de Brevo, porque el plan gratuito de Render bloquea SMTP.
- En Android, la app se instala como APK generado con EAS Build de Expo.
- En iPhone se usa la versión web, ya que publicar en iOS requiere la cuenta de pago de Apple.
- **Limitación:** el servidor gratuito se suspende tras 15 minutos sin uso, y la primera petición después tarda entre 30 y 50 segundos. Antes de cada sesión de prueba conviene abrir la app para despertarlo.

### 4.2. Reglas de la interacción

| Regla | Valor |
|---|---|
| Duración de una conversación | 7 días |
| Días de gracia para decidir | 3 (del día 7 al 10) |
| Mensajes por persona y por día | 10 (se subió de 5: un "jajaja" gastaba un mensaje entero) |
| Largo máximo de un mensaje | 500 caracteres |
| Tonos de mensaje | 6, opcionales |
| Reacciones | 5 caras, una por mensaje recibido; no cuentan como mensaje |
| Etapas de la planta | 7, una por día de la semana: semilla, brote, tallito, primeras hojas, capullo, capullo creciendo y flor completa. Avanza una por cada día en que ambos escriben; si ambos deciden seguir, queda en flor. |
| Ánimo visible para la pareja | Solo el de las últimas 24 h, y se puede desactivar |
| Duración de una búsqueda | Hasta 24 h; se puede salir y la búsqueda sigue |
| Temas por búsqueda | Hasta 3, entre los propios intereses |
| Intereses mínimos | 3 |

Estos valores son **hipótesis de diseño** que conviene validar en la prueba piloto.

### 4.3. Algoritmo de emparejamiento

Cuando alguien busca, el sistema compara a esa persona con quienes están buscando al mismo tiempo y elige a la de mayor puntaje:

> **Puntaje = 3 × temas en común + 1 × intereses en común + 2 × subtemas en común + 4 × ejemplos en común**

- **Solo se empareja a quienes comparten al menos uno de los temas que eligieron al buscar.** Entre ellos, gana el mayor puntaje.
- Lo más específico pesa más: compartir una película concreta vale más que compartir "Películas".
- En el chat se ven los temas compartidos, y cada día se revela una coincidencia más ("Hoy descubrieron: a los dos les gusta *Interestelar*"), de la más específica a la más general (Byrne, 1971; Alves, 2018; Aron et al., 1997).
- La comparación ignora mayúsculas, espacios y tildes ("Iron Man 2" = "iron man 2").
- **Nunca se repite una pareja.**
- Si dos personas buscan exactamente al mismo tiempo, un bloqueo en la base de datos evita que se formen parejas duplicadas.

### 4.4. Jerarquía de intereses y autocompletado

- **Catálogo:** 11 categorías y 77 intereses. Cada interés tiene sus propios subtemas; por ejemplo, Películas tiene géneros, Rock tiene estilos y Fútbol tiene ligas.
- En cada interés se pueden agregar ejemplos dentro de un subtema (Películas → Acción → *Iron Man 2*) o en general (Películas → *Coco*). Todo es opcional.
- **Autocompletado:** al escribir un ejemplo, la app sugiere nombres reales mediante Google Knowledge Graph Search, filtrados por tipo según el interés. Por ejemplo, en Películas solo sugiere películas; en Rock, bandas y artistas; en Fútbol, equipos y jugadores. Siempre se puede escribir texto libre.
- **Rendimiento:** Google tarda alrededor de 1 s en responder. Para que la interfaz reaccione antes de 400 ms (Umbral de Doherty), la app muestra al instante las sugerencias ya recibidas que coinciden con lo que se va escribiendo, y el servidor guarda las respuestas por 24 h y reutiliza la conexión.

### 4.5. Seguridad y privacidad

- Contraseñas guardadas con hash Argon2. Se exigen 8 caracteres, una mayúscula, un número y un símbolo.
- Sesión con token JWT válido 7 días, guardado en el almacenamiento seguro del teléfono.
- **Correo confirmado.** Al registrarse, llega al correo un código de 6 números que se escribe en la app ("Confirma tu correo"). Sin confirmarlo no se puede buscar pareja: así se reducen las cuentas falsas en un espacio donde se conversa con desconocidos.
- **Recuperar la contraseña con un código** de 6 números enviado por correo (no con un enlace, que en el teléfono abriría el navegador). Los códigos vencen en 15 minutos, solo vale el último pedido y se anulan tras 5 intentos fallidos. Se pueden pedir de nuevo cada 60 segundos.
- Límite de intentos de inicio de sesión, de recuperación de contraseña y de códigos.
- No se piden fotos. El ánimo compartido es opcional. La decisión final es privada, y un "no" de la otra persona no se revela mientras uno espera.
- Reporte con motivo (me hizo sentir incómodo/a, contenido ofensivo, acoso o presión, spam, otro) y comentario opcional. La conversación se cierra y la pareja no vuelve a formarse.
- **Moderación antes de enviar.** Cada mensaje se analiza en el servidor antes de guardarse, así que la regla no se puede saltar desde la app:
  - **Leve** (tono brusco, burlas, "cállate", "eres tonto"): aparece "¿Lo reformulamos?" con el mensaje, y las opciones **Editar mensaje** o **Enviar igual**. No castiga: invita a reconsiderar.
  - **Grave** (insultos fuertes, amenazas, acoso sexual, incitación a autolesión): "Este mensaje no cuida a la otra persona, así que no lo enviamos". No descuenta del límite diario y el texto vuelve al campo para reformularlo.
  - El detector reconoce disfraces comunes: letras separadas ("p u t a"), números por letras ("h1j0"), signos entre letras, tildes y letras alargadas ("tooonto"). Además evita falsos positivos con palabras inocentes, como "zorra" o "perra" referidas a animales.
  - También se rechazan nombres de usuario ofensivos.
  - **Limitación:** es una lista de expresiones, no un modelo que entienda el contexto. Puede no detectar ofensas nuevas o muy sutiles; un clasificador automático queda como trabajo futuro.
- Los acuerdos aclaran que **ECHOOM no reemplaza la ayuda profesional**.

### 4.6. Sistema de diseño (IHC Afectiva y UX/UI emocional)

**Paleta:** cálida y natural, con durazno (principal), verde (crecimiento, acciones positivas) y celeste (calma, ayuda), más 5 colores para los estados de ánimo.

**Tipografía:** Poppins para títulos y Quicksand para textos, con una escala Major Second (1,125). El tamaño mínimo es de 12 px. Heading 1 (36 px) marca los momentos de llegada (tu nombre en la bienvenida); los títulos de pestañas usan Heading 3 (28 px), y los de tarjetas y secciones, Subtitle 2 (20 px). Los títulos y subtítulos usan un café cálido de la paleta (#916646, el mismo del logo), y el texto, un café más profundo (#6D4D34). Los subtítulos y los saludos van en negrita. El saludo de Inicio, que queda sobre la ilustración de la colina, usa el café siguiente de la escala (#6D4D34) para mantener el contraste. Se eligió el tono más claro que sigue cumpliendo WCAG 2.2: los títulos, y los subtítulos en negrita, cuentan como texto grande y piden 3:1; el café cálido da 4,1:1 o más en todos los fondos. El tono #DA9968 que se consideró solo llegaba a 2,3:1.

**Accesibilidad:** se midió el contraste con WCAG 2.2 y se corrigió sin abandonar la paleta:

| Elemento | Antes | Después |
|---|---|---|
| Texto blanco sobre botón durazno | 1,95:1 | Café oscuro sobre durazno: **5,27:1** |
| Botones verdes y celestes | 1,86:1 y 1,62:1 | **5,30:1 y 5,71:1** |
| Enlaces | 2,84:1 | 4,72:1 – 7,17:1 |
| Logo y saludo sobre el fondo verde de Inicio | 2,98:1 | **6,1:1** |

Los objetivos táctiles miden al menos 40–48 px (Ley de Fitts).

**Ilustraciones propias de la autora:**
- Semilla en la pantalla de bienvenida.
- Cinco caras de ánimo (fatal, mal, normal, bien, feliz).
- Fondo de Inicio con cielo, nubes, una montaña, un árbol y hierba, que se adapta a cualquier ancho de pantalla sin deformarse y se mueve con suavidad: las nubes van y vienen, la hierba se mece y la montaña se mueve despacio; el árbol y el suelo quedan quietos (tecnología calmada, Weiser y Brown, 1996).
- Avatares: cuatro tonos de piel base y, para chicas y chicos, peinados, flequillos, barbas, lentes, aretes, diadema y prendas dibujados por separado para combinarlos. En las prendas de varias piezas (camisa con cuello, corbata, capucha), el color elegido se aplica a la parte principal y los detalles conservan el color del diseño. La app suma dos tonos de piel más profundos. Al personalizar, cada opción se muestra como una miniatura del propio avatar (reconocer antes que recordar).

**Micro-interacciones:**
- La primera vez del día que se abre la conversación aparece una pantalla breve con la planta sobre un paisaje animado (nubes, sol y colinas que se mecen con la brisa): si creció desde la última visita, se la ve crecer con destellos ("¡Su planta creció!"); si no, recorre sus etapas y recuerda que hoy pueden hacerla crecer. Luego, "Ir a la conversación".
- La planta (ilustración propia en 7 etapas) crece desde la tierra con un pequeño rebote cada vez que sube de etapa, con el aviso "¡Su planta creció!". Al abrir el jardín o la conversación, recorre sus etapas desde la semilla como un time-lapse.
- Animación de búsqueda con mensajes que cambian.
- El avatar "salta" al personalizarlo.
- **Avatares redibujados:** la ropa llega hasta la línea del piso y cubre todo el ancho del cuerpo, y las manos son círculos. Así, cuando el avatar vivo sube las manos para saludar o celebrar, no asoman esquinas de piel ni de la prenda de abajo (principio de "dibujo sólido", Thomas y Johnston, 1981).
- **Avatar vivo:** respira, parpadea y se mece según su ánimo. Saluda inclinando un poco el cuerpo y moviendo la bolita de la mano a la altura del hombro (no tiene brazos), celebra con las dos manos a la altura de los hombros y un rebote, y asiente. En Inicio saluda al entrar y al tocarlo, reacciona al ánimo que guardas (celebra, saluda o asiente) y cada tanto mira a los lados o se estira; con ánimo bajo respira más lento y no sonríe a la fuerza. La otra persona te saluda al encontrarse y celebra cuando florecen (efecto de persona, Lester et al., 1997).
- La cara elegida se agranda al registrar el ánimo.
- Respiración guiada a pantalla completa cuando el ánimo es "Mal" o "Fatal": un círculo crece al inhalar (4 s) y se encoge al exhalar (6 s), con un halo translúcido detrás que se expande todavía más. En el centro, la cara de la emoción respira con la persona: cierra los ojos, se estira al inhalar y sopla con la boca en "o" al exhalar mientras ondas suaves se alejan del círculo y se desvanecen, durante 3 respiraciones, con fondo en el color de la emoción. Busca que la persona no entre a la conversación desde el malestar (regulación previa; Gross, 1998). Al final pregunta, opcionalmente, cómo se siente ahora: sirve como medición antes/después.
- Las caras de ánimo expresan su emoción todo el tiempo, animadas por partes: feliz da saltitos, bien se mece y sonríe, normal mira a los lados y tuerce la boca, mal suspira y mira hacia abajo, y fatal se balancea despacio con los ojos bajos. Todas parpadean y, al elegir una, reacciona. Luego la tarjeta se recoge en un resumen ("Hoy te sientes bien · Cambiar").
- Nueva barra de navegación con una muesca central para el botón de "Conversar"; el ícono de la pestaña elegida da un saltito.
- Botones y chips se hunden un poco al tocarlos y vuelven con un rebote suave.
- Los mensajes con tono entran con un gesto propio (el corazón late, la carita se ríe, el sol gira) y las reacciones aparecen con un pequeño rebote.
- Pantalla de cierre de la semana, que cuida el final de la experiencia (Regla del Pico-Final).
- Bienvenida animada: la semilla llega con sus hojas, saluda con ellas, parpadea y flota, y después aparece el texto "Te damos la bienvenida". Es el primer momento de cada sesión (Regla del Pico-Final). Con "Reducir movimiento" activado, se muestra quieta.

**Jardín:** es un lugar, no una lista. Sobre un paisaje animado propio, las plantas quedan plantadas en las colinas, de izquierda a derecha y cada una un poco más arriba, como si el jardín subiera la colina; si hay muchas, se desliza hacia la derecha. Sobre cada planta hay una etiqueta con la foto, el nombre y la fecha; se mecen con la brisa y por todo el jardín vuelan mariposas. Al tocar una planta se abre una **postal de esa semana**: lo que descubrieron en común, las reacciones que se regalaron, el tono con que más se escribieron y el primer mensaje. Todo sin números ni rachas, y sin plantas que se marchiten (Norman, 2004; Regla del Pico-Final).

**Sonidos (propios, sintetizados para la app):** suaves, de menos de 4 segundos, y solo en momentos con significado (Gaver, 1986; Blattner, Sumikawa y Greenberg, 1989; tecnología calmada de Weiser y Brown, 1996):
- Cada ánimo suena distinto al elegirlo: un arpegio alegre para "feliz" y un tono grave y cálido para "fatal". Ninguno suena a error.
- En la respiración guiada, un cuenco marca el inicio de inhalar y otro el de exhalar, así se puede seguir con los ojos cerrados. Una campanita marca el final.
- La planta suena al crecer, la flor al florecer y hay un aviso al encontrar pareja. En el jardín, al abrir el recuerdo de una planta suena una cajita de música.
- Al enviar, al recibir un mensaje con la conversación abierta y al reaccionar.
- No suenan los botones ni las pestañas. Se apagan en Ajustes → Sonido, respetan el modo silencio del teléfono y no pausan la música de la persona. El sonido nunca es el único aviso: todo se ve también en pantalla.

**Lenguaje:** mensajes en segunda persona, cálidos y sin culpa ("Ya compartiste tus mensajes de hoy. Mañana podrás escribir de nuevo"; "Cerrar aquí" en vez de "Mejor no").

**Diseño adaptable:** la interfaz se adapta a teléfonos pequeños, grandes y tablets. En Inicio, el contenido ocupa todo el ancho y conserva el orden del teléfono.

### 4.7. Iteraciones durante el desarrollo

Al revisar el prototipo, la autora detectó problemas que llevaron a cambios. Esto ilustra el carácter iterativo del Design Thinking:

1. **Temas de búsqueda:** se mostraban 6 temas fijos aunque la persona hubiera elegido otros intereses. Se cambió a mostrar solo sus intereses.
2. **Búsqueda en segundo plano:** no quedaba claro cómo retomar una búsqueda. La tarjeta de Inicio ahora se actualiza sola y avisa "¡Encontramos a alguien!".
3. **Animación de bienvenida:** se probó una animación en Rive, pero no funciona en Expo Go (la herramienta de las pruebas piloto). Se reemplazó por una ilustración SVG propia.
4. **Ancho en pantallas grandes:** se probaron un ancho máximo y luego dos columnas. La autora prefirió una sola columna que ocupe todo el ancho.
5. **Gustos específicos:** se agregó la jerarquía de subtemas y ejemplos con autocompletado, para que el emparejamiento por afinidad sea más preciso.
6. **Retroalimentación del autocompletado:** cuando no hay sugerencias se avisa "Sin sugerencias. Toca + para agregarlo tal como lo escribiste" (visibilidad del estado del sistema; Norman, 2013). También se redujo el tiempo de espera percibido.
7. **Interacciones positivas:** al preparar la presentación, la autora notó que el objetivo habla de micro interacciones *positivas* y que nada impedía enviar un mensaje ofensivo. Se agregó la moderación en dos niveles antes de enviar.

---

## 5. Preparación del Capítulo 8 (Testear)

> No hay resultados todavía. Esta sección solo propone qué evaluar.

**Datos que el prototipo ya registra y pueden usarse en el análisis** (con consentimiento informado):
- Registros diarios de ánimo (escala de 5 niveles) de cada participante.
- Cantidad de días recíprocos por pareja (la etapa de la planta).
- Decisiones finales: seguir, cerrar o sin respuesta.
- Reportes y conversaciones cerradas antes de tiempo.

**Hipótesis de diseño a validar:**
- ¿Diez mensajes al día se sienten suficientes, limitantes o demasiados?
- ¿La pantalla de ánimo al entrar se siente como un ritual agradable o como una obligación?
- ¿Las coincidencias que se revelan cada día ("Hoy descubrieron…") ayudan a seguir la conversación?
- ¿Siete días es una duración adecuada?
- ¿Las ideas para romper el hielo ayudan a iniciar la conversación?
- ¿Ver el ánimo de la otra persona en su avatar aporta cercanía o incomoda?
- ¿Coincidir en gustos específicos hace la conversación más fluida que coincidir solo en intereses generales?
- ¿La planta motiva a escribir sin generar presión?
- ¿La pausa "¿Lo reformulamos?" se percibe como cuidado o como censura? ¿Hubo falsos positivos?

**Instrumentos sugeridos** (coherentes con la sección 1.6.3): observación con *Think Aloud*, un cuestionario de usabilidad estandarizado (por ejemplo, SUS) y preguntas abiertas sobre la experiencia emocional.

---

## 6. Datos para describir el prototipo con precisión

- **Categorías de intereses (11):** Entretenimiento, Música, Cultura, Cocina y gastronomía, Bebidas, Deportes, Actividades al aire libre, Estilo de vida, Bienestar, Creatividad, Social y comunidad.
- **Estados de ánimo (5):** fatal, mal, normal, bien, feliz.
- **Pantallas principales:**
  - Inicio: ánimo, avatar, conversación y jardín.
  - Conversar: búsqueda, presentación y conversación.
  - Jardín: "Siguen floreciendo", "Creciendo ahora" y "Recuerdos".
  - Perfil: avatar, intereses y "Tu semana".
  - Ajustes: mostrar el ánimo, acuerdos, cambiar contraseña y cerrar sesión.

---

## 7. Correcciones necesarias en el documento actual

1. **Metodología (1.6.2, Cuadro 1.1 y Cuadro 1.2):** reemplazar Unity, MongoDB y Blender por las tecnologías de la sección 2. Ajustar el cronograma ("Configuración de Unity y MongoDB" → "Configuración de React Native/Expo, FastAPI y PostgreSQL"; "Integración de modelos 3D" → "Diseño e integración de avatares e ilustraciones SVG").
2. **Edad:** el alcance indica 16 a 28 años, y la app ahora pide 16 años o más (antes decía 18). Al incluir menores de edad, la prueba piloto requiere **consentimiento informado de madre, padre o tutor**. Revisarlo con la tutora.
3. **Sección 2.2 (Computación afectiva e IHC Afectiva):** hoy repite el contenido de la sección 2.1. Conviene reescribirla con Picard (1997), que ya está en las referencias.
4. **Fuentes secundarias (1.6.2):** cambiar "Documentación técnica de Unity, MongoDB, Blender y APIs de moderación" por la documentación de React Native/Expo, FastAPI, PostgreSQL y Google Knowledge Graph Search API.
5. **Referencias:** completar las fichas marcadas como pendientes en la sección B del documento.
6. **Nombre de la app:** ahora se llama **ECHOOM** (antes ECCO). Hay que cambiarlo en todo el documento, en las figuras y en las capturas de pantalla.

---

## 8. Referencias nuevas para agregar (APA 7)

- Kruger, N., Epley, N., Parker, J., & Ng, Z.-W. (2005). Egocentrism over e-mail: Can we communicate as well as we think? *Journal of Personality and Social Psychology, 89*(6), 925–936. https://doi.org/10.1037/0022-3514.89.6.925
- Lester, J. C., Converse, S. A., Kahler, S. E., Barlow, S. T., Stone, B. A., & Bhogal, R. S. (1997). The persona effect: Affective impact of animated pedagogical agents. En *Proceedings of the ACM SIGCHI Conference on Human Factors in Computing Systems* (pp. 359–366). ACM. https://doi.org/10.1145/258549.258797
- Shiffman, S., Stone, A. A., & Hufford, M. R. (2008). Ecological momentary assessment. *Annual Review of Clinical Psychology, 4*, 1–32. https://doi.org/10.1146/annurev.clinpsy.3.022806.091415
- Peters, D., Calvo, R. A., & Ryan, R. M. (2018). Designing for motivation, engagement and wellbeing in digital experience. *Frontiers in Psychology, 9*, 797. https://doi.org/10.3389/fpsyg.2018.00797
- Byrne, D. (1971). *The attraction paradigm*. Academic Press.
- Alves, H. (2018). Sharing rare attitudes attracts. *Personality and Social Psychology Bulletin, 44*(8), 1270–1283. https://doi.org/10.1177/0146167218766861
- Aron, A., Melinat, E., Aron, E. N., Vallone, R. D., & Bator, R. J. (1997). The experimental generation of interpersonal closeness: A procedure and some preliminary findings. *Personality and Social Psychology Bulletin, 23*(4), 363–377. https://doi.org/10.1177/0146167297234003
- Norman, D. A. (2004). *Emotional design: Why we love (or hate) everyday things*. Basic Books.
- Gaver, W. W. (1986). Auditory icons: Using sound in computer interfaces. *Human–Computer Interaction, 2*(2), 167–177. https://doi.org/10.1207/s15327051hci0202_3
- Blattner, M. M., Sumikawa, D. A., & Greenberg, R. M. (1989). Earcons and icons: Their structure and common design principles. *Human–Computer Interaction, 4*(1), 11–44. https://doi.org/10.1207/s15327051hci0401_1
- Thomas, F., & Johnston, O. (1981). *Disney animation: The illusion of life*. Abbeville Press.
- Weiser, M., & Brown, J. S. (1996). Designing calm technology. *PowerGrid Journal, 1*(1).
- Derks, D., Fischer, A. H., & Bos, A. E. R. (2008). The role of emotion in computer-mediated communication: A review. *Computers in Human Behavior, 24*(3), 766–785. https://doi.org/10.1016/j.chb.2007.04.004
- Gross, J. J. (1998). The emerging field of emotion regulation: An integrative review. *Review of General Psychology, 2*(3), 271–299. https://doi.org/10.1037/1089-2680.2.3.271
- Lehrer, P. M., & Gevirtz, R. (2014). Heart rate variability biofeedback: How and why does it work? *Frontiers in Psychology, 5*, 756. https://doi.org/10.3389/fpsyg.2014.00756
- Lieberman, M. D., Eisenberger, N. I., Crockett, M. J., Tom, S. M., Pfeifer, J. H., & Way, B. M. (2007). Putting feelings into words: Affect labeling disrupts amygdala activity in response to affective stimuli. *Psychological Science, 18*(5), 421–428. https://doi.org/10.1111/j.1467-9280.2007.01916.x
- Zaccaro, A., Piarulli, A., Laurino, M., Garbella, E., Menicucci, D., Neri, B., & Gemignani, A. (2018). How breath-control can change your life: A systematic review on psycho-physiological correlates of slow breathing. *Frontiers in Human Neuroscience, 12*, 353. https://doi.org/10.3389/fnhum.2018.00353
- Google. (s. f.). *Knowledge Graph Search API*. Google for Developers. https://developers.google.com/knowledge-graph
- Katsaros, M., Yang, K., & Fratamico, L. (2022). Reconsidering tweets: Intervening during tweet creation decreases offensive content. *Proceedings of the International AAAI Conference on Web and Social Media, 16*, 477–487. https://ojs.aaai.org/index.php/ICWSM/article/view/19308 *[verificar páginas]*
- W3C. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/
- Eisenstadt, M., Liverpool, S., Infanti, E., Ciuvat, R. M., & Carlsson, C. (2021). Mobile apps that promote emotion regulation, positive mental health, and well-being in the general population: Systematic review and meta-analysis. *JMIR Mental Health, 8*(11), e31170. https://doi.org/10.2196/31170 (ya está en el documento; antes se atribuía por error a "Baudon y Jachens").
- *Social connection as a key target for youth mental health* (2025). ScienceDirect. https://www.sciencedirect.com/science/article/pii/S2212657025000054 *[completar autores y revista]*
- Si se usa en la prueba piloto: Brooke, J. (1996). SUS: A "quick and dirty" usability scale. En P. W. Jordan, B. Thomas, B. A. Weerdmeester y I. L. McClelland (Eds.), *Usability evaluation in industry* (pp. 189–194). Taylor & Francis. *[verificar]*
