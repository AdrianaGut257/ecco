**UNIVERSIDAD MAYOR DE SAN SIMÓN**
**FACULTAD DE CIENCIAS Y TECNOLOGÍA**
**CARRERA DE INGENIERÍA INFORMÁTICA**

# DESARROLLO DE UNA APLICACIÓN MÓVIL ORIENTADA A FOMENTAR MICRO INTERACCIONES SOCIALES POSITIVAS A TRAVÉS DE MENSAJES BREVES

Trabajo de grado presentado para optar al Diploma Académico de Licenciatura en Ingeniería de Informática

**Presentado por:** Gutierrez Mollo Adri
**Tutor:** Lic. Flores Villarroel Corina Justina

Cochabamba - Bolivia
Septiembre - 2026

---

## FICHA RESUMEN

> [Resumen de una plana con el contenido del proyecto - se recomienda redactar esta sección al final]

---

## ÍNDICE GENERAL

> [Pendiente de generar]

## ÍNDICE DE FIGURAS

> [Pendiente de generar]

## ÍNDICE DE CUADROS

> [Pendiente de generar]

---

# CAPÍTULO 1. INTRODUCCIÓN

En la era digital actual, los jóvenes enfrentan una paradoja significativa: aunque están hiperconectados y acumulan numerosos contactos digitales, experimentan una creciente desconexión emocional. Las plataformas sociales contemporáneas priorizan métricas cuantitativas y la retención de usuarios, descuidando la calidad de las interacciones y el estado emocional de sus usuarios. Esta dinámica genera entornos donde las conexiones son abundantes pero superficiales, limitando las oportunidades para establecer vínculos auténticos. La Interacción Humano-Computadora Afectiva (IHC Afectiva) busca transformar esta realidad mediante el diseño de interfaces que consideren los estados emocionales de los usuarios. Estudios demuestran que las aplicaciones diseñadas bajo estos principios, especialmente aquellas que incorporan micro interacciones positivas diarias, pueden generar efectos significativos en el estado emocional juvenil. Este proyecto propone el desarrollo de una aplicación móvil fundamentada en principios de IHC Afectiva para fomentar micro interacciones sociales positivas entre jóvenes a través de mensajes breves diarios. La aplicación emparejará usuarios para intercambios limitados pero significativos, e incorporará avatares personalizables para expresar identidad y emociones. Esta herramienta busca contribuir a la regulación emocional de los jóvenes a través de micro interacciones positivas diarias, favoreciendo progresivamente la mejora de su estado emocional en entornos digitales, fortalecer vínculos genuinos y promover comunidades más empáticas, priorizando la calidad de la interacción sobre la cantidad.

## 1.1. ANTECEDENTES

La Interacción Humano-Computadora Afectiva (IHC Afectiva) es una subárea de la IHC que se enfoca en el diseño de interfaces que consideren y respondan a los estados emocionales de los usuarios, con el objetivo de crear experiencias más empáticas y significativas. En investigaciones realizadas a nivel internacional, se encontró a Baudon y Jachens (2021) quienes en su investigación desarrollada en Reino Unido, buscaron examinar el impacto de aplicaciones móviles que promueven la regulación emocional, salud mental positiva y bienestar en la población general. Para esto realizaron una revisión sistemática y meta-análisis de 52 estudios que describían 48 aplicaciones, con un total de 22,090 participantes, aplicando criterios de inclusión para aplicaciones que promovieran emociones positivas, considerando aspectos como: regulación emocional, promoción de bienestar, efectos en salud mental positiva y usabilidad de las aplicaciones. En esta investigación, se presentó que las aplicaciones móviles de salud mental demostraron efectos pequeños pero significativos en la mejora del bienestar emocional, siendo particularmente efectivas aquellas que incorporaban elementos de micro-interacciones positivas diarias y técnicas de regulación emocional instantánea. De ahí que se concluye que las aplicaciones móviles pueden ser herramientas efectivas para promover emociones positivas y bienestar cuando están diseñadas con enfoques específicos de IHC Afectiva que consideran las micro-interacciones emocionales.

De igual forma, se encontró a Vakili (2024), quien en su estudio sobre preferencias de mensajería de texto para jóvenes en transición a servicios de salud mental, aplicó los modelos IMB y Diseño de Sistemas Persuasivos (PSD). Para ello, estudió a 100 jóvenes canadienses de entre 16 y 26 años, aplicando una encuesta que consideró aspectos como el contenido de los mensajes, las características tecnológicas y los facilitadores del engagement.

En esta investigación se evidenció que la personalización de los mensajes fue el factor más significativo para el engagement (27 %), seguido por los mensajes que captan la atención (20 %) y un número razonable de mensajes (15 %). Asimismo, se observó un mayor consenso en los elementos conductuales (100 %) que en los informativos (44 %) o motivacionales (25 %). Se concluye que el diseño centrado en el usuario es un elemento fundamental en aplicaciones de Interacción Humano-Computadora (IHC) Afectiva que buscan generar microinteracciones significativas.

A nivel conceptual, se encontró el estudio "Social connection as a key target for youth mental health" (2025) el cual buscó establecer las conexiones sociales positivas como objetivo clave para la salud mental juvenil. Para esto se realizó una revisión de evidencia sobre conexiones entre pares y conexión escolar, considerando aspectos como: intervenciones de redes sociales, programas escolares y factores transdiagnósticos. En esta investigación, se presentó que las intervenciones de redes sociales y la conexión escolar muestran promesa para mejorar la salud mental juvenil, actuando las conexiones sociales como factor transdiagnóstico. De ahí que se concluye que las estrategias de prevención deberían enfocarse en la conexión social juvenil como elemento fundamental para el estado emocional.

## 1.2. DESCRIPCIÓN DEL PROBLEMA

En la actualidad, los jóvenes se encuentran en una paradoja digital: están hiperconectados a través de redes sociales, acumulando decenas o cientos de contactos, pero experimentan una desconexión emocional y social significativa debido a interacciones superficiales que priorizan métricas cuantitativas sobre conexiones genuinas. Esta situación refleja una creciente dificultad para establecer vínculos significativos en entornos digitales, donde la conexión constante no necesariamente se traduce en vínculos significativos. Las plataformas digitales actuales se enfocan en la visibilidad masiva y la retención de usuarios, descuidando el estado emocional y generando entornos que carecen de experiencias significativas para los jóvenes. Este fenómeno se origina en el diseño de las plataformas sociales existentes, las cuales están orientadas a maximizar el tiempo de uso mediante algoritmos que promueven el consumo pasivo de contenido, en lugar de fomentar vínculos auténticos entre los usuarios. Como resultado, se produce una brecha creciente entre la cantidad de conexiones digitales y la calidad de las relaciones interpersonales que los jóvenes logran establecer. Por otra parte, existe una ausencia de herramientas digitales que consideren los estados emocionales de los usuarios y sus necesidades de conexión social genuina, lo cual repercute en la falta de espacios que prioricen la calidad sobre la cantidad en las interacciones. Además, las dinámicas de comunicación actuales favorecen la unidireccionalidad y las respuestas automáticas, limitando las oportunidades para generar diálogos significativos que contribuyan al estado emocional juvenil. En consecuencia, los jóvenes experimentan un deterioro progresivo en su estado emocional, manifestado en sentimientos de soledad, ansiedad social y dificultades para establecer vínculos auténticos tanto en el entorno digital como presencial. Esta situación perpetúa las interacciones superficiales como norma en la comunicación juvenil y dificulta el desarrollo de comunidades digitales empáticas y solidarias.

### 1.2.1. Definición del problema

**Formulación del problema:** ¿Cómo abordar eficazmente la desconexión emocional que experimentan los jóvenes en la era digital al interactuar con las plataformas sociales existentes?

## 1.3. OBJETIVOS DEL PROYECTO

A continuación, se presentan el objetivo general y los objetivos específicos.

### 1.3.1. Objetivo General

Diseñar e implementar una aplicación móvil basada en principios de Interacción Humano-Computadora Afectiva que promueva la generación de micro interacciones sociales positivas entre jóvenes, contribuyendo a mejorar el estado emocional en entornos digitales.

### 1.3.2. Objetivos Específicos

- Analizar el nivel de desconexión emocional que experimentan los jóvenes al interactuar con plataformas digitales, identificando factores que limitan la generación de vínculos significativos.
- Diseñar una interfaz móvil centrada en el usuario que incorpore dinámicas de interacción breves y elementos visuales orientados a fortalecer la conexión emocional.
- Implementar funcionalidades que permitan la interacción diaria entre los usuarios, como el envío y recepción de mensajes, junto con la personalización del avatar.
- Realizar pruebas piloto con un grupo de jóvenes para evaluar la usabilidad, la experiencia de usuario (UX) y la influencia de la aplicación en el estado emocional de los usuarios.

## 1.4. JUSTIFICACIÓN

El estado emocional de los jóvenes constituye una preocupación creciente en la era digital, donde la hiperconectividad no siempre se traduce en experiencias afectivas significativas. Aunque las redes sociales facilitan la comunicación masiva, con frecuencia generan una desconexión emocional, en la que la cantidad de contactos no asegura vínculos auténticos ni relaciones de apoyo genuinas. Esta situación evidencia la necesidad de herramientas digitales que promuevan la calidad de las interacciones y favorezcan la conexión emocional entre los usuarios. En este contexto, el desarrollo de una aplicación móvil orientada a fomentar micro interacciones sociales positivas busca atender esta necesidad, promoviendo conexiones emocionales reales entre los usuarios. La plataforma se centrará en reforzar la empatía, la reciprocidad y la comunicación genuina, permitiendo que los jóvenes experimenten interacciones significativas que favorezcan la regulación emocional en el momento y, de forma progresiva, impacten positivamente en su estado emocional. Además, esta aplicación busca ofrecer un entorno seguro y positivo, donde las interacciones sean pequeñas pero significativas. Este proyecto surge como respuesta a la falta de herramientas digitales que prioricen la calidad de las interacciones sobre la cantidad. Las plataformas tradicionales suelen enfocarse en la visibilidad masiva y la retención de usuarios, lo que puede generar entornos superficiales que no consideran las emociones ni el impacto en el estado emocional de los jóvenes. Con este desarrollo, se espera reducir la brecha entre la hiperconectividad digital y el estado emocional de los jóvenes, promover la creación de espacios digitales más empáticos y fomentar interacciones auténticas y significativas que contribuyan a su estado emocional.

## 1.5. ALCANCE Y LÍMITES

**Alcances:**

- El proyecto desarrollará un prototipo de una aplicación móvil funcional e interactiva centrada en fomentar micro interacciones sociales positivas entre jóvenes.
- Se incluirán funcionalidades de envío y recepción de mensajes breves diarios diseñados para fomentar la conexión emocional.
- Se implementará un sistema de personalización de avatares que permita la expresión identitaria de los usuarios.
- Se diseñará la interfaz centrada en el usuario con elementos visuales orientados a fortalecer la conexión emocional.
- Se realizarán pruebas piloto con un grupo de jóvenes de entre 16 y 28 años para evaluar la usabilidad, la experiencia de usuario (UX) y el impacto de la aplicación en la regulación emocional de los usuarios.

