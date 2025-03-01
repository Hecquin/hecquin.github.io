// Configuración inicial
const TAMANO_GRILLA = 15;
const CANTIDAD_PALABRAS = 16;

// Variables globales
let temaActual = "general";
let palabrasActuales = [];
// Variables para el control de selección
let seleccionando = false;
let celdasSeleccionadas = [];
let inicioX = null;
let inicioY = null;
// En sopa.js (al inicio del archivo)
const palabrasPorTema = {
  general: [
    "computadora",
    "teclado",
    "ventana",
    "libro",
    "mesa",
    "parlante",
    "silla",
    "lapiz",
    "cuaderno",
    "ventilador",
    "lampara",
    "puerta",
    "espejo",
    "reloj",
    "telefono",
    "carpeta",
    "archivo",
    "cuadro",
    "celular",
    "trapera",
  ],
  ciencias: [
    "biologia",
    "quimica",
    "fisica",
    "astronomia",
    "genetica",
    "ecologia",
    "geologia",
    "matematicas",
    "experimento",
    "microscopio",
    "laboratorio",
    "molecula",
    "celula",
    "energia",
    "termometro",
  ],
  historia: [
    "civilizacion",
    "imperio",
    "revolucion",
    "guerra",
    "monarquia",
    "descubrimiento",
    "colonizacion",
    "independencia",
    "edadmedia",
    "renacimiento",
    "republica",
    "tratado",
    "batalla",
    "arqueologia",
    "artefacto",
  ],
  arte: [
    "pintura",
    "escultura",
    "arquitectura",
    "literatura",
    "musica",
    "danza",
    "fotografia",
    "cinematografia",
    "surrealismo",
    "impresionismo",
    "renacimiento",
    "acuarela",
    "oleo",
    "grabado",
    "museo",
  ],
  frutas: [
    "Albaricoque",
    "arándano",
    "carambola",
    "cereza",
    "ciruela",
    "coco",
    "dátil",
    "frambuesa",
    "fresa",
    "granada",
    "grosella",
    "higo",
    "kiwi",
    "lima",
    "limón",
    "mandarina",
    "mango",
    "manzana",
    "maracuyá",
    "melocotón",
    "melón",
    "membrillo",
    "mora",
    "naranja",
    "nectarina",
    "papaya",
    "pera",
    "piña",
    "plátano",
    "pomelo",
    "rábano",
    "remolacha",
    "rúcula",
    "sandía",
    "tirabeques",
    "uva",
  ],
  verduras: [
    "Acelga",
    "Aguacate",
    "Ajo",
    "Alcachofa",
    "Apio",
    "Berenjena",
    "Brócoli",
    "Calabacín",
    "Calabaza",
    "Cardo",
    "Cebolla",
    "Champiñón",
    "Col",
    "Coliflor",
    "Endibia",
    "Escarola",
    "Espárrago",
    "Espinacas",
    "Guindilla",
    "Guisante",
    "Haba",
    "Lechuga",
    "Lombarda",
    "Nabo",
    "Patata",
    "Pepino",
    "Pimiento",
    "Puerro",
    "Setas",
    "Tomate",
    "Zanahoria",
  ],
};

//************************************************************************** */
function generarSopa() {
  const contenedor = document.getElementById("contenedor-sopa");
  contenedor.innerHTML = "";
  // Inicializar grid con objetos
  let grid = Array.from({ length: TAMANO_GRILLA }, () =>
    Array(TAMANO_GRILLA)
      .fill()
      .map(() => ({
        letra: "",
        encontrada: false,
      }))
  );

  const palabras = obtenerPalabrasPorTema(temaActual);
  palabrasActuales = seleccionarPalabrasAleatorias(palabras);

  colocarPalabras(grid, palabrasActuales);
  rellenarEspaciosVacios(grid);
  renderizarSopa(grid);
  mostrarPalabras(palabrasActuales);
}
//**************************************************************************** */

