var inventario = document.getElementById("card-inventario");
var materia = document.getElementById("card-materia");
var venta = document.getElementById("card-venta");
var recetas = document.getElementById("card-recetas");
var corte = document.getElementById("card-corte");
var cerrarSesion1 = document.getElementById("cerrarSesion1");
var cerrarSesion2 = document.getElementById("cerrarSesion2");

inventario.addEventListener("click", function () {
    window.location.href = "html/inventario/inventario.html";
});

materia.addEventListener("click", function () {
    window.location.href = "html/materia/materias.html";
});

venta.addEventListener("click", function () {
    window.location.href = "html/venta/venta.html";
});

recetas.addEventListener("click", function () {
    window.location.href = "html/receta/recetas.html";
});

corte.addEventListener("click", function () {
    window.location.href = "html/corte/corte.html";
});

cerrarSesion1.addEventListener("click", function () {
    window.location.href = "index.html";
    eliminarCache();
});

cerrarSesion2.addEventListener("click", function () {
    window.location.href = "index.html";
    eliminarCache();
});

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

function eliminarCache(){
    localStorage.clear();
}

document.addEventListener('click', closeNavbarOutsideClick);