**Límites:**

- La aplicación no sustituirá intervenciones terapéuticas profesionales ni funcionará como tratamiento para trastornos de salud mental.
- No se incluirán métodos clínicos formales ni pruebas que midan directamente mejoras en la salud mental de los usuarios.
- No se abordarán funcionalidades de redes sociales masivas como transmisiones en vivo, publicaciones públicas o métricas de popularidad.
- El enfoque se centrará únicamente en micro interacciones entre usuarios; no se desarrollarán recursos para comunicación grupal o individual masiva.
- La funcionalidad estará limitada a la plataforma móvil específica de Android; no se desarrollará versión web en esta primera fase.

## 1.6. DISEÑO METODOLÓGICO

### 1.6.1. Tipo de investigación

Aplicativa con enfoque mixto (cualitativo-cuantitativo): se busca desarrollar una solución tecnológica concreta (aplicación móvil) mientras se evalúa su impacto en aspectos emocionales de los usuarios.

El componente cualitativo permitirá comprender las experiencias emocionales y percepciones de los usuarios, mientras que el componente cuantitativo facilitará la medición de la usabilidad y el impacto emocional mediante escalas validadas.

### 1.6.2. Fuentes de información

**Fuentes primarias:**

- Encuestas y cuestionarios aplicados a participantes del grupo objetivo.
- Retroalimentación de usuarios durante el proceso de diseño iterativo.
- Observación directa durante las pruebas piloto.

**Fuentes secundarias:**

- Literatura académica sobre la Interacción Humano-Computadora Afectiva, diseño emocional y desarrollo móvil.
- Estudios previos sobre aplicaciones del estado emocional.
- Documentación técnica de Unity, MongoDB, Blender y APIs de moderación.
- Referencias metodológicas sobre Design Thinking y evaluación de UX.

### 1.6.3. Técnicas de recolección de datos

**Encuestas**

Se aplicará una encuesta inicial de diagnóstico con 10-20 preguntas para evaluar el nivel de desconexión emocional, patrones de uso de redes sociales, calidad percibida de interacciones digitales y necesidades emocionales de los jóvenes.

**Observación**

Se aplicará observación directa durante las pruebas de usabilidad del prototipo en Figma con 10-20 usuarios mientras navegan e interactúan con las pantallas diseñadas. Se documentarán expresiones emocionales, dudas verbalizadas, tiempo dedicado a cada tarea, dificultades de navegación y reacciones ante elementos visuales.

Se utilizará la técnica Think Aloud (pensar en voz alta), donde los usuarios verbalizarán sus pensamientos, expectativas y reacciones emocionales durante la exploración del prototipo. También se registrarán observaciones sobre la comprensión de flujos de interacción y preferencias de diseño.

### 1.6.4. Procedimiento

**Cuadro 1.1**
_Procedimientos_

| Objetivo específico                                                                                                                                                                            | Actividades                                                                                                                                                                                                             | Recursos                                                                                                                                                       | Producto esperado                                                                                                                                   | Tiempo    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Analizar el nivel de desconexión emocional que experimentan los jóvenes al interactuar con plataformas digitales, identificando factores que limitan la generación de vínculos significativos. | - Revisión bibliográfica sobre desconexión emocional digital<br>- Recolección de datos<br>- Prototipo base                                                                                                              | - Libros, informes, y artículos<br>- Herramientas de encuestas (Google Forms)<br>- Herramientas de diseño (Figma)                                              | - Informe de diagnóstico sobre desconexión emocional<br>- Identificación de factores críticos                                                       | 2 semanas |
| Diseñar una interfaz móvil centrada en el usuario que incorpore dinámicas de interacción breves y elementos visuales orientados a fortalecer la conexión emocional.                            | - Aplicación de fase "Empatizar" y "Definir" de Design Thinking<br>- Definición de paleta de colores y tipografía<br>- Diseño de flujos de interacción y micro-interacción<br>- Modelado 3D de avatares base en Blender | - Blender para modelado 3D<br>- Unity para el desarrollo<br>- Feedback de usuarios<br>- Conocimiento sobre UX/UI                                               | - Sistema con diseño completo UX/UI (colores, tipografía, componentes)<br>- Biblioteca de modelos 3D de avatares                                    | 8 semanas |
| Desarrollar un prototipo funcional de la aplicación móvil que implemente las funcionalidades identificadas.                                                                                    | - Configuración del entorno de desarrollo en Unity<br>- Configuración de base de datos MongoDB<br>- Implementación de funcionalidades<br>- Integración de modelos 3D de Blender                                         | - Unity para el desarrollo<br>- MongoDB<br>- Modelos 3D exportados desde Blender                                                                               | - Prototipo funcional de aplicación móvil para Android<br>- Backend operativo con MongoDB<br>- Personalización de avatares operativa                | 9 semanas |
| Realizar pruebas piloto con un grupo de jóvenes para evaluar la usabilidad, la experiencia de usuario (UX) y la influencia de la aplicación en el estado emocional de los usuarios.            | - Reclutamiento y selección de participantes (10-20 jóvenes)<br>- Período de uso libre de la aplicación (1-2 semanas)<br>- Registros de las pruebas<br>- Documentación de hallazgos                                     | - Grupo de 10-20 jóvenes participantes<br>- Cuestionarios y formularios validados<br>- Dispositivos móviles Android<br>- Herramientas de grabación de sesiones | - Informe de la evaluación<br>- Análisis estadístico del impacto emocional<br>- Reporte de experiencia de usuario<br>- Documento final del proyecto | 5 semanas |

_Nota._ Elaboración propia basada en los objetivos específicos del proyecto.

### 1.6.5. Cronograma de desarrollo

**Cuadro 1.2**
_Cronograma de desarrollo_

> Nota de conversión: en el PDF las marcas "X" por mes no se pudieron recuperar con su columna exacta al extraer el texto. Completar las columnas según el cronograma original.

| Actividad                                                  | Mes 1 | Mes 2 | Mes 3 | Mes 4 | Mes 5 | Mes 6 |
| ---------------------------------------------------------- | ----- | ----- | ----- | ----- | ----- | ----- |
| Revisión bibliográfica sobre desconexión emocional digital |       |       |       |       |       |       |
| Recolección de datos                                       |       |       |       |       |       |       |
| Prototipo base en Figma                                    |       |       |       |       |       |       |
| Aplicación de Design Thinking y definición de diseño       |       |       |       |       |       |       |
| Diseño de flujos de interacción y modelado 3D de avatares  |       |       |       |       |       |       |
| Configuración de Unity y MongoDB                           |       |       |       |       |       |       |
| Implementación de funcionalidades                          |       |       |       |       |       |       |
| Integración de modelos 3D                                  |       |       |       |       |       |       |
| Pruebas de usabilidad y UX                                 |       |       |       |       |       |       |
| Análisis de resultados                                     |       |       |       |       |       |       |
| Elaboración de documento final                             |       |       |       |       |       |       |

_Nota._ Elaboración propia del cronograma de desarrollo según los objetivos específicos del proyecto.

---

# CAPÍTULO 2. MARCO TEÓRICO

El presente capítulo expone los fundamentos conceptuales que sustentan el desarrollo de una aplicación móvil orientada a fomentar micro interacciones sociales positivas entre jóvenes. Para ello. . .

## 2.1. INTERACCIÓN HUMANO-COMPUTADORA (IHC)

La Interacción Humano-Computadora es una disciplina multidisciplinar que estudia el diseño, la evaluación y la implementación de sistemas informáticos interactivos para el uso humano. El grupo de interés especial SIGCHI de la Asociación para la Maquinaria Informática, la define como la "disciplina relacionada con el diseño, la evaluación e implementación de sistemas informáticos interactivos para el uso de los seres humanos, y con el estudio de los fenómenos más importantes con los que está relacionado" (Hernández Bieliukas, 2014, p. 13). Esta disciplina no se limita al hardware o el software de manera aislada; abarca también los modelos mentales de los usuarios, las tareas que desempeña el sistema, su adaptación a distintos contextos y el impacto organizacional y social de la tecnología interactiva.

Según Diaper (1989), citado por Hernández Bieliukas (2014), los objetivos centrales de la IHC son desarrollar o mejorar la seguridad, utilidad, efectividad, eficiencia y usabilidad de los sistemas que incluyan computadoras. Para lograrlo, Preece (1994), referenciado en el mismo texto, plantea que es necesario comprender los factores psicológicos, ergonómicos, organizativos y sociales que determinan cómo las personas trabajan con los ordenadores, para trasladar ese conocimiento al diseño de herramientas que permitan una interacción eficiente, efectiva y segura, tanto a nivel individual como grupal (p. 14). Esta perspectiva establece que la IHC no puede reducirse a un problema técnico, sino que es fundamentalmente un problema humano.

La evolución histórica de la IHC muestra un desplazamiento progresivo de enfoque. Hernández Bieliukas (2014) señala que la disciplina surgió alrededor de 1970, cuando los computadores comenzaron a masificarse, pero los diseñadores asumían erróneamente que los usuarios tendrían un alto conocimiento técnico. La realidad demostró que los usuarios típicos se sentían frustrados con sistemas difíciles de usar, lo que impulsó el giro hacia la usabilidad como criterio central de diseño (p. 206). A mediados de los años noventa, con la aparición de los medios digitales, web, dispositivos móviles, televisión interactiva, se incorporó un nuevo componente a la IHC: las emociones, a partir de lo cual surgió el concepto de experiencia de usuario (p. 207).

### 2.1.1. Diseño Centrado en el Usuario (DCU)

El Diseño Centrado en el Usuario es el enfoque metodológico que sitúa las necesidades, capacidades y comportamientos del usuario como eje conductor de todas las decisiones de diseño. La norma ISO DIS 9241-210 (2010), citada por Hernández Bieliukas (2014), define la experiencia de usuario como las "percepciones y respuestas de las personas que resultan del uso y/o uso anticipado de un producto, sistema o servicio" (p. 207), lo que subraya que el DCU no evalúa el sistema en abstracto, sino siempre en relación con quien lo usa y el contexto en que lo usa.

Norman (2013) popularizó este enfoque al proponer que un buen diseño debe comunicar sus posibilidades de acción a través de affordances, posibilidades percibidas de interacción y ofrecer retroalimentación inmediata al usuario. Para Norman, "el diseño debe facilitar la comprensión del usuario sobre qué acciones son posibles, cuál es el estado actual del sistema y qué sucederá si se realiza una acción" (2013, p. 72), principio que resulta directamente aplicable al diseño de interfaces móviles orientadas a la conexión emocional.

### 2.1.2. Experiencia de Usuario (UX)

