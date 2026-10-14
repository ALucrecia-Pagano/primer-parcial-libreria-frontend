# Editorial Codex

Trabajo Práctico Integrador de Programación III (UTN FRM): frontend estático de una librería que presenta su catálogo y registra libros, clientes y ventas simulados en el navegador. Se abre con doble clic sobre `index.html` (sin servidor, sin librerías).

**Integrantes:** Liendo Mateo, Avila Lucas, Pagano Amanda, Valentini Tiziano, Garcia Juan.

## Cómo abrir

1. Descargar o clonar la carpeta del proyecto completa (`index.html`, `css/`, `js/`, `fonts/`, `assets/`).
2. Hacer **doble clic** sobre `index.html`. Se abre en el navegador por `file://`.

- No hace falta servidor, `npm`, instalación ni conexión a internet: todo el proyecto es HTML, CSS y JavaScript nativos, con recursos locales.
- Navegador probado: Microsoft Edge 155 (Chromium) en Windows 11. Debería funcionar igual en las versiones actuales de Chrome y Firefox, pero esos no se probaron.
- Con JavaScript deshabilitado la página sigue siendo legible (ver "Degradación sin JavaScript" y "Filtro por título").

## Contrato de maqueta (`id` / `name`)

Esta tabla es el contrato entre la maqueta (HTML) y el JavaScript de la Etapa 2. Debe mantenerse sincronizada con la tabla de `knowledge-base/08_arquitectura_propuesta.md` (DD-08): si cambia un `id` o `name`, se actualizan ambas a la vez.

Los mensajes (`*-vacio`, `*-sin-resultados`, `*-errores`, `*-mensaje`) están siempre presentes en el HTML y se ocultan con `hidden`.

| Vista | Elemento | `id` | `name` |
|---|---|---|---|
| Global | Navegación principal | `nav-principal` | — |
| Global | Secciones de vista | `catalogo`, `libros`, `clientes`, `ventas`, `historial` | — |
| Global | Contenido principal (destino del skip-link) | `contenido` | — |
| Global | Botón de tema | `tema-alternar` | — |
| Global | Sidebar (`aside`, contiene `nav-principal`) | `sidebar` | — |
| Global | Botón colapsar sidebar (escritorio) | `sidebar-colapsar` | — |
| Global | Botón abrir menú (celular) | `menu-abrir` | — |
| Global | Botón cerrar menú (celular) | `menu-cerrar` | — |
| Global | Velo del menú móvil | `sidebar-velo` | — |
| Catálogo | Formulario de búsqueda | `form-busqueda` | — |
| Catálogo | Campo de búsqueda por título | `catalogo-busqueda` | `busqueda` |
| Catálogo | Contenedor de tarjetas | `catalogo-lista` | — |
| Catálogo | Zona de estado del filtro (anuncia resultados) | `catalogo-resultados` | — |
| Catálogo | Mensaje sin resultados | `catalogo-sin-resultados` | — |
| Catálogo | Mensaje catálogo vacío | `catalogo-vacio` | — |
| Libros | Formulario de alta | `form-libro` | — |
| Libros | Título | `libro-titulo` | `titulo` |
| Libros | ISBN | `libro-isbn` | `isbn` |
| Libros | Precio | `libro-precio` | `precio` |
| Libros | Editorial (`select`) | `libro-editorial` | `editorialId` |
| Libros | Género (`select`, incluye «Sin clasificar» con `value=""`) | `libro-genero` | `generoId` |
| Libros | Autores (`fieldset` de checkboxes) | `libro-autores` | `autorIds` (cada checkbox) |
| Libros | Errores del formulario | `libro-errores` | — |
| Libros | Mensaje de resultado | `libro-mensaje` | — |
| Libros | Cuerpo de tabla del listado | `libros-tabla` | — |
| Libros | Mensaje listado vacío | `libros-vacio` | — |
| Clientes | Formulario de alta | `form-cliente` | — |
| Clientes | Nombre completo | `cliente-nombre` | `nombreCompleto` |
| Clientes | Email | `cliente-email` | `email` |
| Clientes | Errores del formulario | `cliente-errores` | — |
| Clientes | Mensaje de resultado | `cliente-mensaje` | — |
| Clientes | Cuerpo de tabla del listado | `clientes-tabla` | — |
| Clientes | Mensaje listado vacío | `clientes-vacio` | — |
| Ventas | Formulario de venta | `form-venta` | — |
| Ventas | Cliente (`select`) | `venta-cliente` | `clienteId` |
| Ventas | Libro a agregar (`select`) | `venta-libro` | `libroId` |
| Ventas | Cantidad | `venta-cantidad` | `cantidad` |
| Ventas | Botón agregar renglón | `venta-agregar` | — |
| Ventas | Cuerpo de tabla de renglones | `venta-renglones` | — |
| Ventas | Mensaje sin renglones | `venta-renglones-vacio` | — |
| Ventas | Total | `venta-total` | — |
| Ventas | Botón confirmar venta | `venta-confirmar` | — |
| Ventas | Errores | `venta-errores` | — |
| Ventas | Mensaje de resultado | `venta-mensaje` | — |
| Historial | Cuerpo de tabla de ventas | `historial-tabla` | — |
| Historial | Mensaje historial vacío | `historial-vacio` | — |
| Historial | Panel de detalle de renglones | `historial-detalle` | — |

> Los ids `titulo-*` (títulos `h2` de cada vista), `aviso-maqueta-*` y `libro-autor-1..3` son internos de la maqueta y no forman parte del contrato.

**Verificación del contrato contra `index.html` (C-03):**

- **Fecha:** 14/10/2026
- **Método:** comparación automatizada (script de una sola vez, nada guardado en el repo) que extrae cada `id` y `name` de esta tabla y busca los atributos `id="..."` y `name="..."` en `index.html`; además se comparó esta tabla fila por fila con la de `knowledge-base/08_arquitectura_propuesta.md`.
- **Resultado:** 51 `id` y 12 `name` verificados, **0 faltantes**. Las dos tablas son idénticas (49 filas cada una, incluida la fila nueva `catalogo-resultados`). Se quitó el aviso interno `aviso-maqueta-catalogo` (no era parte del contrato).
- `catalogo-resultados` es el único `id` nuevo de C-03; ningún `id` ni `name` existente cambió.

## Navegación entre vistas

La página es un único `index.html` con 5 vistas (`<section class="vista">`): Catálogo, Libros, Clientes, Ventas e Historial. Solo una se muestra a la vez.

**Decisión:** la navegación la resuelve JavaScript (`js/app.js`) escuchando el evento `hashchange` y alternando el atributo `hidden` de cada vista. No se usa la pseudoclase CSS `:target`.

**Por qué no `:target`:**

- No resuelve la vista por defecto cuando la URL no tiene hash (habría que dejar todo oculto o duplicar reglas).
- No sirve para hashes que apuntan a un elemento dentro de una vista (ej. `#catalogo-lista`) ni para anclas fuera de las vistas (ej. el enlace de salto `#contenido` haría desaparecer todas las secciones).
- No permite mover el foco ni mantener `aria-current` en el enlace activo.
- `hidden` funciona aunque el CSS no cargue y es el mismo mecanismo que usa la maqueta para ocultar mensajes: la Etapa 2 sigue un único criterio.

### Reglas de resolución del hash

| Hash | Resultado |
|---|---|
| `#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial` (id de una vista) | Se muestra esa vista |
| Id de un elemento dentro de una vista (ej. `#catalogo-lista`, `#libro-titulo`) | Se muestra la vista que lo contiene (no se desplaza hasta el elemento) |
| Id inexistente o de un elemento fuera de las vistas (ej. `#no-existe`, `#contenido`) | Se conserva la vista actual |
| Hash vacío o `#` | Se muestra Catálogo |
| Carga inicial sin hash o sin vista válida | Se muestra Catálogo |

### Foco, estado activo e historial

- Al navegar a una vista distinta, el foco se mueve al `h2` de esa vista (`tabindex="-1"`), de modo que el lector de pantalla la anuncia y el siguiente Tab sigue por su contenido. En la carga inicial el foco no se mueve, para no saltear el encabezado y la navegación.
- El enlace de la vista activa lleva `aria-current="page"` (los demás no tienen el atributo). El CSS lo marca con fondo, borde izquierdo grueso, negrita y subrayado, sin depender del color.
- El botón "atrás" del navegador funciona: cada cambio de hash es una entrada del historial y, al volver a un hash vacío, se muestra Catálogo.

### Sidebar y menú móvil

- El `nav#nav-principal` está dentro de `aside#sidebar`, con 5 enlaces, cada uno con ícono decorativo: Catálogo, Libros, Clientes, Ventas e Historial.
- **Escritorio (≥ 1024 px):** `#sidebar-colapsar` la reduce a íconos (`aria-expanded`, `aria-controls="sidebar"`). Colapsada, el texto de cada enlace sigue disponible para lectores de pantalla y el nombre aparece como tooltip en `:hover` y `:focus-visible`. El estado se guarda en `localStorage` (`libreria.preferencias.sidebar`, valores `colapsada` o `expandida`).
- **Celular (< 1024 px):** la sidebar queda fuera de pantalla con `visibility: hidden` (sus enlaces no entran en el orden de Tab). `#menu-abrir` la abre y lleva el foco al primer enlace; `#menu-cerrar`, la tecla Escape, un clic en `#sidebar-velo` o activar un enlace la cierran. Con botón o Escape el foco vuelve a `#menu-abrir`. Si la ventana pasa a escritorio con el menú abierto, se cierra sola.

### Degradación sin JavaScript

Sin JavaScript (la clase `js` en `<html>` no se agrega) se ven las 5 vistas una debajo de otra, la sidebar es un bloque de enlaces visible también a 320 px, no aparecen los botones de hamburguesa, cerrar, colapsar ni de tema, y los enlaces del menú desplazan hasta cada sección (son anclas comunes).

### Handler de formularios de maqueta

`prevenirEnvioMaqueta` es un `preventDefault()` genérico, registrado con `addEventListener('submit', ...)` en cada `<form>`, solo para que la maqueta no recargue la página. **Es de maqueta:** la Etapa 2 debe reemplazarlo por el handler real de cada formulario (con validación y mensajes en texto), de modo que ningún formulario quede sin lógica propia sin que se note.