function obtenerPalabrasPorTema(tema) {
  const palabras = palabrasPorTema[tema] || [];
  return palabras.map((p) =>
    p
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  );
}

//**************************************************************************** */

// Función para seleccionar palabras aleatorias
function seleccionarPalabrasAleatorias(palabras) {
  return [...palabras]
    .sort(() => Math.random() - 0.5)
    .slice(0, CANTIDAD_PALABRAS)
    .map((p) =>
      p
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    ); // Eliminar acentos
}
//**************************************************************************** */

// Modificar la función colocarPalabras para mejorar la colocación
function colocarPalabras(grid, palabras) {
  const direcciones = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: -1 },
  ];

  palabras.forEach((palabra) => {
    let colocada = false;
    let intentos = 0;
    const longitud = palabra.length;

    while (!colocada && intentos < 500) {
      // Aumentar intentos
      intentos++;
      const dir = direcciones[Math.floor(Math.random() * direcciones.length)];

      // Calcular posición máxima permitida
      const maxX =
        dir.dx > 0
          ? TAMANO_GRILLA - longitud
          : dir.dx < 0
          ? longitud - 1
          : TAMANO_GRILLA - 1;
      const maxY =
        dir.dy > 0
          ? TAMANO_GRILLA - longitud
          : dir.dy < 0
          ? longitud - 1
          : TAMANO_GRILLA - 1;

      const x = Math.floor(Math.random() * (maxX + 1));
      const y = Math.floor(Math.random() * (maxY + 1));

      if (puedeColocarPalabra(grid, palabra, x, y, dir.dx, dir.dy)) {
        colocarPalabraEnGrid(grid, palabra, x, y, dir.dx, dir.dy);
        colocada = true;
      }
    }

    if (!colocada) {
      console.warn(`No se pudo colocar: ${palabra}`);
    }
  });
}
//**************************************************************************** */
// Función para verificar si cabe la palabra
function puedeColocarPalabra(grid, palabra, x, y, dx, dy) {
  const longitud = palabra.length;

  // Verificar límites iniciales
  const xFinal = x + (longitud - 1) * dx;
  const yFinal = y + (longitud - 1) * dy;
  if (
    xFinal < 0 ||
    xFinal >= TAMANO_GRILLA ||
    yFinal < 0 ||
    yFinal >= TAMANO_GRILLA
  ) {
    return false;
  }

  // Verificar celdas
  for (let i = 0; i < longitud; i++) {
    const celda = grid[y + i * dy][x + i * dx].letra;
    if (celda !== "" && celda !== palabra[i]) {
      return false;
    }
  }
  return true;
}
//**************************************************************************** */
// Función para colocar la palabra en la grilla
function colocarPalabraEnGrid(grid, palabra, x, y, dx, dy) {
  for (let i = 0; i < palabra.length; i++) {
    const nuevaX = x + i * dx;
    const nuevaY = y + i * dy;
    grid[nuevaY][nuevaX].letra = palabra[i]; // Usar .letra en lugar de asignación directa
  }
}
//**************************************************************************** */
// Función para rellenar espacios vacíos
function rellenarEspaciosVacios(grid) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let y = 0; y < TAMANO_GRILLA; y++) {
    for (let x = 0; x < TAMANO_GRILLA; x++) {
      if (grid[y][x].letra === "") {
        grid[y][x].letra = letras[Math.floor(Math.random() * letras.length)];
      }
    }
  }
}
//**************************************************************************** */

function renderizarSopa(grid) {
  const contenedor = document.getElementById("contenedor-sopa");
  contenedor.innerHTML = "";

  // Calcula tamaño basado en el ancho del contenedor
  const anchoContenedor = contenedor.offsetWidth;
  //const tamanoCelda = (anchoContenedor / TAMANO_GRILLA).toFixed(2);

  //contenedor.style.gridTemplateColumns = `repeat(${TAMANO_GRILLA}, ${tamanoCelda}px)`;

  grid.forEach((fila, y) => {
    fila.forEach((celdaInfo, x) => {
      const celda = document.createElement("div");
      celda.className = `celda-sopa ${
        celdaInfo.encontrada ? "encontrada" : ""
      }`;
      celda.textContent = celdaInfo.letra;
      celda.dataset.x = x;
      celda.dataset.y = y;

      // Asegurar tamaño exacto
      /* celda.style.width = `${tamanoCelda}px`;
      celda.style.height = `${tamanoCelda}px`; */

      contenedor.appendChild(celda);
    });
  });
}

