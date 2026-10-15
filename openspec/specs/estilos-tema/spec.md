# estilos-tema Specification

## Purpose

Define la identidad visual de Editorial Codex (paleta, tipografía local, título, fondo galáctico en CSS, degradés, tapas en CSS y componentes reutilizables) y las garantías de presentación accesible y adaptable: contraste, foco visible, errores sin depender del color, 320/1280 px y tema claro/oscuro.

## Requirements

### Requirement: Estilos en archivos externos con clases reutilizables
Toda la presentación SHALL definirse en hojas de estilo externas, sin atributos `style` ni handlers inline, con clases BEM (`bloque__elemento--modificador`) reutilizadas para elementos equivalentes en todas las vistas, y con el layout resuelto con Flexbox y/o Grid.

#### Scenario: Sin estilos inline
- **WHEN** se busca `style=` y `on...=` en `index.html`
- **THEN** no aparece ninguna coincidencia

#### Scenario: Elementos equivalentes con la misma clase
- **WHEN** se inspeccionan los botones primarios de Catálogo, Libros, Clientes y Ventas
- **THEN** todos usan la misma clase de botón y se ven iguales

### Requirement: Recursos solo locales
La página SHALL cargar únicamente recursos del propio proyecto: hojas de estilo, scripts, la fuente Cinzel Decorative desde `fonts/`, el favicon SVG y la foto decorativa del banner del Catálogo (`assets/img/banner-biblioteca.jpg`, aplicada solo por CSS, también como fondo difuminado en el tema oscuro). NO SHALL pedir recursos externos ni usar imágenes de tapas ni de nebulosas/estrellas: la galaxia y las tapas se dibujan solo con CSS.

#### Scenario: Pestaña Network
- **WHEN** se recarga la página con la pestaña Network de DevTools abierta y se recorren todas las vistas
- **THEN** solo aparecen archivos locales (CSS, JS, fuente, favicon y el banner `banner-biblioteca.jpg`) y ninguna imagen de tapa ni de nebulosas/estrellas

### Requirement: Tapas de libro generadas con CSS
Cada tapa de libro (catálogo) SHALL dibujarse solo con CSS (degradé de fondo) con el título y el autor como texto, y SHALL ser decorativa para lectores de pantalla porque el título ya se anuncia en el contenido.

#### Scenario: Tapa sin imagen
- **WHEN** se inspecciona una tapa del catálogo
- **THEN** no es un `img` ni usa una imagen de fondo, y muestra el título y el autor como texto

### Requirement: Identidad visual del título
El título "Editorial Codex" SHALL usar la fuente local Cinzel Decorative, con texto en degradé blanco, lila, violeta y azul (con color sólido de respaldo), estrellas doradas y un ornamento decorativos (`aria-hidden`), y un brillo más intenso al pasar el cursor o recibir el foco. Su presentación SHALL ser idéntica en ambos temas.

#### Scenario: Efecto en hover y foco
- **WHEN** el operador pasa el cursor o llega con Tab al título enlazado
- **THEN** se ve el efecto de brillo

#### Scenario: Encabezado transparente con resplandor
- **WHEN** se observa el encabezado en el tema oscuro y luego en el claro
- **THEN** en ambos es transparente, sin franja opaca, y el título se apoya en un resplandor violeta y un velo oscuro radial difuso que no genera desplazamiento horizontal a 320 px

#### Scenario: Movimiento reducido
- **WHEN** se emula `prefers-reduced-motion: reduce` en DevTools
- **THEN** ni el título ni el fondo se mueven solos

#### Scenario: Colores forzados
- **WHEN** se emula `forced-colors: active`
- **THEN** el texto del título sigue visible con el color del sistema

### Requirement: Fondo galáctico decorativo solo con CSS
En ambos temas, el fondo de la página fuera de los paneles SHALL ser un fondo "galáctico" decorativo dibujado solo con CSS, idéntico en el tema claro (solo los paneles son claros), sin texto encima y fuera del árbol de accesibilidad. Debajo SHALL haber una capa con la foto local del banner muy difuminada y oscurecida.

#### Scenario: Composición del fondo
- **WHEN** se inspeccionan las reglas de `body::before` y `body::after`
- **THEN** dibujan una base negro azulado con nebulosas desaturadas (ciruela, azul noche, violeta apagado y un toque rosado muy tenue) y estrellas chicas, todo con capas de `radial-gradient`, con `pointer-events: none` y sin referenciar archivos de imagen

#### Scenario: Fondo decorativo
- **WHEN** se inspecciona el árbol de accesibilidad
- **THEN** el fondo no aparece como imagen con nombre accesible ni se encuentra ninguna referencia a archivos de imagen en las reglas de `body::before` y `body::after` (la foto difuminada vive solo en `html::before`); el HTML no contiene ningún `<img>`

#### Scenario: Capa de la foto difuminada
- **WHEN** se inspecciona `html::before`
- **THEN** es fija, decorativa, queda por debajo de la galaxia, muestra `assets/img/banner-biblioteca.jpg` con `filter: blur` y `brightness`, no se anima y se oculta con `forced-colors: active`

#### Scenario: Movimiento reducido en el fondo
- **WHEN** se emula `prefers-reduced-motion: reduce`
- **THEN** el fondo galáctico queda quieto

#### Scenario: Movimiento lento permitido
- **WHEN** se emula `prefers-reduced-motion: no-preference`
- **THEN** el fondo se mueve lentamente animando solo `transform` y `opacity`

#### Scenario: Tema claro con el mismo fondo galáctico
- **WHEN** se activa el tema claro
- **THEN** el fondo de la página y el encabezado son idénticos a los del tema oscuro (foto difuminada, nebulosas y estrellas, mismas capas, opacidades y animaciones) y solo los paneles son claros, con todo el texto sobre superficies opacas

