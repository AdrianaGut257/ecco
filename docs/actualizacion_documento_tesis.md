# ECCO: cambios del prototipo para actualizar el documento de tesis

> **Para el asistente que lea este archivo.** Este documento acompaña al trabajo de grado *"Desarrollo de una aplicación móvil orientada a fomentar micro interacciones sociales positivas a través de mensajes breves"* (UMSS, 2026). Resume lo que se diseñó e implementó en el prototipo después de las fases Empatizar y Definir (capítulos 4 y 5), con el sustento de cada decisión. Úsalo para:
>
> 1. Redactar el **Capítulo 6 (Idear)** y el **Capítulo 7 (Prototipar)**.
> 2. Corregir las secciones del documento que ya no coinciden con el prototipo (sección 7 de este archivo).
> 3. Preparar el **Capítulo 8 (Testear)**, sin inventar resultados: la prueba piloto todavía no se realizó.
>
> Mantén el formato APA 7.ª edición y el estilo del documento original. Las citas aquí mencionadas ya están en el documento, salvo las de la sección 8.

---

## 1. Resumen del prototipo

ECCO es una aplicación móvil que empareja a dos jóvenes con gustos en común para conversar durante **siete días**, con **cinco mensajes por persona al día**. Cada pareja cuida una **planta** que crece solo los días en que ambas personas se escriben. Al final de la semana, cada una decide en privado si quiere seguir en contacto; si ambas dicen que sí, la planta florece y la conversación continúa.

La aplicación no tiene likes, seguidores, contadores públicos ni rankings. Cada persona se representa con un **avatar ilustrado y personalizable** (nunca con una foto), que además refleja su estado de ánimo del día.

### Flujo principal

1. **Registro** (nombre, correo y contraseña).
2. **Onboarding:**
   1. "Un lugar seguro": acuerdos de convivencia y privacidad.
   2. Creación del avatar y del nombre visible.
   3. Elección de intereses (mínimo 3, de un catálogo de 77 en 11 categorías).
   4. "Cuéntanos más": subtemas y ejemplos concretos de cada interés (opcional).
   5. Tres diapositivas que explican cómo funciona la app.
3. **Inicio:** registro del ánimo del día ("¿Cómo te sientes hoy?") y acceso a la conversación y al jardín.
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
| Avatar en vez de foto | ¿Cómo podríamos permitir que el avatar refleje la identidad real? | Avatar personalizable: 6 tonos de piel, 5 peinados, 6 colores de cabello, lentes, pecas, lunar, arete, ropa y fondo. | Usuario 4 ("lentes, pelo largo, lunares, piercings"); Mapa de Motivaciones (12/15). |
| ídem | ¿Cómo podríamos hacer el avatar entretenido? | Botón "Sorpréndeme" y animación de respuesta en cada cambio. | Faceta "deseable" de Morville (2005); Efecto de Usabilidad Estética. |
| ídem (y comunicación "plana") | ¿Cómo podríamos compensar la falta de expresiones? | **El avatar muestra el ánimo del día** (ojos, cejas y boca). La otra persona lo ve, salvo que se desactive. | Causa raíz del Usuario 1: "no puedo ver expresiones, es muy plano"; Picard (1997). |
| Temor a la hostilidad | ¿Cómo podríamos dar reporte y bloqueo sin interrumpir? | Ícono de escudo en la conversación → "Tu bienestar es primero": salir o reportar con motivo. La otra persona no ve el motivo y no vuelven a coincidir. | Mapa de Motivaciones (6/15); Usuarios 4 y 5; Shneiderman (manejo amable de errores). |
| ídem | ¿Cómo podríamos reducir el hate o la toxicidad dentro de la app? | **Moderación antes de enviar en dos niveles:** pausa amable "¿Lo reformulamos?" para lo leve y bloqueo para lo grave. | Katsaros et al. (2022); Gross (1998); Shneiderman. Garantiza que las micro interacciones sean *positivas*, como dice el objetivo general. |
| ídem | ¿Cómo podríamos transmitir confianza antes de la primera conversación? | Pantalla "Un lugar seguro" con acuerdos breves y recordatorio de que se puede salir cuando se quiera. | Síntesis de Empatizar (4.4), necesidad (d). |
| Pocos vínculos pero significativos | ¿Cómo podríamos priorizar la calidad sobre la cantidad? | Una conversación a la vez, 7 días, 5 mensajes por día (hasta 500 caracteres). | Takano (2018); "número razonable de mensajes", 15 % (Vakili, 2024); Saffer (2013). Los 500 caracteres atienden la reserva del Usuario 4. |
| ídem | ¿Cómo podríamos hacer que cada mensaje se sienta significativo? | **Planta que crece solo los días en que ambos escriben**, con una micro-interacción al crecer. Nunca se marchita. | Godard y Holtzman (2024): el uso activo y recíproco se asocia con bienestar (r = 0,15) y apoyo percibido (r = 0,34). |
| ídem | ¿Cómo podríamos sostener un vínculo esporádico? | Decisión privada al final; si ambos siguen, la planta florece y la conversación queda abierta. | POV; Regla del Pico-Final (se cuida el cierre). |
| ídem | ¿Cómo podríamos medir el éxito en bienestar y no en uso? | Registro diario del ánimo y vista privada "Tu semana". Sin rachas ni notificaciones de enganche. | Feng et al. (2026); Gross (1998); insumo para la prueba piloto. |
| Mensajes positivos sin métricas | ¿Cómo podríamos sugerir mensajes positivos cuando no se sabe qué decir? | Frases de validación mezcladas en las ideas ("Gracias por quedarte en la conversación"). | Pedido explícito del Usuario 1; Clark, Algoe y Green (2018). |
| ídem | ¿Cómo podríamos evitar métricas de comparación? | Ningún contador público: el jardín muestra plantas, no números. | Factor 4 del Capítulo 3; límites del alcance. |
| ídem | ¿Cómo podríamos hacer que la app acompañe en un mal día? | Respuestas empáticas al ánimo y **respiración guiada de 25 s** cuando el ánimo es bajo. | Baudon y Jachens (2021): regulación emocional instantánea. |

