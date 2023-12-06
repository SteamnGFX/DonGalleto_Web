/* global Swal */

getGalletas();
let ordenGalletas = [];
let galletas = "";
let tipoVenta = [
    {
        "idVenta": 1,
        "tipo": "Pieza"
    },
    {
        "idVenta": 2,
        "tipo": "Gramo"
    },
    {
        "idVenta": 3,
        "tipo": "Peso dinero"
    },
    {
        "idVenta": 4,
        "tipo": "Caja"
    }
];

getGalletas();

function getGalletas() {
    fetch("../../api/galleta/getAll?",
            {
                method: "GET",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
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
    let clase = "";
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

            if (galleta.cantidad === 0) {
                clase = "d-none";
            } else {
                clase = "";
            }

            if (galleta.cantidad <= 10) {
                claseGalletaCantidad = "baja";
            } else if (galleta.cantidad <= 20) {
                claseGalletaCantidad = "media";
            } else {
                claseGalletaCantidad = "alta";
            }


            registro = '<div class="card-galleta ' + clase + '" onclick="agregarGalletaOrden(' + galleta.idGalleta + ')">' +
                    '<img class="inventarioGalleta" src="' + img + '" alt="galleta">' +
                    '<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; margin: 5px;">' +
                    '<div class="' + claseGalletaCantidad + '">' +
                    '<p style="font-weight: 700;">' + galleta.cantidad + '</p>' +
                    '</div>' +
                    '<p>' + galleta.nombre + '</p>' +
                    '</div>' +
                    '</div>';
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
    window.location.href = "../../inicio.html";
    eliminarCache();
});

document.getElementById("btnCobrar").addEventListener("click", function () {
    iniciarCobro();
});

function agregarGalletaOrden(idGalleta) {
    galletaClick(idGalleta);
}

function actualizarOrdenGalletas(gramos) {
    let cuerpo = "";
    let registro = "";
    let tipoGalleta = "";



    ordenGalletas.forEach(function (galleta) {
        if (galleta.tipo === 1) {
            tipoGalleta = "Pieza";
            registro =
                '<p>' + galleta.galleta.nombre + '<br><b> Tipo: </b>' + tipoGalleta + '  ' +
                '<br><b> Cantidad: </b> ' + galleta.cantidad + ' <br><i class="fa-solid fa-trash" style="color:red; cursor:pointer;" onclick="eliminarGalleta(' + galleta.galleta.idGalleta + ')"></i></p>';
        cuerpo += registro;
        } else if (galleta.tipo === 2) {
            
            tipoGalleta = "Gramo";
            registro =
                '<p>' + galleta.galleta.nombre + '<br><b> Tipo: </b>' + tipoGalleta + '  ' +
                '<br><b> Cantidad: </b> ' + galleta.cantidad + ' <br>'+
                'Gramos: ' + gramos + '<br><i class="fa-solid fa-trash" style="color:red; cursor:pointer;" onclick="eliminarGalleta(' + galleta.galleta.idGalleta + ')"></i> </p>';
        cuerpo += registro;

        } else if (galleta.tipo === 3) {
            tipoGalleta = "Peso Dinero";

        } else if (galleta.tipo === 4) {
            tipoGalleta = "Caja";

        }

    });

    document.getElementById("ordenLista").innerHTML = cuerpo;

    var ordenLista = document.getElementById('ordenLista');
    var flechainf = document.getElementById('flechainf');

    if (ordenLista.offsetHeight > 450) {
        flechainf.classList.remove('d-none');
    }
}



function iniciarCobro() {
    if (ordenGalletas.length === 0) {
        alerta("error", "¡No hay orden que cobrar!");
    } else {
        cobrar();
    }
}

function cobrar() {
    //Variable
    datos = {
        datosVenta: JSON.stringify(ordenGalletas)
    };

    params = new URLSearchParams(datos);
    fetch("../../api/venta/save?",
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
                }

                if (data.success) {
                    alerta("success", "Venta realizada correctamente");
                    vaciarCarrito();
                    getGalletas();
                }
            });
}

