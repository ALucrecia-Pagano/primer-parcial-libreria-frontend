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