La Experiencia de Usuario va más allá de la usabilidad para incorporar la totalidad de las respuestas emocionales, cognitivas y conductuales que una persona experimenta al interactuar con un sistema. Peter Morville (2005), citado por Hernández Bieliukas (2014), propone que la UX contempla siete facetas: que el producto sea útil, usable, deseable, fácil de encontrar, accesible, creíble y valioso (p. 208). La faceta de lo deseable es especialmente relevante para el presente proyecto, pues se vincula directamente con el diseño emocional y la capacidad de una interfaz para generar vínculos afectivos con el usuario.

En el campo del diseño de interfaces, Jon Yablonski sistematizó un conjunto de principios psicológicos aplicados al diseño UX conocidos como las 12 Leyes de UX (Yablonski, 2020). Entre las más relevantes para el diseño de aplicaciones sociales y de bienestar se encuentran las siguientes:

- **Ley de Jakob**, que establece que los usuarios pasan la mayor parte de su tiempo en otros sitios, por lo que prefieren que el diseño funcione de la misma manera que los sitios que ya conocen; esto implica aprovechar los modelos mentales existentes para que los usuarios puedan concentrarse en sus tareas y no en aprender nuevas interfaces.
- **Ley de Fitts**, que indica que el tiempo para alcanzar un objetivo es función de la distancia y el tamaño del objetivo, principio que orienta el tamaño y la ubicación de botones interactivos; los objetivos táctiles deben ser suficientemente grandes, tener separación adecuada y ubicarse en zonas de fácil alcance.
- **Ley de Miller**, que establece que el ser humano puede retener aproximadamente 7 elementos (±2) en la memoria de trabajo simultáneamente, lo que fundamenta la simplicidad en la arquitectura de información y la organización de contenidos en fragmentos más pequeños.
- **Ley de Hick**, que establece que el tiempo necesario para tomar una decisión aumenta con el número y la complejidad de opciones disponibles, lo que justifica interfaces con pocas acciones posibles por pantalla, la segmentación de tareas complejas y el énfasis en opciones recomendadas para evitar la sobrecarga cognitiva.
- **Ley de Postel**, que indica que se debe ser conservador en lo que se hace y liberal en lo que se acepta de otros; en diseño, esto se traduce en interfaces tolerantes y empáticas que anticipan distintas formas de interacción del usuario.
- **Regla del Pico-Final (Peak–End Rule)**, según la cual las personas juzgan una experiencia en gran medida por cómo se sintieron en su momento más intenso y al final, más que por la suma total de cada momento; esto orienta el diseño a cuidar especialmente los puntos álgidos y el cierre de cada flujo.
- **Efecto de Usabilidad Estética**, según el cual los usuarios perciben los diseños estéticamente agradables como más fáciles de usar, son más tolerantes ante problemas menores de usabilidad y asocian la belleza visual con mejor funcionamiento.
- **Efecto Von Restorff**, que establece que cuando múltiples objetos similares están presentes, el que difiere del resto es el que más probablemente será recordado; esto orienta el uso selectivo del énfasis visual para destacar información clave sin saturar la interfaz.
- **Ley de Tesler (Ley de la Conservación de la Complejidad)**, que afirma que en todo sistema existe una cantidad de complejidad que no puede eliminarse, por lo que dicha complejidad debe ser absorbida por el sistema durante el diseño y el desarrollo, y no transferida al usuario.
- **Umbral de Doherty (Doherty Threshold)**, que señala que la productividad se dispara cuando el sistema responde en menos de 400 ms, evitando que el usuario deba esperar; el uso de animaciones y retroalimentación visual puede mejorar la percepción del rendimiento mientras se carga contenido (Yablonski, 2024).

### 2.1.3. Interfaz de usuario (UI)

El diseño de Interfaz de Usuario (UI) se ocupa de los elementos visuales e interactivos a través de los cuales el usuario se comunica con el sistema: botones, tipografía, colores, iconos, campos de texto y animaciones. Ben Shneiderman formuló ocho reglas fundamentales para el diseño de interfaces que constituyen una referencia clásica en el campo. Shneiderman (1992), citado por Hernández Bieliukas (2014), propone como principios esenciales: la coherencia en el uso de elementos visuales para que el usuario los reconozca de inmediato; la retroalimentación informativa ante cada acción del usuario; la estructuración del diálogo en secuencias con inicio, desarrollo y cierre claros; el manejo amable de los errores con sugerencias descriptivas; la posibilidad de deshacer acciones para reducir la ansiedad del usuario; y la reducción de la carga en la memoria a corto plazo mediante interfaces simples y reconocibles (p. 37).

### 2.1.4. Usabilidad

La usabilidad es el atributo de calidad que mide la facilidad con que los usuarios pueden aprender a utilizar un sistema, la eficiencia con que realizan tareas en él y el nivel de satisfacción que experimenta al hacerlo. La norma ISO/IEC 9241 (1998), citada por Hernández Bieliukas (2014), la define como "el grado en el que un producto software puede ser utilizado por usuarios específicos para alcanzar objetivos específicos con efectividad, eficiencia y satisfacción en un contexto de uso específico" (p. 93). Esta definición subraya que la usabilidad no es una propiedad intrínseca del sistema, sino que siempre es relacional: depende del usuario, de la tarea y del contexto. Jakob Nielsen (1993), uno de los principales referentes de la usabilidad, la articula en torno a cinco componentes medibles: facilidad de aprendizaje, eficiencia, memorabilidad, tolerancia a errores y satisfacción (Hernández Bieliukas, 2014, p. 93).

## 2.2. COMPUTACIÓN AFECTIVA E IHC AFECTIVA

La Interacción Humano-Computadora es una disciplina multidisciplinar que estudia el diseño, la evaluación y la implementación de sistemas informáticos interactivos para el uso humano. El grupo de interés especial SIGCHI de la Asociación para la Maquinaria Informática, la define como la "disciplina relacionada con el diseño, la evaluación e implementación de sistemas informáticos interactivos para el uso de los seres humanos, y con el estudio de los fenómenos más importantes con los que está relacionado" (Hernández Bieliukas, 2014, p. 13). Esta disciplina no se limita al hardware o el software de manera aislada; abarca también los modelos mentales de los usuarios, las tareas que desempeña el sistema, su adaptación a distintos contextos y el impacto organizacional y social de la tecnología interactiva.

Según Diaper (1989), citado por Hernández Bieliukas (2014), los objetivos centrales de la IHC son desarrollar o mejorar la seguridad, utilidad, efectividad, eficiencia y usabilidad de los sistemas que incluyan computadoras. Para lograrlo, Preece (1994), referenciado en el mismo texto, plantea que es necesario comprender los factores psicológicos, ergonómicos, organizativos y sociales que determinan cómo las personas trabajan con los ordenadores, para trasladar ese conocimiento al diseño de herramientas que permitan una interacción eficiente, efectiva y segura, tanto a nivel individual como grupal (p. 14). Esta perspectiva establece que la IHC no puede reducirse a un problema técnico, sino que es fundamentalmente un problema humano.

La evolución histórica de la IHC muestra un desplazamiento progresivo de enfoque. Hernández Bieliukas (2014) señala que la disciplina surgió alrededor de 1970, cuando los computadores comenzaron a masificarse, pero los diseñadores asumían erróneamente que los usuarios tendrían un alto conocimiento técnico. La realidad demostró que los usuarios típicos se sentían frustrados con sistemas difíciles de usar, lo que impulsó el giro hacia la usabilidad como criterio central de diseño (p. 206). A mediados de los años noventa, con la aparición de los medios digitales, web, dispositivos móviles, televisión interactiva, se incorporó un nuevo componente a la IHC: las emociones, a partir de lo cual surgió el concepto de experiencia de usuario (p. 207).

## 2.3. EMOCIONES EN ENTORNOS DIGITALES

### 2.3.1. Emociones en la interacción digital

Las emociones son estados complejos que combinan componentes fisiológicos, cognitivos, conductuales y subjetivos, y que motivan la acción humana en prácticamente todos los contextos de vida. Hernández Bieliukas (2014), apoyándose en Jacko y Sears (2008), señala que "la emoción es un componente fundamental de los seres humanos, motivan la acción y le dan significado y riqueza a prácticamente a toda la experiencia humana" (p. 209). En el campo de la IHC, las emociones adquieren un rol particular: determinan cómo el usuario evalúa una interfaz, qué tan motivado está para continuar usándola y qué recuerda de la interacción.

En los entornos digitales, las emociones se generan y se regulan bajo condiciones distintas a las de la interacción presencial. La ausencia de señales no verbales, expresiones faciales, tono de voz, contacto físico empobrece el canal emocional de la comunicación digital, lo que puede generar malentendidos, frialdad percibida y una sensación de distancia afectiva incluso cuando existe conectividad técnica. Picard (1997) ya advertía sobre este problema al señalar que el correo electrónico, limitado al texto, "lleva mucho menos información que una llamada telefónica" precisamente porque carece de los marcadores afectivos que enriquecen la comunicación (p. 10). Esta observación, formulada antes de la era de las redes sociales masivas, resulta más relevante que nunca en el contexto actual.

### 2.3.2. Regulación emocional

La regulación emocional es el proceso mediante el cual las personas influyen sobre las emociones que experimentan, cuándo las experimentan y cómo las expresan y sienten. Gross (1998) propone un modelo de proceso que distingue cinco familias de estrategias regulatorias: selección de la situación, modificación de la situación, despliegue atencional, cambio cognitivo y modulación de la respuesta (p. 275). Las estrategias más estudiadas son la revaluación cognitiva, que consiste en reinterpretar el significado de una situación antes de que la respuesta emocional se consolide, y la supresión expresiva, que implica inhibir la expresión de la emoción una vez que ya se ha generado. Gross (1998) demostró experimentalmente que la revaluación cognitiva es más adaptativa que la supresión: reduce la experiencia emocional negativa sin incrementar la activación fisiológica, mientras que la supresión reduce la expresión pero aumenta la activación simpática (p. 281).

### 2.3.3. Conexión social y bienestar emocional

La conexión social es una necesidad psicológica fundamental del ser humano. Hawkley y Cacioppo (2010) demostraron que la percepción de aislamiento social (la soledad) activa mecanismos de hipervigilancia ante amenazas, deteriora la calidad del sueño, eleva los niveles de cortisol y aumenta el riesgo de morbilidad y mortalidad, con efectos comparables a los del tabaquismo o la obesidad (p. 218). La soledad no es simplemente la ausencia de contacto social cuantitativo; es la discrepancia percibida entre las relaciones sociales deseadas y las realmente disponibles, lo que explica por qué una persona puede estar rodeada de contactos digitales y aun así sentirse profundamente sola.