//**************************************************************************** */
function mostrarPalabras(palabras) {
  // Limpiar todo el contenido previo (incluyendo palabras anteriores)

  const contenedor = document.getElementById("estado");
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
  /* contenedor.innerHTML = "<h5>Palabras a encontrar:</h5>";
   */
  const lista = document.createElement("div");
  lista.className = "palabras-lista";

  palabras.forEach((palabra) => {
    const item = document.createElement("span");
    item.className = "palabra-item";
    item.textContent = palabra;
    lista.appendChild(item);
  });

  contenedor.appendChild(lista);
}
//**************************************************************************** */
// Event listeners
document.getElementById("temas").addEventListener("change", function (e) {
  temaActual = e.target.value;
  generarSopa();
});
//**************************************************************************** */
function iniciarSeleccion(x, y) {
  seleccionando = true;
  celdasSeleccionadas = [];
  inicioX = x;
  inicioY = y;
  agregarSeleccion(x, y);
}
//**************************************************************************** */
// Función para manejar el movimiento durante la selección
function moverSeleccion(x, y) {
  if (!seleccionando) return;

  // Calcular dirección basada en la posición inicial y actual
  const dx = x - inicioX;
  const dy = y - inicioY;

  // Determinar dirección principal con lógica mejorada
  const direccion = {
    dx: dx !== 0 ? Math.sign(dx) : 0,
    dy: dy !== 0 ? Math.sign(dy) : 0,
  };

  // Calcular máxima distancia en cualquier eje
  const distancia = Math.max(Math.abs(dx), Math.abs(dy));

  // Generar camino correctamente
  const nuevasCeldas = [];
  for (let i = 0; i <= distancia; i++) {
    const nuevaX = inicioX + direccion.dx * i;
    const nuevaY = inicioY + direccion.dy * i;

    if (
      nuevaX >= 0 &&
      nuevaX < TAMANO_GRILLA &&
      nuevaY >= 0 &&
      nuevaY < TAMANO_GRILLA
    ) {
      nuevasCeldas.push({ x: nuevaX, y: nuevaY });
    }
  }

  // Actualizar selección
  document.querySelectorAll(".celda-sopa.seleccionada").forEach((c) => {
    if (
      !nuevasCeldas.some((nc) => nc.x == c.dataset.x && nc.y == c.dataset.y)
    ) {
      c.classList.remove("seleccionada");
    }
  });

  nuevasCeldas.forEach((pos) => {
    const celda = document.querySelector(
      `.celda-sopa[data-x="${pos.x}"][data-y="${pos.y}"]`
    );
    if (!celda.classList.contains("seleccionada")) {
      celda.classList.add("seleccionada");
      if (!celdasSeleccionadas.some((c) => c.x === pos.x && c.y === pos.y)) {
        celdasSeleccionadas.push(pos);
      }
    }
  });
}
//**************************************************************************** */
function validarDireccionSeleccion(celdas) {
  if (celdas.length < 2) return true;

  // Calcular dirección promedio
  let dxTotal = 0;
  let dyTotal = 0;

  for (let i = 1; i < celdas.length; i++) {
    dxTotal += celdas[i].x - celdas[i - 1].x;
    dyTotal += celdas[i].y - celdas[i - 1].y;
  }

  const dxPromedio = Math.round(dxTotal / (celdas.length - 1));
  const dyPromedio = Math.round(dyTotal / (celdas.length - 1));

  // Tolerancia para movimientos imperfectos
  const umbralError = 1;

  for (let i = 1; i < celdas.length; i++) {
    const dx = celdas[i].x - celdas[i - 1].x;
    const dy = celdas[i].y - celdas[i - 1].y;

    if (
      Math.abs(dx - dxPromedio) > umbralError ||
      Math.abs(dy - dyPromedio) > umbralError
    ) {
      return false;
    }
  }
  return true;
}
//**************************************************************************** */
// Función para finalizar la selección
function finalizarSeleccion() {
  seleccionando = false;
  verificarPalabra();
  celdasSeleccionadas = [];
}
//**************************************************************************** */
// Función para agregar una celda a la selección