## Preferencias guardadas en el navegador

La maqueta recuerda dos preferencias de **presentación** en `localStorage`. No son datos de dominio (los datos de libros, clientes y ventas se guardan en la Etapa 2 con otras claves, ver `knowledge-base/04_modelo_de_datos.md`, §Persistencia). Solo existen claves con el prefijo `libreria.preferencias.`.

| Clave | Valores posibles | Valor por defecto | Quién la escribe |
|---|---|---|---|
| `libreria.preferencias.tema` | `claro` o `oscuro` | Tema oscuro (ver orden de decisión) | Botón `#tema-alternar` |
| `libreria.preferencias.sidebar` | `colapsada` o `expandida` | `expandida` | Botón `#sidebar-colapsar` (solo escritorio, ≥ 1024 px) |

- **Orden de decisión del tema:** valor guardado válido → preferencia del sistema (`prefers-color-scheme: light` da tema claro) → tema oscuro.
- **Lista blanca:** cualquier valor que no sea uno de los dos permitidos (por ejemplo `"violeta"`) se ignora y se usa el valor por defecto; no se corrige ni se borra la clave, y no hay errores en consola. En la barra lateral, todo valor distinto de `colapsada` equivale a `expandida`.
- **Fallos tolerados:** toda lectura y escritura de `localStorage` está dentro de `try/catch` (`leerPreferencia` y `guardarPreferencia` en `js/app.js`). Si el almacenamiento está bloqueado, lleno o no existe, la página funciona igual con los valores por defecto: el cambio se aplica en la sesión actual, pero no se recuerda al recargar.
- **Sin JavaScript** no hay preferencias: los botones de tema y de colapsar no se muestran y se ve el tema oscuro.

## Recursos y procedencia

- **Imágenes: una sola, decorativa.** `assets/img/banner-biblioteca.jpg` es la foto del banner «Hola, lector» del Catálogo y, además, **se usa también, muy difuminada y oscurecida, como fondo de la página en ambos temas** (detrás del velo galáctico; ver «Fondo galáctico y foto difuminada»). Es un archivo local (sin pedidos externos) que se aplica **solo por CSS** (`background-image` de `.bienvenida__banner`, con un velo degradé por encima y un `background-color` de respaldo si no carga, y `html::before` para el fondo): **decorativa, aplicada por CSS (sin `<img>` ni texto alternativo)**. Las nebulosas y estrellas de la página y las tapas de los libros siguen dibujándose **100% con CSS** (degradés), sin archivos de imagen (DD-12, DD-14). El otro archivo gráfico del proyecto es el favicon `assets/img/favicon.svg`, hecho a mano. Si más adelante aparece otra idea que necesite una imagen (por ejemplo en el change opcional C-12), se documenta acá igual que el banner.
- **Procedencia de `assets/img/banner-biblioteca.jpg`** (completar antes de entregar): autor **[NOMBRE — completar]**; fuente **[Unsplash/Pexels — completar]**; enlace **[URL — completar]**; licencia **[Unsplash License / Pexels License — completar]**. Uso en el proyecto: decorativa, aplicada por CSS (sin `<img>` ni texto alternativo), en el banner del Catálogo y, difuminada, como fondo de página en ambos temas.
- **Fondo galáctico y foto difuminada (CSS):** `html::before` (z-index -4) dibuja la foto `banner-biblioteca.jpg` con `filter: blur(12px) brightness(0.5)`, `transform: scale(1.1)` (oculta los bordes desenfocados) y un tinte cálido suave; igual en el tema oscuro y en el claro (se oculta solo en `forced-colors`) y sin animación. Encima, el velo galáctico con `opacity` 0.6–0.7 mantiene a la galaxia como protagonista. `body::before` dibuja las nebulosas (`radial-gradient` sobre una base negro azulado) y `body::after` las estrellas (capas de `radial-gradient` que se repiten como mosaico). Son decorativos: `pointer-events: none`, contenido vacío (no aparecen en el árbol de accesibilidad) y fijos detrás de todo el contenido. El movimiento lento (solo `transform` y `opacity`) existe únicamente dentro de `@media (prefers-reduced-motion: no-preference)`. **El tema claro comparte este fondo y el encabezado con el oscuro (D21)**: mismas capas, mismas opacidades y mismas animaciones; solo los paneles (sidebar, barra superior, `main` y sus tarjetas, tablas y formularios) se aclaran. `--color-bg` (`#05060f`) no se redefine en el tema claro.
- **Tipografía de la marca:** *Cinzel Decorative* (`fonts/CinzelDecorative-Bold.ttf`), cargada desde el archivo local con `@font-face` y `font-display: swap`. Licencia **SIL Open Font License 1.1**; el texto completo está en `fonts/OFL.txt`. Si la fuente no carga, el título cae en Georgia o una serif del sistema.
- **Tapas de libro:** se dibujan con CSS (degradés); no hay imágenes de tapas (DD-12).
- **Íconos:** SVG en línea, escritos a mano en el HTML (decorativos, `aria-hidden="true"`). No hay librerías de íconos ni pedidos externos.
- **Decisión sobre el parpadeo del tema:** el script se carga con `defer` (regla del proyecto: scripts clásicos con `defer`, sin `<script>` ni handlers en línea). Por eso `data-tema` se aplica recién cuando se ejecuta `js/app.js`, y quien eligió el tema claro puede ver un instante el tema oscuro (por defecto) al cargar o recargar la página. **Se acepta como contrapartida** frente a agregar un script en línea en el `<head>`, que rompería esa regla.

### Qué queda fuera de este change

- **C-03 (`filtro-titulo-readme-avance`):** el filtro del catálogo por título. **Ya implementado por C-03**: el buscador filtra las tarjetas (ver "Filtro por título") y se quitó el aviso de maqueta del Catálogo.
- **C-12 (`extras-prototipo`, opcional):** vista Inicio, escritores, detalle de libro con estrellas, Ingresar/Registro, toasts y migas de pan.
- **Etapa 2 (C-04 a C-11):** datos locales, `localStorage` de libros, clientes y ventas, validaciones, ventas e historial real.

## Contraste de color (C-02)

Criterio: **WCAG 2.2 AA**. Texto normal ≥ 4.5:1; texto grande (≥ 24 px, o ≥ 18.66 px en negrita) ≥ 3:1; componentes de interfaz y contornos que identifican un control ≥ 3:1.

> **Recalculado tras el ajuste final de diseño (D18) y la paleta desaturada con encabezado transparente (D20).** Todas las filas se rehicieron con los valores **efectivos** de `css/styles.css` (la sección 12 «Pasada visual» pisa varios tokens de las secciones anteriores).

- **Todos los ratios están calculados con la fórmula de contraste de WCAG** (luminancia relativa sRGB) sobre los valores reales de los tokens de `css/styles.css`, con 2 decimales.
- **Regla de los degradés:** las superficies grandes (`main`, `.sidebar`, `.tarjeta`/`.formulario`, `.tabla-contenedor`) llevan degradé (la `.marca` es transparente en ambos temas y se evalúa aparte, en «Marca»). El contraste del texto se calcula contra el **tramo más claro** del degradé en el tema oscuro y contra el **tramo más oscuro** en el tema claro (el peor caso de cada tema). Si un par no llegara al mínimo, se **oscurece (o aclara) el degradé, nunca el texto**.
- Tramos críticos, tema oscuro: `main` `#251a3a` (degradé ciruela → azul noche → casi negro: `#251a3a`, `#161a33`, `#0a0d19`); `.sidebar` `#101824`; `.tarjeta`, `.formulario` y `.tabla-contenedor` `#182133`; `.marca` es transparente (peor caso del fondo con foto + velo radial, ver «Marca»; igual en el tema claro). Tema claro (solo paneles): `main` `#f9e9f4`; `.sidebar` `#f2e9fb`; `.tarjeta` y `.formulario` `#f6e3f0`; `.tabla-contenedor` `#f5e3f0`.
- **Barra superior (`.barra`):** ahora tiene fondo opaco propio (`--color-surface`) en ambos temas, así que sus botones y el enlace «Inicio» ya no dependen del fondo galáctico; se evalúan contra esa superficie. Solo el botón de colapsar (mitad fuera de la sidebar) y el enlace «Saltar al contenido» quedan sobre el fondo de la página, que **es el mismo en ambos temas** (D21). El botón lleva un halo sólido (`box-shadow: 0 0 0 3px var(--color-bg)`, `#05060f` en los dos temas) y su borde se evalúa contra ese halo. En el tema claro el botón recibe localmente los valores del tema oscuro (borde `#9a8cc0`, interior `#0e1623`, ícono `#f2f4fc`, rosa `#c9a6e8` y foco `#ffd166`, con propiedades personalizadas locales) y, con foco, un halo de 9 px que deja el anillo amarillo rodeado de oscuro por dentro y por fuera (así no depende de que detrás haya la página oscura o la sidebar clara). Las estrellas del fondo (puntos de 1 a 2 px) no se evalúan.
- **Fondo de la página con foto (ambos temas, D21):** no hay texto directamente sobre el fondo (todo va sobre superficies opacas), así que solo cambian los elementos no textuales que quedan sobre él: el anillo de foco de `main` y del botón de colapsar. Peor caso calculado con la fórmula WCAG: píxel de la foto **blanco** con el tinte cálido (`#ffffff` → 255,238,220), `brightness(0.5)` = (128,119,110), velo galáctico con la opacidad mínima de su animación (0.6; como las nebulosas son más oscuras que la foto, menos opacidad deja pasar más foto y es el caso más claro) y las cuatro nebulosas desaturadas apiladas en el mismo punto (situación inalcanzable: sus centros están separados), que da (96,83,120) = `#605378`; con una sola nebulosa (la más clara) da (79,66,88). Referencia: el texto principal daría 6.36 contra esa cota. El título (`.marca`) no tiene superficie opaca en ningún tema: su peor caso (esta misma cota + velo radial) está en «Marca».
- **Título al 80 %:** `CODEX` queda en `clamp(1.8rem, 4.8vw, 3.8rem)` (mínimo 28.8 px en negrita): sigue siendo texto grande (≥ 18.66 px en negrita), y aun así su par se verificó a 4.5:1 (ver «Marca»). «Editorial» (12 px) y el lema (12.8 px) son texto normal y ya cumplían 4.5:1; sus colores no cambiaron.
- **Banner «Hola, lector» (foto de fondo):** el texto NO se apoya directamente en la foto: va sobre `.bienvenida__contenido`, una superficie local `rgba(14, 18, 39, .94)`. Como el 6 % restante deja pasar la foto, se calculó el **peor caso**: ese velo sobre un píxel **blanco** (`#1c2034`). Los pares del banner están en su propia tabla.
- **Acento rosa (apagado, D20):** `--color-acento-rosa` (`#c9a6e8`, lila rosado, en oscuro; `#8a3d84`, ciruela rosado, en claro). Tras el ajuste final se usa solo en el borde de campos y de la hamburguesa en `:hover` y en el borde del tooltip del menú colapsado (el enlace activo y su `:hover` ahora usan el acento violeta). Es un elemento no textual (mínimo 3:1).