Esta paradoja es precisamente la que experimenta la generación juvenil actual. Twenge et al. (2021) documentaron incrementos en la soledad escolar en 36 de 37 países entre 2012 y 2018, con casi el doble de adolescentes reportando niveles elevados de soledad en 2018 respecto a 2012, incrementos que fueron mayores entre las mujeres. Estos datos sugieren que el auge de la conectividad digital no ha reducido la soledad juvenil, sino que en muchos casos la ha agravado al sustituir la interacción presencial más emocionalmente intensa por interacciones digitales pasivas y superficiales.

### 2.3.4. Micro interacciones sociales positivas

Las micro interacciones sociales positivas son intercambios breves, intencionales y emocionalmente cargados entre personas, que generan respuestas de reconocimiento, pertenencia y bienestar en quien los recibe. Saffer (2013) define las micro interacciones como "contenido de diseño centrado en una sola acción e incorporado en un producto más amplio" (p. 1), y destaca que su poder reside precisamente en su brevedad: no requieren un compromiso prolongado para generar un efecto significativo. En el ámbito social, un mensaje breve de apoyo, una expresión de gratitud o un recordatorio de que alguien piensa en ti son ejemplos de micro interacciones que, aunque mínimas en extensión, tienen efectos medibles en la regulación emocional del receptor.

Clark, Algoe y Green (2018) demostraron que los actos de reconocimiento social positivo, incluso cuando son breves y digitalmente mediados, tienen efectos en la regulación emocional y en la percepción de pertenencia social del receptor.

## 2.4. METODOLOGÍA

El desarrollo de una aplicación móvil orientada al bienestar emocional no puede limitarse a decisiones técnicas o estéticas; requiere una metodología que coloque al usuario en el centro del proceso desde su inicio. En este sentido, la combinación del Design Thinking con el diseño de Experiencia de Usuario (UX) constituye el enfoque metodológico que sustenta el presente proyecto, ya que ambos comparten una orientación común: comprender profundamente al usuario para diseñar soluciones que respondan a sus necesidades reales y no a suposiciones del equipo de desarrollo.

### 2.4.1. Design Thinking

El Design Thinking es definido por Vargas Márquez, Inga Hanampa y Maldonado Portilla (2021) como "un modelo de cómo enfocar la innovación en entornos inciertos de forma ágil y radical" (p. 11), compuesto por herramientas que se aplican en función de la fase del proceso creativo en que se encuentre el equipo. Su estructura metodológica consta de cinco etapas principales: empatizar, definir, idear, prototipar y testear; las cuales no son lineales sino iterativas, permitiendo retornar a fases anteriores cuando los hallazgos así lo exigen.

**Figura 2.1**
_Etapas del Design Thinking_

> [Figura: cinco círculos de colores en secuencia: Empathize, Define, Ideate, Prototype, Test]

1. **La primera etapa, empatizar,** constituye la base de todo el proceso. Implica observar a los usuarios en su contexto, involucrarse en conversaciones con ellos y escuchar activamente sus necesidades, motivaciones y frustraciones. Vargas Márquez et al. (2021) señalan que "los problemas que tratas de resolver no son los tuyos, son problemas de otras personas. Para diseñar para estas personas debes adquirir la empatía por lo que ellos son como personas y lo que es importante para ellos" (p. 12). Esta etapa exige lo que los autores denominan un estado de inmersión, en el que el diseñador se sumerge en el contexto del usuario para comprenderlo en su totalidad.
2. **La segunda etapa, definir,** consiste en sintetizar la información recopilada durante la fase anterior para construir un planteamiento del problema claro y orientado al usuario. Vargas Márquez et al. (2021) la describen como el momento de "crear coherencia sobre la variada información que se ha reunido" (p. 12), con el objetivo de formular un Point of View (POV) que guíe las decisiones de diseño subsiguientes. Este POV debe enmarcar el problema de forma directa, ser inspirador para el equipo y capturar las necesidades reales de las personas estudiadas.
3. **La tercera etapa, idear,** abre el espacio a la generación de múltiples soluciones posibles sin restricciones prematuras. Se emplean técnicas como el brainstorming, los mapas mentales y los storyboards para explorar distintas alternativas antes de comprometerse con una sola dirección. Según Vargas Márquez et al. (2021), esta multiplicidad de ideas "permite aprovechar de mejor manera las distintas visiones de cada equipo de trabajo y el trabajo colectivo" (p. 13), incrementando las posibilidades de innovación y reduciendo el riesgo de soluciones obvias o poco creativas.
4. **La cuarta etapa, prototipar,** implica la construcción de representaciones tangibles de las soluciones propuestas. Vargas Márquez et al. (2021) destacan que el prototipo "vale mil imágenes" (p. 13) en términos de comunicación, ya que permite visualizar decisiones de diseño, iniciar conversaciones productivas con los usuarios y detectar errores de manera temprana y económica. Los prototipos no deben ser perfectos ni definitivos; su propósito es generar aprendizaje y retroalimentación, no representar el producto final.
5. **La quinta etapa, testear,** consiste en poner los prototipos en manos de los usuarios reales para recopilar retroalimentación cualitativa y cuantitativa. Vargas Márquez et al. (2021) recomiendan "siempre hacer un prototipo creyendo que estamos en lo correcto, pero debemos evaluar pensando que estamos equivocados" (p. 14), lo que garantiza una actitud crítica y abierta a la mejora continua. Esta etapa no solo sirve para refinar el prototipo, sino también para profundizar la comprensión del usuario y, en ocasiones, para redefinir el planteamiento del problema.

---

# CAPÍTULO 3. DESCONEXIÓN EMOCIONAL EN LAS REDES SOCIALES

## 3.1. Uso de redes sociales y soledad en jóvenes

La relación entre el uso de redes sociales y la soledad ha sido objeto de numerosas investigaciones en los últimos años, con resultados que durante mucho tiempo resultaron contradictorios. Sin embargo, la evidencia más reciente permite precisar en qué condiciones esta relación se manifiesta. Feng, Lien, Cian, Wang, Li, Chen y Wu (2026) realizaron un meta-análisis que sintetizó 59 estudios con 67 muestras independientes y un total de 81,344 participantes adolescentes y jóvenes adultos (edad media de 17.6 años), publicados entre el año 2000 y mayo de 2025. Los autores encontraron que el uso problemático de redes sociales —entendido como un patrón de uso compulsivo y difícil de controlar— mostró una asociación moderada y consistente con la soledad (r = 0,29), mientras que el tiempo total dedicado a las plataformas mostró una correlación considerablemente menor (r = 0,07). Este hallazgo es central para el presente proyecto, pues sugiere que la desconexión emocional juvenil no depende principalmente de la cantidad de horas de exposición a las redes sociales, sino del tipo de vínculo que la persona establece con su uso. En la misma línea, Godard y Holtzman (2024) desarrollaron un meta-análisis de 141 estudios con aproximadamente 145,000 participantes, centrado en comparar los efectos del uso activo (crear contenido, comentar, interactuar directamente con otros) frente al uso pasivo (observar contenido sin interactuar). Sus resultados mostraron que el uso activo se asoció de manera significativa con un mayor apoyo social percibido en línea (r = 0,34), mayor bienestar general (r = 0,15) y mayor afecto positivo (r = 0,11), mientras que la mayoría de los tamaños de efecto para otras variables resultaron insignificantes. Este hallazgo complementa al anterior: si bien el tiempo de uso por sí solo no predice la soledad, el tipo de interacción —particularmente la interacción activa y recíproca— sí se relaciona con mejores resultados emocionales.

## 3.2. Tipo de interacción digital como factor determinante

Más allá de establecer que existe una relación entre uso de redes sociales y bienestar emocional, resulta necesario identificar con precisión qué características de la interacción digital explican dicha relación. Liu, Pradhan y Wang (2026) realizaron una revisión sistemática siguiendo el protocolo PRISMA, en la cual analizaron 21 estudios empíricos publicados entre 2000 y 2024 sobre la asociación entre el uso de redes sociales y el aislamiento social en jóvenes adultos. Los autores organizaron los hallazgos en tres ejes temáticos: las motivaciones y patrones de uso de las plataformas, los efectos diferenciados de los canales de comunicación textual frente a los visuales, y la ausencia de asociación significativa en un subconjunto de estudios. Este último eje resulta relevante porque evidencia que la relación entre redes sociales y aislamiento no es uniforme, sino que depende de variables contextuales como el tipo de canal utilizado. Un estudio exploratorio realizado por Tian (2026) con 150 participantes chinos, si bien de alcance metodológico más limitado por el tamaño y la homogeneidad de su muestra, aporta evidencia consistente con lo anterior en un contexto cultural distinto: mediante el Social Media Activity Questionnaire (SMAQ), encontró que el uso activo se correlacionó negativamente con la comparación social, la depresión, la ansiedad y el estrés, mientras que el uso pasivo mostró el patrón inverso en las cuatro variables. Este resultado, aunque no generalizable por las limitaciones de la muestra, refuerza la idea de que el tipo de interacción —y no solamente la exposición a la plataforma— es un factor determinante del estado emocional del usuario. En conjunto, esta evidencia permite identificar un primer factor relevante para el diseño de la aplicación: los mecanismos que fomentan una interacción activa, directa y recíproca entre los usuarios tienden a asociarse con mejores resultados emocionales que aquellos que promueven el consumo pasivo de contenido.

## 3.3. Conexión abundante versus vínculo significativo

Un segundo eje de análisis se refiere a la naturaleza cualitativa de los vínculos que las plataformas digitales permiten construir. Smith, Leonis y Anandavalli (2021) plantean que la soledad no debe entenderse como la ausencia de contactos, sino como la discrepancia percibida entre las relaciones sociales deseadas y las relaciones efectivamente disponibles. Bajo esta perspectiva, un joven puede acumular cientos de contactos digitales y experimentar, al mismo tiempo, un nivel elevado de soledad, en la medida en que esos contactos no satisfacen su necesidad de conexión genuina. Esta idea encuentra respaldo conceptual en el modelo propuesto por Takano (2018), quien distingue entre dos formas de vinculación social: el cuidado social elaborado (_elaborate social grooming_), dirigido a relaciones cercanas y que da lugar a redes sociales reducidas pero profundas, y el cuidado social ligero (_lightweight social grooming_), característico de las redes sociales digitales, que permite mantener un número mucho mayor de contactos a costa de la profundidad del vínculo. Este modelo ofrece un marco explicativo para comprender por qué las plataformas actuales, orientadas a maximizar el número de conexiones, tienden a producir relaciones numerosas pero superficiales. Evidencia cualitativa reciente ilustra cómo los propios usuarios experimentan esta tensión. Parry, Kuit, Murray y van der Westhuizen (2026) analizaron las narrativas de una comunidad en línea orientada a reducir el uso de tecnología digital, y encontraron que sus miembros describen la tecnología simultáneamente como una vía de escape y como una fuente de angustia, desarrollando distintas estrategias para gestionar su relación con ella. Un tema recurrente en estas narrativas fue lo que los autores denominan la ilusión de la amistad significativa en línea, es decir, la percepción de que los vínculos construidos exclusivamente en el entorno digital no logran replicar la profundidad de una relación presencial.

