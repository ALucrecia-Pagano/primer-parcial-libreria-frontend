// Editorial Codex - navegación entre vistas (C-01), preferencias de presentación y sidebar (C-02), filtro del catálogo (C-03).
// Script clásico (se carga con defer). Sin librerías ni módulos.

// Mejora progresiva (D3): el CSS usa html.js para mostrar los controles que necesitan JS.
document.documentElement.classList.add('js');

// ---------------------------------------------------------------------------
// Preferencias en localStorage (D7). Todo acceso va en try/catch: si el
// almacenamiento falla, está bloqueado o tiene un valor inválido, se usa el
// valor por defecto y la página sigue funcionando.
// ---------------------------------------------------------------------------
const PREFIJO_PREFERENCIAS = 'libreria.preferencias.';
const TEMAS_VALIDOS = ['claro', 'oscuro'];
const ESTADOS_SIDEBAR_VALIDOS = ['colapsada', 'expandida'];

function leerPreferencia(clave, valorPorDefecto) {
  try {
    const valor = window.localStorage.getItem(PREFIJO_PREFERENCIAS + clave);
    return valor === null ? valorPorDefecto : valor;
  } catch (error) {
    return valorPorDefecto;
  }
}

function guardarPreferencia(clave, valor) {
  try {
    window.localStorage.setItem(PREFIJO_PREFERENCIAS + clave, valor);
    return true;
  } catch (error) {
    return false;
  }
}

// Orden de decisión (D4): preferencia guardada válida -> prefers-color-scheme -> oscuro.
function obtenerTemaInicial() {
  const guardado = leerPreferencia('tema', null);
  if (TEMAS_VALIDOS.includes(guardado)) {
    return guardado;
  }
  try {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'claro';
    }
  } catch (error) {
    // Sin matchMedia: se usa el tema oscuro.
  }
  return 'oscuro';
}

// Aplica el tema en <html> y sincroniza el botón (aria-pressed y nombre accesible).
function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
  const boton = document.getElementById('tema-alternar');
  if (boton) {
    const esClaro = tema === 'claro';
    boton.setAttribute('aria-pressed', String(esClaro));
    boton.setAttribute('aria-label', esClaro ? 'Activar tema oscuro' : 'Activar tema claro');
  }
}

function alternarTema() {
  const nuevo = document.documentElement.getAttribute('data-tema') === 'claro' ? 'oscuro' : 'claro';
  aplicarTema(nuevo);
  guardarPreferencia('tema', nuevo);
}

function iniciarTema() {
  aplicarTema(obtenerTemaInicial());
  const boton = document.getElementById('tema-alternar');
  if (boton) {
    boton.addEventListener('click', alternarTema);
  }
}

const VISTA_POR_DEFECTO = 'catalogo';

const VISTAS = ['catalogo', 'libros', 'clientes', 'ventas', 'historial'];

let vistaActual = null;

