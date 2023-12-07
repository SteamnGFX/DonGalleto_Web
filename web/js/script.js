window.onload = inicializar;

let collapse = false;

let navData = [];

let menuItem = {};

let controller;

function inicializar(){  
        
    navData = [
        {  
            label: "Inicio",
            icon: "fas fa-home",
            btn: "inicio"
        },
        {
            label: "Ventas",
            icon: "fas fa-shopping-cart",
            btn: "ventas"
        },
        {
            label: "Inventario",
            icon: "fas fa-box",
            btn: "inventario"
        },
        {
            label: "Materia Prima",
            icon: "fas fa-leaf",
            btn: "materia"
        },{
            label: "Corte",
            icon: "fas fa-money-check-alt",
            btn: "corte"
        },        
        {
            label: "Recetas",
            icon: "fas fas fa-book",
            btn: "recetas"
        },
        
    ];

    menuItem = {
        "inicio":{
            "htmlFile": "menu/menu.html",
            "jsFile": "../menu/menu.js",
            "cssFile": "/menu/menu.css"
        },
        "recetas":{
            "htmlFile": "html/receta/recetas.html",
            "jsFile": "../html/receta/recetas.js",
            "cssFile": "html/receta/recetas.css"
        },
        "ventas":{
            "htmlFile": "html/venta/orden.html",
            "jsFile": "../html/venta/scriptOrden.js",
            "cssFile": "html/venta/styles.css"
        },
        "inventario":{
            "htmlFile": "html/inventario/inventario.html",
            "jsFile": "../html/inventario/script.js",
            "cssFile": "html/inventario/styles.css"
        }

    };

    cargarMenu();

    loadContent("inicio");
}

function toggleCollapse(){
    
    let hidden = document.getElementsByClassName("hidd");

    collapse = !collapse;

    let nav = document.getElementsByClassName("sidenav")[0];
    if (collapse) {        
        nav.classList.add("sidenav-collapsed");

        hidden[0].classList.remove("d-none");
        hidden[1].classList.remove("d-none");
        
    } else {
        nav.classList.remove("sidenav-collapsed");
       
        hidden[0].classList.add("d-none");
        hidden[1].classList.add("d-none");
    }

    cargarMenu();
    
}

function closeSidenav(){
    collapse = true;

    toggleCollapse();
}

function cargarMenu(){

    var sidenav = document.getElementsByClassName("sidenav-nav")[0];

    let items = "";

    navData.forEach(item => {
        items += `
            <li class='sidenav-nav-item'>
                <a class='sidenav-nav-link' onclick="loadContent('${item.btn}')">
                    <i class='sidenav-link-icon ${item.icon}'></i>
                    <span class='sidenav-link-text ${!collapse ? 'd-none' : ''}'>
                        ${item.label}
                    </span>
                </a>
            </li>
        `;
    });

    let close = `<li class="sidenav-nav-item">
                    <a class="sidenav-nav-link">
                        <i class="fas fa-times sidenav-link-icon icono"></i>
                        <span class='sidenav-link-text ${!collapse ? 'd-none' : ''}'>
                            Cerrar Sesión
                        </span>
                    </a>
                </li>`;

    sidenav.innerHTML = items + close;
}

function loadContent(opcion) {   

    let op = menuItem[opcion];

    fetch(op.cssFile)
        .then(response => response.text())
        .then(css => {
            
            removeScripts("body style");

            const styleLink = document.createElement('style');            
            styleLink.textContent = css;
            document.body.appendChild(styleLink);
   
            return fetch(op.htmlFile)                       
        })
        .then(res => {return res.text()})
        .then(htmlContent => {
            
            setTimeout(() => {
                document.getElementById('moduleBox').innerHTML = htmlContent;

                import(op.jsFile)
                .then(ctr => {
                    controller = ctr;
                    
                    controller.inicializar();
                });

            }, 1000);

            
            
        })
        .catch(error => {
            console.error('Error al cargar dinámicamente:', error);
        });
}

function removeScripts(selector) {
    const scripts = document.querySelectorAll(selector);
    scripts.forEach(script => script.parentNode.removeChild(script));
    document.getElementById('moduleBox').innerHTML = ""; 
}



