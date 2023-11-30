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

document.getElementById("btnUnidad").addEventListener("click", function () {
    mostrarInput();
});

 document.getElementById("btnVenta").addEventListener("click", function () {
        venta();
    });

function venta(){
    if(document.getElementById("txtCantidadVenta").value === ""){
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

document.addEventListener('click', closeNavbarOutsideClick);
