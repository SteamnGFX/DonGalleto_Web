var inventario = document.getElementById("card-inventario");
var materia = document.getElementById("card-materia");
var venta = document.getElementById("card-venta");
var recetas = document.getElementById("card-recetas");
var corte = document.getElementById("card-corte");

let links = {};

export function inicializar() {
  links = {
    inicio: {
      htmlFile: "html/menu/menu.html",
      jsFile: "../html/menu/menu.js",
      cssFile: "html/menu/menu.css",
    },
    recetas: {
      htmlFile: "html/receta/recetas.html",
      jsFile: "../html/receta/recetas.js",
      cssFile: "html/receta/recetas.css",
    },
  };
}

export function loadContent(opcion) {
  let op = menuItem[opcion];

  fetch(op.cssFile)
    .then((response) => response.text())
    .then((css) => {
      removeScripts("body style");

      const styleLink = document.createElement("style");
      styleLink.textContent = css;
      document.body.appendChild(styleLink);          

      return fetch(op.htmlFile);
    })
    .then((res) => {
      return res.text();
    })
    .then((htmlContent) => {

      document.getElementById("moduleBox").innerHTML = htmlContent;    

      import(op.jsFile).then((ctr) => {
        controller = ctr;

        controller.inicializar();
      });
    })
    .catch((error) => {
      console.error("Error al cargar dinámicamente:", error);
    });
}

function eliminarCache() {
  localStorage.clear();
}

// document.addEventListener('click', closeNavbarOutsideClick);