function vaciarCarrito() {
    ordenGalletas = [];
    document.getElementById("ordenLista").innerHTML = '<p style="text-align: center; color:gray; font-style: italic;">Seleccione alguna galleta para iniciar la orden.</p>';
}

function flecha() {

}

const cardGalleta = document.querySelector('.card-galleta');
const contenedorVenta = document.querySelector('.contenedor-venta');

function mostrarContenedorVenta() {
    contenedorVenta.style.display = "flex";
    contenedorVenta.classList.remove('oculto');
}

const cerrarVentaIcon = document.querySelector('.cerrar-venta');

function ocultarContenedorVenta() {
    contenedorVenta.style.display = "none";
    contenedorVenta.classList.add('oculto');
    document.body.style.backgroundColor = '';
    ocultarInput();
}

cerrarVentaIcon.addEventListener('click', ocultarContenedorVenta);
cardGalleta.addEventListener('click', mostrarContenedorVenta);

document.getElementById("btnUnidad").addEventListener("click", function () {
    mostrarInput();
});

document.getElementById("btnGramo").addEventListener("click", function () {
    mostrarInput();
});

document.getElementById("btnPaquete").addEventListener("click", function () {
    mostrarInput();
});


document.getElementById("btnVenta").addEventListener("click", function () {
    venta();
});

function venta() {
    if (document.getElementById("txtCantidadVenta").value === "") {
        alert("ingresa una cantidad!");
    } else {
        window.location = "orden.html";
    }
}

function mostrarInput() {
    document.getElementById("btnVenta").classList.remove("d-none");

    document.getElementById("btnUnidad").classList.add("d-none");
    document.getElementById("btnGramo").classList.add("d-none");
    document.getElementById("btnPaquete").classList.add("d-none");
    document.getElementById("txtCantidadVenta").classList.remove("d-none");
    document.getElementById("btnVenta").classList.add("btn");
    document.getElementById("btnVenta").classList.add("aceptar");
}

function ocultarInput() {
    document.getElementById("btnVenta").classList.add("d-none");

    document.getElementById("btnUnidad").classList.remove("d-none");
    document.getElementById("btnGramo").classList.remove("d-none");
    document.getElementById("btnPaquete").classList.remove("d-none");
    document.getElementById("txtCantidadVenta").classList.add("d-none");
    document.getElementById("btnVenta").classList.remove("btn");
    document.getElementById("btnVenta").classList.remove("aceptar");
}

function galletaClick(idGalleta) {
    (async () => {
        const {value: formValues} = await Swal.fire({
            title: "TIPO DE VENTA",
            html: `
                <button class="swal2-confirm btnPieza" id="btnUnidad" onclick="manejadorGalletas(` + idGalleta + `,` + 1 + `)"><span>Pieza</span></button>
                <button class="swal2-confirm btnPieza" id="btnCantidad" onclick="manejadorGalletas(` + idGalleta + `,` + 2 + `)"><span>Gramo</span></button>
                <button class="swal2-confirm btnPieza" id="btnGramo" onclick="manejadorGalletas(` + idGalleta + `,` + 3 + `)"><span>Peso de dinero</span></button>
                <button class="swal2-confirm btnPieza" id="btnCaja" onclick="manejadorGalletas(` + idGalleta + `,` + 4 + `)"><span>Cajas</span></button>
            `,
            showConfirmButton: false
        });
    })();
}


function manejadorGalletas(idGalleta, idTipoVenta) {
    let galletaSeleccionada = galletas.find(galleta => galleta.idGalleta === idGalleta);
    let ventaSeleccionada = tipoVenta.find(venta => venta.idVenta === idTipoVenta);

    if (!galletaSeleccionada || !ventaSeleccionada) {
        // Manejar el caso cuando no se encuentra la galleta o la venta
        alerta("error", "No se encontró la galleta o el tipo de venta");
        return;
    }

    let cantidadGalletaSeleccionada = galletaSeleccionada.cantidad;

    if (cantidadGalletaSeleccionada <= 0) {
        // Manejar el caso cuando no hay galletas disponibles
        alerta("error", "No hay galletas disponibles");
        return;
    }

    // Crear un objeto de orden de galletas
    let nuevaOrden = {
        idVenta: ventaSeleccionada.idVenta,
        galleta: {
            idGalleta: galletaSeleccionada.idGalleta,
            nombre: galletaSeleccionada.nombre,
            precio: galletaSeleccionada.precio
        },
        cantidad: 0, // Se actualizará después en seleccionarCantidad
        tipo: ventaSeleccionada.idVenta,
        fechaVenta: new Date().toISOString() // Obtener la fecha actual en formato ISO
    };

    seleccionarCantidad(nuevaOrden, cantidadGalletaSeleccionada, idTipoVenta, galletaSeleccionada.peso);
}

