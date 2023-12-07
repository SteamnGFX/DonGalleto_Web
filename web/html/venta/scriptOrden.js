let tipoVenta = [];
let galletas = [];
let ordenGalletas = [];

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

export function inicializar(){    

    let url = "api/galleta/getAll";
    
    getData(url)
    .then(data => {
        galletas = data;
        createCards();
    })
    .catch(error => {
        console.error("Error al obtener los datos:", error.message);
    });

    tipoVenta = [
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

    // galletas = [
    //     {
    //         idGalleta: "1",
    //         nombre: "Galleta 1",
    //         cantidad: 25,
    //         fotografia: "",
    //         precio: "20.00",
    //         peso: 200         
    //     },
    //     {
    //         idGalleta: "2",
    //         nombre: "Galleta 2",
    //         cantidad: 10,
    //         fotografia: "",
    //         precio: "20.00",
    //         peso: 200         
    //     },
    //     {
    //         idGalleta: "3",
    //         nombre: "Galleta 3",
    //         cantidad: 15,
    //         fotografia: "",
    //         precio: "20.00",
    //         peso: 200         
    //     }
    // ];

    document.getElementsByClassName("total")[0].style.display = "none";
    document.getElementById("btnCobrar").disabled = true;

    document.getElementById("btnCobrar").addEventListener("click", () => {
        iniciarCobro();
    });

    createCards();
}

function createCards() {

    let contenedor =  document.getElementById("contenedor-g");
    let cuerpo = "";

    if (galletas.length !== undefined) {     
        cuerpo = "";
        let registro = "";
        let img = "";    
        let classGCantidad = "";

        galletas.forEach( (g, index) => {

            if (g.cantidad === 0) {                          
                return;
            }

            if (g.fotografia != "") {
                img = "data:image/jpeg;base64," + g.fotografia;
            } else {
                img = "../../img/galleta.jpg";
            }
                        
            if (g.cantidad <= 10) {
                classGCantidad = "baja";                
            } else if (g.cantidad <= 20) {
                classGCantidad = "media";
            } else {
                classGCantidad = "alta";
            }

            registro = `<div class="card" ondblclick="controller.agregarGalletaOrden('${g.idGalleta}')">
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
                                <div class="btns">
                                    <button type="button" class="btn btn-success btnAgregar" onclick="controller.agregarGalletaOrden('${g.idGalleta}')">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>                                    
                                </div>
                            </div>
                        </div>`;                          


            cuerpo += registro;

        });

        contenedor.style.placeItems = "";
        contenedor.style.justifyItems = "";

        contenedor.innerHTML = cuerpo;

        if (cuerpo == "") {        

            let notFound = "<h2 class='prNotFound'>NO HAY PRODUCTOS</h2>"
    
            contenedor.style.placeItems = "Center";
            contenedor.style.justifyItems = "Center";
    
            contenedor.innerHTML = notFound;
        }

    }
}

export function agregarGalletaOrden(idGalleta) {
    (async () => {
        const {value: formValues} = await Swal.fire({
            title: "TIPO DE VENTA",
            html: `
                <button class="swal2-confirm btnPieza" id="btnUnidad" onclick="controller.manejadorGalletas('${idGalleta}', 1)"><span>Pieza</span></button>
                <button class="swal2-confirm btnPieza" id="btnCantidad" onclick="controller.manejadorGalletas('${idGalleta}', 2)"><span>Gramo</span></button>
                <button class="swal2-confirm btnPieza" id="btnGramo" onclick="controller.manejadorGalletas('${idGalleta}', 3)"><span>Peso de dinero</span></button>
                <button class="swal2-confirm btnPieza" id="btnCaja" onclick="controller.manejadorGalletas('${idGalleta}', 4)"><span>Cajas</span></button>
            `,
            showConfirmButton: false
        });
    })();
}

export function manejadorGalletas(...datosGalleta) {

    let galletaSeleccionada = galletas.find(galleta => galleta.idGalleta === datosGalleta[0]);
    let ventaSeleccionada = tipoVenta.find(venta => venta.idVenta === datosGalleta[1]);

    if (!galletaSeleccionada || !ventaSeleccionada) {    
        alerta('error',"No se encontró la galleta o el tipo de venta")    
        return;
    }

    let cantidadGalletaSeleccionada = galletaSeleccionada.cantidad;

    if (cantidadGalletaSeleccionada <= 0) {    
        alerta('error',"No hay galletas disponibles")        
        return;
    }

    // Crear un objeto de orden de galletas
    let nuevaOrden = {
        idVenta: 0,
        galleta: {
            idGalleta: galletaSeleccionada.idGalleta,
            nombre: galletaSeleccionada.nombre,
            precio: galletaSeleccionada.precio
        },
        cantidad: 0,
        tipo: ventaSeleccionada.idVenta,
        total: 0,
        fechaVenta: new Date().toISOString() // Obtener la fecha actual en formato ISO
    };

    seleccionarCantidad(nuevaOrden, cantidadGalletaSeleccionada, datosGalleta[1], galletaSeleccionada.peso);
}

async function ventanaCantidad(titulo, label, placeholder, preConfirmCallback){

    const swalContent = document.createElement('div');

    if (placeholder != "caja") {
        swalContent.innerHTML = `
            <label for="swal-input1">${label}</label>
            <br>
            <input type="text" id="swal-input1" style="width: 70%; margin-top: 2%;" maxlength="10" autocapitalize="off" autocorrect="off" onkeypress="return controller.soloNumeros(event)" placeholder="Ingresa la cantidad">
        `;
    } else {      
        swalContent.innerHTML = `
            <label for="swal-input1">${label}</label>
            <br>
            <select id="swal-input1" style="width: 70%; margin-top: 2%; height: 40px; border-radius: 10px; text-indent: 10px;">
                <option value="12">Docena</option>
                <option value="6">Media Docena</option>
            </select>
        `;
    }

    const {value: cantidad} = await Swal.fire({
        title: titulo,
        html: swalContent,
        confirmButtonText: "ACEPTAR",
        preConfirm: preConfirmCallback
    });          
    
    return cantidad
}

async function ventaPorPiezas(...datos){

    const cantidad = await ventanaCantidad("VENTA POR PIEZAS","Cantidad de venta","Cantidad de piezas", ()=>{
        const input = document.getElementById('swal-input1');
        const cantidad = parseInt(input.value);
        
        if (cantidad) {

            let cantidadGalletaSeleccionada = datos[1];

            if (cantidad > cantidadGalletaSeleccionada) {
                alerta('error',"No hay galletas suficientes")   
                return false;
            } else {                                        
                let orden = datos[0];            
               
                orden.cantidad = cantidad;
                orden.total = orden.galleta.precio * cantidad;
                let gExist = ordenGalletas.find((g) => g.galleta.idGalleta === orden.galleta.idGalleta && g.tipo === orden.tipo);

                if (gExist) {
                    gExist.cantidad += orden.cantidad;
                    gExist.total = orden.galleta.precio * gExist.cantidad;                                       
                } else {
                    ordenGalletas.push(orden);                                                         
                }                                       
                
                actualizarStockGalletas(orden.galleta.idGalleta, cantidad); 
                actualizarOrdenGalletas();
                return true;
            }
        } else {
            alerta('error', "Ingresar una cantidad de galletas")            
            return false;
        }
    });
}

async function ventaPorGramos(...datos) {
    const cantidad = await ventanaCantidad("VENTA POR GRAMOS", "Cantidad de venta", "Cantidad de gramos.", () => {
        const input = document.getElementById('swal-input1');
        const cantidad = parseInt(input.value);                                     
        
        let orden = datos[0];
        let cantidadGalletaSeleccionada = datos[1]
        let peso = datos[2];

        let cantidadGramoGalleta = cantidadGalletaSeleccionada * peso;       

        if (cantidad > cantidadGramoGalleta) {
            alerta('error', "No hay galletas suficientes")
            return false;
        }

        if (cantidad === "") {
            alerta('error', "Ingresar una cantidad de gramos!")
            return false;
        }

        let galleta = galletas.find(g => g.idGalleta === orden.galleta.idGalleta);
        let gramosVendidas = cantidad / galleta.peso;
        let galletasVendidas = Math.ceil(gramosVendidas); 

        let gExist = ordenGalletas.find((g) => g.galleta.idGalleta === orden.galleta.idGalleta && g.tipo === orden.tipo);

        orden.gramos = cantidad;    
        orden.cantidad = galletasVendidas;
        orden.total = galleta.precio * galletasVendidas;

        if (gExist) {

            gExist.cantidad += orden.cantidad;
            gExist.gramos += orden.gramos
            gExist.total = orden.galleta.precio * gExist.cantidad;
                               
        } else {
            ordenGalletas.push(orden);                     
        }       

        actualizarStockGalletasGramo(orden.galleta.idGalleta, cantidad);
        actualizarOrdenGalletas();

        return true;
    });

    return cantidad;
}

async function ventaPorModena(...datos){

    const cantida = await ventanaCantidad("VENTA POR DINERO","Cantidad de peso de dinero", "Cantidad de dinero", ()=>{
        const input = document.getElementById('swal-input1');
        const cantidad = parseInt(input.value);
        
        let orden = datos[0]
        let cantidadGalletaSeleccionada = datos[1];
        let galleta = galletas.find(g => g.idGalleta === orden.galleta.idGalleta);    

        let cantidadMoneda = Math.ceil(cantidad / galleta.precio);

        if (cantidad) {
            
            if (cantidadMoneda > cantidadGalletaSeleccionada) {
                alerta('error', "No hay galletas suficientes");
                return false;
            } else {                

                orden.cantidad = cantidadMoneda;
                orden.pesoDinero = cantidadMoneda;
                orden.total = cantidadMoneda * galleta.precio;

                let gExist = ordenGalletas.find((g) => g.galleta.idGalleta === orden.galleta.idGalleta && g.tipo === orden.tipo);

                if (gExist) {

                    gExist.cantidad += orden.cantidad;
                    gExist.pesoDinero += orden.pesoDinero;
                    gExist.total = orden.galleta.precio * gExist.cantidad;
                                       
                } else {
                    ordenGalletas.push(orden);                     
                }                                       

                actualizarStockGalletas(orden.galleta.idGalleta, cantidadMoneda);
                actualizarOrdenGalletas();
                return true;
            }
        } else {
            alerta('error', "Ingresar una cantidad de galletas");
            return false;
        }

                    
    });
    
}

async function ventaPorCaja(...datos){
    const cantidad = await ventanaCantidad("VENTA POR CAJA","Selecciona la cantidad","caja",()=>{
        const input = document.getElementById('swal-input1');
        const cantidad = parseInt(input.value);

        let orden = datos[0];
        let cantidadGalletaSeleccionada = datos[1];
        let galleta = galletas.find(g => g.idGalleta === orden.galleta.idGalleta);

        if (cantidad) {
            if (cantidad > cantidadGalletaSeleccionada) {
                alerta('error', "No hay galletas suficientes");
                return false;
            } else {
                orden.cantidad = cantidad;
                orden.total = cantidad * galleta.precio;

                let gExist = ordenGalletas.find((g) => g.galleta.idGalleta === orden.galleta.idGalleta && g.tipo === orden.tipo);

                if (gExist) {

                    gExist.cantidad += orden.cantidad;            
                    gExist.total = orden.galleta.precio * gExist.cantidad;
                                       
                } else {
                    ordenGalletas.push(orden);                     
                }                                       

                actualizarStockGalletas(orden.galleta.idGalleta, cantidad);
                actualizarOrdenGalletas();

                return true;
            }
        } else {
            alerta('error', "Ingresar una cantidad de galletas");
            return false;
        }
    });
}

function seleccionarCantidad(orden, cantidadGalletaSeleccionada, idTipoVenta, peso) {
    if (idTipoVenta === 1) {
        ventaPorPiezas(orden, cantidadGalletaSeleccionada);        
    } else if (idTipoVenta === 2) {
        ventaPorGramos(orden, cantidadGalletaSeleccionada, peso);
    } else if (idTipoVenta === 3) {
        ventaPorModena(orden, cantidadGalletaSeleccionada);
    } else if (idTipoVenta === 4) {
        ventaPorCaja(orden, cantidadGalletaSeleccionada);
    }
}

export function soloNumeros(event) {  
    var charCode = event.which || event.keyCode;

    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
        return false;
    }

    if (charCode === 13) {
        return true;
    }
}

