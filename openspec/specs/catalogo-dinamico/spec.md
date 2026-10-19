# catalogo-dinamico Specification

## Purpose

Renderiza el catálogo de libros y los listados iniciales de Libros y Clientes de forma dinámica desde arrays de datos locales en el navegador, sin depender de HTML estático maquetado.

## Requirements

### Requirement: Arrays de datos con ids estables
El sistema SHALL mantener arrays con ids estables para libros, editoriales, géneros, autores y clientes, con al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes.

#### Scenario: Arrays iniciales cargados
- **WHEN** se abre la aplicación por primera vez
- **THEN** existen los arrays `libros`, `editoriales`, `generos`, `autores` y `clientes` con los datos iniciales definidos

### Requirement: Render del catálogo desde el array libros
El catálogo SHALL renderizarse en `#catalogo-lista` a partir del array `libros` usando `createElement` y `textContent`, mostrando título, ISBN, editorial, género, autores y precio formateado en ARS.

#### Scenario: Tarjetas generadas desde el array
- **WHEN** se carga la vista Catálogo
- **THEN** se genera una tarjeta por cada libro en el array `libros`, con los mismos datos y clases que las tarjetas estáticas de C-01

#### Scenario: Libro sin género
- **WHEN** un libro tiene `generoId` igual a `null`
- **THEN** su tarjeta muestra «Sin clasificar» en lugar de un nombre de género

### Requirement: Render inicial de listados de Libros y Clientes
Los listados de Libros y Clientes SHALL renderizarse inicialmente desde los arrays `libros` y `clientes` respectivamente.

#### Scenario: Listado de libros inicial
- **WHEN** se abre la vista Libros
- **THEN** se muestra una fila por cada libro en el array `libros`

#### Scenario: Listado de clientes inicial
- **WHEN** se abre la vista Clientes
- **THEN** se muestra una fila por cada cliente en el array `clientes`

### Requirement: Formateo de importes y fechas
Los importes SHALL formatearse con `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })` y las fechas SHALL mostrarse como `dd/mm/aaaa hh:mm`.

#### Scenario: Importe en ARS
- **WHEN** se muestra un precio de 1500
- **THEN** se ve `$ 1.500,00`

#### Scenario: Fecha en formato local
- **WHEN** se muestra una fecha en formato ISO 8601
- **THEN** se ve como `dd/mm/aaaa hh:mm`

### Requirement: Búsqueda activa al volver al Catálogo
Cada vez que se muestra la vista Catálogo SHALL aplicarse la búsqueda que tenga escrita `#catalogo-busqueda`, con la misma regla de coincidencia y los mismos mensajes que al escribir.

#### Scenario: Volver desde otra vista
- **WHEN** se escribe `mapa` en el buscador, se navega a Libros y se vuelve al Catálogo
- **THEN** se ve solo «El mapa invisible» y el campo sigue diciendo `mapa`

#### Scenario: Búsqueda vacía al volver
- **WHEN** el buscador está vacío y se vuelve al Catálogo
- **THEN** se ven todos los libros

### Requirement: Género inexistente se muestra como «Sin clasificar»
Un libro cuyo `generoId` es nulo o no corresponde a ningún género cargado SHALL mostrarse como «Sin clasificar» en el Catálogo y en la tabla de Libros, sin modificar el `generoId` guardado.

#### Scenario: Id de género inexistente
- **WHEN** un libro de `libreria.libros` tiene `generoId` `"ge-99"` y se recarga la página
- **THEN** el Catálogo y la tabla de Libros muestran «Sin clasificar» para ese libro y `libreria.libros` sigue guardando `"ge-99"`

#### Scenario: Libro sin género
- **WHEN** un libro tiene `generoId` `null`
- **THEN** el Catálogo y la tabla de Libros muestran «Sin clasificar»

### Requirement: Contador de libros del Catálogo
El número de la tarjeta «Historias por descubrir» (`.bienvenida__cantidad`) SHALL mostrar la cantidad total de libros cargados (no los filtrados) y actualizarse tras cada alta de libro sin recargar.

#### Scenario: Contador inicial
- **WHEN** se abre la aplicación con los 6 libros iniciales
- **THEN** el contador muestra 6

#### Scenario: Contador tras un alta
- **WHEN** se registra un libro nuevo
- **THEN** el contador muestra 7 sin recargar la página, aunque haya una búsqueda activa