### Tema oscuro (`:root`)

| Par (texto o elemento / fondo) | Tema | Colores (hex) | Ratio (calculado con fórmula WCAG) | Mínimo | Resultado y ajuste |
|---|---|---|---|---|---|
| Texto principal / `main` (`--degrade-superficie`), tramo más claro | Oscuro | `#f2f4fc` / `#251a3a` | 14.85 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `main`, tramo más claro | Oscuro | `#c3bfdc` / `#251a3a` | 9.17 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto principal / `.sidebar` (`--degrade-sidebar`), tramo más claro (nombre del logo, enlaces) | Oscuro | `#f2f4fc` / `#101824` | 16.23 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `.sidebar`, tramo más claro (rótulo «TU BIBLIOTECA», enlaces del menú sin activar) | Oscuro | `#c3bfdc` / `#101824` | 10.02 | 4.5:1 | Cumple. Ajuste: ninguno |
| Logo «CODEX» de la sidebar (30 px, Cinzel; texto grande) / `.sidebar`, tramo más claro | Oscuro | `#b6a6ff` / `#101824` | 8.39 | 3:1 | Cumple. Ajuste: ninguno |
| Texto principal / `.tarjeta` y `.formulario` (`--degrade-tarjeta`), tramo más claro (títulos, etiquetas, precio) | Oscuro | `#f2f4fc` / `#182133` | 14.66 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `.tarjeta` y `.formulario`, tramo más claro (datos de la tarjeta, ayuda del formulario) | Oscuro | `#c3bfdc` / `#182133` | 9.05 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto principal / `.tabla-contenedor` (`--degrade-tabla`), tramo más claro | Oscuro | `#f2f4fc` / `#182133` | 14.66 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `.tabla-contenedor`, tramo más claro | Oscuro | `#c3bfdc` / `#182133` | 9.05 | 4.5:1 | Cumple. Ajuste: ninguno |
| Enlace/acento (`a`, `.resumen-venta__total`) / `main`, tramo más claro | Oscuro | `#b6a6ff` / `#251a3a` | 7.68 | 4.5:1 | Cumple. Ajuste: ninguno |
| Enlace/acento / `.tarjeta`, tramo más claro | Oscuro | `#b6a6ff` / `#182133` | 7.58 | 4.5:1 | Cumple. Ajuste: ninguno |
| Enlace/acento / `.tabla-contenedor`, tramo más claro | Oscuro | `#b6a6ff` / `#182133` | 7.58 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto principal / `--color-surface-2` (`.tabla th`, `.mensaje`, `.aviso`, hamburguesa, botón secundario, tooltip) | Oscuro | `#f2f4fc` / `#182133` | 14.66 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `--color-surface-2` (`.aviso`, `.mensaje--vacio`, `.tabla th`) | Oscuro | `#c3bfdc` / `#182133` | 9.05 | 4.5:1 | Cumple. Ajuste: ninguno |
| Enlace activo del menú (`aria-current`, acento) / `--color-surface-2` | Oscuro | `#b6a6ff` / `#182133` | 7.58 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto principal / `--color-surface` (campos y selects de registro, pill de búsqueda, botón de tema, etiqueta «Historias por descubrir», `.salto`) | Oscuro | `#f2f4fc` / `#0e1623` | 16.52 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `--color-surface` (enlace «Inicio», `.barra__texto`, `placeholder` del buscador, detalle «libros, infinitos mundos», chips sin marcar) | Oscuro | `#c3bfdc` / `#0e1623` | 10.20 | 4.5:1 | Cumple. Ajuste: ninguno |
| Cantidad «6» de la tarjeta «Historias por descubrir» (56 px, acento; texto grande) / `--color-surface` | Oscuro | `#b6a6ff` / `#0e1623` | 8.54 | 3:1 | Cumple. Ajuste: ninguno |
| «Inicio» en `:hover` (acento) / `--color-surface-2` | Oscuro | `#b6a6ff` / `#182133` | 7.58 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto principal / `--color-bg` (respaldo del fondo) | Ambos | `#f2f4fc` / `#05060f` | 18.40 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto del botón primario (blanco) / tramo más claro de `--degrade-boton` (`#5934d8` → `#07689b`) | Oscuro | `#ffffff` / `#07689b` | 6.07 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto del botón primario en `:hover` (blanco) / tramo más claro de `--degrade-boton-hover` | Oscuro | `#ffffff` / `#075680` | 7.92 | 4.5:1 | Cumple. Ajuste: ninguno |
| Borde del botón primario (`--color-borde-boton`) / `.formulario`, tramo más claro (no texto) | Oscuro | `#b6a6ff` / `#182133` | 7.58 | 3:1 | Cumple. Ajuste: ninguno |
| Error (ícono ⚠ y borde de `.mensaje--error`) / `--color-surface-2` (no texto) | Oscuro | `#ff9b9b` / `#182133` | 7.98 | 3:1 | Cumple. Ajuste: ninguno |
| Éxito (ícono ✔ y borde de `.mensaje--exito`) / `--color-surface-2` (no texto) | Oscuro | `#8be0ae` / `#182133` | 10.25 | 3:1 | Cumple. Ajuste: ninguno |
| Error, referencia como texto / `.tarjeta`, tramo más claro | Oscuro | `#ff9b9b` / `#182133` | 7.98 | 4.5:1 | Cumple. Ajuste: ninguno |
| Éxito, referencia como texto / `.tarjeta`, tramo más claro | Oscuro | `#8be0ae` / `#182133` | 10.25 | 4.5:1 | Cumple. Ajuste: ninguno |
| Acento rosa (borde de campos en `:hover`) / `.tarjeta`, tramo más claro (no texto) | Oscuro | `#c9a6e8` / `#182133` | 7.75 | 3:1 | Cumple. Ajuste: ninguno |
| Acento rosa (borde del tooltip) / `--color-surface-2` (no texto) | Oscuro | `#c9a6e8` / `#182133` | 7.75 | 3:1 | Cumple. Ajuste: ninguno |
| Acento rosa (borde de la hamburguesa en `:hover`) / `--color-surface` (no texto) | Oscuro | `#c9a6e8` / `#0e1623` | 8.73 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de campos y botones (`--color-borde-campo`) / `main`, tramo más claro (no texto) | Oscuro | `#9a8cc0` / `#251a3a` | 5.35 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de campos y botones / `.formulario`, tramo más claro (no texto) | Oscuro | `#9a8cc0` / `#182133` | 5.28 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de campos y botones / `--color-surface-2` (no texto) | Oscuro | `#9a8cc0` / `#182133` | 5.28 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de campos de registro, pill de búsqueda y botón de tema (1 px) / `--color-surface`, interior del control (no texto) | Oscuro | `#9a8cc0` / `#0e1623` | 5.95 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de la pill de búsqueda (1 px) / `main`, tramo más claro, exterior (no texto) | Oscuro | `#9a8cc0` / `#251a3a` | 5.35 | 3:1 | Cumple. Ajuste: ninguno |
| Lupa de la búsqueda (`--color-text-suave`, ícono) / `--color-surface` (no texto) | Oscuro | `#c3bfdc` / `#0e1623` | 10.20 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de los botones de la barra y de «Inicio» (`--color-borde-campo`) / `--color-surface` de `.barra` (no texto) | Oscuro | `#9a8cc0` / `#0e1623` | 5.95 | 3:1 | Cumple. Ajuste: ninguno |
| Ícono sol/luna (`currentColor` = texto principal) / `--color-surface` del botón de tema (no texto) | Oscuro | `#f2f4fc` / `#0e1623` | 16.52 | 3:1 | Cumple. Ajuste: ninguno |
| Borde del botón de tema activo (`aria-pressed="true"`, acento) / `--color-surface` (no texto) | Oscuro | `#b6a6ff` / `#0e1623` | 8.54 | 3:1 | Cumple. Ajuste: ninguno |
| Borde del botón colapsar (1 px, ancho >= 1024 px, mitad fuera de la sidebar) / halo `--color-bg` (`box-shadow: 0 0 0 3px`) que lo separa de la foto y la galaxia (no texto) | Ambos | `#9a8cc0` / `#05060f` | 6.63 | 3:1 | Cumple. Ajuste: **se agregó el halo**: sin él, contra el peor caso del fondo con foto daba 2.29 (cota apilada) a 3.06 (una nebulosa) y no se garantizaba 3:1 |
| Borde del botón colapsar / `--color-surface`, interior del botón (no texto) | Ambos | `#9a8cc0` / `#0e1623` | 5.95 | 3:1 | Cumple. Ajuste: ninguno |
| Foco (`--color-foco`) sobre el fondo de la página con foto (anillo del botón colapsar y de `main`), peor caso con las 4 nebulosas apiladas y velo 0.6 (no texto) | Ambos | `#ffd166` / (96,83,120) = `#605378` | 4.85 | 3:1 | Cumple. Ajuste: ninguno (con una sola nebulosa, (79,66,88), da 6.47) |
| Foco / halo del botón colapsar, `--color-bg` (no texto) | Ambos | `#ffd166` / `#05060f` | 14.01 | 3:1 | Cumple. Ajuste: ninguno |
| Ícono flecha del botón colapsar (`currentColor` = `#f2f4fc`; en el tema claro por propiedad local) / interior `#0e1623` (no texto) | Ambos | `#f2f4fc` / `#0e1623` | 16.52 | 3:1 | Cumple. Ajuste: ninguno |
| Foco del botón colapsar con anillo rodeado por el halo de 9 px (solo tema claro; anillo `#ffd166` entre dos bandas de `--color-bg`) (no texto) | Claro | `#ffd166` / `#05060f` | 14.01 | 3:1 | Cumple. Ajuste: **se agregó el halo de 9 px con foco**: sin él, la mitad del anillo caería sobre la sidebar clara (`#ffd166` / `#f2e9fb` = 1.22) |
| Chip de autor sin marcar: borde `--color-borde-campo` / `.formulario`, tramo más claro (no texto) | Oscuro | `#9a8cc0` / `#182133` | 5.28 | 3:1 | Cumple. Ajuste: ninguno |
| Chip de autor sin marcar: borde / `--color-surface`, interior del chip (no texto) | Oscuro | `#9a8cc0` / `#0e1623` | 5.95 | 3:1 | Cumple. Ajuste: ninguno |
| Chip de autor sin marcar: recuadro `::before` (`currentColor` = texto suave) / `--color-surface` (no texto) | Oscuro | `#c3bfdc` / `#0e1623` | 10.20 | 3:1 | Cumple. Ajuste: ninguno |
| Chip de autor marcado: texto acento (✓ incluida) / `--color-surface-2` | Oscuro | `#b6a6ff` / `#182133` | 7.58 | 4.5:1 | Cumple. Ajuste: ninguno |
| Chip de autor marcado: borde acento / `.formulario`, tramo más claro (no texto) | Oscuro | `#b6a6ff` / `#182133` | 7.58 | 3:1 | Cumple. Ajuste: ninguno |
| Foco (`--color-foco`) / `main`, tramo más claro (no texto) | Oscuro | `#ffd166` / `#251a3a` | 11.31 | 3:1 | Cumple. Ajuste: ninguno |
| Foco / `.sidebar`, tramo más claro (no texto) | Oscuro | `#ffd166` / `#101824` | 12.36 | 3:1 | Cumple. Ajuste: ninguno |
| Foco / `.tarjeta` y `.formulario`, tramo más claro (incluye el anillo del chip enfocado) (no texto) | Oscuro | `#ffd166` / `#182133` | 11.17 | 3:1 | Cumple. Ajuste: ninguno |
| Foco / `--color-surface-2` (no texto) | Oscuro | `#ffd166` / `#182133` | 11.17 | 3:1 | Cumple. Ajuste: ninguno |
| Foco en `.barra` (hamburguesa, «Inicio», tema) / `--color-surface` (no texto) | Oscuro | `#ffd166` / `#0e1623` | 12.58 | 3:1 | Cumple. Ajuste: ninguno |

