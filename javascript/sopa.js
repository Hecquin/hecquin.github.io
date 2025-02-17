// Configuración inicial
const TAMANO_GRILLA = 16;
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
  contenedor.style.gridTemplateColumns = `repeat(${TAMANO_GRILLA}, 40px)`;

  grid.forEach((fila, y) => {
    fila.forEach((celdaInfo, x) => {
      const celda = document.createElement("div");
      celda.className =
        "celda-sopa" +
        (celdaInfo.encontrada ? " encontrada" : "") +
        (celdaInfo.encontrada &&
        document
          .querySelector(`.celda-sopa[data-x="${x}"][data-y="${y}"]`)
          ?.classList.contains("multiples")
          ? " multiples"
          : "");

      celda.textContent = celdaInfo.letra;
      celda.dataset.x = x;
      celda.dataset.y = y;
      contenedor.appendChild(celda);
    });
  });
}
//**************************************************************************** */
function mostrarPalabras(palabras) {
  const contenedor = document.getElementById("estado");
  contenedor.innerHTML = "<h3>Palabras a encontrar:</h3>";

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

  // Bloquear dirección después del primer movimiento
  if (celdasSeleccionadas.length === 1) {
    const dx = x - celdasSeleccionadas[0].x;
    const dy = y - celdasSeleccionadas[0].y;

    // Determinar dirección principal con tolerancia reducida
    this.direccion = {
      dx: Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) : 0,
      dy: Math.abs(dy) > Math.abs(dx) ? Math.sign(dy) : 0,
    };

    // Forzar dirección diagonal pura si el ángulo es cercano
    if (Math.abs(dx) === Math.abs(dy)) {
      this.direccion = { dx: Math.sign(dx), dy: Math.sign(dy) };
    }
  }

  // Aplicar dirección bloqueada
  const nuevasCeldas = obtenerCeldasDireccionales(
    inicioX,
    inicioY,
    x,
    y,
    this.direccion
  );

  // Limpiar selección previa
  document.querySelectorAll(".celda-sopa.seleccionada").forEach((c) => {
    if (
      !nuevasCeldas.some((nc) => nc.x == c.dataset.x && nc.y == c.dataset.y)
    ) {
      c.classList.remove("seleccionada");
    }
  });

  // Agregar nuevas celdas válidas
  nuevasCeldas.forEach(({ x, y }) => agregarSeleccion(x, y));
}
//**************************************************************************** */
function validarDireccionSeleccion(celdas) {
  if (celdas.length < 2) return true;

  const dx = celdas[1].x - celdas[0].x;
  const dy = celdas[1].y - celdas[0].y;

  // Umbral de sensibilidad reducido
  const deltaPermitido = 0; // Cero tolerancia a desviaciones

  for (let i = 2; i < celdas.length; i++) {
    const currentDx = celdas[i].x - celdas[i - 1].x;
    const currentDy = celdas[i].y - celdas[i - 1].y;

    if (
      Math.abs(currentDx - dx) > deltaPermitido ||
      Math.abs(currentDy - dy) > deltaPermitido
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
    x1 = x0 + dirX * Math.max(dx, dy);
    y1 = y0 + dirY * Math.max(dx, dy);
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
  const pasos = Math.max(
    Math.abs(xActual - xInicio),
    Math.abs(yActual - yInicio)
  );

  for (let i = 0; i <= pasos; i++) {
    const x = xInicio + direccion.dx * i;
    const y = yInicio + direccion.dy * i;

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

// Event listeners para touch
document
  .getElementById("contenedor-sopa")
  .addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const celda = document.elementFromPoint(touch.clientX, touch.clientY);
    if (celda && celda.classList.contains("celda-sopa")) {
      iniciarSeleccion(parseInt(celda.dataset.x), parseInt(celda.dataset.y));
    }
  });
//**************************************************************************** */
// En el event listener de touchmove, agregar:
document.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (seleccionando) {
    const touch = e.touches[0];
    // Aumentar precisión táctil
    const elementos = document.elementsFromPoint(touch.clientX, touch.clientY);
    const celda = elementos.find((el) => {
      const rect = el.getBoundingClientRect();
      return (
        el.classList.contains("celda-sopa") &&
        touch.clientX >= rect.left + 10 &&
        touch.clientX <= rect.right - 10 &&
        touch.clientY >= rect.top + 10 &&
        touch.clientY <= rect.bottom - 10
      );
    });

    if (celda) {
      moverSeleccion(parseInt(celda.dataset.x), parseInt(celda.dataset.y));
    }
  }
});
//**************************************************************************** */
document.addEventListener("touchend", (e) => {
  e.preventDefault();
  finalizarSeleccion();
});
//**************************************************************************** */
// Inicialización
generarSopa();