function actualizarStockGalletas(idGalleta, cantidadVendida) {
    let galleta = galletas.find(g => g.idGalleta === idGalleta);

    if (galleta) {
        galleta.cantidad -= cantidadVendida;
    }

    createCards();
}

function actualizarStockGalletasGramo(idGalleta, cantidadGramos) {
    let galleta = galletas.find(g => g.idGalleta === idGalleta);

    let gramosVendidas = cantidadGramos / galleta.peso;
    let galletasVendidas = Math.ceil(gramosVendidas);

    if (galleta) {
        galleta.cantidad -= galletasVendidas;
    }

    createCards();
}

function actualizarOrdenGalletas() {
    let cuerpo = "";
    let registro = "";
    let tipoGalleta = "";

    document.getElementsByClassName("total")[0].style.display = "block";
    document.getElementById("btnCobrar").disabled = false;
    document.getElementById("ordenLista").style.display = "none";
    

    ordenGalletas.forEach(g => {

        if (g.tipo === 1) {
            tipoGalleta = "Pieza";
        } else if (g.tipo === 2) {
            tipoGalleta = "Gramo";
        } else if (g.tipo === 3) {
            tipoGalleta = "Peso Dinero";
        } else if (g.tipo === 4) {
            tipoGalleta = "Caja";
        }       

        registro = `<div class="cardVenta" data-galleta-id="${g.galleta.idGalleta}">
                        <div class="headerV">
                            <span class="nombrePr">${g.galleta.nombre}</span>
                            <span class="sumProduct">$${g.total}</span>
                            <i class="fa-solid fa-trash eliminar" onclick="controller.eliminarGalleta('${g.galleta.idGalleta}')"></i>
                        </div>
                        <div class="ventaInfo">
                            <div class="tipoGalleta">
                                <span class="subTitulo">Tipo</span>
                                <span class="info">${tipoGalleta}</span>
                            </div>
                            <div class="cantidad">
                                <span class="subTitulo">Cantidad</span>
                                <span class="info">${g.cantidad}</span>
                            </div>
                            <button type="button" class="btn btn-error btnEliminar" onclick="controller.changeCantidad('${g.galleta.idGalleta}',${g.tipo})">
                                <i class="fa-solid fa-minus"></i>
                            </button>
                        </div>
                    </div>
                    `;            

        cuerpo += registro;
        
    });    

    document.getElementById("productos").innerHTML = cuerpo;
    actualizarTotal();
}

