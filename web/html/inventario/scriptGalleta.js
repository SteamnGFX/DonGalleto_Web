/* global Swal */

let galletaCantidad = 0;
let clics = 0;
let imgFotoGalleta = "";

window.onload = function () {
    if (localStorage.getItem("galletas") && localStorage.getItem("galleta")) {
        cargarGalleta(); // Llamar a la función getGalletas cuando la página se cargue
    }
};

function regresarInventario() {
    window.location.href = "inventario.html";
    localStorage.removeItem("galleta");
    localStorage.removeItem("galletas");
}

document.getElementById("btnAgregar").addEventListener("click", function () {
    aumentarGalletas();
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

function guardarNumero() {
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


function cargarGalleta() {
    let galletas = JSON.parse(localStorage.getItem("galletas"));
    let galleta = localStorage.getItem("galleta");

    document.getElementById("txtIdGalleta").value = galletas[galleta].idGalleta;
    document.getElementById("txtNombreGalleta").value = galletas[galleta].nombre;
    document.getElementById("txtDescripcionGalleta").value = galletas[galleta].descripcion;
    document.getElementById("txtPrecioGalleta").value = galletas[galleta].precio;
    document.getElementById("txtCantidadGalletas").innerHTML = galletas[galleta].cantidad;


    if (galletas[galleta].fotografia === "") {
        const imgElemento = document.getElementById('fotografiaGalleta');
        imgElemento.src = "../../img/logo.png";
    } else {
        imgFotoGalleta = galletas[galleta].fotografia;
        // Mostrar la imagen en la etiqueta <img>
        const imgElemento = document.getElementById('fotografiaGalleta');
        imgElemento.src = 'data:image/jpeg;base64,' + imgFotoGalleta;
    }
    galletaCantidad = galletas[galleta].cantidad;

}


function guardarGalleta() {
    if (validarDatos()) {
        let galleta = {
            "idGalleta": document.getElementById("txtIdGalleta").value,
            "cantidad": galletaCantidad,
            "nombre": document.getElementById("txtNombreGalleta").value,
            "descripcion": document.getElementById("txtDescripcionGalleta").value,
            "fotografia": imgFotoGalleta,
            "precio": parseFloat(document.getElementById("txtPrecioGalleta").value)
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