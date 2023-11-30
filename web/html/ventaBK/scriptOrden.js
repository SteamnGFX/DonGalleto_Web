getGalletas();
let ordenGalletas = [];
let galletas = "";

function getGalletas() {
    fetch("../../api/galleta/getAll?",
            {
                method: "GET",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                createDivsFromGalletas(data);
                galletas = data;
            });
}

function createDivsFromGalletas(galletas) {
    let cuerpo = "";
    let registro = "";
    let img = "";
    let claseGalletaCantidad = "";

    if (galletas.length !== undefined) {
        galletas.forEach(function (galleta, index) {
            // Verifica si es la primera galleta del nuevo contenedor
            if (index % 3 === 0) {
                // Si es la primera galleta del nuevo contenedor, cierra el contenedor anterior
                if (index !== 0) {
                    cuerpo += '</div>';
                }

                // Abre un nuevo contenedor-inventario
                cuerpo += '<div class="contenedor-orden">';
            }

            if (galleta.fotografia === "") {
                img = "../../img/icono.png";
            } else {
                img = "data:image/jpeg;base64," + galleta.fotografia;
            }

            if (galleta.cantidad <= 10) {
                claseGalletaCantidad = "baja";
            } else if (galleta.cantidad <= 20) {
                claseGalletaCantidad = "media";
            } else {
                claseGalletaCantidad = "alta";
            }

            registro =
                    ' <div class="card-galleta" onclick="agregarGalletaOrden(' + galleta.idGalleta + ')"> <img class="inventarioGalleta" src="' + img + '  " alt="galleta" style="aspect-ratio: 1 / 1; width: 192px; height: 192px"><p>' + galleta.nombre + '</p></div>';
            cuerpo += registro;

            // Verifica si es la última galleta del arreglo
            if (index === galletas.length - 1) {
                cuerpo += '</div>';
            }
        });
        document.getElementById("galletas-orden").innerHTML = cuerpo;
    } else {
        document.getElementById("btnAgregarGalleta").classList.add("d-none");
    }
}

document.getElementById("btnRegresar").addEventListener("click", function () {
    window.location.href = "venta.html";
    eliminarCache();
});

document.getElementById("btnCobrar").addEventListener("click", function () {
    cobrar();
});

function agregarGalletaOrden(idGalleta) {
    let galletaSeleccionda = galletas.find(galleta => galleta.idGalleta === idGalleta);


    ordenGalletas.push(galletaSeleccionda);
    console.log(ordenGalletas);
    actualizarOrdenGalletas(ordenGalletas);
}

function actualizarOrdenGalletas() {
    let cuerpo = "";
    let registro = "";
    ordenGalletas.forEach(function (galleta) {
        registro =
            '<p>' + galleta.nombre + '<span style="font-style:bold;"><b> Tipo</b></span>: ' +
            '<span style="color: black;"><b> Cantidad</b></span>: ' + ' </p>';
        cuerpo += registro;
    });

    document.getElementById("ordenLista").innerHTML = cuerpo;
}



function cobrar() {
    let respuesta = confirm("¿Deseas terminar la orden y cobrar?");
    if (respuesta) {
        alert("TOTAL: 1000 MXN.");

        vaciarCarrito();
    } else {
        alert("Se ha cancelado la venta");
    }
}

function    vaciarCarrito() {
    ordenGalletas = [];
    document.getElementById("ordenLista").innerHTML = '<p style="text-align: center; color:gray; font-style: italic;">Seleccione alguna galleta para iniciar la orden.</p>';
}

function flecha(){
    
}