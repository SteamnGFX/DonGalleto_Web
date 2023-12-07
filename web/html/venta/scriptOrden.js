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
                    '<p> $  ' + galleta.precio + '</p>' +
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

function actualizarOrdenGalletas() {
    let cuerpo = "";
    let registro = ""; 
    let tipoGalleta = ""; //trabajando

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
                    '<br><b> Cantidad: </b> ' + galleta.cantidad + ' <br>' +
                    'Gramos: ' + galleta.gramos + '<br><i class="fa-solid fa-trash" style="color:red; cursor:pointer;" onclick="eliminarGalleta(' + galleta.galleta.idGalleta + ')"></i> </p>';
            cuerpo += registro;

        } else if (galleta.tipo === 3) {
            tipoGalleta = "Peso Dinero";
            registro =
                    '<p>' + galleta.galleta.nombre + '<br><b> Tipo: </b>' + tipoGalleta + '  ' +
                    '<br><b> Cantidad: </b> ' + galleta.pesoDinero + ' <br><i class="fa-solid fa-trash" style="color:red; cursor:pointer;" onclick="eliminarGalleta(' + galleta.galleta.idGalleta + ')"></i></p>';
            cuerpo += registro;

        } else if (galleta.tipo === 4) {
            tipoGalleta = "Caja";
            let tipoCaja = "";
            if (galleta.cantidad === 6) {
                tipoCaja = "Media Docena";
            } else if (galleta.cantidad === 12) {
                tipoCaja = "Docena";
            }
            registro =
                    '<p>' + galleta.galleta.nombre +
                    '<br><b> Cantidad: </b> ' + galleta.cantidad + ' <br>' +
                    'Tipo de Caja: ' + tipoCaja + '<br><i class="fa-solid fa-trash" style="color:red; cursor:pointer;" onclick="eliminarGalleta(' + galleta.galleta.idGalleta + ')"></i> </p>';
            cuerpo += registro;

        }

    });

    document.getElementById("ordenLista").innerHTML = cuerpo;

    var ordenLista = document.getElementById('ordenLista');
    var flechainf = document.getElementById('flechainf');

    if (ordenLista.offsetHeight > 450) {
        flechainf.classList.remove('d-none');
    }
    calcularPrecio();
}