## 3.4. Resultados de la encuesta diagnóstico aplicada al grupo objetivo

Esta sección se completa una vez aplicada la encuesta de diagnóstico descrita en el apartado 1.6.2 del presente documento, dirigida a jóvenes de 16 a 28 años. Se recomienda estructurar la presentación de resultados en los siguientes puntos:

- Caracterización de la muestra (edad, género, plataformas de uso frecuente).
- Nivel percibido de desconexión emocional al interactuar con redes sociales actuales.
- Percepción sobre la calidad versus la cantidad de contactos digitales.
- Valoración de elementos como métricas públicas (likes, seguidores, vistas) en la experiencia emocional del usuario.
- Interés y expectativas frente a una herramienta centrada en micro interacciones breves y significativas.

Los resultados obtenidos deberán contrastarse con los hallazgos reportados en las secciones 3.1 a 3.3, de manera que el diagnóstico no se sustente únicamente en la literatura, sino también en evidencia primaria recogida en el contexto local del proyecto.

## 3.5. Factores identificados que limitan la generación de vínculos significativos

A partir de la evidencia revisada, es posible sintetizar los siguientes factores que contribuyen a la desconexión emocional de los jóvenes en su interacción con las plataformas digitales actuales:

1. **Uso problemático más que uso extendido.** No es el tiempo de exposición a las redes sociales lo que se asocia con mayor soledad, sino un patrón de uso compulsivo y difícil de autorregular (Feng et al., 2026).
2. **Predominio del consumo pasivo sobre la interacción activa.** El consumo pasivo de contenido —observar sin interactuar— se asocia consistentemente con peores resultados emocionales que la interacción activa y recíproca (Godard & Holtzman, 2024; Tian, 2026).
3. **Ausencia de mecanismos que prioricen la calidad del vínculo.** Las plataformas actuales están diseñadas para maximizar el número de conexiones y el tiempo de uso, sin incorporar mecanismos que favorezcan la profundidad de la interacción (Takano, 2018).
4. **Presencia de métricas de comparación social.** Los elementos de validación pública propios de las redes sociales convencionales (likes, seguidores, vistas) están vinculados en la literatura a la comparación social ascendente, favoreciendo la sensación de inadecuación más que la conexión genuina.
5. **Percepción de superficialidad en los vínculos digitales.** Los propios usuarios identifican una brecha entre la cantidad de contactos digitales disponibles y la calidad de conexión emocional que estos les proporcionan (Smith et al., 2021; Parry et al., 2026).

---

# CAPÍTULO 4. EMPATÍA

El presente capítulo desarrolla la primera etapa del Design Thinking aplicada al presente proyecto: Empatizar. Esta fase tiene como propósito comprender en profundidad las necesidades, motivaciones y frustraciones de los jóvenes respecto a su experiencia con las redes sociales y la conexión emocional digital, complementando la evidencia documental presentada en el Capítulo 3 con evidencia primaria recolectada directamente del grupo objetivo. Para ello se aplicaron tres técnicas: una guía de entrevista cualitativa semiestructurada, la aplicación de dicha entrevista a seis participantes, y la Técnica de los 5 ¿Por qué? para profundizar en las causas raíz de los problemas identificados.

## 4.1. GUÍA DE LA ENTREVISTA CUALITATIVA

Con el objetivo de establecer una guía de apoyo para el desarrollo de las entrevistas, se elaboró un guion estructurado en tres momentos: introducción, preguntas personales, y dos bloques temáticos centrales (redes sociales y bienestar emocional), cerrando con una conclusión. El diseño de este instrumento se fundamentó en los factores de desconexión emocional identificados en el Capítulo 3, particularmente aquellos vinculados al tipo de interacción digital (Godard & Holtzman, 2024; Liu et al., 2026) y a la discrepancia entre conexión cuantitativa y vínculo significativo (Smith et al., 2021).

### 4.1.1. Introducción

Al inicio de cada entrevista se explicó el propósito del estudio, se solicitó el consentimiento para la grabación de la sesión y se enfatizó la confidencialidad de la información compartida por los participantes.

### 4.1.2. Preguntas personales

- ¿Cuál es tu nombre y edad?
- ¿A qué te dedicas actualmente (estudias, trabajas, ambas)?
- ¿Cuáles son las redes sociales o apps de mensajería que más usas en tu día a día?
- ¿Aproximadamente cuántas horas al día pasas en redes sociales?

### 4.1.3. Redes sociales

- ¿Sientes que la mayoría del tiempo estás interactuando con otras personas o más bien viendo contenido sin interactuar?
- ¿Puedes contarme sobre alguna vez que una interacción en redes sociales te haya hecho sentir realmente bien o conectado con alguien?
- ¿Y alguna vez que te haya hecho sentir mal, comparado(a), o más solo(a) de lo que ya estabas?
- ¿Qué opinas sobre los likes, seguidores o vistas? ¿Sientes que te generan algún tipo de presión o comparación?
- De tus contactos digitales, ¿cuántos dirías que son vínculos realmente significativos para ti?
- Si pudieras cambiar algo de cómo funcionan las redes sociales actuales, ¿qué cambiarías?
- Si tuvieras que enviar solo unos pocos mensajes breves al día a alguien nuevo, ¿sentirías que es más fácil o significativo si esa persona comparte algún interés contigo, o preferirías que sea totalmente al azar? ¿Por qué?
- Si tuvieras que personalizar cómo te representas en una app, por ejemplo con un avatar en vez de una foto real, ¿qué tan importante sería eso para ti?
- ¿Qué tan cómodo(a) te sentirías conversando con una persona que no conoces, aunque sea de forma anónima o con avatar? ¿Qué te generaría más confianza?

### 4.1.4. Bienestar emocional

- ¿Sientes que tienes suficientes personas con quienes hablar cuando necesitas apoyo?
- ¿Alguna vez has sentido que, a pesar de tener muchos contactos digitales, te sientes solo(a)?
- ¿Qué tipo de mensajes o gestos de otras personas te hacen sentir realmente acompañado(a) o valorado(a)?
- ¿Prefieres conversaciones largas y poco frecuentes, o mensajes breves pero más constantes? ¿Por qué?
- Cuando algo bueno te pasa en el día, ¿sueles compartirlo con alguien? ¿Con quién y por qué medio?
- Si existiera una app pensada exclusivamente para enviar y recibir mensajes breves y positivos entre personas, sin likes ni seguidores públicos, ¿qué esperarías de ella? ¿La usarías?
- ¿Hay algún tipo de mensaje o palabra que te gustaría recibir más seguido, pero que sientes que casi nunca recibes?
- Si usaras esta app, ¿cuántos mensajes o interacciones esperarías tener al día?

### 4.1.5. Conclusión

Se agradeció la participación y disposición de cada entrevistado, dando espacio a comentarios adicionales antes de finalizar la sesión.

## 4.2. APLICACIÓN DE LAS ENTREVISTAS

La guía descrita fue aplicada a seis jóvenes de entre 16 y 28 años (Usuario 1: Rolando Mercado Rojas, Usuario 2: Rubén Hernández Torrez, Usuario 3: Fernando José Pérez Armando, Usuario 4: Antonia Tapia, Usuario 5: Alejandra Pérez Ramal, Usuario 6: Renata Martínez Mitte), residentes en Cochabamba, Bolivia, reclutados a través de grupos digitales de contacto directo con el grupo objetivo. El criterio de selección priorizó la diversidad de perfiles (género, nivel de sociabilidad autopercibido) con el fin de enriquecer los hallazgos cualitativos, en línea con la recomendación de incorporar diversidad de perspectivas al construir mapas de empatía (Vargas Márquez et al., 2021). Las entrevistas tuvieron una duración aproximada de 20 a 30 minutos cada una, y sus resultados fueron sistematizados utilizando la técnica de Entrevistas Cualitativas de Design Thinking, organizada en cuatro categorías: necesidades, problemas, deseos y observaciones.

A continuación, se presentan de forma detallada los resultados de los Usuarios 1 y 4, seleccionados por representar perfiles contrastantes dentro de la muestra (un perfil introvertido con dificultad de vinculación frente a uno sociable con red de apoyo consolidada), lo cual permite ilustrar la amplitud de experiencias recogidas.

### 4.2.1. Usuario 1: Rolando Mercado Rojas

Rolando, de 25 años, estudiante universitario, presenta un uso moderado de redes sociales (1 a 2 horas diarias). Se define a sí mismo como una persona reservada e introspectiva, con dificultad para iniciar y mantener conversaciones tanto digitales como presenciales.

Entre los hallazgos más relevantes de esta entrevista destaca que Rolando no identifica ningún vínculo digital que considere significativo, pese a contar con un número considerable de seguidores en redes sociales, lo que evidencia la discrepancia entre conexión cuantitativa y vínculo cualitativo señalada por Smith et al. (2021) y por el modelo de vinculación social ligera y elaborada propuesto por Takano (2018). Asimismo, valida fuertemente dos decisiones de diseño relevantes para el presente proyecto: la preferencia por el emparejamiento basado en intereses compartidos, consistente con los hallazgos de Liu et al. (2026) sobre el rol del canal y contenido de la comunicación en la asociación entre redes sociales y aislamiento social, y el uso de un avatar en lugar de una fotografía real como medio de expresión.

**Figura 4.1**
_Entrevista cualitativa - Usuario 1 (Rolando Mercado Rojas)_

> [Figura: ficha "Entrevistas cualitativas" con columnas Necesidades, Problemas, Deseos y Observaciones.]
>
> **Necesidades:** sentirse comprendido sin presión de mantener conversación constante; espacios organizados por intereses/gustos compartidos; expresarse sin exponer identidad real; recibir reconocimiento y validación emocional; vínculos de bajo costo de mantenimiento (poca frecuencia, pero significativos).
>
> **Problemas:** consumo pasivo predominante (solo reacciona, no interactúa); cero vínculos digitales significativos actualmente; desconfianza al hablar con desconocidos, incluso en persona; se siente solo pese a tener muchos seguidores; hábito de resolver problemas solo, sin buscar apoyo; comparación social por logros de conocidos (no por likes); comparte logros solo vía estados públicos, no en privado a alguien.
>
> **Deseos:** emparejamiento por intereses/gustos en común; usar avatar en vez de foto real; uso una vez al día, de preferencia en la noche; recibir frases específicas de validación ("gracias por quedarte", "no es tu culpa"); reacciones más variadas (como WhatsApp, no como Facebook); app multiplataforma.
>
> **Observaciones:** reconoce tener un patrón evitativo y miedo al abandono/aprovechamiento por parte de otros. En la pregunta 7 del bienestar emocional, lo piensa mucho de qué decir o responderle. También dijo que tiene miedo a ser juzgado por sus gustos o eso vivió hace años atrás en épocas de secundaria. No ve necesario el WhatsApp, si no fuera por la universidad, no lo tendría. Fue bastante honesto durante la entrevista y dijo que lo pasó bien. Contradicción interesante: dice no afectarle los likes, pero sí lo afecta comparar logros de un amigo cercano por WhatsApp (sugiere que la comparación social no viene de métricas públicas sino de contenido cercano/personal). Valida fuertemente las decisiones de diseño: emparejamiento por intereses y uso de avatar. El único ejemplo de "conexión positiva" que dio fue mínimo (intercambio de cuentas de videojuego, sin diálogo real) sugiere que hasta un contacto breve sin conversación profunda ya genera bienestar si hay interés en común.