function agregarSeleccion(x, y) {
  const celda = document.querySelector(
    `.celda-sopa[data-x="${x}"][data-y="${y}"]`
  );
  if (celda) {
    // Permitir selección incluso si ya fue encontrada
    celda.classList.add("seleccionada");
    if (!celdasSeleccionadas.some((c) => c.x == x && c.y == y)) {
      celdasSeleccionadas.push({ x: parseInt(x), y: parseInt(y) });
    }
  }
}
//**************************************************************************** */
// Función para obtener celdas en línea recta entre dos puntos (Bresenham)

function obtenerCeldasEntrePuntos(x0, y0, x1, y1) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  const puntos = [];

  // Forzar dirección única después del primer movimiento
  if (puntos.length > 1) {
    const dirX = puntos[1].x - puntos[0].x;
    const dirY = puntos[1].y - puntos[0].y;
    x1 = Math.max(0, Math.min(TAMANO_GRILLA - 1, x1));
    y1 = Math.max(0, Math.min(TAMANO_GRILLA - 1, y1));
  }

  while (true) {
    puntos.push({ x: x0, y: y0 });
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  return puntos;
}
//**************************************************************************** */
// Función para verificar si la selección es una palabra válida
function verificarPalabra() {
  const letras = celdasSeleccionadas
    .sort((a, b) => a.x - b.x || a.y - b.y)
    .map(
      (c) =>
        document.querySelector(`.celda-sopa[data-x="${c.x}"][data-y="${c.y}"]`)
          .textContent
    )
    .join("");

  const palabraInvertida = [...letras].reverse().join("");
  const palabraEncontrada = palabrasActuales.find(
    (p) => p === letras || p === palabraInvertida
  );

  if (palabraEncontrada) {
    marcarCeldasEncontradas(); // Primero marcar las celdas
    marcarPalabraEncontrada(palabraEncontrada);
    const gridActual = obtenerGridActual();
    renderizarSopa(gridActual); // Luego renderizar
  }

  document.querySelectorAll(".celda-sopa.seleccionada").forEach((c) => {
    c.classList.remove("seleccionada");
  });
}
//**************************************************************************** */
function obtenerGridActual() {
  const grid = [];
  document.querySelectorAll(".celda-sopa").forEach((celda, index) => {
    const y = Math.floor(index / TAMANO_GRILLA);
    const x = index % TAMANO_GRILLA;
    if (!grid[y]) grid[y] = [];
    grid[y][x] = {
      letra: celda.textContent,
      encontrada: celda.classList.contains("encontrada"),
    };
  });
  return grid;
}
//**************************************************************************** */
function marcarCeldasEncontradas() {
  celdasSeleccionadas.forEach(({ x, y }) => {
    const celda = document.querySelector(
      `.celda-sopa[data-x="${x}"][data-y="${y}"]`
    );
    const yaMarcada = celda.classList.contains("encontrada");

    celda.classList.add("encontrada");
    if (yaMarcada) {
      celda.classList.add("multiples");
    }
  });
}
//**************************************************************************** */
// Función para marcar la palabra en la lista
function marcarPalabraEncontrada(palabra) {
  document.querySelectorAll(".palabra-item").forEach((item) => {
    if (
      item.textContent === palabra ||
      item.textContent === [...palabra].reverse().join("")
    ) {
      item.classList.add("encontrada");
    }
  });
}
//**************************************************************************** */
function obtenerCeldasDireccionales(
  xInicio,
  yInicio,
  xActual,
  yActual,
  direccion
) {
  const celdas = [];
  const dx = direccion.dx;
  const dy = direccion.dy;
  const pasos = Math.max(
    Math.abs(xActual - xInicio),
    Math.abs(yActual - yInicio)
  );

  // Algoritmo mejorado para diagonales puras
  for (let i = 0; i <= pasos; i++) {
    const x = xInicio + dx * i;
    const y = yInicio + dy * i;

    if (x >= 0 && x < TAMANO_GRILLA && y >= 0 && y < TAMANO_GRILLA) {
      celdas.push({ x, y });
    }
  }
  return celdas;
}
//**************************************************************************** */
// Event listeners para mouse
document
  .getElementById("contenedor-sopa")
  .addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("celda-sopa")) {
      iniciarSeleccion(
        parseInt(e.target.dataset.x),
        parseInt(e.target.dataset.y)
      );
    }
  });
