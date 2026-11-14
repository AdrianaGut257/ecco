# Sugerencias para ECHOOM (rama `Eliminar`)

Propuestas de mejora para revisar antes de pasarlas a `Adriana`. La sección 1 ya está implementada en esta rama; la 2 y la 3 son ideas para decidir.

## 1. Implementadas en esta rama

| Función | Qué hace | Por qué |
|---|---|---|
| **Pregunta del día** | En el separador del día de hoy, el chat propone una pregunta (7 en total, de lo más liviano a lo más personal). Al tocarla se escribe en el campo para editarla. | Ataca la causa raíz "no sé de qué hablar" y genera cercanía gradual (Aron et al., 1997). Complementa las ideas para romper el hielo, que son sobre gustos; la pregunta es sobre la persona. |
| **Aviso con cariño** | Si la otra persona compartió que hoy se siente "Mal" o "Fatal", aparece un aviso sobre el campo: "Luis hoy no se siente muy bien…" con el botón "Escribir con cariño". Se puede cerrar. | Hace útil el ánimo compartido: no solo se ve, sino que invita a actuar con empatía (Derks et al., 2008). |
| **Algo bueno de hoy** | Tarjeta en Inicio para anotar en una línea algo bueno del día. Privada: se guarda solo en el teléfono. | Práctica de gratitud asociada a más bienestar (Emmons y McCullough, 2003). Da a la app un valor diario sin depender de tener pareja de conversación. |
| **Tu mes** | En Perfil, 28 días en cuadrícula, cada uno del color del ánimo, y las cosas buenas de los últimos días. | La persona ve su evolución sin números ni rachas. Es un insumo útil para la prueba piloto. |
| **Barra de progreso en el registro** | 4 segmentos sobre acuerdos, avatar, intereses y detalles. | Visibilidad del estado del sistema (Nielsen, 1994). El registro es largo y no se sabía cuánto faltaba. |
| **Vibración suave** | Toque leve al reaccionar o enviar; vibración de éxito al crecer la planta, florecer, encontrar pareja o terminar la respiración. | Retroalimentación táctil (Hoggan et al., 2008). Funciona aunque el sonido esté apagado. |

Todas tienen sustento en `decisiones_de_diseno.md` y están descritas en `CONTEXT.md`.

## 2. Nuevas funcionalidades propuestas (sin implementar)

Ordenadas de mayor a menor impacto según los hallazgos de Empatizar.

1. **Carta de cierre.** El día 7, antes de decidir, cada persona puede dejarle a la otra un mensaje final (sin límite de 10 mensajes, una sola vez) que se guarda en el recuerdo del jardín. Cuida el final de la experiencia (Regla del Pico-Final) incluso si no siguen en contacto.
2. **Pausa de búsquedas.** Un interruptor "Tomarme un descanso" en Ajustes que evita buscar pareja por unos días sin perder el jardín. Da control y evita sentir obligación (Peters et al., 2018, autonomía).
3. **Postal del jardín.** Al florecer una planta, generar una imagen (la flor, los dos avatares y los temas compartidos) para guardar o compartir. Sin nombres de usuario, para cuidar la privacidad.
4. **Tamaño de texto.** En Ajustes → Apariencia: Normal / Grande. Ayuda a la accesibilidad (WCAG 1.4.4) y es barato porque todo usa las variantes de `Text`.
5. **Recordatorio suave opcional.** Una sola notificación diaria, apagada por defecto, a la hora que la persona elija: "¿Cómo te sientes hoy?". Sin rachas ni insistencia, para no caer en el enganche que se descartó.
6. **Tema de la semana sugerido por el ánimo.** Si la persona viene de varios días con "Mal", sugerir temas más livianos (humor, música) al buscar pareja. Hay que evaluarlo con cuidado para no etiquetar a nadie.
7. **Exportar mi diario.** Descargar en un PDF "Tu mes" y las cosas buenas para llevarlas a un profesional si la persona quiere. Refuerza que la app no sustituye la ayuda profesional.

## 3. Propuestas de diseño (sin implementar)

- **Tipografía:** los títulos usan una fuente redondeada que funciona bien; en textos largos (acuerdos, mensajes) conviene subir el interlineado a 1,5 para mejorar la lectura.
- **Jerarquía en Inicio:** "Tu día" y "Algo bueno de hoy" quedan debajo de las tarjetas de conversación y jardín. Probar en la prueba piloto si la gente los encuentra o si conviene agruparlos en una sola tarjeta "Tu día".
- **Modo oscuro:** en "Tu mes", los días sin registro (borde punteado) se ven poco sobre el fondo oscuro; conviene un borde un tono más claro.
- **Estados vacíos:** el jardín y "Tu mes" sin datos podrían mostrar una ilustración pequeña (una semilla) en vez de no aparecer.
- **Microcopy:** unificar el trato ("tú") y evitar signos de exclamación seguidos en mensajes de error, para mantener un tono calmado (Weiser y Brown, 1996).

## 4. Cómo verlo

```bash
git checkout Eliminar
cd frontend && npx expo start
```

En Android, con Expo Go. La vibración solo se siente en el teléfono.