### 4.2.2. Usuario 4: Antonia Tapia

Antonia, de 20 años, estudiante, presenta un uso considerable de redes sociales (3 horas diarias). A diferencia de Rolando, cuenta con una red de apoyo sólida y vínculos significativos ya establecidos, mostrando un perfil más sociable, aunque igualmente crítico frente a las dinámicas actuales de las redes sociales.

Antonia expresó reservas respecto al formato de mensajes exclusivamente breves, señalando que en ocasiones necesita mayor espacio para expresarse. Este hallazgo resulta relevante frente al concepto de micro interacciones sociales positivas de Saffer (2013), pues sugiere que la brevedad, si bien valiosa como principio general, no debe aplicarse de forma rígida para todos los perfiles de usuario. Asimismo, destacó la importancia de que el avatar refleje rasgos identitarios reales, matizando la idea inicial de que el avatar debía funcionar como anonimato total.

**Figura 4.2**
_Entrevista cualitativa - Usuario 4 (Antonia Tapia)_

> [Figura: ficha "Entrevistas cualitativas" con Necesidades, Problemas, Deseos y Observaciones.]
>
> **Necesidades:** espacios de debate respetuoso, sin insultos ni haters; contenido segmentado a públicos afines (evitar exposición a lo que no le interesa); emparejamiento por gustos específicos y particulares (ej. videojuegos poco populares); preservar su individualidad y espacio personal.
>
> **Problemas:** le afectan los estándares de belleza irreales que ve en redes; rara vez encuentra con quién hablar de sus intereses muy específicos (ej. Salty Face); los extraños con gustos afines que ha conocido "aún no aportan" a su vida diaria; considera que una app de solo texto breve sería insuficiente para expresarse bien.
>
> **Deseos:** avatar personalizable con rasgos identitarios propios (lentes, pelo largo, lunares, piercings); posibilidad de enviar mensajes más elaborados, tipo "story time", no solo texto corto; pocas conversaciones, pero significativas; debates de opinión respetuosos, no hostiles.
>
> **Observaciones:** ya cuenta con una red de apoyo sólida (amigos presenciales, pareja), su necesidad de vínculo digital es más de intereses específicos que de compañía emocional básica. Es la única entrevistada que expresó reserva ante el formato de "mensajes breves" tal como se planteó, prefiere poder explayarse cuando el tema lo amerita. Diferencia importante: no busca anonimato total en el avatar, sino que este refleje su identidad real (lentes, pelo), matiza la idea de "avatar = anonimato". En los 5 ¿Por qué?, su causa raíz repetida es la preferencia consciente por la soledad/individualidad, no por incapacidad social, perfil distinto a los usuarios 1-3.

### 4.2.3. Usuarios 2, 3, 5 y 6

De manera complementaria, el mismo instrumento fue aplicado a los Usuarios 2 (Rubén Hernández Torrez), 3 (Fernando José Pérez Armando), 5 (Alejandra Pérez Ramal) y 6 (Renata Martínez Mitte). De forma consistente con los Usuarios 1 y 4, estos cuatro participantes reportaron dificultades para sostener vínculos digitales significativos —coincidiendo con el patrón de soledad juvenil creciente documentado por Twenge et al. (2021) y por el meta-análisis de Feng et al. (2026), según el cual la asociación entre redes sociales y soledad depende más del tipo de uso que del tiempo de exposición—, así como preocupación por la hostilidad o desconfianza hacia desconocidos en línea, y una valoración positiva hacia el emparejamiento por intereses compartidos y el uso de avatares como medio de expresión.

## 4.3. TÉCNICA DE LOS 5 ¿POR QUÉ?

Con el objetivo de profundizar en las causas raíz de los problemas identificados durante las entrevistas, se aplicó la Técnica de los 5 ¿Por qué? a cuatro problemas recurrentes: la soledad pese a tener múltiples contactos digitales, el predominio del consumo pasivo sobre la interacción activa, la comparación social generada por likes y seguidores, y la dificultad para generar conversaciones significativas con desconocidos. Esta técnica permitió superar la descripción superficial de los síntomas para llegar a explicaciones más profundas, en coherencia con el enfoque de inmersión propuesto por Vargas Márquez et al. (2021) para la etapa de empatizar.

A continuación, se presentan los resultados detallados de los Usuarios 1 y 5, seleccionados por ilustrar dos causas raíz distintas y complementarias entre sí.

### 4.3.1. Usuario 1: Rolando Mercado Rojas

**Figura 4.3**
_Técnica de los 5 ¿Por qué? - Usuario 1 (Rolando Mercado Rojas)_

| Problema                                                                    | ¿Por qué? 1                                                            | ¿Por qué? 2                                                              | ¿Por qué? 3                                                                      | ¿Por qué? 4                                       | ¿Por qué? 5                                                                    |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------ |
| Siento soledad a pesar de tener muchos contactos digitales                  | Porque es distinto cuando alguien está a tu lado que de manera digital | Cuando estoy en persona me hace caso pero por digital no se sabe         | Porque no siento que no estoy hablando con una persona si no con una computadora | No puedo ver expresiones, siento que es muy plano | En la voz también se puede entender las expresiones                            |
| Paso más tiempo viendo contenido que interactuando con otras personas       | Veo mucho contenido para aprender y me siento más feliz                | Es por el tiktok, casi no hay cosas que me impresionen                   | Probar nuevas cosas, las rutinas me parecen aburridas                            | Me siento estancado si hago lo mismo              | Con respecto al tiktok, no me concentro fácilmente, es difícil                 |
| Los likes/seguidores me generan comparación o presión                       | A otros les veía va mejor que a mí, ya que tienen más apoyo            | Talvez por que sería que son menores a mí, han tomado mejores decisiones | Ahora tengo que mejorar para poder alcanzarlos                                   | A veces si siento que mejoro y a veces no         | Por que es muy difícil escoger entre que camino seguir y otros tienen una guía |
| Me cuesta generar una conversación significativa con alguien que no conozco | No lo conozco, no se que le gusta o incomodo                           | Siento que hay personas que no les gusta que los hablen                  | Siempre me costó entender a las personas, y alguien nuevo                        | No se como iniciar una conversación               | En eventos o algo en común lo haría, pero si no hay, no sabría de que hablar   |

El análisis reveló que, para Rolando, la causa raíz de la desconexión digital radica en la ausencia de señales no verbales en la comunicación en línea, lo que hace que la interacción se perciba como poco genuina en comparación con el contacto presencial. Este hallazgo confirma empíricamente la advertencia de Picard (1997) respecto al empobrecimiento del canal emocional en la comunicación mediada por texto.

### 4.3.2. Usuario 5: Alejandra Pérez Ramal

**Figura 4.4**
_Técnica de los 5 ¿Por qué? - Usuario 5 (Alejandra Pérez Ramal)_

| Problema                                                                    | ¿Por qué? 1                                    | ¿Por qué? 2                                          | ¿Por qué? 3                                | ¿Por qué? 4                                          | ¿Por qué? 5                    |
| --------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------- | ------------------------------ |
| Siento soledad a pesar de tener muchos contactos digitales                  | Porque me cuesta confiar                       | Porque me hicieron daño                              | Porque supuestamente soy muy intensa       | Porque mi manera de querer es muy expresiva          | Porque soy así                 |
| Paso más tiempo viendo contenido que interactuando con otras personas       | Porque no se cómo interactuar con el contenido | Porque no sé qué le gustaría al creador de contenido | Porque nunca fui creadora de contenido     | Porque nunca me animé y tampoco sé qué hacer ni cómo | Porque no me llama la atención |
| Los likes/seguidores me generan comparación o presión                       | Porque quiero ser famosa                       | Porque quiero que me conozca la gente                | Porque quiero que se me reconozca por algo | Porque quiero destacar                               | Porque me gusta destacar       |
| Me cuesta generar una conversación significativa con alguien que no conozco | Porque no hay confianza de mi parte            | Porque no conozco a la persona                       | Porque no sé quién es esa persona          | Porque no sé cómo será esa persona                   | Porque no la conocí            |

En este caso, la causa raíz identificada se vincula a experiencias previas de conflicto derivadas de una forma intensa y expresiva de relacionarse, lo que ha generado cierta cautela al momento de establecer nuevos vínculos digitales. Este hallazgo resulta consistente con los procesos de regulación emocional descritos por Gross (1998), particularmente en lo referido a la modulación de la respuesta tras experiencias emocionalmente intensas.

### 4.3.3. Usuarios 2, 3, 4 y 6

El mismo análisis fue aplicado a los Usuarios 2 (Rubén Hernández Torrez), 3 (Fernando José Pérez Armando), 4 (Antonia Tapia) y 6 (Renata Martínez Mitte). En conjunto, las causas raíz identificadas a través de esta técnica coinciden en tres ejes: la falta de confianza inicial hacia desconocidos, la ausencia de un tema o interés en común que facilite el inicio de la conversación, y el temor a ser juzgado o rechazado al exponerse emocionalmente. Estos ejes son coherentes con la caracterización de la soledad como discrepancia entre las relaciones deseadas y las disponibles (Hawkley & Cacioppo, 2010), y con la noción de "ilusión de amistad significativa en línea" documentada por Parry et al. (2026).

## 4.4. SÍNTESIS DE LA FASE EMPATIZAR

La aplicación de las técnicas descritas en el presente capítulo permitió confirmar, desde la evidencia primaria, los factores identificados previamente a partir de la literatura en el Capítulo 3. De manera consistente entre los seis participantes, se evidenció: (a) la existencia de vínculos digitales numerosos pero de bajo significado emocional, en línea con Smith et al. (2021) y Takano (2018); (b) una fuerte preferencia por el emparejamiento basado en intereses o gustos compartidos como facilitador de la conversación, consistente con Liu et al. (2026); (c) una valoración positiva del uso de avatares como medio de expresión frente a la exposición de la identidad real; y (d) una necesidad explícita de mecanismos que generen confianza y seguridad frente a la interacción con desconocidos. Estos hallazgos constituyen la base para la construcción del planteamiento del problema y la definición del punto de vista de diseño que se desarrolla en el Capítulo 5.

---

# CAPÍTULO 5. DEFINIR