### Marca (`.marca`)

**Ambos temas (D20, D21):** el encabezado es **transparente**: no hay franja opaca; detrás del título se ven la foto difuminada de la biblioteca y la nebulosa de la página. Para sostener el contraste, `.marca::before` dibuja (sin HTML extra, decorativo, con `overflow-x: clip` en `.marca`) dos capas radiales: un **resplandor violeta** (`rgba(120, 84, 210, .25)` en el centro, elipse de ancho `min(24rem, 90%)` × 6.5 rem) y, debajo, un **velo oscuro difuso** `rgb(8, 5, 18)` (elipse de ancho `min(34rem, 100%)` × 9.5 rem, centrada en el texto). Opacidad del velo según la distancia relativa `t` al centro: 0.85 en el centro, 0.82 hasta `t` = 0.55, 0.61 en 0.75, 0.28 en 0.90 y 0 en 1. El texto más alejado del centro (los extremos del lema, a 320 px y a 1280 px) queda en `t` ≈ 0.62–0.68, así que cada par se verificó en el centro (velo 0.85 + resplandor 0.25) y en `t` = 0.75 (velo 0.61, resplandor 0.05 como cota superior del real). **Fondo de peor caso debajo del velo:** el de «Fondo de la página con foto», (96,83,120) = `#605378`. Con el velo da `#2e224d` en el centro, `#231c34` en `t` = 0.62 y `#2e2641` en `t` = 0.75. Los halos de `text-shadow` y `drop-shadow` del título son sombras difusas de cobertura parcial y, como en el resto del README, no se descuentan del par.

**Tema claro (D21):** el encabezado es idéntico al del tema oscuro (transparente, con el mismo resplandor y velo radial sobre el mismo fondo con foto, nebulosas y estrellas), así que los pares de abajo valen para **ambos temas**. Ya no existe la superficie opaca `--marca-fondo`.

El degradé de «CODEX» (D20, tomado del prototipo) va de blanco a lila, violeta y azul: `#ffffff` 0 % → `#e4d0ff` 24 % → `#bc92f8` 48 % → `#9a8cff` 72 % → `#78a2ff` 100 % (con `background-clip: text`; respaldo sólido `--marca-texto` y `CanvasText` en `forced-colors`). Su tramo más oscuro es `#9a8cff`. «CODEX» es texto grande (mínimo 3:1), pero **se exigió 4.5:1** a todos sus tramos.

| Par (texto o elemento / fondo) | Tema | Colores (hex) | Ratio (calculado con fórmula WCAG) | Mínimo | Resultado y ajuste |
|---|---|---|---|---|---|
| «Editorial» y respaldo sólido de «CODEX» (`--marca-texto`) / peor caso, centro del velo | Ambos | `#f3eaff` / `#2e224d` | 12.45 | 4.5:1 | Cumple. Ajuste: ninguno |
| «Editorial» y respaldo de «CODEX» / peor caso, `t` = 0.75 | Ambos | `#f3eaff` / `#2e2641` | 12.26 | 4.5:1 | Cumple. Ajuste: ninguno |
| Lema «Tus historias. Tu próximo mundo.» (`#e4dced`, cursiva) / peor caso, centro del velo | Ambos | `#e4dced` / `#2e224d` | 10.89 | 4.5:1 | Cumple. Ajuste: ninguno |
| Lema / peor caso, `t` = 0.75 | Ambos | `#e4dced` / `#2e2641` | 10.72 | 4.5:1 | Cumple. Ajuste: ninguno |
| «CODEX», tramo `#ffffff` / peor caso, centro del velo | Ambos | `#ffffff` / `#2e224d` | 14.51 | 4.5:1 | Cumple. Ajuste: ninguno |
| «CODEX», tramo `#e4d0ff` / peor caso, centro del velo | Ambos | `#e4d0ff` / `#2e224d` | 10.20 | 4.5:1 | Cumple. Ajuste: ninguno |
| «CODEX», tramo `#bc92f8` / peor caso, centro del velo | Ambos | `#bc92f8` / `#2e224d` | 5.94 | 4.5:1 | Cumple. Ajuste: ninguno |
| «CODEX», tramo más oscuro `#9a8cff` / peor caso, centro del velo | Ambos | `#9a8cff` / `#2e224d` | 5.23 | 4.5:1 | Cumple. Ajuste: ninguno |
| «CODEX», tramo `#78a2ff` / peor caso, centro del velo | Ambos | `#78a2ff` / `#2e224d` | 5.81 | 4.5:1 | Cumple. Ajuste: ninguno |
| «CODEX», tramo más oscuro `#9a8cff` / peor caso, `t` = 0.75 | Ambos | `#9a8cff` / `#2e2641` | 5.15 | 4.5:1 | Cumple. Ajuste: ninguno |
| «CODEX», tramo `#bc92f8` / peor caso, `t` = 0.75 | Ambos | `#bc92f8` / `#2e2641` | 5.86 | 4.5:1 | Cumple. Ajuste: ninguno |
| «CODEX», tramo `#78a2ff` / peor caso, `t` = 0.75 | Ambos | `#78a2ff` / `#2e2641` | 5.72 | 4.5:1 | Cumple. Ajuste: ninguno |
| Ícono del libro de la marca (trazo `#d6baff`) / peor caso, centro del velo (no texto) | Ambos | `#d6baff` / `#2e224d` | 8.52 | 3:1 | Cumple. Ajuste: ninguno |
| Foco `--color-foco-marca` en `.marca__enlace` (anillo a `t` ≈ 0.45, velo 0.83 + resplandor 0.12) (no texto) | Ambos | `#ffd166` / `#231a38` | 11.41 | 3:1 | Cumple. Ajuste: ninguno |
| Foco `--color-foco-marca` si no hubiera velo (cota: solo el peor caso del fondo) (no texto) | Ambos | `#ffd166` / `#605378` | 4.85 | 3:1 | Cumple. Ajuste: ninguno (también cubre el anillo del enlace «Saltar al contenido», que cae en la esquina, fuera del velo; en el tema claro su `outline-color` es `--color-foco-marca`, no `--color-foco`) |

### Banner «Hola, lector» (`.bienvenida__banner`), igual en ambos temas

El texto va sobre `.bienvenida__contenido`, una superficie local `rgba(14, 18, 39, .94)` que no deja ver la foto detrás del texto. Peor caso calculado: velo al 94 % sobre un píxel blanco de la imagen = `#1c2034`. El texto queda siempre dentro de esa superficie (tiene padding). El degradé del banner que se ve al costado del texto (de `rgba(14,18,39,.98)` a transparente) no lleva texto encima.

| Par (texto o elemento / fondo) | Tema | Colores (hex) | Ratio (calculado con fórmula WCAG) | Mínimo | Resultado y ajuste |
|---|---|---|---|---|---|
| Título «Hola, lector…» (`--color-banner-texto`, Cinzel 24–36 px, negrita; texto grande) / peor caso de `.bienvenida__contenido` | Ambos | `#f2f4fc` / `#1c2034` | 14.65 | 3:1 | Cumple. Ajuste: ninguno |
| Título, referencia como texto normal / peor caso de `.bienvenida__contenido` | Ambos | `#f2f4fc` / `#1c2034` | 14.65 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto «Desconectá un rato…» (`--color-banner-suave`, 16 px) / peor caso de `.bienvenida__contenido` | Ambos | `#d7d1eb` / `#1c2034` | 10.88 | 4.5:1 | Cumple. Ajuste: ninguno |
| Título si la imagen no carga (respaldo `background-color` `#131a31`) / `#131a31` | Ambos | `#f2f4fc` / `#131a31` | 15.68 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto «Desconectá un rato…» si la imagen no carga / `#131a31` | Ambos | `#d7d1eb` / `#131a31` | 11.65 | 4.5:1 | Cumple. Ajuste: ninguno |

