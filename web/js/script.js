var inventario = document.getElementById("card-inventario");
var materia = document.getElementById("card-materia");
var venta = document.getElementById("card-venta");
var recetas = document.getElementById("card-recetas");
var corte = document.getElementById("card-corte");
var cerrarSesion1 = document.getElementById("cerrarSesion1");
var cerrarSesion2 = document.getElementById("cerrarSesion2");

inventario.addEventListener("click", function () {
    animacion();
    setTimeout(function () {
        window.location.href = "html/inventario/inventario.html";
    }, 1000);
});

materia.addEventListener("click", function () {
    animacion();
    setTimeout(function () {
        window.location.href = "html/materia/materias.html";
    }, 1000);
});

venta.addEventListener("click", function () {
    animacion();
    setTimeout(function () {
        window.location.href = "html/venta/orden.html";
    }, 1000);
});

recetas.addEventListener("click", function () {
    animacion();
    setTimeout(function () {
        window.location.href = "html/receta/recetas.html";
    }, 1000);
});

corte.addEventListener("click", function () {
    animacion();
    setTimeout(function () {
        window.location.href = "html/corte/corte.html";
    }, 1000);
});

cerrarSesion1.addEventListener("click", function () {
    animacion();
    setTimeout(function () {
        window.location.href = "index.html";
    }, 1000);
    eliminarCache();
});

cerrarSesion2.addEventListener("click", function () {
    animacion();
    setTimeout(function () {
        eliminarCache();
        window.location.href = "index.html";
    }, 1000);
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

function eliminarCache() {
    localStorage.clear();
}

function animacion() {
    document.getElementById("contenedor-main").classList.add("animate__animated");
    document.getElementById("contenedor-main").classList.add("animate__fadeOut");
}

document.addEventListener('click', closeNavbarOutsideClick);
