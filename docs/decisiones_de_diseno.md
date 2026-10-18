# Decisiones de diseño de ECCO (fase Idear → Prototipar)

Este documento registra qué ideas surgidas de la técnica **¿Cómo podríamos...?** (Figura 5.6) se implementaron en el prototipo, cuáles se descartaron y con qué sustento. Sirve como base para redactar el Capítulo 6 (Idear) y el de Prototipar.

## Criterio de selección

Siguiendo a Vargas Márquez et al. (2021), en la etapa de idear se generan muchas alternativas, pero solo se llevan al prototipo las que cumplen tres condiciones:

1. **Responden a un hallazgo consistente** de la fase Empatizar/Definir: el Mapa de Motivaciones (interés en común 13/15, avatar 12/15, entorno sin hostilidad 6/15) o un factor del Capítulo 3.
2. **Tienen respaldo en la literatura** citada en el documento.
3. **No agregan carga cognitiva innecesaria**: Ley de Hick y Ley de Tesler (Yablonski, 2020). Si una idea agrega opciones sin resolver un dolor central, se pospone.

## 1. Ideas seleccionadas e implementadas

| Pregunta "¿Cómo podríamos...?" | Idea implementada | Sustento | Dónde está en la app |
|---|---|---|---|
| ...identificar los intereses antes de emparejar? | Selección de intereses en el onboarding (mínimo 3). Antes de buscar, se eligen hasta 3 temas de la semana **solo entre los propios intereses**; el backend rechaza temas ajenos. | Mapa de Motivaciones (13/15); Liu et al. (2026); deseo explícito de los Usuarios 1 y 5. Mostrar solo lo que la persona eligió mantiene la coherencia entre pantallas y reduce opciones (Shneiderman; Ley de Hick). | Onboarding → "¿Qué te gusta?"; Conversar → "Temas de esta semana". |
| ...mostrar qué tienen en común antes de chatear? | La pantalla "Esta semana conversarás con" muestra los temas e intereses compartidos. | Causa raíz de los 5 ¿Por qué?: "no sé de qué hablar" (Usuario 1). | `matchFoundScreen` |
| ...emparejar con gustos más cercanos para que la conversación fluya? | Jerarquía de intereses: categoría → interés → subtema (género, estilo…) → ejemplos concretos (una película, una banda). El emparejamiento puntúa más los subtemas (×2) y los ejemplos (×4) en común, y la pantalla de presentación muestra "¡Coinciden en algo muy suyo!". | Usuario 4 buscaba gustos "específicos y particulares (ej. videojuegos poco populares)"; Usuario 1: el único contacto positivo que recordaba fue con alguien con su mismo juego; Mapa de Motivaciones (13/15); Liu et al. (2026). Mientras más concreto es lo compartido, más fácil es iniciar y sostener la conversación. | Onboarding y Perfil → "Cuéntanos más"; `matchFoundScreen`. |
| ...facilitar que la persona describa sus gustos sin esfuerzo? | Autocompletado con Google Knowledge Graph Search: sugiere nombres reales (películas, series, bandas, juegos, libros, equipos, lugares) filtrados según el interés. Siempre se puede escribir texto libre. | Ley de Tesler (Yablonski, 2020): el sistema absorbe la complejidad de escribir nombres exactos. Además, los nombres normalizados hacen que dos personas que escriben lo mismo de forma distinta igual coincidan. Se usa una fuente externa y actualizada en lugar de un catálogo propio que quedaría desactualizado. | `itemInput`; backend `modules/suggestions`. |
| ...sugerir temas basados en gustos compartidos? | "Ideas para romper el hielo": 3 sugerencias generadas a partir de los temas e intereses en común. Al tocarlas se llenan en el campo de texto para editarlas, no se envían solas. | Usuario 1: "si no hay algo en común, no sabría de qué hablar". Personalización como el factor más importante del engagement, 27 % (Vakili, 2024). Se limitan a 3 por la Ley de Hick. | Conversación, encima del campo de texto. |
| ...sugerir mensajes positivos cuando no se sabe qué decir? | En las mismas sugerencias se mezclan frases de validación ("Gracias por quedarte en la conversación", "Qué bueno leerte"). | Frases pedidas por el Usuario 1 ("gracias por quedarte"); reconocimiento social positivo (Clark, Algoe y Green, 2018). | `sparks.ts` |
| ...que el avatar refleje la identidad real? | Avatar ilustrado y personalizable: tono de piel, peinado, color de cabello, lentes, pecas, lunar, arete, ropa y fondo. Sin fotos. | Usuario 4: "lentes, pelo largo, lunares, piercings"; Mapa de Motivaciones (12/15); equilibrio entre anonimato y autenticidad. | Onboarding y Perfil → "Personalizar mi avatar". |
| ...que el avatar sea entretenido y no solo funcional? | Botón "Sorpréndeme" que genera un avatar al azar, con una animación de respuesta en cada cambio. | Faceta "deseable" de Morville (2005); Efecto de Usabilidad Estética (Yablonski, 2020). | `avatarCustomizer` |
| ...compensar la falta de señales no verbales? | **El avatar muestra el ánimo del día** (ojos, cejas y boca cambian). La otra persona lo ve junto al nombre ("hoy se siente bien"). Se puede desactivar. | Causa raíz del Usuario 1: "no puedo ver expresiones, es muy plano"; Picard (1997) sobre el empobrecimiento afectivo del texto. | Encabezado de la conversación; Ajustes → "Mostrar mi ánimo en mi avatar". |
| ...dar reporte/bloqueo sin interrumpir la experiencia? | Ícono de escudo discreto en la conversación. Abre "Tu bienestar es primero" con dos acciones: salir, o reportar con motivo. La otra persona no ve el motivo y no vuelven a coincidir. | Mapa de Motivaciones (6/15); Usuario 4 ("sin haters"); Usuario 5 (privacidad); manejo amable de errores y reducción de ansiedad (Shneiderman, en Hernández Bieliukas, 2014). | `safetySheet` |
| ...transmitir confianza antes de la primera conversación? | Pantalla "Un lugar seguro" con acuerdos breves y un recordatorio en "Esta semana conversarás con" de que puedes salir o reportar cuando quieras. | Necesidad (d) de la síntesis de Empatizar (4.4). | `termsScreen`, `matchFoundScreen` |
| ...priorizar la calidad sobre la cantidad? | Una sola conversación a la vez, durante 7 días, con **5 mensajes al día** por persona y un máximo de 500 caracteres por mensaje. | Cuidado social elaborado (Takano, 2018); "número razonable de mensajes" como factor de engagement, 15 % (Vakili, 2024); brevedad de la micro-interacción (Saffer, 2013). El límite de caracteres es generoso por la reserva del Usuario 4 ante mensajes demasiado cortos. | Contador "Te quedan N de 5 mensajes hoy". |
| ...hacer que cada mensaje se sienta significativo? | **La planta crece solo los días en que ambos se escriben.** Al crecer, hay una micro-interacción ("¡Su planta creció!"). La planta nunca se marchita, para no castigar. | Godard y Holtzman (2024): el uso activo y recíproco se asocia con más bienestar (r = 0,15) y apoyo percibido (r = 0,34). | Encabezado de la conversación; Jardín. |
| ...sostener un vínculo esporádico en el tiempo? | Decisión privada en el día 7 (con 3 días de gracia). Si ambos quieren seguir, la planta florece y la conversación sigue abierta en "Siguen floreciendo". | POV: "vínculos genuinos". Regla del Pico-Final: se cuida el cierre de la semana con una pantalla propia (Yablonski, 2020). | `decisionCard`, `outcomeScreen`, Jardín. |
| ...evitar métricas públicas de comparación? | No hay likes, seguidores, contadores ni rankings. El jardín muestra plantas, no números. | Factor 4 del Capítulo 3; Limitaciones del alcance (sin métricas de popularidad). | Todo el sistema. |
| ...medir el éxito en bienestar y no en uso? | Registro diario del ánimo y una vista privada "Tu semana" en el Perfil. No hay rachas ni notificaciones que empujen al uso. | Feng et al. (2026): la soledad se asocia al uso problemático (r = 0,29), no al tiempo de uso. Monitorear la propia emoción como paso previo a regularla (Gross, 1998). Los datos sirven para la prueba piloto (objetivo específico 4). | Inicio → "¿Cómo te sientes hoy?"; Perfil → "Tu semana". |
| ...que recibir un mensaje sea un pequeño momento significativo? | Respuestas empáticas al ánimo registrado y, si el ánimo es bajo ("Fatal" o "Mal"), una **respiración guiada de 25 segundos**. | Baudon y Jachens (2021): las apps más efectivas incorporan micro-interacciones positivas y técnicas de regulación instantánea. | `breathingCard` en Inicio. |