### Tema claro (`:root[data-tema="claro"]`)

| Par (texto o elemento / fondo) | Tema | Colores (hex) | Ratio (calculado con fórmula WCAG) | Mínimo | Resultado y ajuste |
|---|---|---|---|---|---|
| Texto principal / `main` (`--degrade-superficie`), tramo más oscuro | Claro | `#1c1530` / `#f9e9f4` | 15.00 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `main`, tramo más oscuro | Claro | `#54486f` / `#f9e9f4` | 7.10 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto principal / `.sidebar` (`--degrade-sidebar`), tramo más oscuro (nombre del logo, enlaces) | Claro | `#1c1530` / `#f2e9fb` | 14.86 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `.sidebar`, tramo más oscuro (rótulo «TU BIBLIOTECA», enlaces del menú sin activar) | Claro | `#54486f` / `#f2e9fb` | 7.04 | 4.5:1 | Cumple. Ajuste: ninguno |
| Logo «CODEX» de la sidebar (30 px, Cinzel; texto grande) / `.sidebar`, tramo más oscuro | Claro | `#5c37bd` / `#f2e9fb` | 6.51 | 3:1 | Cumple. Ajuste: ninguno |
| Texto principal / `.tarjeta` y `.formulario` (`--degrade-tarjeta`), tramo más oscuro (títulos, etiquetas, precio) | Claro | `#1c1530` / `#f6e3f0` | 14.31 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `.tarjeta` y `.formulario`, tramo más oscuro (datos de la tarjeta, ayuda del formulario) | Claro | `#54486f` / `#f6e3f0` | 6.78 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto principal / `.tabla-contenedor` (`--degrade-tabla`), tramo más oscuro | Claro | `#1c1530` / `#f5e3f0` | 14.28 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `.tabla-contenedor`, tramo más oscuro | Claro | `#54486f` / `#f5e3f0` | 6.76 | 4.5:1 | Cumple. Ajuste: ninguno |
| Enlace/acento (`a`, `.resumen-venta__total`) / `main`, tramo más oscuro | Claro | `#5c37bd` / `#f9e9f4` | 6.57 | 4.5:1 | Cumple. Ajuste: ninguno |
| Enlace/acento / `.tarjeta`, tramo más oscuro | Claro | `#5c37bd` / `#f6e3f0` | 6.27 | 4.5:1 | Cumple. Ajuste: ninguno |
| Enlace/acento / `.tabla-contenedor`, tramo más oscuro | Claro | `#5c37bd` / `#f5e3f0` | 6.26 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto principal / `--color-surface-2` (`.tabla th`, `.mensaje`, `.aviso`, hamburguesa, botón secundario, tooltip) | Claro | `#1c1530` / `#f5effc` | 15.54 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `--color-surface-2` (`.aviso`, `.mensaje--vacio`, `.tabla th`) | Claro | `#54486f` / `#f5effc` | 7.36 | 4.5:1 | Cumple. Ajuste: ninguno |
| Enlace activo del menú (`aria-current`, acento) / `--color-surface-2` | Claro | `#5c37bd` / `#f5effc` | 6.81 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto principal / `--color-surface` (campos y selects de registro, pill de búsqueda, botón de tema, etiqueta «Historias por descubrir», `.salto`) | Claro | `#1c1530` / `#ffffff` | 17.51 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto suave / `--color-surface` (enlace «Inicio», `.barra__texto`, `placeholder` del buscador, detalle «libros, infinitos mundos», chips sin marcar) | Claro | `#54486f` / `#ffffff` | 8.29 | 4.5:1 | Cumple. Ajuste: ninguno |
| Cantidad «6» de la tarjeta «Historias por descubrir» (56 px, acento; texto grande) / `--color-surface` | Claro | `#5c37bd` / `#ffffff` | 7.67 | 3:1 | Cumple. Ajuste: ninguno |
| «Inicio» en `:hover` (acento) / `--color-surface-2` | Claro | `#5c37bd` / `#f5effc` | 6.81 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto del botón primario (blanco) / tramo más claro de `--degrade-boton` (`#5934d8` → `#07689b`) | Claro | `#ffffff` / `#07689b` | 6.07 | 4.5:1 | Cumple. Ajuste: ninguno |
| Texto del botón primario en `:hover` (blanco) / tramo más claro de `--degrade-boton-hover` | Claro | `#ffffff` / `#075680` | 7.92 | 4.5:1 | Cumple. Ajuste: ninguno |
| Borde del botón primario (`--color-borde-boton`) / `.formulario`, tramo más oscuro (no texto) | Claro | `#5934d8` / `#f6e3f0` | 5.90 | 3:1 | Cumple. Ajuste: ninguno |
| Error (ícono ⚠ y borde de `.mensaje--error`) / `--color-surface-2` (no texto) | Claro | `#a8201a` / `#f5effc` | 6.46 | 3:1 | Cumple. Ajuste: ninguno |
| Éxito (ícono ✔ y borde de `.mensaje--exito`) / `--color-surface-2` (no texto) | Claro | `#17663a` / `#f5effc` | 6.22 | 3:1 | Cumple. Ajuste: ninguno |
| Error, referencia como texto / `.tarjeta`, tramo más oscuro | Claro | `#a8201a` / `#f6e3f0` | 5.95 | 4.5:1 | Cumple. Ajuste: ninguno |
| Éxito, referencia como texto / `.tarjeta`, tramo más oscuro | Claro | `#17663a` / `#f6e3f0` | 5.73 | 4.5:1 | Cumple. Ajuste: ninguno |
| Acento rosa (borde de campos en `:hover`) / `.tarjeta`, tramo más oscuro (no texto) | Claro | `#8a3d84` / `#f6e3f0` | 5.57 | 3:1 | Cumple. Ajuste: ninguno |
| Acento rosa (borde del tooltip) / `--color-surface-2` (no texto) | Claro | `#8a3d84` / `#f5effc` | 6.05 | 3:1 | Cumple. Ajuste: ninguno |
| Acento rosa (borde de la hamburguesa en `:hover`) / `--color-surface` (no texto) | Claro | `#8a3d84` / `#ffffff` | 6.82 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de campos y botones (`--color-borde-campo`) / `main`, tramo más oscuro (no texto) | Claro | `#66598c` / `#f9e9f4` | 5.33 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de campos y botones / `.formulario`, tramo más oscuro (no texto) | Claro | `#66598c` / `#f6e3f0` | 5.09 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de campos y botones / `--color-surface-2` (no texto) | Claro | `#66598c` / `#f5effc` | 5.53 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de campos de registro, pill de búsqueda y botón de tema (1 px) / `--color-surface`, interior del control (no texto) | Claro | `#66598c` / `#ffffff` | 6.23 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de la pill de búsqueda (1 px) / `main`, tramo más oscuro, exterior (no texto) | Claro | `#66598c` / `#f9e9f4` | 5.33 | 3:1 | Cumple. Ajuste: ninguno |
| Lupa de la búsqueda (`--color-text-suave`, ícono) / `--color-surface` (no texto) | Claro | `#54486f` / `#ffffff` | 8.29 | 3:1 | Cumple. Ajuste: ninguno |
| Borde de los botones de la barra y de «Inicio» (`--color-borde-campo`) / `--color-surface` de `.barra` (no texto) | Claro | `#66598c` / `#ffffff` | 6.23 | 3:1 | Cumple. Ajuste: ninguno |
| Ícono sol/luna (`currentColor` = texto principal) / `--color-surface` del botón de tema (no texto) | Claro | `#1c1530` / `#ffffff` | 17.51 | 3:1 | Cumple. Ajuste: ninguno |
| Borde del botón de tema activo (`aria-pressed="true"`, acento) / `--color-surface` (no texto) | Claro | `#5c37bd` / `#ffffff` | 7.67 | 3:1 | Cumple. Ajuste: ninguno |
| Tooltip del menú colapsado (relleno `--color-surface-2` `#f5effc`) / fondo de la página `--color-bg`, donde se superpone (no texto) | Claro | `#f5effc` / `#05060f` | 17.93 | 3:1 | Cumple. Ajuste: el borde del tooltip en tema claro pasa de `#8a3d84` (2.96 sobre `#05060f`) a `#9a4a94`: 3.64 sobre el fondo de la página `#05060f` y 4.76 sobre `main` `#f9e9f4` (calculado con fórmula WCAG) |
| Botón colapsar en tema claro: ver filas «Ambos» del tema oscuro (borde `#9a8cc0` / halo `#05060f` 6.63; interior 5.95; ícono 16.52; foco 14.01 / 4.85) | Claro | `#9a8cc0` / `#05060f` | 6.63 | 3:1 | Cumple. Ajuste: valores del tema oscuro por propiedades locales (el borde claro `#66598c` daba solo 3.24 contra el halo)
| Chip de autor sin marcar: borde `--color-borde-campo` / `.formulario`, tramo más oscuro (no texto) | Claro | `#66598c` / `#f6e3f0` | 5.09 | 3:1 | Cumple. Ajuste: ninguno |
| Chip de autor sin marcar: borde / `--color-surface`, interior del chip (no texto) | Claro | `#66598c` / `#ffffff` | 6.23 | 3:1 | Cumple. Ajuste: ninguno |
| Chip de autor sin marcar: recuadro `::before` (`currentColor` = texto suave) / `--color-surface` (no texto) | Claro | `#54486f` / `#ffffff` | 8.29 | 3:1 | Cumple. Ajuste: ninguno |
| Chip de autor marcado: texto acento (✓ incluida) / `--color-surface-2` | Claro | `#5c37bd` / `#f5effc` | 6.81 | 4.5:1 | Cumple. Ajuste: ninguno |
| Chip de autor marcado: borde acento / `.formulario`, tramo más oscuro (no texto) | Claro | `#5c37bd` / `#f6e3f0` | 6.27 | 3:1 | Cumple. Ajuste: ninguno |
| Foco (`--color-foco`) / `main`, tramo más oscuro (no texto) | Claro | `#1b4fd8` / `#f9e9f4` | 5.70 | 3:1 | Cumple. Ajuste: ninguno |
| Foco / `.sidebar`, tramo más oscuro (no texto) | Claro | `#1b4fd8` / `#f2e9fb` | 5.65 | 3:1 | Cumple. Ajuste: ninguno |
| Foco / `.tarjeta` y `.formulario`, tramo más oscuro (incluye el anillo del chip enfocado) (no texto) | Claro | `#1b4fd8` / `#f6e3f0` | 5.44 | 3:1 | Cumple. Ajuste: ninguno |
| Foco / `--color-surface-2` (no texto) | Claro | `#1b4fd8` / `#f5effc` | 5.90 | 3:1 | Cumple. Ajuste: ninguno |
| Foco en `.barra` (hamburguesa, «Inicio», tema) / `--color-surface` (no texto) | Claro | `#1b4fd8` / `#ffffff` | 6.65 | 3:1 | Cumple. Ajuste: ninguno |
| Foco en `.barra` con `#ffd166` (DESCARTADO por fallar) / `--color-surface` de la barra | Claro | `#ffd166` / `#ffffff` | 1.44 | 3:1 | **No cumple: por eso `#ffd166` NO se usa en la barra del tema claro** |

