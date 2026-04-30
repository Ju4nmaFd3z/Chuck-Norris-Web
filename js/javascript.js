"use strict";

// ------------------------------------------
// Endpoints de la API
// ------------------------------------------

const ENDPOINT_CATEGORIAS       = 'https://api.chucknorris.io/jokes/categories';
const ENDPOINT_CHISTE_ALEATORIO = 'https://api.chucknorris.io/jokes/random';

// ------------------------------------------
// Variables globales
// ------------------------------------------

let contadorChistes = 0;
let chisteActual    = null;

// Mensajes de error al estilo Chuck Norris
const MENSAJES_ERROR = [
    'Error al obtener los datos. Chuck Norris los obtuvo primero.',
    'No se pudieron cargar los datos. Chuck Norris estaba cerca.',
    'El servidor falló antes de que Chuck Norris terminara su movimiento.',
    'Algo salió mal. Chuck Norris no aprobó esta petición.',
    'Conexión perdida. Chuck Norris desconectó el servidor.',
    'No hay respuesta del servidor. Chuck Norris lo dejó inconsciente.',
    'Los datos existen, pero Chuck Norris decidió no compartirlos.',
    'No se pudieron obtener los datos. El servidor entró en pánico por Chuck Norris.',
    'Estamos trabajando en el problema... antes de que Chuck Norris vuelva.',
    'Chuck Norris interrumpió la carga de datos.',
    'El servidor no sobrevivió a Chuck Norris.',
    'Chuck Norris dice "no" a esta petición.',
    'Error: Chuck Norris.',
    'Chuck Norris estuvo aquí.',
    'El servidor se rindió ante Chuck Norris.',
    'Error al obtener los datos. Chuck Norris los redondeó hacia abajo.',
    'El servidor intentó responder... pero Chuck Norris lo miró fijamente.',
    'Datos no disponibles. Chuck Norris los está usando ahora mismo.',
    'La petición falló. Chuck Norris ganó esta ronda.',
    'No se pudieron cargar los datos. Chuck Norris cerró la conexión de una patada voladora.',
    'Timeout agotado. Chuck Norris nunca espera.',
    'El servidor se escondió cuando oyó el nombre de Chuck Norris.',
    'Error de red. Chuck Norris rompió el protocolo.',
    'Los datos se negaron a venir. Saben quién es Chuck Norris.',
    'El servidor respondió con miedo. Chuck Norris respondió con silencio.',
    'Petición rechazada. Chuck Norris ya aprobó otra.',
    'Error desconocido. Chuck Norris lo conoce.',
    'El servidor cayó. Chuck Norris ni siquiera tocó el teclado.'
];

// ------------------------------------------
// Elementos del DOM
// ------------------------------------------

const textoChiste          = document.getElementById('texto-chiste');
const categoriaSelect      = document.getElementById('categoria-select');
const botonObtenerChiste   = document.getElementById('boton-obtener-chiste');
const botonChisteAleatorio = document.getElementById('boton-chiste-aleatorio');
const botonCopiarChiste    = document.getElementById('boton-copiar-chiste');
const contadorElement      = document.getElementById('contador-chistes');

// ------------------------------------------
// Inicialización cuando el DOM está listo
// ------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    botonObtenerChiste.addEventListener('click', function () {
        const categoriaSeleccionada = categoriaSelect.value;
        if (categoriaSeleccionada) {
            obtenerChistePorCategoria(categoriaSeleccionada);
        }
    });

    botonChisteAleatorio.addEventListener('click', function () {
        obtenerChisteAleatorio();
    });

    botonCopiarChiste.addEventListener('click', function () {
        copiarChiste();
    });

    obtenerCategorias();
});

// ------------------------------------------
// Funciones
// ------------------------------------------

/**
 * @brief Devuelve un mensaje de error aleatorio al estilo Chuck Norris.
 *
 * @return {string} Un mensaje de error aleatorio.
 */
function obtenerErrorAleatorio() {
    const indice = Math.floor(Math.random() * MENSAJES_ERROR.length);
    return MENSAJES_ERROR[indice];
}

/**
 * @brief Obtiene las categorías de chistes desde su endpoint correspondiente.
 *
 * Esta función realiza una petición fetch al endpoint de las categorías de chistes,
 * valida la respuesta y actualiza un elemento <select> con las categorías obtenidas.
 * Además, habilita o deshabilita botones de la interfaz dependiendo del resultado.
 *
 * @see obtenerErrorAleatorio
 */
