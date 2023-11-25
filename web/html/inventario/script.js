window.onload = function () {
    getGalletas(); // Llamar a la función getGalletas cuando la página se cargue
};

function toggleNavbar() {
    var navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
}

function closeNavbarOutsideClick(event) {
    var navbar = document.querySelector('.navbar');
    var icon = document.querySelector('#navbar-icon');

    if (!navbar.contains(event.target) && event.target !== icon) {
        navbar.classList.remove('active');
    }
}

document.getElementById("btnRegresar").addEventListener("click", function () {
    window.location.href = "../../inicio.html";
    eliminarCache();
});


document.getElementById("btnAgregarGalleta").addEventListener("click", function () {
    window.location.href = "galleta.html";
    localStorage.removeItem("galleta");
    localStorage.removeItem("galletas");
    eliminarCache();
});

document.addEventListener('click', closeNavbarOutsideClick);

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
                localStorage = data;
                localStorage.setItem("galletas", JSON.stringify(data));
                createDivsFromGalletas(data);

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
                cuerpo += '<div class="contenedor-inventario">';
            }
            
            if (galleta.fotografia === ""){
                img = "../../img/icono.png";
            } else {
                img = "data:image/jpeg;base64," + galleta.fotografia ;
            }
            
            if (galleta.cantidad <= 10){
                claseGalletaCantidad = "baja";
            } else if (galleta.cantidad <= 20) {
                claseGalletaCantidad = "media";
            } else {
                claseGalletaCantidad = "alta";
            }

            registro =
                    '<div class="card-inventario" onclick="cargarGalleta(' + galletas.indexOf(galleta) + ')">' +
                    '<p class="p-cantidad ' + claseGalletaCantidad +' ">' + galleta.cantidad + '</p>' +
                    '<img class="inventarioGalleta" src="'+ img +'  " alt="galleta" style="aspect-ratio: 1 / 1; width: 192px; height: 192px">' +
                    '<p>' + galleta.nombre + '</p>' +
                    '</div>';

            cuerpo += registro;

            // Verifica si es la última galleta del arreglo
            if (index === galletas.length - 1) {
                cuerpo += '</div>';
            }
        });

        document.getElementById("contenedor-inventario").innerHTML = cuerpo;
    } else {
        document.getElementById("btnAgregarGalleta").classList.add("d-none");
    }


}

function cargarGalleta(indice) {
    localStorage.setItem("galleta", indice);

    window.location = "galleta.html";
}