### Tapas de libro (iguales en ambos temas)

Texto blanco (`#ffffff`) de `.tarjeta__tapa-titulo` (negrita, 20 px) y `.tarjeta__tapa-autor` (14 px, requiere 4.5:1) sobre el **tramo más claro** de cada degradé.

| Par (texto o elemento / fondo) | Tema | Colores (hex) | Ratio (calculado con fórmula WCAG) | Mínimo | Resultado y ajuste |
|---|---|---|---|---|---|
| Tapa 1 (`.tapa--degrade-1`), texto blanco sobre el tramo más claro | Ambos | `#ffffff` / `#1c3f9e` | 9.32 | 4.5:1 | Cumple. Ajuste: ninguno |
| Tapa 2 (`.tapa--degrade-2`), texto blanco sobre el tramo más claro | Ambos | `#ffffff` / `#0b4f6c` | 8.94 | 4.5:1 | Cumple. Ajuste: ninguno |
| Tapa 3 (`.tapa--degrade-3`), texto blanco sobre el tramo más claro | Ambos | `#ffffff` / `#7a2048` | 9.87 | 4.5:1 | Cumple. Ajuste: ninguno |
| Tapa 4 (`.tapa--degrade-4`), texto blanco sobre el tramo más claro | Ambos | `#ffffff` / `#0b4f6c` | 8.94 | 4.5:1 | Cumple. Ajuste: ninguno |
| Tapa 5 (`.tapa--degrade-5`), texto blanco sobre el tramo más claro | Ambos | `#ffffff` / `#7c3a0a` | 8.51 | 4.5:1 | Cumple. Ajuste: ninguno |
| Tapa 6 (`.tapa--degrade-6`), texto blanco sobre el tramo más claro | Ambos | `#ffffff` / `#5b21b6` | 8.98 | 4.5:1 | Cumple. Ajuste: ninguno |

### Referencia: bordes y elementos decorativos

| Par (texto o elemento / fondo) | Tema | Colores (hex) | Ratio (calculado con fórmula WCAG) | Mínimo | Resultado y ajuste |
|---|---|---|---|---|---|
| Borde de superficies (`--color-borde`, `--color-linea`) / `main`, tramo más claro (decorativo) | Oscuro | `#8675a7` / `#251a3a` | 3.97 | — | Informativo (no se exige) |
| Borde de superficies (`--color-borde`, `--color-linea`) / `main`, tramo más oscuro (decorativo) | Claro | `#80708f` / `#f9e9f4` | 3.88 | — | Informativo (no se exige) |
| Borde del banner (`--color-banner-borde` `#b6a6ff`) / `main`, tramo más claro (decorativo; el banner se delimita por su fondo oscuro) | Oscuro | `#b6a6ff` / `#251a3a` | 7.68 | — | Informativo (no se exige) |
| Borde del banner (`--color-banner-borde` `#b6a6ff`) / `main`, tramo más oscuro (decorativo; el banner se delimita por su fondo oscuro) | Claro | `#b6a6ff` / `#f9e9f4` | 1.82 | — | Informativo (no se exige) |
| Destello ✦ de la tarjeta «Historias por descubrir» (trazo acento, `aria-hidden`) / `--color-surface` | Oscuro | `#b6a6ff` / `#0e1623` | 8.54 | — | Informativo (no se exige) |
| Destello ✦ de la tarjeta «Historias por descubrir» (trazo acento, `aria-hidden`) / `--color-surface` | Claro | `#5c37bd` / `#ffffff` | 7.67 | — | Informativo (no se exige) |

**Notas:**

- **Ningún par usado está por debajo del mínimo.** La única fila que falla es la de `#ffd166` sobre la barra del tema claro y está marcada como **descartada**: precisamente por eso no se usa ahí.
- **Anillo de foco en el tema claro:** sobre el título (`.marca`: velo oscuro en el tema oscuro, franja oscura en el claro) y sobre el enlace «Saltar al contenido» se usa `--color-foco-marca` (`#ffd166`) en ambos temas. En el tema claro la barra superior es blanca, por lo que ahí `#ffd166` daría 1.4:1: se conserva `--color-foco` (`#1b4fd8`).
- **Chips de autores (formulario de libros):** el `<input type="checkbox">` real queda visualmente oculto (1 px, `clip-path`), sigue en el orden de Tab y se marca con la barra espaciadora; el anillo de foco (`3px solid var(--color-foco)`) se dibuja sobre el chip (`input:focus-visible + label`). El estado marcado se distingue por el ✓ y el cambio de peso, no solo por color.
- **Botón de tema:** el estado ya no se distingue por el grosor del borde sino por el ícono (sol / luna) y por `aria-label`/`aria-pressed`; el borde de estado activo sigue cumpliendo 3:1.
- Las estrellas doradas de la marca (`#e8c47a`), el destello ✦ y la línea de la tarjeta «Historias por descubrir» son decorativos (`aria-hidden`) y no se evalúan como requisito.
- Los bordes decorativos de tarjetas, tablas, secciones, mensajes y banner (`--color-borde`, `--color-linea`) no identifican controles y no se exige contraste. El brillo (`box-shadow`) es decorativo.
- El texto «Error:» de `.mensaje--error` usa el color de texto principal; el color de error solo pinta el ícono y el borde, así que el mensaje se entiende por el texto y el ícono, no solo por el color.
- Estos valores son de cálculo. Cómo se ven los degradés, la foto del banner y el brillo en el navegador lo verifica Amanda a mano (ver la sección siguiente).

## Verificación manual — C-01

Verificación manual en el navegador (sin tests automáticos). Se registra el comportamiento real observado, aunque falle.

- **Fecha:** 14/10/2026
- **Navegador (nombre y versión):** Microsoft Edge 155.0.4283.45 (Chromium 155) en Windows 11
- **Apertura:** `file://` (doble clic en `index.html`)

| Criterio | Cómo se verificó | Resultado observado | Estado |
|---|---|---|---|
| Abrir `index.html` por doble clic (`file://`) y ver las 5 secciones sin errores en consola | Doble clic sobre `index.html`; revisar consola de DevTools | Sin errores ni advertencias en consola. Abre en Catálogo; las 5 vistas son accesibles desde el menú, una a la vez | ✅ Aprobado |
| Cada `id`/`name` del HTML coincide 1 a 1 con la tabla de este README | Muestreo manual con Ctrl+F en el código fuente (view-source) + comparación completa automatizada por el agente | Manual: 9 de 55 verificados, todos presentes (los que aparecen 2 veces corresponden a `label for` + `id` del campo). Comparación completa del agente: 43 `id` y 12 `name`, 0 faltantes | ✅ Aprobado |
| Todos los campos tienen label asociada (clic en la label enfoca el campo) | Clic en cada etiqueta de los formularios | En Catálogo, Libros, Clientes y Ventas el clic en cada etiqueta enfoca su campo; en Autores el clic en el nombre tilda y destilda el checkbox | ✅ Aprobado |
| Cambiar de vista con clic y con teclado; la vista activa se distingue sin depender del color | Navegar con mouse y con Tab/Enter; emulación de acromatopsia en DevTools | Funciona con clic y con teclado (Tab + Enter); la vista activa se distingue por negrita y subrayado grueso | ✅ Aprobado |
| Recargar con `#ventas` en la URL muestra Ventas; sin hash muestra Catálogo | Recargar con `#ventas` y luego sin hash | Con `#ventas` abre en Ventas; sin hash abre en Catálogo | ✅ Aprobado |
| Botón "atrás" del navegador vuelve a la vista previa | Recorrer varias vistas y usar "atrás" hasta Catálogo | Recorre las vistas anteriores en orden hasta Catálogo | ✅ Aprobado |
| Sin JS (tarea 3.4): se ven las 5 vistas y los enlaces desplazan a cada sección | Deshabilitar JavaScript en DevTools y recargar | Se ven las 5 vistas y los enlaces desplazan a cada sección | ✅ Aprobado |
| Vista a 320 px (anotar scroll horizontal o aspecto sin estilo: el responsive es C-02) | DevTools modo responsive a 320 px, recorrer las 5 vistas; `document.documentElement.scrollWidth <= window.innerWidth` en consola | En las 5 vistas la prueba devuelve `true` (sin scroll horizontal). Contenido en una columna, sin estilos; las tablas se ajustan partiendo el texto de las celdas en varias líneas. Texto legible | ✅ Aprobado |
| Vista a 1280 px | DevTools modo responsive a 1280 px, recorrer las 5 vistas; misma prueba de `scrollWidth` | Sin scroll horizontal (la prueba devuelve `true`). Sin estilos: contenido alineado a la izquierda con mucho espacio libre a la derecha; tablas compactas y legibles | ✅ Aprobado |
| Recorrido solo con teclado (Tab/Shift+Tab/Enter) por las 5 vistas | Sin usar el mouse | Con Tab/Shift+Tab se recorren los enlaces del menú y los controles de cada vista; con Enter se cambia de vista | ✅ Aprobado |
| Al cambiar de vista el foco va al `h2` de la vista | Navegar con teclado y observar el elemento enfocado | Al cambiar de vista con Enter el foco pasa al `h2` de la vista y el siguiente Tab continúa dentro de esa vista | ✅ Aprobado |
| El foco es siempre visible | Tab por enlaces, campos y botones de todas las vistas | El contorno de foco se ve en todos los elementos recorridos | ✅ Aprobado |
| Ningún formulario recarga la página (Enter en buscador, en `cliente-email`, en `venta-cantidad`; clic en "Guardar libro") | Probar cada envío y verificar que la URL y la página no cambian | La página no se recarga, la URL no cambia y el texto ingresado se conserva en los 4 casos | ✅ Aprobado |
| La consola no muestra errores | Revisar consola de DevTools durante todo el recorrido | Sin errores ni advertencias al final del recorrido | ✅ Aprobado |
| La vista activa se distingue sin color | DevTools > Rendering > Emulate vision deficiencies: achromatopsia | El enlace activo se distingue por la negrita y el subrayado grueso | ✅ Aprobado |