// Devuelve el id de la vista que corresponde al hash, o null si no hay ninguna.
function obtenerVistaDesdeHash(hash) {
  let id = String(hash || '').replace(/^#/, '');
  if (id === '') {
    return null;
  }
  try {
    id = decodeURIComponent(id);
  } catch (error) {
    return null;
  }
  if (VISTAS.includes(id)) {
    return id;
  }
  const elemento = document.getElementById(id);
  if (!elemento) {
    return null;
  }
  const vista = elemento.closest('.vista');
  return vista ? vista.id : null;
}

// Muestra solo la vista indicada y marca su enlace como página actual.
function mostrarVista(id, opciones) {
  const moverFoco = Boolean(opciones && opciones.moverFoco);

  document.querySelectorAll('.vista').forEach(function (seccion) {
    seccion.hidden = seccion.id !== id;
  });

  document.querySelectorAll('.navegacion__enlace').forEach(function (enlace) {
    if (enlace.getAttribute('href') === '#' + id) {
      enlace.setAttribute('aria-current', 'page');
    } else {
      enlace.removeAttribute('aria-current');
    }
  });

  vistaActual = id;

  // Render inicial de listados desde los arrays (C-04).
  if (id === 'catalogo') {
    renderCatalogo(libros);
  }
  if (id === 'libros') {
    renderLibros();
  }
  if (id === 'clientes') {
    renderClientes();
  }

  if (moverFoco) {
    const titulo = document.querySelector('#' + id + ' .vista__titulo');
    if (titulo) {
      titulo.focus();
    }
  }
}

function alCambiarHash() {
  const hashVacio = location.hash === '' || location.hash === '#';
  const id = hashVacio ? VISTA_POR_DEFECTO : obtenerVistaDesdeHash(location.hash);
  if (id === null || id === vistaActual) {
    return;
  }
  mostrarVista(id, { moverFoco: true });
}

function iniciarNavegacion() {
  const id = obtenerVistaDesdeHash(location.hash) || VISTA_POR_DEFECTO;
  mostrarVista(id, { moverFoco: false });
  window.addEventListener('hashchange', alCambiarHash);
}

// ---------------------------------------------------------------------------
// Sidebar (D8): colapsar en escritorio (>= 1024 px) y menú hamburguesa en celular.
// ---------------------------------------------------------------------------
const CONSULTA_ESCRITORIO = '(min-width: 1024px)';

function obtenerElementosSidebar() {
  return {
    aplicacion: document.querySelector('.aplicacion'),
    sidebar: document.getElementById('sidebar'),
    botonColapsar: document.getElementById('sidebar-colapsar'),
    botonAbrir: document.getElementById('menu-abrir'),
    botonCerrar: document.getElementById('menu-cerrar'),
    velo: document.getElementById('sidebar-velo')
  };
}

function aplicarEstadoSidebar(colapsada) {
  const el = obtenerElementosSidebar();
  if (!el.aplicacion) {
    return;
  }
  el.aplicacion.classList.toggle('aplicacion--sidebar-colapsada', colapsada);
  if (el.botonColapsar) {
    el.botonColapsar.setAttribute('aria-expanded', String(!colapsada));
    el.botonColapsar.setAttribute('aria-label', colapsada ? 'Expandir menú' : 'Colapsar menú');
  }
}

function alternarSidebarColapsada() {
  const colapsar = !document.querySelector('.aplicacion').classList.contains('aplicacion--sidebar-colapsada');
  aplicarEstadoSidebar(colapsar);
  guardarPreferencia('sidebar', colapsar ? 'colapsada' : 'expandida');
}

function menuMovilAbierto() {
  const aplicacion = document.querySelector('.aplicacion');
  return Boolean(aplicacion && aplicacion.classList.contains('aplicacion--menu-abierto'));
}

function abrirMenuMovil() {
  const el = obtenerElementosSidebar();
  el.aplicacion.classList.add('aplicacion--menu-abierto');
  el.botonAbrir.setAttribute('aria-expanded', 'true');
  const primerEnlace = el.sidebar.querySelector('.navegacion__enlace');
  if (primerEnlace) {
    primerEnlace.focus();
  }
}

// devolverFoco: true al cerrar con botón, Escape o velo (el foco vuelve a la hamburguesa).
function cerrarMenuMovil(devolverFoco) {
  const el = obtenerElementosSidebar();
  if (!menuMovilAbierto()) {
    return;
  }
  el.aplicacion.classList.remove('aplicacion--menu-abierto');
  el.botonAbrir.setAttribute('aria-expanded', 'false');
  if (devolverFoco) {
    el.botonAbrir.focus();
  }
}

function iniciarSidebar() {
  const el = obtenerElementosSidebar();
  if (!el.aplicacion || !el.sidebar) {
    return;
  }

  // Estado de escritorio recordado (lista blanca; cualquier otro valor = expandida).
  const guardado = leerPreferencia('sidebar', 'expandida');
  aplicarEstadoSidebar(ESTADOS_SIDEBAR_VALIDOS.includes(guardado) && guardado === 'colapsada');

  if (el.botonColapsar) {
    el.botonColapsar.addEventListener('click', alternarSidebarColapsada);
  }
  if (el.botonAbrir) {
    el.botonAbrir.addEventListener('click', abrirMenuMovil);
  }
  if (el.botonCerrar) {
    el.botonCerrar.addEventListener('click', function () {
      cerrarMenuMovil(true);
    });
  }
  if (el.velo) {
    el.velo.addEventListener('click', function () {
      cerrarMenuMovil(true);
    });
  }

  // Activar un enlace del menú lo cierra; el foco lo mueve la navegación al h2 de la vista.
  // (La marca de la sidebar es solo texto: no navega ni cierra el menú.)
  el.sidebar.querySelectorAll('.navegacion__enlace').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
      if (!menuMovilAbierto()) {
        return;
      }
      cerrarMenuMovil(false);
      // Mismo destino: no habrá hashchange, así que el foco va al título de la vista actual.
      if (enlace.getAttribute('href') === '#' + vistaActual) {
        const titulo = document.querySelector('#' + vistaActual + ' .vista__titulo');
        if (titulo) {
          titulo.focus();
        }
      }
    });
  });

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && menuMovilAbierto()) {
      cerrarMenuMovil(true);
    }
  });

  // Al pasar a escritorio el menú móvil se cierra, sin velo ni estados rotos.
  const consulta = window.matchMedia(CONSULTA_ESCRITORIO);
  const alCambiarAncho = function (evento) {
    if (evento.matches) {
      cerrarMenuMovil(false);
    }
  };
  if (consulta.addEventListener) {
    consulta.addEventListener('change', alCambiarAncho);
  } else if (consulta.addListener) {
    consulta.addListener(alCambiarAncho);
  }
}

