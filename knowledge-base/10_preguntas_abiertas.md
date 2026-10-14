# Preguntas Abiertas

## Inconsistencias detectadas

### IN-01 — Datos estáticos vs. filtro funcional en Etapa 1
**Consigna (Etapa 1)**: listados con datos estáticos de ejemplo + una interacción básica (filtro por título).
**Consigna (Ej. 3)**: el filtro opera sobre el catálogo generado desde el array.
**Impacto**: el filtro de Etapa 1 (sobre tarjetas del DOM) no es el definitivo.
**Resolución**: ✅ resuelta (DD-07). En Etapa 1 se filtra leyendo el título de cada tarjeta estática; la normalización/coincidencia vive en una función pura (`coincideTitulo(titulo, busqueda)`) que la Etapa 2 reutiliza sobre el array.

### IN-02 — Libro repetido en venta: sumar o rechazar
**Consigna**: "se modifica la cantidad del renglón existente **o** se informa el duplicado".
**Impacto**: dos comportamientos válidos; el README debe decir cuál se implementó.
**Resolución propuesta**: decide Etapa 2; documentarlo en el caso manual 4.

## Preguntas abiertas (priorizadas)

| Prioridad | Pregunta | Bloquea | Decisor |
|---|---|---|---|
| ~~Alta~~ ✅ | ~~¿Una página con secciones o multipágina?~~ Resuelta: una página con secciones (DD-01) | — | Amanda |
| ~~Alta~~ ✅ | ~~Contrato de `id`/`name`~~ Resuelta: tabla en [08](08_arquitectura_propuesta.md#tabla-de-contrato-id--name), copiada al README (DD-08) | — | Amanda |
| ~~Media~~ ✅ | ~~Formato del id de venta~~ Resuelta: `V-0001` (DD-09) | — | Amanda |
| ~~Media~~ ✅ | ~~Formato de fecha y moneda~~ Resuelta: ISO guardada / `dd/mm/aaaa hh:mm` mostrada; `Intl.NumberFormat('es-AR', ARS)` (DD-10, DD-11) | — | Amanda |
| Media | ¿Qué hacer si el JSON de `localStorage` está corrupto? (supuesto: volver al seed) | Persistencia | Etapa 2 |
| Media | ¿Regex de email a usar? (ej. `^[^\s@]+@[^\s@]+\.[^\s@]+$`) | Alta clientes | Etapa 2 |
| ~~Baja~~ ✅ | ~~Tema y portadas~~ Resuelta: tema oscuro con contraste suficiente, tapas en CSS (DD-12) | — | Amanda |
| ~~Baja~~ ✅ | ~~Nombre de la librería~~ Resuelta: **Editorial Codex** (DD-13) | — | Amanda |
| ~~Baja~~ ✅ | ~~Integrantes~~ Resuelta: Liendo Mateo, Avila Lucas, Pagano Amanda, Valentini Tiziano, Garcia Juan (DD-13) | — | Equipo |

Siguen abiertas para la **Etapa 2**: IN-02, JSON corrupto en `localStorage` y regex de email.