## Verificación manual — C-02

Registro **a mano**, en el navegador (sin tests automáticos). Se anota el comportamiento real observado, aunque falle (RN-GL-03). Lo que figura como "No ejecutado" no se ejecutó y no está aprobado.

- **Fecha:** 14/10/2026
- **Navegador (nombre y versión):** Microsoft Edge 155.0.4283.45 (Chromium 155) en Windows 11
- **Apertura:** `file://` (doble clic en `index.html`), con `localStorage` limpio al empezar
- **Contraste:** los ratios se **calcularon con la fórmula de WCAG** (ver "Contraste de color (C-02)"); no se midieron en DevTools.
- **Resumen:** 19 ítems ejecutados OK (uno, E1, parcial), 0 fallos, 14 ítems no ejecutados. El contraste es un cálculo, no una ejecución en el navegador.

Columna "Tareas": a qué tarea de `openspec/changes/estilos-responsive-accesibilidad/tasks.md` aporta cada ítem (1.15 = Checklist A, 2.8 = Checklist B, 3.5 = 320/1280 px en ambos temas, 3.6 = teclado, 3.7 = preferencias y movimiento).

### Ítems ejecutados

| ID | Qué se verifica | Tareas | Resultado observado |
|---|---|---|---|
| A1 | Carga sin hash: abre Catálogo y la consola no muestra errores | 1.15, 2.8, 3.5 | OK — sin hash abre el Catálogo con el banner y la tarjeta «Historias por descubrir»; la consola no muestra errores |
| A4 | Skip-link: primer Tab lo muestra y al activarlo el foco pasa al contenido | 3.6 | OK — el skip-link se muestra con el primer Tab y al activarlo el foco pasa al contenido |
| A5 | Recorrido con Tab/Shift+Tab por todo: foco siempre visible | 1.15, 3.6 | OK — Tab y Shift+Tab recorren todo en orden lógico y el foco siempre se ve |
| A6 | Enter en los 5 enlaces: el foco va al `h2` y `aria-current="page"` queda solo en el enlace propio | 2.8, 3.6 | OK — con Enter en los 5 enlaces el foco va al `h2` y `aria-current` queda solo en el enlace de la vista visible |
| A8 | Enter en los formularios no recarga la página | 3.6 | OK — Enter en los campos de los 4 formularios no recarga la página |
| A9 | Tab llega a las 5 regiones de tabla y el foco se ve | 3.6 | OK — Tab llega a las 5 regiones de tabla y el foco se ve |
| A12 | Colapsar la sidebar con Enter/Espacio; `aria-expanded` y `aria-label` cambian | 2.8, 3.6 | OK — colapsa con Enter y expande con Espacio; `aria-expanded` y `aria-label` cambian; al colapsar se oculta el logo y «TU BIBLIOTECA» |
| A13 | Tooltip de "Ventas" con la sidebar colapsada | 3.6 | OK — con la sidebar colapsada aparece el tooltip «Ventas» |
| A14 | `scrollWidth <= innerWidth` en las 5 vistas a 1280 px, tema oscuro | 1.15, 2.8, 3.5 | OK — la prueba devuelve `true` en las 5 vistas |
| A15 | Mensaje de error y enlace activo legibles en Achromatopsia | 1.15 | OK — el mensaje de error y el enlace activo se leen bien en Achromatopsia |
| B1 | Botón de tema con Espacio; `aria-pressed` y `aria-label` cambian | 3.6 | OK — el tema claro muestra la luna, `aria-pressed="true"` y `aria-label` «Activar tema oscuro» (en oscuro muestra el sol con «Activar tema claro») |
| B2 | Recargar mantiene el tema claro y la sidebar colapsada | 1.15, 2.8, 3.7 | OK — al recargar se mantienen el tema claro y la sidebar colapsada. Observación de diseño: el fondo exterior se mantiene galáctico y el botón de colapsar se ve como un disco oscuro |
| B4 | Foco visible en tema claro, incluidos el título y la barra | 1.15, 3.6 | OK — el foco se ve en todo, incluidos el título, la barra, «Inicio», la píldora y los chips |
| C2 | A 320 px: hamburguesa con Enter abre (foco al primer enlace) y Escape cierra (el foco vuelve a la hamburguesa) | 2.8, 3.6 | OK — Enter abre el menú con el foco en el primer enlace; Escape lo cierra y el foco vuelve a la hamburguesa |
| C4 | A 320 px: un enlace del menú navega, cierra el menú y el foco va al `h2` | 2.8, 3.6 | OK — el enlace «Clientes» navega, cierra el menú y el foco va al `h2`; el logo también cierra el menú y lleva al Catálogo |
| C6 | A 320 px: `scrollWidth <= innerWidth` en las 5 vistas, tema claro y oscuro | 1.15, 2.8, 3.5 | OK — la prueba devuelve `true` en las 5 vistas, en tema claro y en oscuro |
| C7 | A 320 px las tablas se desplazan dentro de su contenedor, no la página | 3.5 | OK — las tablas se desplazan dentro de su contenedor |
| D1 | Sin JS a 320 px: menú visible, enlace «Inicio» de la barra visible, sin botones que dependan de JS (hamburguesa, colapsar, tema), vistas apiladas | 2.8 | OK — se ven el menú y la barra con «Inicio»; no hay hamburguesa, colapsar, cerrar ni tema; las vistas aparecen apiladas |
| E1 | Ajuste final de diseño (D18): banner y tarjeta «Historias por descubrir» solo en Catálogo; «Inicio» lleva al Catálogo sin marcar `aria-current`; chips de autores en Libros con Tab y Espacio (foco visible); ícono sol/luna del botón de tema en ambos temas | 2.8, 3.5, 3.6 | OK (parcial) — «Inicio» de la barra vuelve al Catálogo sin `aria-current`; los chips de autores se operan con Tab y Espacio; el botón de tema muestra sol en oscuro y luna en claro; el banner y la tarjeta se ven en el Catálogo (A1). No se informó una comprobación explícita de que el banner y la tarjeta no aparezcan en las otras vistas |
| Contraste | Todos los pares ≥ 4.5:1 (texto) y ≥ 3:1 (no texto) en ambos temas | 1.15 | calculado con fórmula WCAG, ver tabla de "Contraste de color (C-02)" |

### Ítems no ejecutados

| ID | Qué se verifica | Tareas | Resultado |
|---|---|---|---|
| A2 | Network: solo recursos locales | 1.15, 3.5 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) |
| A3 | El foco no se mueve en la carga | 2.8 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) |
| A7 | El título lleva a Catálogo y muestra el efecto | 3.6 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) |
| A10 | Hashes: `#libros`, `#clientes`, `#ventas`, `#historial`, `#inexistente`, `#`, `#libro-titulo`, `#contenido` | 2.8 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1). C-01 solo cubrió `#ventas` y la carga sin hash; el resto no se registró |
| A11 | El botón "atrás" vuelve a la vista previa | 2.8 | No ejecutado en C-02: cubierto en C-01 (criterio "Botón 'atrás' del navegador vuelve a la vista previa" de *Verificación manual — C-01*). C-02 no cambió esa navegación |
| A16 | Con movimiento reducido ni el título ni el fondo se animan solos | 1.15, 3.7 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) |
| B3 | Solo existen claves `libreria.preferencias.*` en `localStorage` | 3.7 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) |
| B5 | `scrollWidth <= innerWidth` en las 5 vistas a 1280 px, tema claro | 3.5 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) |
| C1 | Con el menú cerrado, Tab no entra a los enlaces ocultos | 2.8 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) |
| C3 | Cerrar el menú con el botón y con el velo | 2.8, 3.6 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) |
| C5 | Abrir el menú y pasar a 1280 px no deja el velo | 2.8 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) |
| C8 | A 320 px las flechas del teclado desplazan la tabla enfocada | 3.4b, 3.6 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) |
| D2 | Sin JS a 320 px, el enlace "Ventas" desplaza a su sección | 2.8 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1). C-01 verificó las anclas sin JS, pero C-02 cambió el diseño de la sidebar, así que no alcanza como cobertura |
| D3 | Sin JS a 1280 px | 2.8 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1). Mismo motivo que D2 |

**Nota sobre la tarea 3.4b:** A9 (Tab llega a las 5 regiones de tabla y el foco se ve) se ejecutó y quedó OK; C8 (las flechas desplazan la tabla a 320 px) no se ejecutó, así que la 3.4b queda **verificada parcialmente**.

**Cobertura por tarea** (decisión de Amanda del 14/10/2026: ejecución reducida; ningún fallo observado). Las tareas se marcaron como completas con cobertura parcial; lo no ejecutado **no** se da por aprobado:

- **1.15** (Checklist A): no ejecutados A2 (Network) y A16 (movimiento reducido).
- **2.8** (Checklist B): no ejecutados A3, A10, A11 (cubierto en C-01), C1, C3, C5, D2 y D3.
- **3.4b** (regiones de tabla): no ejecutado C8 (flechas).
- **3.5** (320/1280 px, ambos temas): no ejecutados A2 (Network) y B5 (1280 px en tema claro).
- **3.6** (teclado): no ejecutados A7 (título/efecto), C3 (cerrar el menú con botón y velo) y C8.
- **3.7** (preferencias y movimiento): solo se ejecutó B2; no ejecutados B3 (claves de `localStorage`) y A16 (movimiento reducido).

## Qué es maqueta y qué funciona

La Etapa 1 entrega la maqueta navegable. Esta tabla dice, por vista, qué es solo maqueta (HTML sin datos reales), qué ya funciona y qué `id` del contrato conecta la Etapa 2.

