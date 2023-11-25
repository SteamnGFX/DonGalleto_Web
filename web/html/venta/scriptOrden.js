getGalletas();
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
                console.log(data);
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
                    '<div class="card-orden" onclick="cargarGalleta(' + galletas.indexOf(galleta) + ')">' +
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
        document.getElementById("contenedor-orden").innerHTML = cuerpo;
    } else {
        document.getElementById("btnAgregarGalleta").classList.add("d-none");
    }


}