## 2. Ideas descartadas o pospuestas

| Idea | Decisión | Razón |
|---|---|---|
| "Mundo de conexiones" con estadísticas globales ("2k conexiones", "96 % se sintieron mejor") | **Descartada y eliminada** del prototipo. | Introduce métricas públicas y comparación social (factor 4); además, las cifras eran ficticias. |
| Notificaciones push y rachas diarias | Descartada. | Pueden fomentar el uso compulsivo, que es el patrón asociado a la soledad (Feng et al., 2026). El interruptor de notificaciones de Ajustes no hacía nada y se quitó (coherencia, Shneiderman). |
| Reacciones variadas a los mensajes (deseo del Usuario 1) | Pospuesta. | Tiene valor, pero agrega opciones en cada mensaje (Ley de Hick). Candidata para la siguiente iteración, tras la prueba piloto. |
| Mensajes largos tipo "story time" (Usuario 4) | Atendida parcialmente. | Se permiten 500 caracteres por mensaje. No se agregó un formato especial para no romper el principio de micro-interacción. |
| Debates de opinión (Usuario 4) | Descartada. | Fuera del alcance: la app es de conversación uno a uno, no grupal (límites 1.5). |
| Avatar 3D (Unity/Blender) | Reemplazado por un avatar 2D en SVG. | El prototipo se implementó en Expo/React Native. El SVG es liviano, se personaliza en tiempo real y funciona en Android sin motor 3D. |