//**************************************************************************** */
document.addEventListener("mousemove", (e) => {
  if (seleccionando) {
    const celda = document.elementFromPoint(e.clientX, e.clientY);
    if (celda && celda.classList.contains("celda-sopa")) {
      moverSeleccion(parseInt(celda.dataset.x), parseInt(celda.dataset.y));
    }
  }
});
//**************************************************************************** */
document.addEventListener("mouseup", finalizarSeleccion);
//**************************************************************************** */
// Event listeners para touch
// Touchstart
document.getElementById("contenedor-sopa").addEventListener(
  "touchstart",
  function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.getBoundingClientRect();

    // Calcular posición relativa considerando scroll y bordes
    const x = touch.clientX - rect.left - this.clientLeft;
    const y = touch.clientY - rect.top - this.clientTop;

    // Calcular tamaño exacto de celda
    const tamanoCelda = (rect.width - this.clientLeft * 2) / TAMANO_GRILLA;

    // Asegurar redondeo preciso
    const celdaX = Math.min(
      TAMANO_GRILLA - 1,
      Math.max(0, Math.floor(x / tamanoCelda))
    );
    const celdaY = Math.min(
      TAMANO_GRILLA - 1,
      Math.max(0, Math.floor(y / tamanoCelda))
    );

    iniciarSeleccion(celdaX, celdaY);
  },
  { passive: false }
);

//**************************************************************************** */
// En el event listener de touchmove, agregar:
// Touchmove
// En el event listener touchmove
document.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault();
    if (!seleccionando) return;

    const touch = e.touches[0];
    const contenedor = document.getElementById("contenedor-sopa");
    const rect = contenedor.getBoundingClientRect();

    // Cálculo preciso considerando zoom y desplazamiento
    const scaleX = contenedor.offsetWidth / rect.width;
    const scaleY = contenedor.offsetHeight / rect.height;

    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    const tamanoCelda = contenedor.offsetWidth / TAMANO_GRILLA;
    const celdaX = Math.floor(x / tamanoCelda);
    const celdaY = Math.floor(y / tamanoCelda);

    moverSeleccion(
      Math.max(0, Math.min(TAMANO_GRILLA - 1, celdaX)),
      Math.max(0, Math.min(TAMANO_GRILLA - 1, celdaY))
    );
  },
  { passive: false }
);

//**************************************************************************** */
// Touchend
document.addEventListener(
  "touchend",
  function (e) {
    e.preventDefault();
    finalizarSeleccion();
  },
  { passive: false }
);
//**************************************************************************** */
// Al final del archivo sopa.js
// Actualizar al cambiar tamaño de pantalla
window.addEventListener("resize", () => {
  if (document.getElementById("contenedor-sopa").children.length > 0) {
    renderizarSopa(obtenerGridActual());
  }
});
// Inicialización
generarSopa();