### Requirement: Superficies con degradé y acento rosa
`main`, la sidebar, las tarjetas y los contenedores de tabla SHALL usar un degradé sutil y sobrio con borde violeta apagado y brillo suave de baja opacidad. SHALL existir un acento rosa apagado (`--color-acento-rosa`, nunca un rosa neón) para `:hover` de campos y de la hamburguesa y para el tooltip; el enlace activo de la sidebar usa el acento violeta (`--color-accent`).

#### Scenario: Degradé y acento visibles
- **WHEN** se observa la página en el tema oscuro
- **THEN** `main`, la sidebar, las tarjetas y las tablas muestran el degradé y el borde con brillo, el enlace activo de la sidebar muestra el borde en el acento violeta y el tooltip usa el acento rosa apagado

#### Scenario: Paleta de cada tema
- **WHEN** se comparan las superficies y el acento rosa en ambos temas
- **THEN** en el tema oscuro el degradé es ciruela profundo / azul noche sin magenta y el acento es lila rosado; en el claro el degradé es lavanda/rosa pálido y el acento es una variante más oscura

#### Scenario: Contraste contra el tramo crítico
- **WHEN** se calcula el contraste del texto sobre una superficie con degradé
- **THEN** se mide contra el tramo más claro del degradé en el tema oscuro y contra el más oscuro en el claro, y si un par no llega al mínimo se oscurece el degradé y no el texto

### Requirement: Contraste mínimo en ambos temas
Todo par texto/fondo SHALL tener contraste de al menos 4.5:1 (WCAG AA texto normal), tanto en el tema oscuro como en el tema claro, incluidos enlaces, textos secundarios, mensajes y el título de la marca.

#### Scenario: Cálculo con la fórmula WCAG
- **WHEN** se calcula con la fórmula de contraste de WCAG el texto secundario de una tarjeta contra el tramo crítico de su degradé en cada tema
- **THEN** el ratio es mayor o igual a 4.5:1 en los dos temas y queda registrado en la tabla del README

### Requirement: Foco visible
Todo elemento enfocable (enlaces, campos, botones, botones de sidebar y tema) SHALL mostrar al recibir foco por teclado, con `:focus-visible`, un contorno de alto contraste (≥ 3:1 contra el fondo sobre el que se dibuja); NO SHALL quitarse el `outline` sin reemplazo.

#### Scenario: Recorrido con Tab
- **WHEN** el operador recorre con Tab cualquier vista en cada tema
- **THEN** el elemento enfocado siempre muestra un contorno visible

#### Scenario: Foco dorado sobre el fondo de la página
- **WHEN** el operador enfoca con Tab el título, el enlace de salto o el botón de colapsar de la sidebar, en cada tema
- **THEN** el contorno es `#ffd166`, y en el tema claro el botón de colapsar lo rodea además con un halo oscuro

#### Scenario: Foco en la barra superior en tema claro
- **WHEN** en el tema claro el operador enfoca con Tab un control de la barra superior
- **THEN** el contorno usa el color de foco del tema (no `#ffd166`, que no llega a 3:1 sobre fondo claro)

### Requirement: Errores y estados sin depender del color
Los mensajes de error SHALL comunicarse con texto (prefijo "Error:" o texto explícito) y los estados (activo, error, éxito) SHALL distinguirse por un rasgo además del color.

#### Scenario: Escala de grises
- **WHEN** se revela un mensaje de error y se observa la página en escala de grises
- **THEN** el error se entiende por su texto

### Requirement: Diseño adaptable a 320 px y 1280 px
Con estilos mobile-first, todas las vistas SHALL ser legibles a 320 px y a 1280 px de ancho sin scroll horizontal de la página. Las celdas de las tablas NO SHALL partir su contenido en varias líneas (ids como "V-0001", fechas, importes); cuando la tabla no entra en el ancho disponible SHALL desplazarse dentro de su propio contenedor.

#### Scenario: Sin scroll horizontal
- **WHEN** se emula 320 px y luego 1280 px en DevTools y se recorre cada vista
- **THEN** en consola `document.documentElement.scrollWidth <= window.innerWidth` da `true` en todas

#### Scenario: Tabla desplazable
- **WHEN** se muestra Historial a 320 px
- **THEN** la tabla se desplaza dentro de su contenedor y la página no

#### Scenario: Celdas sin cortes
- **WHEN** se muestra Historial a 320 px
- **THEN** "V-0001", la fecha "13/10/2026 14:30" y el total se ven cada uno en una sola línea, sin partirse

#### Scenario: Región con scroll enfocable
- **WHEN** a 320 px el operador llega con Tab a la tabla de Historial
- **THEN** el contenedor recibe foco visible y las flechas del teclado desplazan la tabla

### Requirement: Alternancia de tema claro y oscuro
La página SHALL ofrecer un botón para alternar entre tema oscuro y claro, con `aria-pressed` que refleje si el tema claro está activo y un nombre accesible que describa la acción. Sin preferencia guardada, el tema inicial SHALL seguir `prefers-color-scheme`; con preferencia guardada, SHALL usarse la guardada.

#### Scenario: Cambiar de tema
- **WHEN** el operador activa el botón de tema con Enter
- **THEN** cambian los colores de toda la página y `aria-pressed` cambia de valor

#### Scenario: Tema recordado
- **WHEN** el operador elige el tema claro y recarga la página
- **THEN** la página abre en tema claro

#### Scenario: Preferencia del sistema
- **WHEN** no hay tema guardado y se emula `prefers-color-scheme: light`
- **THEN** la página abre en tema claro