| Lista fija de 6 temas (Viajes, Música, Juegos, Comida, Naturaleza, Películas) al buscar pareja | **Reemplazada** por los intereses de cada persona. | Mostraba temas que la persona no había elegido, lo que rompía la coherencia con su perfil (detectado en pruebas con la usuaria). |

## 3. Decisiones de diseño visual con sustento

| Decisión | Antes | Después | Sustento |
|---|---|---|---|
| Contraste del texto en botones | Blanco sobre durazno `#F2AA74`: **1,95:1** | Café oscuro `#553B29` sobre el mismo durazno: **5,27:1** | WCAG 2.2, criterio 1.4.3 (mínimo 4,5:1). Faceta "accesible" de Morville (2005). Se conserva la paleta cálida. |
| Contraste en verde y celeste | 1,86:1 y 1,62:1 | 5,30:1 y 5,71:1 (tono "darker" de la misma familia) | Ídem. |
| Enlaces y títulos en `primary-normal-active` | 2,84:1 | `primary-dark-hover` (4,72:1) o `primary-dark-active` (7,17:1) | Ídem. |
| Fondos de las diapositivas de bienvenida | Durazno y verde con texto blanco (≤ 3,2:1) | Tonos oscuros de la misma familia (≥ 4,8:1) | Ídem. |
| Tamaño mínimo del texto | 11 px | 12 px | Legibilidad en móvil; memorabilidad y satisfacción (Nielsen, en Hernández Bieliukas, 2014). |
| Tamaño de los objetivos táctiles | Botones pequeños de ~33 px de alto | Mínimo 40–48 px | Ley de Fitts (Yablonski, 2020). |
| Rasgos del avatar en piel oscura | Trazo casi del mismo color que la piel | Trazo más oscuro en los tonos 5 y 6 | Inclusión: el avatar debe expresar emoción en cualquier tono de piel. |
| Lenguaje de la interfaz | — | Mensajes en segunda persona, sin culpa ("Mañana podrás escribir de nuevo", "Cerrar aquí" en vez de "Mejor no") | Manejo amable de errores (Shneiderman); Ley de Postel (Yablonski, 2020). |
| Bienvenida al iniciar sesión | Plantita estática en etapa 1 | Ilustración propia de una semilla (`assets/svg/semilla.svg`) | Efecto de Usabilidad Estética (Yablonski, 2020): una ilustración cuidada al iniciar sesión refuerza la metáfora de la semilla que crece con la conexión. Se prefirió SVG a una animación en Rive porque Rive exige una development build y no funciona en Expo Go, lo que complicaba las pruebas piloto. |
| Caras para registrar el ánimo | Círculos de color dibujados en código | Ilustraciones propias (`assets/svg/emotions/`), las mismas en Inicio y en "Tu semana" | Coherencia visual entre pantallas (Shneiderman, en Hernández Bieliukas, 2014); Efecto de Usabilidad Estética (Yablonski, 2020). Se mantienen las 5 opciones y sus etiquetas de texto, para que la emoción no dependa solo de la imagen. |
| Fondo de Inicio | Degradado con sol o luna según la hora | Ilustración propia de colinas y arbustos (`assets/svg/background/home.svg`) que se adapta al ancho sin deformarse | Efecto de Usabilidad Estética (Yablonski, 2020); refuerza la metáfora del jardín. El logo y el saludo usan `primary-darker` (6,1:1 sobre el verde), porque el tono anterior quedaba en 2,98:1, bajo el mínimo de WCAG 2.2. |
| Ancho del contenido en Inicio | Se probó un máximo de 560 px y luego dos columnas | Una sola columna que ocupa todo el ancho | Decisión de la autora tras revisarlo en pantalla ancha: el contenido debe crecer con la ventana y conservar el orden del teléfono (ánimo → conversación → jardín). Prioriza la coherencia del flujo entre tamaños de pantalla. |
| Retroalimentación de espera | Spinner genérico | Animación de búsqueda con mensajes rotativos y la aclaración "seguimos buscando por ti hasta 24 horas" | Umbral de Doherty; visibilidad del estado del sistema (Norman, 2013). |

