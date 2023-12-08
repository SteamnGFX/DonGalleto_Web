let galletas = [];

/* global Swal */

let galletaCantidad = 0;
let clics = 0;
let imgFotoGalleta = "";

let links = {};
export let opcion;

export function inicializar(){
    document.getElementById("btnAgregarGalleta").addEventListener("click", function () {

    });

    // let url = "api/galleta/getAll";

    // getData(url)
    // .then(data => {
    //     galletas = data;
    //     createCards();
    // })
    // .catch(error => {
    //     console.error("Error al obtener los datos:", error.message);
    // });

    galletas = [
        {
            idGalleta: "1",
            nombre: "Galleta 1",
            cantidad: 25,
            fotografia: "",
            precio: "20.00",
            peso: 200         
        },
        {
            idGalleta: "2",
            nombre: "Galleta 2",
            cantidad: 10,
            fotografia: "",
            precio: "20.00",
            peso: 200         
        },
        {
            idGalleta: "3",
            nombre: "Galleta 3",
            cantidad: 15,
            fotografia: "",
            precio: "20.00",
            peso: 200         
        },
        {
            idGalleta: "3",
            nombre: "Galleta 3",
            cantidad: 15,
            fotografia: "",
            precio: "20.00",
            peso: 200         
        },
        {
            idGalleta: "3",
            nombre: "Galleta 3",
            cantidad: 15,
            fotografia: "",
            precio: "20.00",
            peso: 200         
        },
        {
            idGalleta: "3",
            nombre: "Galleta 3",
            cantidad: 15,
            fotografia: "",
            precio: "20.00",
            peso: 200         
        },
        {
            idGalleta: "3",
            nombre: "Galleta 3",
            cantidad: 15,
            fotografia: "",
            precio: "20.00",
            peso: 200         
        },
        {
            idGalleta: "3",
            nombre: "Galleta 3",
            cantidad: 15,
            fotografia: "",
            precio: "20.00",
            peso: 200         
        },

    ];

    links = {
        "agregar":{
            "htmlFile": "html/inventario/galleta.html"
        },
        "ver":{
            "htmlFile": "html/inventario/inventario.html"
        },
        "invetario":{
            htmlFile: "invetario/inventario.html",
            jsFile: "inventario/script.js",
            cssFile: "invetario/styles.css",
        }
    };

    createCards();    
    
}

async function getData(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();                

        return data;
        
    } catch (error) {

        console.error(`Error en la solicitud: ${error.message}`);

        Swal.fire({
            icon: 'error',
            title: 'ERROR AL CARGAR LOS DATOS',
            text: 'Se intentará de nuevo',
            showConfirmButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                galletas = getGalletas();
            } else if (result.dismiss) {
                Swal.fire({
                    icon: 'info',
                    title: 'RECARGA LA PÁGINA',
                    showConfirmButton: false,        
                })
            }
        });

        throw error;     

    }
}

function createCards() {
    let cuerpo = "";
    let registro = "";
    let img = "";
    let classGCantidad = "";
    
    if (galletas.length !== undefined) {
        galletas.forEach(g => {

            if (g.fotografia === ""){
                img = "../../img/galleta.jpg";
            } else {
                img = "data:image/jpeg;base64," + g.fotografia ;
            }
            
            if (g.cantidad <= 10){
                classGCantidad = "baja";
            } else if (g.cantidad <= 20) {
                classGCantidad = "media";
            } else {
                classGCantidad = "alta";
            }

            registro = `<div class="card" ondblclick="controller.cargarGalleta('${g.idGalleta}')">
                            <div class="card-img">
                                <img src=${img} alt="galleta">
                            </div>
                            <div class="card-info">
                                <h4 class="text-uppercase">${g.nombre}</h4>
                                <span class="card-precio">
                                    <b>Precio: </b>
                                    <span>$${g.precio}</span>
                                </span>
                                <div class="stock">
                                    <span class="itemStock ${classGCantidad}">${g.cantidad}</span>
                                </div>
                            </div>
                        </div>`;

            cuerpo += registro;


        });

        document.getElementsByClassName("loader-div")[0].style.display = "none";

        document.getElementById("contenedor-g").innerHTML = cuerpo;
    } else {
        document.getElementById("btnAgregarGalleta").classList.add("d-none");
    }

}