function obtenerCategorias() {
    fetch(ENDPOINT_CATEGORIAS)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            return response.json();
        })
        .then(function (categorias) {
            try {
                categoriaSelect.innerHTML = '';
                //Cambiamos la primera letra de las categorías a mayúscula
                categorias.forEach(function (categoria) {
                    const opcion = document.createElement('option');
                    opcion.value = categoria;
                    opcion.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
                    categoriaSelect.appendChild(opcion);
                });
                botonObtenerChiste.disabled   = false;
                botonChisteAleatorio.disabled = false;
            } catch (error) {
                console.error('Error al manipular el DOM de categorías:', error);
                mostrarError('Error al obtener las categorías. ' + obtenerErrorAleatorio());
            }
        })
        .catch(function (error) {
            categoriaSelect.innerHTML     = '<option value="">Cargando categorías...</option>';
            botonObtenerChiste.disabled   = true;
            botonChisteAleatorio.disabled = true;
            botonCopiarChiste.disabled    = true;
            mostrarError('Error al obtener las categorías. ' + obtenerErrorAleatorio());
            console.error('Error al cargar las categorías:', error);
        });
}

/**
 * @brief Obtiene un chiste de una categoría específica desde la API.
 *
 * Construye dinámicamente la URL del endpoint usando URLSearchParams
 * para añadir el parámetro de categoría de forma correctamente codificada.
 *
 * @param {string} categoria - La categoría del chiste que se desea obtener.
 * @see obtenerErrorAleatorio
 * @see mostrarChiste
 * @see mostrarError
 */
function obtenerChistePorCategoria(categoria) {
    const url = new URL(ENDPOINT_CHISTE_ALEATORIO);
    url.searchParams.set('category', categoria);

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            return response.json();
        })
        .then(function (datos) {
            try {
                mostrarChiste(datos.value);
            } catch (error) {
                console.error('Error al mostrar el chiste en el DOM:', error);
            }
        })
        .catch(function (error) {
            const nombreCategoria = categoria.charAt(0).toUpperCase() + categoria.slice(1);
            mostrarError('Error al obtener el chiste de la categoría ' + nombreCategoria + '. ' + obtenerErrorAleatorio());
            console.error('Error al obtener el chiste:', error);
        });
}

/**
 * @brief Obtiene un chiste aleatorio de cualquier categoría desde la API.
 *
 * @see obtenerErrorAleatorio
 * @see mostrarChiste
 * @see mostrarError
 */
function obtenerChisteAleatorio() {
    fetch(ENDPOINT_CHISTE_ALEATORIO)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            return response.json();
        })
        .then(function (datos) {
            try {
                mostrarChiste(datos.value);
            } catch (error) {
                console.error('Error al mostrar el chiste aleatorio en el DOM:', error);
            }
        })
        .catch(function (error) {
            mostrarError(obtenerErrorAleatorio());
            console.error('Error al obtener el chiste aleatorio:', error);
        });
}

/**
 * @brief Muestra un chiste en el área de texto de la interfaz.
 *
 * Actualiza el elemento del DOM destinado al texto del chiste, incrementa
 * el contador de chistes obtenidos y habilita el botón de copiar.
 *
 * @param {string} texto - El texto del chiste a mostrar.
 * @return {void} No devuelve ningún valor.
 */
function mostrarChiste(texto) {
    chisteActual = texto;
    textoChiste.textContent = texto;
    textoChiste.style.color = 'var(--chuck-light)';
    contadorChistes++;
    contadorElement.textContent = contadorChistes;
    botonCopiarChiste.disabled = false;
}

/**
 * @brief Muestra un mensaje de error en el área de texto del chiste.
 *
 * Deshabilita el botón de copiar ya que no hay un chiste válido para copiar.
 *
 * @param {string} mensajeError - El mensaje de error a mostrar.
 * @return {void} No devuelve ningún valor.
 */
function mostrarError(mensajeError) {
    chisteActual = null;
    textoChiste.textContent = mensajeError;
    textoChiste.style.color = 'var(--chuck-red)';
    botonCopiarChiste.disabled = true;
}

/**
 * @brief Copia el chiste actual al portapapeles del sistema.
 *
 * Muestra una alerta según el resultado de la operación.
 *
 * @see obtenerErrorAleatorio
 * @return {void} No devuelve ningún valor.
 */
function copiarChiste() {
    if (!chisteActual) {
        return;
    }

    navigator.clipboard.writeText(chisteActual)
        .then(function () {
            alert('Chiste copiado al portapapeles. Chuck Norris no necesitó Ctrl+C');
        })
        .catch(function (error) {
            alert('El chiste intentó copiarse... Chuck Norris lo detuvo.');
            console.error('Error al copiar el chiste:', error);
        });
}