function iniciarCobro() {
    if (ordenGalletas.length === 0) {
        alerta("error", "¡No hay orden que cobrar!");
    } else {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn-success",
                cancelButton: "btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "¿Estas seguro?",
            text: "Estás por terminar la venta!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Terminar venta!",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                cobrar();
            } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                    ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelada",
                    text: "Tu venta se ha cancelado.",
                    icon: "error",
                    confirmButtonText: "ACEPTAR",
                });
            }
        });
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
                    alerta("error", 'Error interno del servidor. Intente nuevamente más tarde.');
                    return;
                }

                if (data.error) {
                    alerta("error", "algo ha ocurrido");
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
    document.getElementById("txtTotalVenta").innerHTML = "0.0";
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
            const swalContent = document.createElement('div');
            swalContent.innerHTML = `
            <label for="swal-input1">Cantidad de venta</label>
            <br>
            <input type="text" id="swal-input1" style="width: 70%; margin-top: 2%;" maxlength="10" autocapitalize="off" autocorrect="off" onkeypress="return soloNumeros(event)" placeholder="Cantidad de piezas.">
            `;
            const {value: cantidad} = await Swal.fire({
                title: "VENTA POR PIEZAS",
                html: swalContent,
                confirmButtonText: "ACEPTAR",
                preConfirm: () => {
                    const input = document.getElementById('swal-input1');
                    const cantidad = input.value;

                    if (cantidad) {
                        if (cantidad > cantidadGalletaSeleccionada) {
                            alerta("error", "No hay galletas suficientes");
                            return false;
                        } else {
                            orden.cantidad = cantidad;
                            ordenGalletas.push(orden);
                            actualizarStockGalletas(orden.galleta.idGalleta, cantidad);
                            // Actualizar la ordenGalletas original con la cantidad ingresada
                            actualizarOrdenGalletas();
                            return true;
                        }
                    } else {
                        alerta("error", "Ingresar una cantidad de galletas");
                        return false;
                    }
                }
            });
        })();
    }
    if (idTipoVenta === 2) {
        (async () => {
            const swalContent = document.createElement('div');
            swalContent.innerHTML = `
            <label for="swal-input1">Cantidad de venta</label>
            <br>
            <input type="text" id="swal-input1" style="width: 70%;margin-top: 2%;" maxlength="10" autocapitalize="off" autocorrect="off" onkeypress="return soloNumeros(event)" placeholder="Cantidad de gramos.">
        `;

            const {value: cantidad} = await Swal.fire({
                title: "INGRESE LA CANTIDAD",
                html: swalContent,
                confirmButtonText: "ACEPTAR",
                preConfirm: () => {
                    const input = document.getElementById('swal-input1');
                    const cantidad = input.value;


                    let cantidadGramoGalleta = cantidadGalletaSeleccionada * peso;

                    if (cantidad > cantidadGramoGalleta) {
                        alerta("error", "No hay galletas suficientes");
                        return false;
                    }


                    if (cantidad === "") {
                        alerta("error", "Ingresar una cantidad de gramos!");
                        return false;
                    }

                    let galleta = galletas.find(g => g.idGalleta === orden.galleta.idGalleta);
                    let gramosVendidas = cantidad / galleta.peso;
                    let galletasVendidas = Math.ceil(gramosVendidas);
                    
                    orden.gramos = cantidad;  

                    orden.cantidad = galletasVendidas;
                    ordenGalletas.push(orden);
                    actualizarStockGalletasGramo(orden.galleta.idGalleta, cantidad);
                    actualizarOrdenGalletas();

                    return true;
                }
            });
        })();
    }
    if (idTipoVenta === 3) {
        (async () => {
            const swalContent = document.createElement('div');
            swalContent.innerHTML = `
            <label for="swal-input1">Cantidad de peso de dinero</label>
            <br>
            <input type="text" id="swal-input1" style="width: 70%; margin-top: 2%;" maxlength="10" autocapitalize="off" autocorrect="off" onkeypress="return soloNumeros(event)" placeholder="Cantidad de dinero.">
            `;
            const {value: cantidad} = await Swal.fire({
                title: "VENTA POR PESO DE DINERO",
                html: swalContent,
                confirmButtonText: "ACEPTAR",
                preConfirm: () => {
                    const input = document.getElementById('swal-input1');
                    const cantidad = input.value;

                    if (cantidad) {
                        if (cantidad > cantidadGalletaSeleccionada) {
                            alerta("error", "No hay galletas suficientes");
                            return false;
                        } else {
                            orden.cantidad = cantidad / orden.galleta.precio;
                            orden.pesoDinero = cantidad / orden.galleta.precio;
                            ordenGalletas.push(orden);
                            actualizarStockGalletas(orden.galleta.idGalleta, cantidad / orden.galleta.precio);
                            //Actualizar la ordenGalletas original con la cantidad ingresada
                            actualizarOrdenGalletas();
                            return true;
                        }
                    } else {
                        alerta("error", "Ingresar una cantidad de galletas");
                        return false;
                    }
                }
            });
        })();
    }

    if (idTipoVenta === 4) {
        (async () => {
            const swalContent = document.createElement('div');
            swalContent.innerHTML = `
            <label for="swal-input1">Cantidad de venta</label>
            <br>
            <select id="swal-input1" style="width: 70%; margin-top: 2%; height: 40px; border-radius: 10px; text-indent: 10px;">
                <option value="12">Docena</option>
                <option value="6">Media Docena</option>
            </select>
            `;
            const {value: cantidad} = await Swal.fire({
                title: "INGRESE LA CANTIDAD",
                html: swalContent,
                confirmButtonText: "ACEPTAR",
                preConfirm: () => {
                    const input = document.getElementById('swal-input1');
                    const cantidad = parseInt(input.value);

                    if (cantidad) {
                        if (cantidad > cantidadGalletaSeleccionada) {
                            alerta("error", "No hay galletas suficientes");
                            return false;
                        } else {
                            orden.cantidad = cantidad;
                            ordenGalletas.push(orden);
                            actualizarStockGalletas(orden.galleta.idGalleta, cantidad);
                            actualizarOrdenGalletas();
                            return true;
                        }
                    } else {
                        alerta("error", "Ingresar una cantidad de galletas");
                        return false;
                    }
                }
            });
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

    createDivsFromGalletas(galletas);

    let index = ordenGalletas.find(g => g.galletaidGalleta === idGalleta);


    if (index !== -1) {
        ordenGalletas.splice(index, 1);
        actualizarOrdenGalletas();
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

function calcularPrecio() {
    let total = "";
    ordenGalletas.forEach(function (galleta) {
        let precio = galleta.galleta.precio;
        let cantidad = galleta.cantidad;
        let subTotal = precio * cantidad;

        total = parseFloat(document.getElementById("txtTotalVenta").textContent);

        total += subTotal;

    });
    document.getElementById("txtTotalVenta").innerHTML = total;
}