// Handler de maqueta: evita que los formularios recarguen la página (D6).
function prevenirEnvioMaqueta(evento) {
  evento.preventDefault();
}

function registrarFormulariosMaqueta() {
  document.querySelectorAll('form').forEach(function (formulario) {
    // El buscador del catálogo ya no es maqueta: tiene su propio handler (C-03).
    if (formulario.id === 'form-busqueda') {
      return;
    }
    formulario.addEventListener('submit', prevenirEnvioMaqueta);
  });
}

// ---------------------------------------------------------------------------
// Filtro del catálogo (C-03). La regla es pura (sin DOM) para que la Etapa 2
// la reutilice tal cual sobre el array de libros (DD-07).
// ---------------------------------------------------------------------------

// Texto comparable: en minúsculas y sin tildes ni otros diacríticos (NFD separa la
// letra de su marca y el rango U+0300–U+036F quita las marcas). Pura; tolera null/undefined.
// Efecto aceptado: la ñ queda como n ("nino" encuentra "niño").
function normalizarTexto(texto) {
  return String(texto == null ? '' : texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

// Coincidencia por título: sin distinguir mayúsculas, tildes ni espacios en los bordes
// de la búsqueda ("orbita" encuentra "Órbita lenta"). Búsqueda vacía o solo espacios -> true.
// Tolera null/undefined.
function coincideTitulo(titulo, busqueda) {
  const texto = normalizarTexto(String(busqueda == null ? '' : busqueda).trim());
  if (texto === '') {
    return true;
  }
  return normalizarTexto(titulo).includes(texto);
}

// Texto que anuncia la zona de estado #catalogo-resultados (pura, sin DOM).
function textoResultadosCatalogo(visibles, total, busquedaVacia) {
  if (busquedaVacia) {
    return 'Se muestran los ' + total + ' libros.';
  }
  if (visibles === 0) {
    return 'No se encontraron libros que coincidan con la búsqueda.';
  }
  if (visibles === 1) {
    return 'Se muestra 1 de ' + total + ' libros.';
  }
  return 'Se muestran ' + visibles + ' de ' + total + ' libros.';
}

// ---------------------------------------------------------------------------
// Helpers de datos (C-04): resuelven nombres de editorial, género y autores
// a partir de los ids estables del array.
// ---------------------------------------------------------------------------
function obtenerNombreEditorial(id) {
  const editorial = editoriales.find(function (e) {
    return e.id === id;
  });
  return editorial ? editorial.nombre : '';
}

function obtenerNombreGenero(id) {
  const genero = generos.find(function (g) {
    return g.id === id;
  });
  return genero ? genero.nombre : '';
}

function obtenerNombresAutores(ids) {
  return ids.map(function (id) {
    const autor = autores.find(function (a) {
      return a.id === id;
    });
    return autor ? autor.nombre : '';
  }).join(', ');
}

// Renderiza el catálogo desde un array de libros (C-04).
// Usa createElement para la estructura y textContent para todo el texto (RN-GL-01).
function renderCatalogo(librosAMostrar) {
  const lista = document.getElementById('catalogo-lista');
  if (!lista) {
    return;
  }
  // Vaciar contenedor nodo a nodo (sin innerHTML).
  while (lista.firstChild) {
    lista.removeChild(lista.firstChild);
  }

  librosAMostrar.forEach(function (libro, index) {
    const articulo = document.createElement('article');
    articulo.className = 'tarjeta';

    // Tapa (CSS generada, sin imágenes).
    const tapa = document.createElement('div');
    tapa.className = 'tarjeta__tapa tapa tapa--degrade-' + ((index % 6) + 1);
    tapa.setAttribute('aria-hidden', 'true');
    const tapaTitulo = document.createElement('span');
    tapaTitulo.className = 'tarjeta__tapa-titulo';
    tapaTitulo.textContent = libro.titulo;
    const tapaAutor = document.createElement('span');
    tapaAutor.className = 'tarjeta__tapa-autor';
    tapaAutor.textContent = obtenerNombresAutores(libro.autorIds);
    tapa.appendChild(tapaTitulo);
    tapa.appendChild(tapaAutor);
    articulo.appendChild(tapa);

    // Título.
    const tituloEl = document.createElement('h3');
    tituloEl.className = 'tarjeta__titulo';
    tituloEl.textContent = libro.titulo;
    articulo.appendChild(tituloEl);

    // Datos.
    const dl = document.createElement('dl');
    dl.className = 'tarjeta__datos';

    function agregarDato(etiqueta, valor) {
      const dt = document.createElement('dt');
      dt.textContent = etiqueta;
      const dd = document.createElement('dd');
      dd.textContent = valor;
      dl.appendChild(dt);
      dl.appendChild(dd);
    }

    agregarDato('ISBN', libro.isbn);
    agregarDato('Editorial', obtenerNombreEditorial(libro.editorialId));
    agregarDato('Género', libro.generoId ? obtenerNombreGenero(libro.generoId) : 'Sin clasificar');
    agregarDato('Autores', obtenerNombresAutores(libro.autorIds));
    articulo.appendChild(dl);

    // Precio formateado en ARS.
    const precio = document.createElement('p');
    precio.className = 'tarjeta__precio';
    precio.textContent = formatearImporteARS(libro.precio);
    articulo.appendChild(precio);

    lista.appendChild(articulo);
  });
}

// Renderiza el listado de Libros desde el array libros (C-04).
function renderLibros() {
  const tabla = document.getElementById('libros-tabla');
  if (!tabla) {
    return;
  }
  while (tabla.firstChild) {
    tabla.removeChild(tabla.firstChild);
  }

  libros.forEach(function (libro) {
    const fila = document.createElement('tr');

    function agregarCelda(texto) {
      const celda = document.createElement('td');
      celda.textContent = texto;
      fila.appendChild(celda);
    }

    agregarCelda(libro.titulo);
    agregarCelda(libro.isbn);
    agregarCelda(obtenerNombreEditorial(libro.editorialId));
    agregarCelda(libro.generoId ? obtenerNombreGenero(libro.generoId) : 'Sin clasificar');
    agregarCelda(obtenerNombresAutores(libro.autorIds));
    agregarCelda(formatearImporteARS(libro.precio));

    tabla.appendChild(fila);
  });
}

// Renderiza el listado de Clientes desde el array clientes (C-04).
function renderClientes() {
  const tabla = document.getElementById('clientes-tabla');
  if (!tabla) {
    return;
  }
  while (tabla.firstChild) {
    tabla.removeChild(tabla.firstChild);
  }

  clientes.forEach(function (cliente) {
    const fila = document.createElement('tr');

    const celdaNombre = document.createElement('td');
    celdaNombre.textContent = cliente.nombreCompleto;
    const celdaEmail = document.createElement('td');
    celdaEmail.textContent = cliente.email;
    fila.appendChild(celdaNombre);
    fila.appendChild(celdaEmail);

    tabla.appendChild(fila);
  });
}

// Parte DOM: re-renderiza el catálogo desde el array libros aplicando
// coincideTitulo sobre cada entrada. Crea o quita tarjetas dinámicamente.
function filtrarCatalogo() {
  const campo = document.getElementById('catalogo-busqueda');
  const lista = document.getElementById('catalogo-lista');
  const sinResultados = document.getElementById('catalogo-sin-resultados');
  const zonaEstado = document.getElementById('catalogo-resultados');
  if (!campo || !lista) {
    return;
  }
  const busqueda = campo.value;
  const librosFiltrados = libros.filter(function (libro) {
    return coincideTitulo(libro.titulo, busqueda);
  });
  renderCatalogo(librosFiltrados);

  const visibles = librosFiltrados.length;
  const total = libros.length;
  if (sinResultados) {
    sinResultados.hidden = !(total > 0 && visibles === 0);
  }

  if (zonaEstado) {
    const busquedaVacia = String(busqueda).trim() === '';
    zonaEstado.textContent = textoResultadosCatalogo(visibles, total, busquedaVacia);
  }
}

// Enter o clic en "Buscar": no recarga la página y vuelve a filtrar.
function alEnviarBusqueda(evento) {
  evento.preventDefault();
  filtrarCatalogo();
}

function iniciarFiltroCatalogo() {
  const formulario = document.getElementById('form-busqueda');
  const campo = document.getElementById('catalogo-busqueda');
  if (!formulario || !campo) {
    return;
  }
  campo.addEventListener('input', filtrarCatalogo);
  campo.addEventListener('change', filtrarCatalogo);
  formulario.addEventListener('submit', alEnviarBusqueda);
}

// ---------------------------------------------------------------------------
// Persistencia de datos de dominio (C-05): al arrancar, verifica si cada clave
// de dominio existe en localStorage. Si falta, carga el seed y lo guarda; si
// existe, usa lo guardado sin mezclar con seed.
// ---------------------------------------------------------------------------
function iniciarPersistencia() {
  const errorPersistencia = document.getElementById('error-persistencia');

  // Libros: usar seed si no hay nada guardado.
  const librosGuardados = cargar('libreria.libros');
  if (librosGuardados === null) {
    // JSON corrupto: usar seed y mostrar error.
    errorPersistencia.hidden = false;
    guardar('libreria.libros', libros);
  } else if (librosGuardados !== undefined && Array.isArray(librosGuardados)) {
    libros = librosGuardados;
  } else {
    guardar('libreria.libros', libros);
  }

  // Clientes: usar seed si no hay nada guardado.
  const clientesGuardados = cargar('libreria.clientes');
  if (clientesGuardados === null) {
    errorPersistencia.hidden = false;
    guardar('libreria.clientes', clientes);
  } else if (clientesGuardados !== undefined && Array.isArray(clientesGuardados)) {
    clientes = clientesGuardados;
  } else {
    guardar('libreria.clientes', clientes);
  }

  // Ventas: iniciar vacío si no hay nada guardado.
  const ventasGuardadas = cargar('libreria.ventas');
  if (ventasGuardadas === null) {
    errorPersistencia.hidden = false;
    guardar('libreria.ventas', ventas);
  } else if (ventasGuardadas !== undefined && Array.isArray(ventasGuardadas)) {
    ventas = ventasGuardadas;
  } else {
    guardar('libreria.ventas', ventas);
  }
}

iniciarPersistencia();
iniciarNavegacion();
registrarFormulariosMaqueta();
iniciarTema();
iniciarSidebar();
iniciarFiltroCatalogo();
// ==========================================
// C-06: ALTA DE LIBROS (Fase 5) - por Lucas
// ==========================================

function poblarFormularioLibro() {
  const selectEditorial = document.getElementById('libro-editorial');
  const selectGenero = document.getElementById('libro-genero');
  const fieldsetAutores = document.getElementById('libro-autores');

  // 1. Cargar Editoriales
  if (selectEditorial && typeof editoriales !== 'undefined') {
    selectEditorial.innerHTML = '<option value="">Seleccione una editorial...</option>';
    editoriales.forEach(ed => {
      const opt = document.createElement('option');
      opt.value = ed.id;
      opt.textContent = ed.nombre;
      selectEditorial.appendChild(opt);
    });
  }

  // 2. Cargar Géneros
  if (selectGenero && typeof generos !== 'undefined') {
    selectGenero.innerHTML = '<option value="">Sin clasificar</option>';
    generos.forEach(gen => {
      const opt = document.createElement('option');
      opt.value = gen.id;
      opt.textContent = gen.nombre;
      selectGenero.appendChild(opt);
    });
  }

  // 3. Cargar Autores (Checkboxes)
  if (fieldsetAutores && typeof autores !== 'undefined') {
    fieldsetAutores.innerHTML = '<legend>Autores (*)</legend>';
    autores.forEach(aut => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'autorIds';
      input.value = aut.id;
      
      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${aut.nombre}`));
      fieldsetAutores.appendChild(label);
    });
  }
}
// Función auxiliar para sacarle espacios y guiones al ISBN
function normalizarIsbn(isbn) {
  return String(isbn || '').replace(/[\s-]/g, '').toLowerCase();
}

// Función pura de validación
function validarLibro(datos, listaLibros, listaEditoriales, listaGeneros, listaAutores) {
  const errores = [];

  // 1. Título obligatorio
  if (!datos.titulo || datos.titulo.trim() === '') {
    errores.push('El título es obligatorio.');
  }

  // 2. ISBN obligatorio y único
  const isbnLimpio = normalizarIsbn(datos.isbn);
  if (!isbnLimpio) {
    errores.push('El ISBN es obligatorio.');
  } else {
    const isbnExiste = listaLibros.some(l => normalizarIsbn(l.isbn) === isbnLimpio);
    if (isbnExiste) {
      errores.push('El ISBN ya se encuentra registrado.');
    }
  }

  // 3. Precio numérico mayor a cero
  const precioNum = Number(datos.precio);
  if (isNaN(precioNum) || precioNum <= 0) {
    errores.push('El precio debe ser un número mayor a cero.');
  }

  // 4. Editorial existente
  if (!datos.editorialId || !listaEditoriales.some(e => e.id === datos.editorialId)) {
    errores.push('Debe seleccionar una editorial válida.');
  }

  // 5. Al menos 1 autor
  if (!Array.isArray(datos.autorIds) || datos.autorIds.length === 0) {
    errores.push('Debe seleccionar al menos un autor.');
  }

  // 6. Género opcional (pero si mandan uno, debe existir)
  if (datos.generoId && !listaGeneros.some(g => g.id === datos.generoId)) {
    errores.push('El género seleccionado no es válido.');
  }

  return errores;
}
// Función para manejar el envío del formulario de libros
function registrarHandlerAltaLibro() {
  const form = document.getElementById('form-libro');
  if (!form) return;

  // Removemos el handler genérico de la maqueta si es que estaba
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const divErrores = document.getElementById('libro-errores');
    const divMensaje = document.getElementById('libro-mensaje');

    // Ocultar y limpiar mensajes previos
    if (divErrores) {
      divErrores.hidden = true;
      divErrores.innerHTML = '';
    }
    if (divMensaje) {
      divMensaje.hidden = true;
      divMensaje.textContent = '';
    }

    // 1. Recolectar datos del formulario
    const titulo = document.getElementById('libro-titulo').value;
    const isbn = document.getElementById('libro-isbn').value;
    const precio = document.getElementById('libro-precio').value;
    const editorialId = document.getElementById('libro-editorial').value;
    const generoId = document.getElementById('libro-genero').value || null;

    const autorCheckboxes = form.querySelectorAll('input[name="autorIds"]:checked');
    const autorIds = Array.from(autorCheckboxes).map(cb => cb.value);

    const datosForm = { titulo, isbn, precio, editorialId, generoId, autorIds };

    // 2. Validar
    const errores = validarLibro(datosForm, libros, editoriales, generos, autores);

    if (errores.length > 0) {
      // Mostrar errores
      const ul = document.createElement('ul');
      errores.forEach(err => {
        const li = document.createElement('li');
        li.textContent = err;
        ul.appendChild(li);
      });
      divErrores.appendChild(ul);
      divErrores.hidden = false;
      return; // Cortamos acá, no se guarda nada
    }

    // 3. Crear el libro nuevo
    const nuevoLibro = {
      id: 'lib-' + Date.now(), // Generamos un ID simple
      titulo: titulo.trim(),
      isbn: isbn.trim(),
      precio: Number(precio),
      editorialId: editorialId,
      generoId: generoId,
      autorIds: autorIds
    };

    // 4. Guardar en el array y en localStorage (asumiendo que Mateo hizo la función guardar en C-05)
    libros.push(nuevoLibro);
    if (typeof guardar === 'function') {
      guardar('libreria.libros', libros);
    } else {
      localStorage.setItem('libreria.libros', JSON.stringify(libros));
    }

    // 5. Mostrar éxito y resetear formulario
    if (divMensaje) {
      divMensaje.textContent = 'Libro registrado con éxito.';
      divMensaje.hidden = false;
    }
    form.reset();

    // 6. Refrescar las vistas si las funciones de Mateo de C-04 ya existen
    if (typeof renderTablaLibros === 'function') renderTablaLibros();
    if (typeof renderCatalogo === 'function') renderCatalogo();
  });
}

// ==========================================
// INICIALIZADOR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  poblarFormularioLibro();
  registrarHandlerAltaLibro();
  registrarHandlerAltaCliente();
  poblarSelectoresVenta();
  registrarHandlerAgregarDetalle();
  renderTablaDetalleVenta();
  registrarHandlerConfirmarVenta();
  renderHistorialVentas();
});
// ==========================================
// C-07: ALTA DE CLIENTES (Fase 5) - por Lucas
// ==========================================

// Función pura de validación de clientes
function validarCliente(datos, listaClientes) {
  const errores = [];

  // 1. Nombre obligatorio
  if (!datos.nombreCompleto || datos.nombreCompleto.trim() === '') {
    errores.push('El nombre completo es obligatorio.');
  }

  // 2. Email obligatorio, con formato válido y único
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailLimpio = String(datos.email || '').trim().toLowerCase();

  if (!emailLimpio) {
    errores.push('El email es obligatorio.');
  } else if (!emailRegex.test(emailLimpio)) {
    errores.push('El formato del email no es válido.');
  } else {
    // Validar que no exista
    const emailExiste = listaClientes.some(c => c.email.trim().toLowerCase() === emailLimpio);
    if (emailExiste) {
      errores.push('El email ya se encuentra registrado.');
    }
  }

  return errores;
}
// Función para manejar el envío del formulario de clientes
function registrarHandlerAltaCliente() {
  const form = document.getElementById('form-cliente');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const divErrores = document.getElementById('cliente-errores');
    const divMensaje = document.getElementById('cliente-mensaje');

    // Limpiar mensajes previos
    if (divErrores) {
      divErrores.hidden = true;
      divErrores.innerHTML = '';
    }
    if (divMensaje) {
      divMensaje.hidden = true;
      divMensaje.textContent = '';
    }

    // 1. Recolectar datos
    const nombreCompleto = document.getElementById('cliente-nombre').value;
    const email = document.getElementById('cliente-email').value;

    const datosForm = { nombreCompleto, email };

    // 2. Validar
    const errores = validarCliente(datosForm, clientes);

    if (errores.length > 0) {
      // Mostrar errores
      const ul = document.createElement('ul');
      errores.forEach(err => {
        const li = document.createElement('li');
        li.textContent = err;
        ul.appendChild(li);
      });
      divErrores.appendChild(ul);
      divErrores.hidden = false;
      return;
    }

    // 3. Crear cliente nuevo
    const nuevoCliente = {
      id: 'cli-' + Date.now(),
      nombreCompleto: nombreCompleto.trim(),
      email: email.trim().toLowerCase()
    };

    // 4. Guardar
    clientes.push(nuevoCliente);
    if (typeof guardar === 'function') {
      guardar('libreria.clientes', clientes);
    } else {
      localStorage.setItem('libreria.clientes', JSON.stringify(clientes));
    }

    // 5. Notificar éxito y limpiar
    if (divMensaje) {
      divMensaje.textContent = 'Cliente registrado con éxito.';
      divMensaje.hidden = false;
    }
    form.reset();

    // 6. Refrescar tablas
    if (typeof renderTablaClientes === 'function') renderTablaClientes();
    if (typeof poblarSelectoresVenta === 'function') poblarSelectoresVenta();
  });
}
// ==========================================
// C-08: COMPOSICIÓN DE VENTA - por Lucas
// ==========================================

// 1. Variable global temporal para guardar los libros que el usuario va agregando
let detalleVentaActual = [];

// 2. Función para cargar las listas desplegables de Clientes y Libros
function poblarSelectoresVenta() {
  // Nota: Asumo que los IDs en tu index.html son 'venta-cliente' y 'venta-libro'. 
  // Si no llega a cargar, revisamos el HTML.
  const selectClienteVenta = document.getElementById('venta-cliente');
  const selectLibroVenta = document.getElementById('venta-libro');

  // Llenar selector de Clientes
  if (selectClienteVenta && typeof clientes !== 'undefined') {
    selectClienteVenta.innerHTML = '<option value="">Seleccione un cliente...</option>';
    clientes.forEach(cli => {
      const opt = document.createElement('option');
      opt.value = cli.id;
      // Mostramos nombre y email para evitar confusiones
      opt.textContent = `${cli.nombreCompleto} (${cli.email})`;
      selectClienteVenta.appendChild(opt);
    });
  }

  // Llenar selector de Libros
  if (selectLibroVenta && typeof libros !== 'undefined') {
    selectLibroVenta.innerHTML = '<option value="">Seleccione un libro...</option>';
    libros.forEach(lib => {
      const opt = document.createElement('option');
      opt.value = lib.id;
      // Mostramos título y precio para que el cajero vea el valor
      opt.textContent = `${lib.titulo} - $${lib.precio}`;
      selectLibroVenta.appendChild(opt);
    });
  }
}
// 3. Manejar el clic en "Agregar renglón" al detalle
function registrarHandlerAgregarDetalle() {
  const btnAgregar = document.getElementById('venta-agregar');
  if (!btnAgregar) return;

  btnAgregar.addEventListener('click', function(e) {
    e.preventDefault();

    const selectLibro = document.getElementById('venta-libro');
    const inputCantidad = document.getElementById('venta-cantidad');
    
    // Como no hay un div específico para errores del detalle, usamos un alert simple para no ensuciar el HTML
    const libroId = selectLibro.value;
    const cantidad = parseInt(inputCantidad.value);

    // Validaciones simples
    if (!libroId) {
      alert('Debe seleccionar un libro.');
      return;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
      alert('La cantidad debe ser mayor a cero.');
      return;
    }

    // Buscamos el libro en nuestro array general
    const libro = libros.find(l => l.id === libroId);
    if (!libro) return;

    // Chequear si el libro ya está en el detalle temporal
    const detalleExistente = detalleVentaActual.find(d => d.libroId === libroId);
    if (detalleExistente) {
      // Si ya está, le sumamos la cantidad
      detalleExistente.cantidad += cantidad;
      detalleExistente.subtotal = detalleExistente.cantidad * libro.precio;
    } else {
      // Si es nuevo, lo agregamos al array temporal
      detalleVentaActual.push({
        libroId: libro.id,
        titulo: libro.titulo,
        precioUnitario: libro.precio,
        cantidad: cantidad,
        subtotal: cantidad * libro.precio
      });
    }

    // Limpiar inputs (opcional, dejamos la cantidad en 1 por comodidad)
    selectLibro.value = '';
    inputCantidad.value = '1';

    // Refrescar la tabla del carrito
    renderTablaDetalleVenta();
  });
}

// 4. Dibujar la tabla del carrito temporal
function renderTablaDetalleVenta() {
  const tbody = document.getElementById('venta-renglones');
  const spanTotal = document.getElementById('venta-total'); 
  const pVacio = document.getElementById('venta-renglones-vacio');
  
  if (!tbody) return;
  tbody.innerHTML = ''; // Limpiamos la maqueta

  let totalVenta = 0;

  if (detalleVentaActual.length === 0) {
    if (pVacio) pVacio.hidden = false;
    if (spanTotal) spanTotal.innerHTML = '$&nbsp;0,00';
    return;
  } else {
    if (pVacio) pVacio.hidden = true;
  }

  detalleVentaActual.forEach((det, index) => {
    totalVenta += det.subtotal;

    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td>${det.titulo}</td>
      <td>${det.cantidad}</td>
      <td>$&nbsp;${det.precioUnitario.toFixed(2).replace('.', ',')}</td>
      <td>$&nbsp;${det.subtotal.toFixed(2).replace('.', ',')}</td>
      <td><button class="boton boton--secundario btn-quitar" type="button" data-index="${index}">Quitar</button></td>
    `;
    
    tbody.appendChild(tr);
  });

  // Evento para los botones "Quitar" de la tablita temporal
  const botonesQuitar = tbody.querySelectorAll('.btn-quitar');
  botonesQuitar.forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = this.getAttribute('data-index');
      detalleVentaActual.splice(idx, 1); // Lo borramos del array temporal
      renderTablaDetalleVenta(); // Redibujamos
    });
  });

  // Mostrar el total formateado
  if (spanTotal) {
    spanTotal.innerHTML = `$&nbsp;${totalVenta.toFixed(2).replace('.', ',')}`;
  }
}
// ==========================================
// C-09: CONFIRMACIÓN DE VENTA - por Lucas
// ==========================================