export function eliminarGalleta(idGalleta) {
    let ordenGalletasFind = ordenGalletas.find(g => g.galleta.idGalleta === idGalleta);
    let galleta = galletas.find(g => g.idGalleta === idGalleta);

    let galletaCantidad = ordenGalletasFind.cantidad;
    let anteriorGalletas = galleta.cantidad;
    
    galleta.cantidad = parseFloat(galletaCantidad) + parseFloat(anteriorGalletas);

    createCards();

    let index = ordenGalletas.find(g => g.galleta.idGalleta === idGalleta);

    if (index !== -1) {
        ordenGalletas.splice(index, 1);
        actualizarOrdenGalletas();

        if (ordenGalletas.length === 0) {
            document.getElementById("ordenLista").style.display = "block";
            document.getElementById("btnCobrar").disabled = true;
            document.getElementsByClassName("total")[0].style.display = "none";
        }
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

    fetch("api/venta/save",
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
                    alert('error',"Error interno del servidor. Intente nuevamente más tarde.");
                    return;
                }

                if (data.error) {
                    alert('error',"Algo salío mal.");
                }

                if (data.success) {
                    alerta("success", "Venta realizada correctamente");
                    vaciarCarrito();
                    getData();
                }
            });
}

function vaciarCarrito() {
    ordenGalletas = [];
    document.getElementById("productos").innerHTML = '<p style="text-align: center; color:gray; font-style: italic;">Seleccione alguna galleta para iniciar la orden.</p>';
}

export function changeCantidad(idGalleta, tipo){

    let drop = ordenGalletas.find((g) => g.galleta.idGalleta === idGalleta && g.tipo === tipo);

    if (drop.cantidad != 0) {

        let galleta = galletas.find(g => g.idGalleta === idGalleta);

        drop.cantidad -= 1;
        drop.total = drop.galleta.precio * drop.cantidad;

        galleta.cantidad = galleta.cantidad + 1;

        createCards();
              
        actualizarOrdenGalletas();        

        if (drop.cantidad == 0) {
            let index = ordenGalletas.findIndex(g => g.galleta.idGalleta === idGalleta && g.tipo == tipo);

            if (index !== -1) {
                ordenGalletas.splice(index, 1);
                actualizarOrdenGalletas();

                if (ordenGalletas.length === 0) {
                    document.getElementById("ordenLista").style.display = "block";
                    document.getElementById("btnCobrar").disabled = true;
                    document.getElementsByClassName("total")[0].style.display = "none";
                }
            }
        }
    }

}

function actualizarTotal() {    
    const total = ordenGalletas.reduce((sum, g) => sum + g.total, 0);
    document.querySelector('.total span').textContent = `TOTAL: $${total}`;
}