export function cargarGalleta(id) {

    let galleta = galletas.find(g => g.idGalleta = id);

    loadContent("agregar","ver");

    setTimeout(()=>{
        document.getElementById("txtIdGalleta").value = galleta.idGalleta;
        document.getElementById("txtNombreGalleta").value = galleta.nombre;
        document.getElementById("txtDescripcionGalleta").value = galleta.descripcion;
        document.getElementById("txtPrecioGalleta").value = "$" + galleta.precio;
        document.getElementById("txtCantidadGalletas").innerHTML = galleta.cantidad;
        document.getElementById("txtPesoGalleta").value = galleta.peso;    

        if (galleta.fotografia === "") {
            const imgElemento = document.getElementById('fotografiaGalleta');
            imgElemento.src = "../../img/logo.png";
        } else {
            imgFotoGalleta = galleta.fotografia;
            // Mostrar la imagen en la etiqueta <img>
            const imgElemento = document.getElementById('fotografiaGalleta');
            imgElemento.src = 'data:image/jpeg;base64,' + imgFotoGalleta;
        }

        galletaCantidad = galleta.cantidad;

        cargarCrear();

    }, 500)

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

function alerta(icon,error) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: icon,
        title: error
    });
}

function manejarClicEnImagen() {
    // Obtener el input de tipo file o crear uno si no existe
    const inputImagen = document.getElementById('inputImagen') || crearInputImagen();

    // Limpiar cualquier selección anterior
    inputImagen.value = null;

    // Agregar un listener para el cambio en el input
    inputImagen.addEventListener('change', manejarCambioDeImagen);

    // Simular clic en el input para abrir el explorador de archivos
    inputImagen.click();
}


// Función para crear un input de tipo file si no existe
function crearInputImagen() {
    const inputImagen = document.createElement('input');
    inputImagen.type = 'file';
    inputImagen.accept = '.jpg, .jpeg, .png';
    inputImagen.id = 'inputImagen';
    inputImagen.style.display = 'none';
    document.body.appendChild(inputImagen);
    return inputImagen;
}

// Función para manejar el cambio en el input de la imagen
function manejarCambioDeImagen(event) {
    const input = event.target;
    const imagen = input.files[0];

    if (imagen) {
        // Leer la imagen como base64
        const lector = new FileReader();

        lector.onload = function (e) {
            // Guardar la imagen en la variable imgFotoGalleta (sin el prefijo)
            imgFotoGalleta = e.target.result.split(',')[1];

            // Mostrar la imagen en la etiqueta <img>
            const imgElemento = document.getElementById('fotografiaGalleta');
            imgElemento.src = 'data:image/jpeg;base64,' + imgFotoGalleta;

            // Remover el listener para evitar múltiples llamadas
            input.removeEventListener('change', manejarCambioDeImagen);
        };
        lector.readAsDataURL(imagen);
    }
}

function cargarCrear(){
    document.getElementById('txtCantidadGalletas').addEventListener('dblclick', function () {
        clics++;
        if (clics === 2) {
            toggleInputs();
        }
    });
    
    document.getElementById('txtCantidadGalletas').addEventListener('dblclick', function () {
        clics++;
        if (clics === 2) {
            toggleInputs();
        }
    });

    document.getElementById("btnDisminuir").addEventListener("click", function () {
        disminuirGalleta();
    });
    
    document.getElementById("guardarGalleta").addEventListener("click", function () {
        guardarGalleta();
    });
    
    document.getElementById("eliminarGalleta").addEventListener("click", function () {
        eliminarGalleta();
    });
    
    document.getElementById("fotografiaGalleta").addEventListener("click", function () {
        manejarClicEnImagen();
    });
    
}

