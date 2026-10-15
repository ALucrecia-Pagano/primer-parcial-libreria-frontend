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

// Parte DOM: oculta/muestra tarjetas con hidden y actualiza los mensajes.
// En C-04 se reemplaza el cuerpo por un re-render desde el array de libros.
function filtrarCatalogo() {
  const campo = document.getElementById('catalogo-busqueda');
  const lista = document.getElementById('catalogo-lista');
  if (!campo || !lista) {
    return;
  }
  const busqueda = campo.value;
  const tarjetas = lista.querySelectorAll('.tarjeta');
  let visibles = 0;

  tarjetas.forEach(function (tarjeta) {
    const encabezado = tarjeta.querySelector('.tarjeta__titulo');
    const titulo = encabezado ? encabezado.textContent : '';
    const coincide = coincideTitulo(titulo, busqueda);
    tarjeta.hidden = !coincide;
    if (coincide) {
      visibles += 1;
    }
  });

  const total = tarjetas.length;
  const sinResultados = document.getElementById('catalogo-sin-resultados');
  if (sinResultados) {
    sinResultados.hidden = !(total > 0 && visibles === 0);
  }

  const zonaEstado = document.getElementById('catalogo-resultados');
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

iniciarNavegacion();
registrarFormulariosMaqueta();
iniciarTema();
iniciarSidebar();
iniciarFiltroCatalogo();