## 4. Reglas de la interacción (valores del prototipo)

| Regla | Valor | Archivo |
|---|---|---|
| Duración de la conversación | 7 días | `backend/src/modules/matches/constants.py` |
| Días de gracia para decidir | 3 | ídem |
| Mensajes por persona y por día | 5 | ídem |
| Largo máximo de un mensaje | 500 caracteres | `backend/src/modules/chat/schemas.py` |
| Etapas de la planta | 6 (crece 1 por día recíproco) | `constants.py` |
| Visibilidad del ánimo para la pareja | Últimas 24 h, desactivable | `constants.py` (`MOOD_VISIBLE_HOURS`) |
| Búsqueda activa | Hasta 24 h | `constants.py` |

Estos valores son hipótesis de diseño. Conviene validarlos en la prueba piloto, por ejemplo preguntando si 5 mensajes diarios se sintieron suficientes.

## 5. Inconsistencias detectadas entre el documento y el prototipo

1. **Tecnologías:** el documento (1.6.2 y Cuadro 1.1) menciona Unity, MongoDB y Blender. El prototipo usa Expo/React Native, FastAPI y PostgreSQL, con avatares en SVG. Conviene actualizar la metodología.
2. **Edad mínima:** el alcance indica jóvenes de **16 a 28 años**, pero los términos de la app decían "18 años o más". Se alinearon a 16 años. Al incluir menores de edad, revisa con tu tutora el consentimiento informado para la prueba piloto.
3. **Limitación terapéutica:** el alcance aclara que la app no sustituye la ayuda profesional. Ahora se dice explícitamente en los acuerdos y en la hoja de seguridad.

## 6. Referencias nuevas que conviene agregar

- W3C. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/ (criterios 1.4.3 y 1.4.11).
- Baudon, P., & Jachens, L. (2021). Mobile apps promoting emotion regulation, positive mental health, and well-being in the general population: Systematic review and meta-analysis. *JMIR Mental Health, 8*(11), e31170. https://mental.jmir.org/2021/11/e31170 *[verificar volumen y DOI]*.
- Social connection as a key target for youth mental health (2025). ScienceDirect, https://www.sciencedirect.com/science/article/pii/S2212657025000054 *[completar autores y revista]*.
- Google. (s. f.). *Knowledge Graph Search API*. Google for Developers. https://developers.google.com/knowledge-graph (uso gratuito de hasta 100 000 consultas por día por proyecto).