function soloNumeros(event) {
    // Obtener el código de tecla presionada
    var charCode = event.which || event.keyCode;

    // Permitir solo números (códigos de tecla entre 48 y 57 son números)
    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
        return false;
    }

    // Permitir la tecla Enter (código 13)
    if (charCode === 13) {
        return true;
    }
}




function aumentarGalletas() {
    galletaCantidad++;
    document.getElementById("txtCantidadGalletas").innerHTML = galletaCantidad;

}

function disminuirGalleta() {
    if (galletaCantidad > 1)
        galletaCantidad--;
    document.getElementById("txtCantidadGalletas").innerHTML = galletaCantidad;
}

function toggleInputs() {
    const input1 = document.getElementById('txtCantidadGalletas');
    const input2 = document.getElementById('txtCantidadGalletas2');

    input1.classList.toggle('d-none');
    input2.classList.toggle('d-none');
    input2.value = galletaCantidad;
}

export function guardarNumero() {
    const input1 = document.getElementById('txtCantidadGalletas');
    const input2 = document.getElementById('txtCantidadGalletas2');

    galletaCantidad = input2.value;

    input1.classList.remove('d-none');
    input2.classList.add('d-none');

    document.getElementById("txtCantidadGalletas").innerHTML = galletaCantidad;
    clics = 0;
}

function detectarDobleClic() {
    clics++;
    if (clics === 2) {
        toggleInputs();
    }
}

function guardarGalleta() {
    if (validarDatos()) {
        let galleta = {
            "idGalleta": document.getElementById("txtIdGalleta").value,
            "cantidad": galletaCantidad,
            "nombre": document.getElementById("txtNombreGalleta").value,
            "descripcion": document.getElementById("txtDescripcionGalleta").value,
            "fotografia": imgFotoGalleta,
            "precio": parseFloat(document.getElementById("txtPrecioGalleta").value),
            "peso": parseFloat(document.getElementById("txtPesoGalleta").value)
        };

        if (document.getElementById("txtIdGalleta").value === "") {
            galleta.idGalleta = 0;
        }

        //Variable
        datos = {
            datosGalleta: JSON.stringify(galleta)
        };
        params = new URLSearchParams(datos);
        fetch("../../api/galleta/save?",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                    body: params
                })
                .then(response => {
                    return response.json();
                })
                .then(function (data) {
                    if (data.exception != null) {
                        console.log('Error interno del servidor. Intente nuevamente más tarde.');
                        return;
                    }

                    if (data.error) {
                        alert("algo ha ocurrido");
                    } else {
                        window.location = "inventario.html";
                    }
                });
    }
}

function eliminarGalleta() {

    let galleta = {
        "idGalleta": document.getElementById("txtIdGalleta").value,
        "cantidad": galletaCantidad,
        "nombre": document.getElementById("txtNombreGalleta").value,
        "descripcion": document.getElementById("txtDescripcionGalleta").value,
        "fotografia": document.getElementById("fotografiaGalleta").value
    };

    if (document.getElementById("txtIdGalleta").value === "") {
        galleta.idGalleta = 0;
    }

    //Variable
    datos = {
        datosGalleta: JSON.stringify(galleta)
    };
    params = new URLSearchParams(datos);
    fetch("../../api/galleta/delete?",
            {
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                body: params
            })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                if (data.exception != null) {
                    console.log('Error interno del servidor. Intente nuevamente más tarde.');
                    return;
                }

                if (data.error) {
                    alert("algo ha ocurrido");
                } else {
                    window.location = "inventario.html";
                }
            });
}




function validarDatos() {

    if (document.getElementById("txtNombreGalleta").value === "") {
        alerta("error","Ingresa el nombre de la galleta");
        return;
    }
    if (document.getElementById("txtPrecioGalleta").value === "") {
        alerta("error","Ingresa el precio de la galleta");
        return;
    }
    if (document.getElementById("txtDescripcionGalleta").value === "") {
        alerta("error","Ingresa la descripción de la galleta");
        return;
    }
    if (galletaCantidad === 0) {
        alerta("error","Ingresa la cantidad de las galleta");
        return;
    }
    return true;
}


