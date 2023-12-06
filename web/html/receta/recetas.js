
let links = {};
export let opcion;

export function inicializar(){    

    links = {
        "agregar":{
            "htmlFile": "html/receta/crearReceta.html"
        },
        "ver":{
            "htmlFile": "html/receta/receta.html"
        },
        "recetas":{
            "htmlFile": "html/receta/recetas.html",
            "jsFile": "../html/receta/recetas.js",
            "cssFile": "html/receta/recetas.css"
        }
    };
    
    //loadContent("ver")

}

export function loadContent(...btn) {

    let op = links[btn[0]];    

    opcion = btn;    

    fetch(op.htmlFile)
        .then(response => response.text())
        .then(htmlContent => {
            document.getElementById('moduleBox').innerHTML = htmlContent;                             

            if (btn == "ver") {    
                let textArea = document.getElementsByClassName("txtDetalles");

                textArea[0].disabled  = true;
                textArea[1].disabled  = true;
            }

            if (btn.length > 1 && btn[1] == "modificar") {                
                opcion = "ver";    
            }
        })
        .catch(error => {
            console.error('Error al cargar dinámicamente:', error);
        });

}

export function previewImage(event) {
    const input = event.target;

    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('image-preview');

    // Limpiar la previsualización anterior
    previewImage.src = '';
    previewContainer.style.display = 'none';

    // Verificar si se seleccionó un archivo
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        // Configurar el evento onload del lector
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
        };

        // Leer el contenido del archivo como URL
        reader.readAsDataURL(input.files[0]);
    }
}