let materiaCantidad = 0;
let clics = 0;
let imgFotoMateria = "";

window.onload = function () {
    if (localStorage.getItem("materias") && localStorage.getItem("materia")) {
        cargarMateria(); // Llamar a la función getMaterias cuando la página se cargue
    }
};

function regresarMaterias() {
    window.location.href = "materias.html";
    localStorage.removeItem("materia");
    localStorage.removeItem("materias");
}

document.getElementById("btnAgregar").addEventListener("click", function () {
    aumentarMaterias();
});

document.getElementById("btnDisminuir").addEventListener("click", function () {
    disminuirMateria();
});

document.getElementById("guardarMateria").addEventListener("click", function () {
    guardarMateria();
});

document.getElementById("eliminarMateria").addEventListener("click", function () {
    eliminarMateria();
});

document.getElementById("fotografiaMateria").addEventListener("click", function () {
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
            // Guardar la imagen en la variable imgFotoMateria (sin el prefijo)
            imgFotoMateria = e.target.result.split(',')[1];

            // Mostrar la imagen en la etiqueta <img>
            const imgElemento = document.getElementById('fotografiaMateria');
            imgElemento.src = 'data:image/jpeg;base64,' + imgFotoMateria;

            // Remover el listener para evitar múltiples llamadas
            input.removeEventListener('change', manejarCambioDeImagen);
        };
        lector.readAsDataURL(imagen);
    }
}




document.getElementById('txtCantidadMaterias').addEventListener('dblclick', function () {
    clics++;
    if (clics === 2) {
        toggleInputs();
    }
});

document.getElementById('txtCantidadMaterias').addEventListener('dblclick', function () {
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




function aumentarMaterias() {
    materiaCantidad++;
    document.getElementById("txtCantidadMaterias").innerHTML = materiaCantidad;

}

function disminuirMateria() {
    if (materiaCantidad > 1)
        materiaCantidad--;
    document.getElementById("txtCantidadMaterias").innerHTML = materiaCantidad;
}

function toggleInputs() {
    const input1 = document.getElementById('txtCantidadMaterias');
    const input2 = document.getElementById('txtCantidadMaterias2');

    input1.classList.toggle('d-none');
    input2.classList.toggle('d-none');
    input2.value = materiaCantidad;
}

function guardarNumero() {
    const input1 = document.getElementById('txtCantidadMaterias');
    const input2 = document.getElementById('txtCantidadMaterias2');

    materiaCantidad = input2.value;

    input1.classList.remove('d-none');
    input2.classList.add('d-none');

    document.getElementById("txtCantidadMaterias").innerHTML = materiaCantidad;
    clics = 0;
}

function detectarDobleClic() {
    clics++;
    if (clics === 2) {
        toggleInputs();
    }
}


function cargarMateria() {
    let materias = JSON.parse(localStorage.getItem("materias"));
    let materia = localStorage.getItem("materia");
    
    document.getElementById("txtIdMateria").value = materias[materia].id;
    document.getElementById("txtNombreMateria").value = materias[materia].nombre;
    document.getElementById("txtPrecioMateria").value = materias[materia].precioUnitario;
    document.getElementById("txtCantidadMaterias").innerHTML = materias[materia].cantidad;
    
    let unidadMedida = materias[materia].unidadMedida;
    console.log(unidadMedida);
    document.getElementById("txtUnidadMedida").value = unidadMedida;

    document.getElementById("txtProveedorMateria").value = materias[materia].proveedor;

    let fechaCompra = materias[materia].fechaCompra;
    console.log(fechaCompra)
    if (fechaCompra) {
        document.getElementById("txtFechaCompra").value = fechaCompra;
    }
    
    if (materias[materia].fotografia === "") {
        const imgElemento = document.getElementById('fotografiaMateria');
        imgElemento.src = "../../img/logo.png";
    } else {
        imgFotoMateria = materias[materia].fotografia;
        // Mostrar la imagen en la etiqueta <img>
        const imgElemento = document.getElementById('fotografiaMateria');
        imgElemento.src = 'data:image/jpeg;base64,' + imgFotoMateria;
    }
    materiaCantidad = materias[materia].cantidad;

}


function guardarMateria() {
    if (validarDatos()) {
        let idMateriaString = document.getElementById("txtIdMateria").value;
        let idMateria = idMateriaString !== "" ? parseInt(idMateriaString) : 0;

        let materia = {
            "id": idMateria,
            "cantidad": materiaCantidad,
            "nombre": document.getElementById("txtNombreMateria").value,
            "unidadMedida": document.getElementById("txtUnidadMedida").value,
            "proveedor": document.getElementById("txtProveedorMateria").value,
            "precioUnitario": document.getElementById("txtPrecioMateria").value,
            "fechaCompra": document.getElementById("txtFechaCompra").value,
            "fotografia": imgFotoMateria,
            "precio": parseFloat(document.getElementById("txtPrecioMateria").value)
        };
       
        console.log(materia);
        //Variable
        datos = {
            datosMateria: JSON.stringify(materia)
        };
        
        console.log(datos);
        params = new URLSearchParams(datos);
        fetch("../../api/materia/save?",
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
                        window.location = "materias.html";
                    }
                });
    }
}

function eliminarMateria() {

     let idMateriaString = document.getElementById("txtIdMateria").value;
     let idMateria = idMateriaString !== "" ? parseInt(idMateriaString) : 0;

     let materia = {
            "id": idMateria,
            "cantidad": materiaCantidad,
            "nombre": document.getElementById("txtNombreMateria").value,
            "unidadMedida": document.getElementById("txtUnidadMedida").value,
            "proveedor": document.getElementById("txtProveedorMateria").value,
            "precioUnitario": document.getElementById("txtPrecioMateria").value,
            "fechaCompra": document.getElementById("txtFechaCompra").value,
            "fotografia": imgFotoMateria,
            "precio": parseFloat(document.getElementById("txtPrecioMateria").value)
        };
       

    //Variable
    datos = {
        datosMateria: JSON.stringify(materia)
    };
    params = new URLSearchParams(datos);
    fetch("../../api/materia/delete?",
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
                    window.location = "materias.html";
                }
            });
}




function validarDatos() {
    
    if (document.getElementById("txtFechaCompra").value === "") {
        alerta("error","Ingresa la fecha de la compra de la materia");
        return;
    }

    if (document.getElementById("txtNombreMateria").value === "") {
        alerta("error","Ingresa el nombre de la materia");
        return;
    }
    
    
    if (document.getElementById("txtProveedorMateria").value === "") {
        alerta("error","Ingresa el proveedor de la materia");
        return;
    }
    
    if (document.getElementById("txtPrecioMateria").value === "") {
        alerta("error","Ingresa el precio de la materia");
        return;
    }
    if (materiaCantidad === 0) {
        alerta("error","Ingresa la cantidad de las materia");
        return;
    }
    if (document.getElementById("txtUnidadMedida").value === "") {
        alerta("error","Ingresa la medida de la materia");
        return;
    }
    return true;
}

function alerta(icon, error) {
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