| Vista | Qué es maqueta | Qué ya funciona | Ganchos para la Etapa 2 |
|---|---|---|---|
| Global | Los formularios de Libros, Clientes y Ventas solo evitan recargar la página (`prevenirEnvioMaqueta`); no validan ni guardan | Navegación por hash entre las 5 vistas, foco al `h2`, `aria-current`; tema claro/oscuro recordado; sidebar colapsable y menú móvil; formularios que no recargan | `nav-principal`, `contenido`, `tema-alternar`, `sidebar`, `sidebar-colapsar`, `menu-abrir`, `menu-cerrar`, `sidebar-velo` |
| Catálogo | Las 6 tarjetas están escritas a mano en el HTML (no salen de un array); `catalogo-vacio` nunca se muestra | Filtro por título en vivo (`coincideTitulo`, ver "Filtro por título") | `form-busqueda`, `catalogo-busqueda`, `catalogo-resultados`, `catalogo-lista`, `catalogo-sin-resultados`, `catalogo-vacio` |
| Libros | Formulario sin validación ni guardado; la tabla del listado está vacía | Etiquetas asociadas a cada campo; el envío no recarga | `form-libro`, `libro-titulo`, `libro-isbn`, `libro-precio`, `libro-editorial`, `libro-genero`, `libro-autores`, `libro-errores`, `libro-mensaje`, `libros-tabla`, `libros-vacio` |
| Clientes | Formulario sin validación ni guardado; la tabla está vacía | Etiquetas asociadas; el envío no recarga | `form-cliente`, `cliente-nombre`, `cliente-email`, `cliente-errores`, `cliente-mensaje`, `clientes-tabla`, `clientes-vacio` |
| Ventas | Sin renglones, total ni confirmación reales | Etiquetas asociadas; el envío no recarga | `form-venta`, `venta-cliente`, `venta-libro`, `venta-cantidad`, `venta-agregar`, `venta-renglones`, `venta-renglones-vacio`, `venta-total`, `venta-confirmar`, `venta-errores`, `venta-mensaje` |
| Historial | Tabla y detalle vacíos | Solo la navegación a la vista | `historial-tabla`, `historial-vacio`, `historial-detalle` |

Los avisos `aviso-maqueta-*` que quedan en Libros, Clientes, Ventas e Historial rotulan los controles que todavía no funcionan (el del Catálogo se quitó porque el buscador ya funciona).

## Decisiones de la Etapa 1

Detalle en `knowledge-base/09_decisiones_y_supuestos.md`.

- **DD-01 — Una sola página con secciones:** `index.html` único con 5 vistas (`<section class="vista">`) que se alternan con `hidden`.
- **DD-12 y DD-14 — Tema oscuro, alternativa clara y tapas con CSS:** identidad visual propia (galaxia en CSS puro), con tema claro opcional recordado en `localStorage`; sin imágenes de portadas, cada tapa es un degradé CSS con título y autor como texto. La única foto es el banner decorativo del Catálogo (`assets/img/banner-biblioteca.jpg`, aplicada por CSS, con procedencia a completar en «Recursos y procedencia»).
- **DD-08 — Contrato `id`/`name`:** la tabla de este README y la de `knowledge-base/08` se mantienen idénticas; cambiar un `id` o `name` exige actualizar ambas.
- **DD-09, DD-10 y DD-11 — Formatos:** id de venta correlativo `V-0001`; importes guardados como `number` y formateados al mostrar con `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })`; fechas en ISO 8601 mostradas como `dd/mm/aaaa hh:mm`. (Se aplican desde la Etapa 2.)
- **DD-07 — Filtro con regla pura reutilizable:** `coincideTitulo(titulo, busqueda)` no toca el DOM, así la Etapa 2 la llama tal cual sobre el array de libros.

## Filtro por título

El campo "Buscar por título" del Catálogo filtra las tarjetas mientras se escribe.

- **Regla:** `coincideTitulo(titulo, busqueda)` (función global de `js/app.js`, pura, sin DOM). Devuelve `true` si el título contiene la búsqueda sin distinguir mayúsculas ni espacios al principio o al final de la búsqueda. Búsqueda vacía o solo espacios devuelve `true` (se ven todos). Tolera `null` y `undefined`.
- **Eventos:** `input` y `change` sobre `#catalogo-busqueda`, y `submit` sobre `#form-busqueda` (Enter o clic en "Buscar"; `preventDefault()` y vuelve a filtrar, la página no se recarga). `registrarFormulariosMaqueta()` omite `#form-busqueda`, que ya no usa el handler de maqueta.
- **Ocultar tarjetas:** `filtrarCatalogo()` asigna `hidden` a cada `.tarjeta` de `#catalogo-lista` según el texto de su `.tarjeta__titulo` (`textContent`).
- **Mensajes:** `#catalogo-sin-resultados` se muestra solo si hay tarjetas y ninguna coincide. `#catalogo-vacio` no lo toca el filtro (lo gobernará C-04 cuando el catálogo salga del array).
- **Zona de estado para lectores de pantalla:** `#catalogo-resultados` (`role="status"`, `aria-live="polite"`, clase `solo-lectores`, vacía al cargar). `textoResultadosCatalogo(visibles, total, busquedaVacia)` arma el texto: "Se muestran los 6 libros." (búsqueda vacía), "Se muestra 1 de 6 libros.", "Se muestran 4 de 6 libros." o "No se encontraron libros que coincidan con la búsqueda.". El texto no incluye lo que escribió el usuario y se escribe con `textContent`.
- **Limitación conocida (acentos):** no se normalizan; "orbita" no encuentra "Órbita lenta". La regla (RN-CA-04) no lo pide.
- **Degradación sin JavaScript:** se ven las 6 tarjetas y ningún mensaje; enviar el buscador recarga `index.html?busqueda=...` con el catálogo completo, sin errores.
- **Para C-04:** reemplazar el cuerpo de `filtrarCatalogo()` por un re-render desde `libros.filter(l => coincideTitulo(l.titulo, busqueda))`, conservando `coincideTitulo`, `textoResultadosCatalogo`, los listeners y `#catalogo-resultados`.

## Casos manuales de la Etapa 1

Registro para completar **a mano**, en el navegador (sin tests automáticos). Se anota el comportamiento real observado, aunque falle (RN-GL-03). Solo figuran como "OK" los pasos que Amanda ejecutó; lo que dice "No ejecutado" no está aprobado.

- **Fecha:** 14/10/2026
- **Navegador (nombre y versión):** Microsoft Edge 155.0.4283.45 (Chromium 155) en Windows 11
- **Apertura:** `file://` (doble clic en `index.html`)

### Caso manual 1 — Filtro por título

| # | Paso | Resultado esperado | Resultado observado | Estado |
|---|---|---|---|---|
| 1 | Abrir `index.html` con doble clic (vista Catálogo) | Se ven las 6 tarjetas; ningún mensaje | Se ven las 6 tarjetas y ningún mensaje | OK |
| 2 | Escribir `MAPA` en "Buscar por título" | Solo "El mapa invisible" | Se ve solo «El mapa invisible» | OK |
| 3 | Reemplazar por `DE` | 4 tarjetas: "La casa del faro", "Estrellas de papel", "Cartas desde el sur", "Manual de jardinería urbana" | Se ven las 4 tarjetas esperadas: «La casa del faro», «Estrellas de papel», «Cartas desde el sur» y «Manual de jardinería urbana» | OK |
| 4 | Reemplazar por `  faro  ` (con espacios) | Solo "La casa del faro", igual que sin espacios | Se ve solo «La casa del faro», igual que sin espacios | OK |
| 5 | Borrar todo el texto | Vuelven las 6 tarjetas; sin mensaje | Vuelven las 6 tarjetas, sin mensaje | OK |
| 6 | Escribir `xyz` | Ninguna tarjeta; mensaje "No se encontraron libros que coincidan con la búsqueda." | Ninguna tarjeta; aparece «No se encontraron libros que coincidan con la búsqueda.» | OK |
| 7 | Con `xyz` escrito, presionar Enter y luego clic en "Buscar" | No recarga, la URL no cambia, el texto se conserva | No recarga, la URL no cambia y el texto se conserva | OK |
| 8 | Con el lector de pantalla del sistema (Narrador/NVDA) o el panel de Accesibilidad de DevTools, repetir 2 y 6 | Se anuncia/lee "Se muestra 1 de 6 libros." y "No se encontraron libros…" en `#catalogo-resultados` | No ejecutado (resultado no informado por la usuaria) | No ejecutado |

### Caso manual 8 — Teclado y anchos 320 / 1280 px

Resultado **parcial**: lo que figura como OK se ejecutó en la verificación de C-02 (ver "Verificación manual — C-02", mismo día y navegador); el resto no se ejecutó.

| Caso | Qué se verifica | Cubierto por (C-02) | Resultado observado | Estado |
|---|---|---|---|---|
| 8a | Recorrido solo con teclado (skip-link, Tab/Shift+Tab, Enter en los enlaces, Enter en formularios, regiones de tabla, colapsar, tooltip) a 1280 px | A4, A5, A6, A8, A9, A12, A13, B4 | Todo operable con teclado, orden lógico y foco siempre visible | OK |
| 8b | Teclado a 320 px: hamburguesa y enlace del menú | C2, C4 | Enter abre el menú y Escape lo cierra devolviendo el foco; un enlace navega, cierra el menú y lleva el foco al `h2` | OK |
| 8c | 1280 px, tema oscuro, sin scroll horizontal en las 5 vistas | A14 | `scrollWidth <= innerWidth` da `true` en las 5 vistas | OK |
| 8d | 320 px, tema claro y oscuro, sin scroll horizontal en las 5 vistas | C6 | `scrollWidth <= innerWidth` da `true` en las 5 vistas, en claro y en oscuro | OK |
| 8e | 320 px: las tablas se desplazan dentro de su contenedor | C7 | Las tablas se desplazan dentro de su contenedor | OK |
| 8f | 1280 px, tema claro, sin scroll horizontal en las 5 vistas | B5 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) | No ejecutado |
| 8g | 320 px: las flechas del teclado desplazan la tabla enfocada | C8 | No ejecutado: no priorizado por tiempo (cierre de Etapa 1) | No ejecutado |
