window.onload = function () {
    getMaterias(); // Llamar a la función getMaterias cuando la página se cargue
    
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


document.getElementById("btnAgregarMateria").addEventListener("click", function () {
    window.location.href = "materia.html";
    localStorage.removeItem("materia");
    localStorage.removeItem("materias");
    eliminarCache();
});

document.addEventListener('click', closeNavbarOutsideClick);

function getMaterias() {
    fetch("../../api/materia/getAll?",
            {
                method: "GET",
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                localStorage = data;
                console.log(data);
                localStorage.setItem("materias", JSON.stringify(data));
                createDivsFromMaterias(data);
                console.log(createDivsFromMaterias(data));

            });
}


function createDivsFromMaterias(materias) {
    
    let cuerpo = "";
    let registro = "";
    let img = "";
    let claseMateriaCantidad = "";
    
    if (materias.length !== undefined) {
        materias.forEach(function (materia, index) {
            
            // Verifica si es la primera materia del nuevo contenedor
            if (index % 3 === 0) {
                // Si es la primera materia del nuevo contenedor, cierra el contenedor anterior
                if (index !== 0) {
                    cuerpo += '</div>';
                }

                // Abre un nuevo contenedor-inventario
                cuerpo += '<div class="contenedor-inventario">';
            }
            if (materia.fotografia === ""){
                img = "../../img/icono.png";
            } else {
                img = "data:image/jpeg;base64," + materia.fotografia ;
            }
            
            if (materia.cantidad <= 10){
                claseMateriaCantidad = "baja";
            } else if (materia.cantidad <= 20) {
                claseMateriaCantidad = "media";
            } else {
                claseMateriaCantidad = "alta";
            }
            
   

            registro =
                    '<div class="card-inventario" onclick="cargarMateria(' + materias.indexOf(materia) + ')">' +
                    '<p class="p-cantidad ' + claseMateriaCantidad +' ">' + materia.cantidad + " " + materia.unidadMedida +'</p>' +
                    '<img class="inventarioMateria" src="'+ img +'  " alt="materia" style="aspect-ratio: 1 / 1; width: 192px; height: 192px">' +
                    '<p>' + materia.nombre + '</p>' +
                    '</div>';

            cuerpo += registro;

            // Verifica si es la última materia del arreglo
            if (index === materias.length - 1) {
                cuerpo += '</div>';
            }
        });

        document.getElementById("contenedor-inventario").innerHTML = cuerpo;
    } else {
        document.getElementById("btnAgregarMateria").classList.add("d-none");
    }


}

function cargarMateria(indice) {
    localStorage.setItem("materia", indice);

    window.location = "materia.html";
}

