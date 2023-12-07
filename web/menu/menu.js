let links = {};

export function inicializar() {
  links = {
    recetas: {
      htmlFile: "receta/recetas.html",
      jsFile: "receta/recetas.js",
      cssFile: "receta/recetas.css",
    },
    ventas: {
      htmlFile: "venta/orden.html",
      jsFile: "venta/scriptOrden.js",
      cssFile: "venta/styles.css",
    },
    inventario: {
      htmlFile: "invetario/inventario.html",
      jsFile: "inventario/script.js",
      cssFile: "invetario/styles.css",
    },
    recetas:{
      "htmlFile": "receta/recetas.html",
      "jsFile": "receta/recetas.js",
      "cssFile": "receta/recetas.css"
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

      

      const rutaSinHtmlPrefix = op.jsFile.replace("html/", "");

      console.log(rutaSinHtmlPrefix)

      import(op.jsFile).then((ctr) => {

        
        controller = ctr;

        controller.inicializar();
      });
    })
    .catch((error) => {
      console.error("Error al cargar dinámicamente:", error);
    });
}