El presente capítulo desarrolla la segunda etapa del Design Thinking: Definir. Su propósito es sintetizar la información recopilada durante la fase de Empatizar para construir un planteamiento del problema claro y orientado al usuario, formulando un Point of View (POV) que guíe las decisiones de diseño en las etapas subsiguientes (Vargas Márquez et al., 2021). Para ello se aplicaron cuatro técnicas: Perfil de Usuario, Mapa de Empatía, Mapa de Motivaciones y la técnica ¿Cómo podríamos...?

## 5.1. PERFIL DE USUARIO

Con el objetivo de contar con una referencia clara de los usuarios entrevistados durante las siguientes fases del proyecto, se elaboró un perfil individual para cada participante, sintetizando su biografía, objetivos, personalidad y frustraciones. A continuación, se presentan los perfiles de los Usuarios 1 y 5, seleccionados por representar dos formas distintas de experimentar la desconexión emocional: una vinculada a la dificultad de iniciar vínculos (introversión), y otra vinculada a la cautela derivada de experiencias relacionales previas.

### 5.1.1. Usuario 1: Rolando Mercado Rojas

El perfil de Rolando ilustra un patrón de aislamiento emocional pese a la conectividad digital, consistente con la discrepancia entre relaciones deseadas y disponibles descrita por Hawkley y Cacioppo (2010). Su frustración central, no tener ningún vínculo digital que considere significativo, sintetiza de forma individual la paradoja documentada a nivel poblacional por Feng et al. (2026).

**Figura 5.1**
_Perfil de usuario - Usuario 1 (Rolando Mercado Rojas)_

> [Figura: ficha "Perfil de usuario".]
> **Nombre:** Rolando Mercado Rojas · **Edad:** 25 años · **Profesión:** Estudiante · **Estado civil:** Soltero · **País:** Bolivia
> **Frase:** "Prefiero hablar en persona, y también me cuesta porque no suelen ser personas de mis mismas cosas en común."
> **Biografía:** joven estudiante universitario con uso moderado de redes sociales (1-2 horas al día). Se define como reservado e introspectivo, con dificultad para iniciar y mantener conversaciones, tanto digitales como presenciales, y prefiere el contacto en persona porque la interacción digital le resulta "plana" al faltar expresiones faciales. Tiende a resolver sus problemas de forma independiente. Menciona convivir con TDA/TDH, lo que asocia a su preferencia por contenido nuevo y variado antes que la rutina.
> **Objetivos:** conectar con personas que compartan sus mismos gustos e intereses (ej. videojuegos como Fortnite); sentirse comprendido sin la presión de mantener conversaciones constantes; recibir palabras de reconocimiento y validación emocional genuina; encontrar mayor claridad sobre qué camino seguir en su vida.
> **Personalidad:** introvertido; reservado / evitativo; independiente (resuelve problemas solo); honesto y reflexivo al expresarse; con dificultad de concentración (TDA/TDH autorreportado).
> **Frustraciones:** no tiene ningún vínculo digital que considere significativo; se siente solo pese a tener muchos seguidores en redes; le cuesta iniciar conversación con desconocidos, incluso en persona; miedo a ser juzgado por sus gustos (experiencia pasada en secundaria); percibe que las personas a veces se aprovechan de él por su forma de ser evitativa; se compara con pares que percibe con más apoyo o decisiones de vida más claras.

**Figura 5.2**
_Perfil de usuario - Usuario 5 (Alejandra Pérez Ramal)_

> [Figura: ficha "Perfil de usuario".]
> **Nombre:** Alejandra Pérez Ramal · **Edad:** anónimo · **Profesión:** Estudia · **Estado civil:** Soltero · **País:** España
> **Frase:** "Preferiría compartir gustos, así podríamos charlar más tiempo y esa persona se lo pasaría bien."
> **Biografía:** estudiante, con un uso moderado de redes sociales (2 horas al día), principalmente para consumir contenido en Instagram y TikTok. Señala tener varias personas de apoyo y algunas amistades significativas surgidas de comunidades de videojuegos, aunque no logra identificar una interacción puntual en redes sociales que la haya hecho sentir realmente conectada. Reporta sentirse sola en ciertos momentos, a pesar de contar con esa red. Valora los espacios libres de toxicidad y el respeto a su privacidad.
> **Objetivos:** conectar con personas que compartan sus mismos gustos; contar con un espacio de apoyo emocional accesible; expresarse de forma creativa a través de un avatar.
> **Personalidad:** sociable, con vínculos tanto presenciales como digitales; creativa (particularmente en la personalización de avatares); poco afectada por métricas públicas de validación (likes/seguidores); valora su privacidad frente a desconocidos.
> **Frustraciones:** lo tóxico presente en las redes sociales actuales; no identifica interacciones puntuales en redes que le generen conexión real; sensación ocasional de soledad, pese a contar con apoyo.

### 5.1.2. Usuario 5: Alejandra Pérez Ramal

El perfil de Alejandra aporta un matiz relevante al planteamiento del problema: a diferencia de Rolando, cuenta con vínculos significativos previos, surgidos de comunidades de videojuegos, lo que valida empíricamente el emparejamiento por intereses compartidos como mecanismo efectivo de vinculación (Liu et al., 2026). Sin perjuicio de ello, su experiencia de cautela relacional evidencia que la calidad del vínculo depende también de la gestión emocional de la interacción, y no únicamente de la afinidad temática.

### 5.1.3. Usuarios 2, 3, 4 y 6

De manera complementaria, se elaboraron los perfiles de los Usuarios 2 (Rubén Hernández Torrez), 3 (Fernando José Pérez Armando), 4 (Antonia Tapia) y 6 (Renata Martínez Mitte), cuyos perfiles refuerzan los hallazgos ya descritos: predominio del consumo pasivo, escasez de vínculos digitales significativos, y una valoración compartida hacia mecanismos de emparejamiento por afinidad y personalización mediante avatares.

## 5.2. MAPA DE EMPATÍA

Con el objetivo de sistematizar visualmente lo que cada usuario piensa, siente, escucha, ve, habla y hace, así como sus dolores y necesidades, se elaboró un Mapa de Empatía por participante, a partir de la información recogida en las entrevistas.

### 5.2.1. Usuario 1: Rolando Mercado Rojas

El mapa evidencia que la percepción de la comunicación digital como "plana", debido a la ausencia de expresiones y tono de voz, constituye un dolor central para Rolando, confirmando la advertencia de Picard (1997) sobre el empobrecimiento del canal emocional en la comunicación mediada por texto.

**Figura 5.3**
_Mapa de empatía - Usuario 1 (Rolando Mercado Rojas)_

> [Figura: Mapa de empatía.]
> **¿Qué piensa y siente?** Le cuesta mantener vínculos digitales por falta de tiempo e intereses en común; cree que puede resolver sus problemas sin ayuda de otros; teme ser juzgado por sus gustos (experiencia de secundaria); valoraría más un vínculo esporádico pero genuino que uno frecuente y superficial; percibe la interacción digital como "plana" por la ausencia de expresiones y tono; su TDA/TDH lo lleva a preferir la novedad sobre la rutina.
> **¿Qué escucha?** Comentarios sobre logros de conocidos cercanos (ej. un amigo consiguiendo trabajo) que le generan comparación; denuncias o contenido de agresión que le impactan emocionalmente al verlas en redes; silencio de sus propios contactos digitales, no recibe iniciativa de conversación de otros.
> **¿Qué ve?** Cientos de seguidores en Instagram con quienes no tiene ninguna conexión real; reacciones limitadas en plataformas como Facebook (pocas opciones); estados de WhatsApp de personas con logros o vida "avanzando", mientras él prefiere no publicar directamente a nadie; pares que percibe con más apoyo o que ya tomaron decisiones de vida más claras que las suyas.
> **¿Qué habla y hace?** Solo reacciona a contenido, casi no comenta ni inicia conversación; comparte sus logros únicamente por estados públicos, nunca en mensaje directo a alguien; evita el conflicto o la interacción prolongada; prioriza el encuentro presencial sobre el digital; fue honesto y reflexivo durante la entrevista, mostrando apertura pese a su perfil reservado.
> **¿Cuáles son sus dolores?** No tiene ningún vínculo digital que considere significativo; se siente solo pese a tener muchos contactos/seguidores; le cuesta iniciar conversación, incluso en persona; percibe que a veces las personas se aprovechan de su actitud evitativa; miedo a exponerse y ser juzgado; comparación constante con pares que percibe con más claridad o avance en su vida.
> **¿Cuáles son sus necesidades?** Conectar con personas que compartan sus mismos intereses (reduce la barrera de iniciar conversación); un punto de partida claro o "tema en común" que le facilite saber de qué hablar; expresarse mediante un avatar en vez de una foto real; recibir mensajes de validación específicos ("gracias por quedarte", "no es tu culpa"); interacciones de baja frecuencia pero de alto significado (no constantes); un espacio con menor exposición pública que las redes sociales tradicionales.

### 5.2.2. Usuario 5: Alejandra Pérez Ramal

En el caso de Alejandra, el mapa revela una necesidad de protección de la privacidad frente a desconocidos como condición previa para la confianza, lo que resulta coherente con los mecanismos de seguridad y moderación contemplados en el alcance del proyecto.

**Figura 5.4**
_Mapa de empatía - Usuario 5 (Alejandra Pérez Ramal)_

> [Figura: Mapa de empatía.]
> **¿Qué piensa y siente?** Piensa que compartir gustos en común facilita charlas más largas y agradables; no le preocupan mucho los likes ni la frecuencia de uso de una app; a veces siente soledad, pese a decir que cuenta con mucho apoyo; no identifica ninguna interacción en redes que la haya hecho sentir "realmente conectada".
> **¿Qué escucha?** Conversaciones sobre temas actuales o gustos compartidos con sus amistades; comentarios de otros consolándola cuando se desahoga.
> **¿Qué ve?** Toxicidad en las interacciones dentro de redes sociales; personas muy enfocadas en likes y reconocimiento público, a diferencia de ella.
> **¿Qué habla y hace?** Consume más contenido del que interactúa activamente; comparte momentos buenos de su día con personas que le caen bien, tanto en internet como en persona; cuida su privacidad, evitando compartir datos personales con desconocidos.
> **¿Cuáles son sus dolores?** No logra identificar experiencias de conexión genuina puntuales en redes sociales; exposición a ambientes tóxicos en redes sociales; sensación ocasional de soledad pese a decir tener suficiente apoyo.
> **¿Cuáles son sus necesidades?** Emparejamiento por intereses/gustos en común; espacio de apoyo emocional sin exposición público; posibilidad de personalización creativa (avatar); protección y resguardo de su información personal.

### 5.2.3. Usuarios 2, 3, 4 y 6

Los Mapas de Empatía correspondientes a los Usuarios 2 (Rubén Hernández Torrez), 3 (Fernando José Pérez Armando), 4 (Antonia Tapia) y 6 (Renata Martínez Mitte) confirman de forma reiterada los mismos dolores y necesidades: escasos vínculos digitales significativos, exposición a ambientes hostiles o de comparación social, y una necesidad compartida de espacios que prioricen la calidad de la interacción sobre la exposición pública.