function registrarHandlerConfirmarVenta() {
  const formVenta = document.getElementById('form-venta');
  if (!formVenta) return;

  formVenta.addEventListener('submit', function(e) {
    e.preventDefault();

    const selectCliente = document.getElementById('venta-cliente');
    const divErrores = document.getElementById('venta-errores');
    const divMensaje = document.getElementById('venta-mensaje');

    // 1. Limpiar mensajes previos
    if (divErrores) {
      divErrores.hidden = true;
      divErrores.innerHTML = '';
    }
    if (divMensaje) {
      divMensaje.hidden = true;
      divMensaje.textContent = '';
    }

    const clienteId = selectCliente.value;

    // 2. Validar antes de guardar
    const errores = [];
    if (!clienteId) errores.push('Debe seleccionar un cliente para la venta.');
    if (detalleVentaActual.length === 0) errores.push('Error: agregá al menos un libro a la venta.');

    if (errores.length > 0) {
      if (divErrores) {
        divErrores.innerHTML = '<p>' + errores.join('<br>') + '</p>';
        divErrores.hidden = false;
      }
      return;
    }

    // 3. Crear el objeto de la venta final
    // Calculamos el total recorriendo el carrito
    const totalVenta = detalleVentaActual.reduce((acc, det) => acc + det.subtotal, 0);
    
    // Generamos un ID provisorio (ej: V-17290000)
    const nuevoId = 'V-' + Math.floor(Date.now() / 1000); 

    const nuevaVenta = {
      id: nuevoId,
      fecha: new Date().toISOString(),
      clienteId: clienteId,
      detalle: [...detalleVentaActual], // Hacemos una copia del carrito
      total: totalVenta
    };

    // 4. Guardar la venta en el sistema
    // Asumimos que existe un array global 'ventas' (si no existe lo creamos vacío para no romper)
    if (typeof ventas === 'undefined') {
      window.ventas = [];
    }
    
    ventas.push(nuevaVenta);
    
    if (typeof guardar === 'function') {
      guardar('libreria.ventas', ventas);
    } else {
      localStorage.setItem('libreria.ventas', JSON.stringify(ventas));
    }

    // 5. Mostrar éxito y resetear todo
    if (divMensaje) {
      divMensaje.textContent = `Venta ${nuevaVenta.id} registrada correctamente.`;
      divMensaje.hidden = false;
    }

    // Vaciamos el carrito y reseteamos la pantalla
    detalleVentaActual = [];
    formVenta.reset();
    renderTablaDetalleVenta();
    
    // 6. Refrescar el historial de ventas si ya existe esa función (C-10)
    if (typeof renderHistorialVentas === 'function') {
      renderHistorialVentas();
    }
  });
}
// ==========================================
// C-10: HISTORIAL DE VENTAS - por Lucas
// ==========================================

