# documentacion-readme Specification

## Purpose
Define el contenido obligatorio del `README.md` de Editorial Codex como documento de entrega: lo que necesita el docente para abrir y evaluar el proyecto y lo que necesita el equipo de la Etapa 2 para continuarlo sin adivinar.

## Requirements

### Requirement: Datos de entrega
El `README.md` SHALL indicar el nombre de la librería (Editorial Codex), los cinco integrantes (Liendo Mateo, Avila Lucas, Pagano Amanda, Valentini Tiziano, Garcia Juan) y cómo abrir el proyecto: doble clic sobre `index.html`, sin servidor, sin npm ni instalación.

#### Scenario: Abrir siguiendo el README
- **WHEN** una persona sin contexto sigue solo las instrucciones de apertura del README
- **THEN** abre la página por `file://` sin instalar nada y ve la vista Catálogo

### Requirement: Qué es maqueta y qué funciona
El `README.md` SHALL tener una sección "Qué es maqueta y qué funciona" que, para cada una de las 5 vistas, indique qué controles son maqueta (no guardan ni calculan) y qué interacción ya funciona, incluyendo navegación, filtro por título, tema y sidebar, y qué `id` del contrato usa la Etapa 2 para conectarla. Desde la Etapa 2 SHALL reflejar que las altas de Libros y Clientes, la venta y el historial funcionan con datos guardados, e indicar lo que siga pendiente.

#### Scenario: Lectura como compañero de Etapa 2
- **WHEN** un integrante del equipo lee la sección después de este change
- **THEN** sabe que las altas de Libros y Clientes, la composición y confirmación de ventas y el historial funcionan, qué queda pendiente (por ejemplo C-11) y qué ganchos usa cada vista

### Requirement: Decisiones de la Etapa 1
El `README.md` SHALL resumir las decisiones de la Etapa 1: una página con secciones, tema oscuro con alternativa clara, tapas generadas con CSS, contrato de `id`/`name` estable y la regla de filtro reutilizable con su firma y comportamiento, incluida la limitación de acentos.

#### Scenario: Reutilizar el filtro en la Etapa 2
- **WHEN** un integrante de la Etapa 2 busca cómo filtrar el array de libros
- **THEN** el README le indica la función `coincideTitulo(titulo, busqueda)`, que no toca el DOM, y qué devuelve con búsqueda vacía

### Requirement: Contrato confirmado contra el HTML final
La tabla de contrato `id`/`name` del `README.md` SHALL coincidir con la de `knowledge-base/08_arquitectura_propuesta.md` y con el `index.html` final de la Etapa 1, incluida la fila nueva `catalogo-resultados`, y SHALL registrar la fecha y el método de la confirmación.

#### Scenario: Cada fila existe
- **WHEN** se busca en `index.html` cada `id` y `name` de la tabla del README
- **THEN** todos existen y la tabla es idéntica a la de `knowledge-base/08`

### Requirement: Registro honesto de casos manuales
El `README.md` SHALL registrar los casos manuales 1 y 8 con sus pasos, el resultado esperado y el resultado observado. Un caso no ejecutado SHALL figurar como "Pendiente de ejecutar"; un caso que falla SHALL describir el comportamiento real; ningún caso SHALL marcarse como aprobado sin haberse ejecutado.

#### Scenario: Caso sin ejecutar
- **WHEN** el caso manual 1 todavía no se ejecutó en el navegador
- **THEN** su resultado observado dice "Pendiente de ejecutar" y su estado no es "Aprobado"

#### Scenario: Caso ejecutado con falla
- **WHEN** al ejecutar el caso un paso no se comporta como se espera
- **THEN** el README describe lo que se observó en ese paso, con fecha y navegador

### Requirement: Altas, venta e historial documentados
El `README.md` SHALL explicar cómo funcionan las altas de libros y clientes (validaciones y refrescos), la composición y confirmación de la venta (cantidades, libro repetido, id correlativo) y el historial (orden, "Ver detalle" con valores guardados).

#### Scenario: Consulta del orden del historial
- **WHEN** se lee la sección del historial en el README
- **THEN** dice que las ventas se listan de la más reciente a la más antigua y que el detalle usa los importes guardados

### Requirement: Estructura de la venta guardada
El `README.md` SHALL listar la clave `libreria.ventas` en la tabla de claves de dominio y SHALL tener una sección propia, «Ventas guardadas (correcciones Etapa 2)», con la estructura exacta de cada venta: `{id, fecha, clienteId, clienteNombre, renglones: [{libroId, titulo, cantidad, precioUnitario, subtotal}], total}`, el tipo y formato de cada campo, qué pasa con ventas del formato anterior y con elementos inválidos, y el aviso cuando falla la escritura.

#### Scenario: Leer una venta en DevTools
- **WHEN** se compara una venta de `libreria.ventas` en DevTools con el README
- **THEN** cada campo de la venta y de sus renglones figura en «Ventas guardadas (correcciones Etapa 2)» con su significado

#### Scenario: Sección de C-05 intacta
- **WHEN** se compara la sección «Datos de dominio guardados en el navegador (C-05)» antes y después del change
- **THEN** no tiene otro cambio que, si hiciera falta, la fila de la clave `libreria.ventas`

### Requirement: Reproducción del caso de precio histórico
El `README.md` SHALL dar los pasos para reproducir el caso de precio histórico: confirmar una venta, anotar sus importes, cambiar solo el precio del libro dentro de `libreria.libros` desde DevTools > Application > Local Storage sin tocar `libreria.ventas`, recargar y abrir el detalle en Historial, donde deben verse los importes confirmados.

#### Scenario: Docente siguiendo los pasos
- **WHEN** el docente sigue solo esos pasos en una copia del proyecto
- **THEN** puede ubicar el libro en `libreria.libros`, cambiar su precio y comprobar el detalle de la venta en Historial

### Requirement: Plantilla de verificación de las correcciones de Etapa 2
El `README.md` SHALL tener una sección "Verificación manual — correcciones Etapa 2" con una plantilla para completar a mano que incluya los casos manuales 2 a 7 con los datos exactos de la consigna (el caso 5 es dos unidades a 1500 y una a 2000: subtotales 3000 y 2000, total 5000), un caso de seguridad con un título con HTML, uno de «Sin clasificar», uno de filtro al volver al Catálogo y uno del contador, con la columna Resultado vacía. Ningún caso SHALL figurar como aprobado sin ejecutarse.

#### Scenario: Plantilla sin resultados inventados
- **WHEN** se abre la sección recién creada
- **THEN** cada fila tiene pasos y resultado esperado, y la columna Resultado está vacía