## 5.3. MAPA DE MOTIVACIONES

Con el objetivo de identificar variables positivas compartidas entre los distintos usuarios respecto a sus necesidades, se elaboró un Mapa de Motivaciones cruzando la información de los seis participantes entrevistados.

El análisis cruzado permitió identificar tres motivaciones que se repiten de manera consistente entre la mayoría de los participantes: (a) la necesidad de un interés o gusto en común como facilitador de la conversación, presente en 13 de los 15 cruces analizados; (b) la preferencia por el uso de un avatar como medio de expresión y resguardo de la identidad, presente en 12 de los 15 cruces; y (c) la necesidad de un entorno libre de hostilidad o conflicto, presente en 6 de los 15 cruces. Estos hallazgos, obtenidos de forma inductiva a partir de la evidencia primaria, coinciden con los factores identificados deductivamente a partir de la literatura en el Capítulo 3, en particular con los planteamientos de Godard y Holtzman (2024) sobre el valor del uso activo y recíproco, y con el modelo de vinculación social propuesto por Takano (2018).

**Figura 5.5**
_Mapa de motivaciones_

> [Figura: matriz 6×6 de cruces entre Rolando Mercado, Rubén Hernández, Fernando Pérez, Antonia Tapia, Alejandra Pérez y Renata Martínez, con la motivación compartida en cada celda (por ejemplo: tema en común para iniciar la conversación; uso de avatar para resguardar la identidad; entorno respetuoso libre de juicios o de hostilidad; valoración de mensajes positivos; preferencia por vínculos significativos sobre la cantidad; emparejamiento por intereses y valores compartidos).]

## 5.4. ¿CÓMO PODRÍAMOS...?

A partir de los conocimientos sintetizados en el Mapa de Motivaciones, se aplicó la técnica ¿Cómo podríamos...? con el objetivo de convertir dichos hallazgos (insights) en preguntas orientadoras que faciliten la posterior generación de ideas en la etapa de Idear.

Las preguntas formuladas abordan los cinco conocimientos centrales derivados de la fase de Empatizar: la necesidad de intereses compartidos, la preferencia por el uso de avatares, el temor a la hostilidad o a interactuar con desconocidos, la preferencia por vínculos pocos pero significativos, y la preferencia por mensajes positivos libres de métricas públicas de validación. Estas preguntas constituyen el punto de partida directo para la generación de ideas desarrollada en el Capítulo 6.

**Figura 5.6**
_Técnica ¿Cómo podríamos...?_

| Conocimiento                                                                                               | ¿Cómo podríamos...?                                                          | ¿Cómo podríamos...?                                                           | ¿Cómo podríamos...?                                                      | ¿Cómo podríamos...?                                                                   | ¿Cómo podríamos...? |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------- |
| La mayoría necesita de compartir gustos/intereses para poder iniciar y sostener una conversación           | identificar los intereses de un usuario antes de emparejarlo con otro?       | sugerir temas de conversación basados en gustos compartidos?                  | mostrar visualmente qué tienen en común dos usuarios antes de chatear?   | evitar que el emparejamiento se sienta forzado si hay pocos intereses en común?       | —                   |
| Casi todos prefieren usar un avatar en vez de una foto real                                                | permitir que el avatar refleje la personalidad o identidad real del usuario? | hacer para que un avatar sea una experiencia entretenida y no solo funcional? | equilibrar el anonimato con una sensación de autenticidad en el avatar?  | usar el avatar como forma de romper el hielo en la conversación?                      | —                   |
| Existe temor a ser juzgado, a la hostilidad, o a que alguien tenga malas intenciones                       | generar un espacio seguro para conversar con desconocidos?                   | reducir el hate o la toxicidad dentro de la app?                              | dar mecanismos de reporte/bloqueo sin que interrumpan la experiencia?    | transmitir confianza antes de que el usuario inicie su primera conversación?          | —                   |
| Muchos se sienten solos a pesar de tener contactos digitales, y valoran pocos vínculos pero significativos | priorizar la calidad de la interacción sobre la cantidad de contactos?       | hacer que cada mensaje breve se sienta significativo y no trivial?            | ayudar a que un vínculo esporádico se sostenga en el tiempo?             | medir el éxito de la app en bienestar emocional y no en métricas de uso?              | —                   |
| Prefieren mensajes positivos y de validación, sin likes ni exposición pública                              | fomentar mensajes de apoyo y reconocimiento entre usuarios?                  | evitar cualquier métrica pública que genere comparación (likes, seguidores)?  | sugerir tipos de mensajes positivos cuando el usuario no sabe qué decir? | hacer que recibir un mensaje se sienta como un pequeño momento significativo del día? | —                   |

## 5.5. PLANTEAMIENTO DEL PROBLEMA (POINT OF VIEW)

A partir de la síntesis de la evidencia documental (Capítulo 3) y de la evidencia primaria recolectada en el presente capítulo, se formula el siguiente planteamiento del problema (POV), en los términos propuestos por Vargas Márquez et al. (2021):

> Los jóvenes de 16 a 28 años necesitan un espacio digital que priorice la calidad de la interacción sobre la cantidad de conexiones, porque las plataformas actuales, centradas en el consumo pasivo de contenido y en métricas públicas de validación, no logran satisfacer su necesidad de vínculos genuinos, generando una desconexión emocional pese a la hiperconectividad.

Este planteamiento integra los hallazgos más consistentes de la fase de Empatizar —la necesidad de afinidad temática, la preferencia por el anonimato progresivo mediante avatares, la exigencia de seguridad frente a desconocidos y la preferencia por vínculos escasos pero significativos— y constituye la base sobre la cual se desarrollan las técnicas de generación de ideas en el Capítulo 6.

---

# REFERENCIAS BIBLIOGRÁFICAS

> Formato APA 7.ª edición. Las referencias de la sección A provienen del archivo .bib proporcionado. La sección B lista las obras citadas en el texto que **no estaban en el .bib**; sus datos están marcados para verificación antes de entregar.

## A. Referencias del archivo .bib

Feng, H.-P., Lien, Y.-J., Cian, S.-Y., Wang, W.-Y., Li, Y.-T., Chen, C.-H., & Wu, Y.-Y. (2026). Exploring the relationship between social media use and loneliness in adolescents and young adults: A systematic review and meta-analysis. _Social Psychiatry and Psychiatric Epidemiology, 61_(8), 1345–1359. https://doi.org/10.1007/s00127-026-03175-4

Godard, R., & Holtzman, S. (2024). Are active and passive social media use related to mental health, wellbeing, and social support outcomes? A meta-analysis of 141 studies. _Journal of Computer-Mediated Communication, 29_(1), zmad055. https://doi.org/10.1093/jcmc/zmad055

Liu, Y., Pradhan, S., & Wang, X. (2026). The relationship between social media use and social isolation in young adults: A systematic review. _Information, Communication & Society_. https://doi.org/10.1080/1369118X.2026.2674934

Parry, D. A., Kuit, C., Murray, A., & van der Westhuizen, A. (2026). Connect to disconnect: What an online community for digital disconnection can tell us about digital well-being. _New Media & Society, 28_(8), 4303–4323. https://doi.org/10.1177/14614448251362436

Smith, D., Leonis, T., & Anandavalli, S. (2021). Belonging and loneliness in cyberspace: Impacts of social media on adolescents' well-being. _Australian Journal of Psychology, 73_(1), 12–23. https://doi.org/10.1080/00049530.2021.1898914

Takano, M. (2018). Two types of social grooming methods depending on the trade-off between the number and strength of social relationships. _Royal Society Open Science, 5_(8), 180148. https://doi.org/10.1098/rsos.180148

Tian, W. (2026). The role of active vs. passive social media use on mental health. _Lecture Notes in Education Psychology and Public Media, 122_(1), 30–36. https://doi.org/10.54254/2753-7048/2026.HT29949

Tufail, M., Yaqoob, M., Shafqat, S., Tufail, M. S., & Khan, M. U. (2025). The impact of social media and smartphone addiction on the quality of interpersonal relationships among university students. _Social Sciences Spectrum, 4_(2), 478–486. https://doi.org/10.71085/sss.04.02.285

> ⚠️ Tufail et al. (2025) está en el .bib pero **no se cita en ningún punto del texto**. Citarla (por ejemplo en 3.3 o 3.5, factor 5) o retirarla.

## B. Obras citadas en el texto sin ficha en el .bib (completar y verificar)

- Baudon, P., & Jachens, L. (2021). _[título, revista, volumen, páginas, DOI: completar]_.
- Clark, M. S., Algoe, S. B., & Green, M. (2018). _[verificar título y revista, DOI: completar]_.
- Diaper, D. (1989). _[citado por Hernández Bieliukas, 2014; completar o citar solo la fuente secundaria]_.
- Gross, J. J. (1998). _[verificar título, Review of General Psychology, 2(3), 271–299, DOI: completar]_.
- Hawkley, L. C., & Cacioppo, J. T. (2010). _[verificar título, Annals of Behavioral Medicine, 40(2), 218–227, DOI: completar]_.
- Hernández Bieliukas, R. (2014). _[título de la obra, editorial/universidad, URL: completar]_.
- Jacko, J. A., & Sears, A. (2008). _[citado por Hernández Bieliukas; completar o citar solo la fuente secundaria]_.
- Morville, P. (2005). _[citado por Hernández Bieliukas; completar o citar solo la fuente secundaria]_.
- Nielsen, J. (1993). _Usability engineering_. _[verificar editorial]_.
- Norman, D. A. (2013). _The design of everyday things_ (ed. rev. y ampl.). Basic Books. _[verificar]_
- Picard, R. W. (1997). _Affective computing_. MIT Press. _[verificar]_
- Preece, J. (1994). _[citado por Hernández Bieliukas; completar o citar solo la fuente secundaria]_.
- Saffer, D. (2013). _Microinteractions: Designing with details_. O'Reilly Media. _[verificar]_
- Shneiderman, B. (1992). _Designing the user interface_. _[verificar edición y editorial]_.
- Twenge, J. M., et al. (2021). _[verificar título, revista y DOI; el texto del PDF tiene una palabra "ScienceDirect" pegada por error en 2.3.3]_.
- Vakili, _[inicial]_. (2024). _[título, revista, DOI: completar]_.
- Vargas Márquez, Inga Hanampa, & Maldonado Portilla (2021). _[verificar iniciales, título y editorial]_.
- Yablonski, J. (2020). _Laws of UX_. O'Reilly Media. _[verificar]_. Yablonski, J. (2024). _[completar; se cita para el Umbral de Doherty]_.
- ISO DIS 9241-210 (2010) e ISO/IEC 9241 (1998): normas citadas vía Hernández Bieliukas (2014).
- "Social connection as a key target for youth mental health" (2025): _[completar autores, revista y DOI]_.