function seleccionarCantidad(orden, cantidadGalletaSeleccionada, idTipoVenta, peso) {
    if (idTipoVenta === 1) {
        (async () => {
            const {value: cantidad} = await Swal.fire({
                title: "INGRESE LA CANTIDAD",
                input: "text",
                inputLabel: "Cantidad de venta",
                inputPlaceholder: "100",
                inputAttributes: {
                    maxlength: "10",
                    autocapitalize: "off",
                    autocorrect: "off"
                }
            });

            if (cantidad) {
                if (cantidad > cantidadGalletaSeleccionada) {
                    alerta("error", "No hay galletas suficientes");
                } else {
                    orden.cantidad = cantidad;
                    ordenGalletas.push(orden);
                    actualizarStockGalletas(orden.galleta.idGalleta, cantidad);
                    // Actualizar la ordenGalletas original con la cantidad ingresada
                    actualizarOrdenGalletas();
                }
            }
        })();
    }
    if (idTipoVenta === 2) {
        (async () => {
            const {value: cantidad} = await Swal.fire({
                title: "INGRESE LA CANTIDAD",
                input: "text",
                inputLabel: "Cantidad de venta",
                inputPlaceholder: "100",
                inputAttributes: {
                    maxlength: "10",
                    autocapitalize: "off",
                    autocorrect: "off"
                }
            });

            if (cantidad) {
                let cantidadGramoGalleta = cantidadGalletaSeleccionada * peso;
                if (cantidad > cantidadGramoGalleta) {
                    alerta("error", "No hay galletas suficientes");
                } else {
                    let galleta = galletas.find(g => g.idGalleta === orden.galleta.idGalleta);

                    let gramosVendidas = cantidad / galleta.peso;
                    let galletasVendidas = Math.ceil(gramosVendidas);

                    orden.cantidad = galletasVendidas;
                    ordenGalletas.push(orden);
                    actualizarStockGalletasGramo(orden.galleta.idGalleta, cantidad);
                    // Actualizar la ordenGalletas original con la cantidad ingresada
                    actualizarOrdenGalletas(gramosVendidas*10);
                }
            }
        })();
    }
}

function actualizarStockGalletas(idGalleta, cantidadVendida) {
    let galleta = galletas.find(g => g.idGalleta === idGalleta);


    if (galleta) {
        galleta.cantidad -= cantidadVendida;
    }

    createDivsFromGalletas(galletas);
}

function actualizarStockGalletasGramo(idGalleta, cantidadVendidaGramos) {
    let galleta = galletas.find(g => g.idGalleta === idGalleta);

    let gramosVendidas = cantidadVendidaGramos / galleta.peso;
    let galletasVendidas = Math.ceil(gramosVendidas);

    if (galleta) {
        galleta.cantidad -= galletasVendidas;
    }

    createDivsFromGalletas(galletas);
}

function eliminarGalleta(idGalleta) {
    let ordenGalletasFind = ordenGalletas.find(g => g.galleta.idGalleta === idGalleta);
    let galleta = galletas.find(g => g.idGalleta === idGalleta);

    let galletaCantidad = ordenGalletasFind.cantidad;
    let anteriorGalletas = galleta.cantidad;
    
    galleta.cantidad = parseFloat(galletaCantidad) + parseFloat(anteriorGalletas);

    console.log(galletaCantidad);
    createDivsFromGalletas(galletas);

    let index = ordenGalletas.find(g => g.galletaidGalleta === idGalleta);


    if (index !== -1) {
        ordenGalletas.splice(index, 1);
        actualizarOrdenGalletas();
        console.log(ordenGalletas);
    }
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