function renderHistorialVentas() {
  // ATENCIÓN: Pongo estos IDs por defecto, pero si en tu index.html 
  // se llaman distinto, cambialos acá para que coincidan.
  const tbody = document.getElementById('historial-renglones'); 
  const pVacio = document.getElementById('historial-vacio'); 

  if (!tbody) return;
  tbody.innerHTML = ''; // Limpiamos la maqueta

  // Si no hay ventas registradas
  if (typeof ventas === 'undefined' || ventas.length === 0) {
    if (pVacio) pVacio.hidden = false;
    return;
  } else {
    if (pVacio) pVacio.hidden = true;
  }

  // Recorremos el array de ventas globales y armamos las filas
  ventas.forEach(venta => {
    // Buscamos el nombre del cliente real para que no se vea solo un código raro
    const cliente = typeof clientes !== 'undefined' ? clientes.find(c => c.id === venta.clienteId) : null;
    const nombreCliente = cliente ? cliente.nombreCompleto : venta.clienteId;

    // Formateamos un poco la fecha para que se vea prolija
    const fechaObj = new Date(venta.fecha);
    const fechaFormateada = fechaObj.toLocaleDateString() + ' ' + fechaObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${venta.id}</td>
      <td>${fechaFormateada}</td>
      <td>${nombreCliente}</td>
      <td>${venta.detalle.length}</td>
      <td>$&nbsp;${venta.total.toFixed(2).replace('.', ',')}</td>
    `;
    
    tbody.appendChild(tr);
  });
}