### 3.3. Ideas descartadas o pospuestas

| Idea | Decisión | Razón |
|---|---|---|
| "Mundo de conexiones" con estadísticas globales | Descartada | Introducía métricas públicas y comparación social (factor 4). |
| Notificaciones push y rachas diarias | Descartada | Pueden fomentar el uso compulsivo, asociado a la soledad (Feng et al., 2026). |
| Reacciones variadas a los mensajes (Usuario 1) | Pospuesta | Suma opciones en cada mensaje (Ley de Hick). Candidata tras la prueba piloto. |
| Mensajes largos tipo "story time" (Usuario 4) | Atendida parcialmente | 500 caracteres por mensaje, sin un formato especial que rompa la micro-interacción. |
| Debates de opinión (Usuario 4) | Descartada | Fuera del alcance (sin comunicación grupal). |
| Avatar 3D | Reemplazada | Avatar 2D en SVG (ver sección 2). |
| Lista fija de 6 temas para buscar pareja | Reemplazada | Mostraba temas que la persona no eligió; ahora se usan sus propios intereses. |

---

## 4. Capítulo 7: Prototipar

### 4.1. Arquitectura

Arquitectura cliente-servidor:

- **Cliente:** aplicación React Native (Expo) organizada por funcionalidades: autenticación, onboarding, inicio, conversación, jardín, perfil y ajustes.
- **Servidor:** API REST en FastAPI, organizada en módulos: autenticación, usuarios, ánimo, emparejamiento, chat, jardín y sugerencias.
- **Base de datos:** PostgreSQL, con migraciones versionadas (Alembic).
- **Servicio externo:** Google Knowledge Graph Search, consultado solo desde el servidor para proteger la clave.

La app consulta al servidor cada pocos segundos para recibir mensajes nuevos y saber si ya se encontró pareja (cada 4 s en la conversación y cada 3–5 s durante la búsqueda), y solo mientras la pantalla está visible.

### 4.2. Reglas de la interacción

| Regla | Valor |
|---|---|
| Duración de una conversación | 7 días |
| Días de gracia para decidir | 3 (del día 7 al 10) |
| Mensajes por persona y por día | 5 |
| Largo máximo de un mensaje | 500 caracteres |
| Etapas de la planta | 6: semilla, brote, plantita, capullo, primera flor y flor completa. Avanza una por cada día en que ambos escriben. |
| Ánimo visible para la pareja | Solo el de las últimas 24 h, y se puede desactivar |
| Duración de una búsqueda | Hasta 24 h; se puede salir y la búsqueda sigue |
| Temas por búsqueda | Hasta 3, entre los propios intereses |
| Intereses mínimos | 3 |

Estos valores son **hipótesis de diseño** que conviene validar en la prueba piloto.

### 4.3. Algoritmo de emparejamiento

Cuando alguien busca, el sistema compara a esa persona con quienes están buscando al mismo tiempo y elige a la de mayor puntaje:

> **Puntaje = 3 × temas en común + 1 × intereses en común + 2 × subtemas en común + 4 × ejemplos en común**

- Lo más específico pesa más: compartir una película concreta vale más que compartir "Películas".
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
- Límite de intentos de inicio de sesión y de recuperación de contraseña. La recuperación se hace con un enlace por correo que vence en 30 minutos.
- No se piden fotos. El ánimo compartido es opcional. La decisión final es privada, y un "no" de la otra persona no se revela mientras uno espera.
- Reporte con motivo (me hizo sentir incómodo/a, contenido ofensivo, acoso o presión, spam, otro) y comentario opcional. La conversación se cierra y la pareja no vuelve a formarse.
- **Moderación antes de enviar.** Cada mensaje se analiza en el servidor antes de guardarse, así que la regla no se puede saltar desde la app:
  - **Leve** (tono brusco, burlas, "cállate", "eres tonto"): aparece "¿Lo reformulamos?" con el mensaje, y las opciones **Editar mensaje** o **Enviar igual**. No castiga: invita a reconsiderar.
  - **Grave** (insultos fuertes, amenazas, acoso sexual, incitación a autolesión): "Este mensaje no cuida a la otra persona, así que no lo enviamos". No descuenta del límite diario y el texto vuelve al campo para reformularlo.
  - El detector reconoce disfraces comunes: letras separadas ("p u t a"), números por letras ("h1j0"), signos entre letras, tildes y letras alargadas ("tooonto"). Además evita falsos positivos con palabras inocentes, como "zorra" o "perra" referidas a animales.
  - También se rechazan nombres de usuario ofensivos.
  - **Limitación:** es una lista de expresiones, no un modelo que entienda el contexto. Puede no detectar ofensas nuevas o muy sutiles; un clasificador automático queda como trabajo futuro.
- Los acuerdos aclaran que **ECCO no reemplaza la ayuda profesional**.

### 4.6. Sistema de diseño (IHC Afectiva y UX/UI emocional)

**Paleta:** cálida y natural, con durazno (principal), verde (crecimiento, acciones positivas) y celeste (calma, ayuda), más 5 colores para los estados de ánimo.

**Tipografía:** Poppins para títulos y Quicksand para textos. El tamaño mínimo es de 12 px.

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
- Fondo de colinas y arbustos en Inicio, que se adapta a cualquier ancho de pantalla sin deformarse.

**Micro-interacciones:**
- La planta crece con una animación y el aviso "¡Su planta creció!".
- Animación de búsqueda con mensajes que cambian.
- El avatar "salta" al personalizarlo.
- La cara elegida se agranda al registrar el ánimo.
- Respiración guiada con un círculo que se expande y se contrae.
- Pantalla de cierre de la semana, que cuida el final de la experiencia (Regla del Pico-Final).
- Bienvenida animada: la semilla llega, brota, saluda con sus hojas, parpadea y flota, y después aparece el texto "Te damos la bienvenida". Es el primer momento de cada sesión (Regla del Pico-Final). Con "Reducir movimiento" activado, se muestra quieta.

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
- ¿Cinco mensajes al día se sienten suficientes o limitantes?
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

---

## 8. Referencias nuevas para agregar (APA 7)

- Google. (s. f.). *Knowledge Graph Search API*. Google for Developers. https://developers.google.com/knowledge-graph
- Katsaros, M., Yang, K., & Fratamico, L. (2022). Reconsidering tweets: Intervening during tweet creation decreases offensive content. *Proceedings of the International AAAI Conference on Web and Social Media, 16*, 477–487. https://ojs.aaai.org/index.php/ICWSM/article/view/19308 *[verificar páginas]*
- W3C. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/
- Baudon, P., & Jachens, L. (2021). Mobile apps promoting emotion regulation, positive mental health, and well-being in the general population: Systematic review and meta-analysis. *JMIR Mental Health, 8*(11), e31170. https://mental.jmir.org/2021/11/e31170 *[verificar DOI]*
- *Social connection as a key target for youth mental health* (2025). ScienceDirect. https://www.sciencedirect.com/science/article/pii/S2212657025000054 *[completar autores y revista]*
- Si se usa en la prueba piloto: Brooke, J. (1996). SUS: A "quick and dirty" usability scale. En P. W. Jordan, B. Thomas, B. A. Weerdmeester y I. L. McClelland (Eds.), *Usability evaluation in industry* (pp. 189–194). Taylor & Francis. *[verificar]*
