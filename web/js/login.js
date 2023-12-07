let contLogin = document.getElementById("contenedor-login");
let lblError = document.getElementById("lblError");
let txtBtnLogin = document.getElementById("txtBtnLogin");

let txtUser = document.getElementById("txtUser");
let passwordField = document.getElementById("txtPassword");

txtUser.addEventListener('keydown', (e)=>{
    if (e.key == "Enter") passwordField.focus();
});

passwordField.addEventListener('keydown', (e)=>{
    if (e.key == "Enter") 
    document.getElementsByClassName("login")[0].focus();
});

function togglePassword(icon) {    
    if (passwordField.type === "password") {
        passwordField.type = "text";
        icon.classList.remove("fa-lock");
        icon.classList.add("fa-unlock");
    } else {
        passwordField.type = "password";
        icon.classList.remove("fa-unlock");
        icon.classList.add("fa-lock");
    }
}


function iniciarSersion() {
    document.getElementById("txtBtnLogin").classList.add("d-none");
    document.getElementById("loader-login").classList.remove("d-none");

    let user = document.getElementById("txtUser").value;
    let pass = document.getElementById("txtPassword").value;
    let params;

    let error = {
        user: false,
        pass: false
    };

    error["user"] = (user == "");
    error["pass"] = (pass == "");
    
    if (error["user"] || error["pass"]) {
        if (error["user"] && error["pass"]) {
            txtUser.focus();
            Swal.fire(
                'Faltan Datos',
                'Ingresa usuario y contraseña',
                'error',                
            ).then((result) => {                
                if (result.isConfirmed) {
                  txtUser.focus();
                } else if (result.dismiss) {
                    txtUser.focus();
                }
            });

            txtBtnLogin.classList.remove("d-none");
            document.getElementById("loader-login").classList.add("d-none");            
        } else {
            if (error["user"]) {
                Swal.fire(
                    'Faltan Datos',
                    'Ingresa un usuario',
                    'error'
                ).then((result) => {                
                    if (result.isConfirmed) {
                      txtUser.focus();
                    } else if (result.dismiss) {
                        txtUser.focus();
                    }
                });
                txtBtnLogin.classList.remove("d-none");
                document.getElementById("loader-login").classList.add("d-none");
            } else if (error["pass"]) {
                Swal.fire(
                    'Faltan Datos',
                    'Ingresa una contraseña',
                    'error'
                ).then((result) => {                
                    if (result.isConfirmed) {
                        passwordField.focus();
                    } else if (result.dismiss) {
                        passwordField.focus();
                    }
                });                
                txtBtnLogin.classList.remove("d-none");
                document.getElementById("loader-login").classList.add("d-none");                
            }
        }   
    } else {

        let usuario = {
            nombre_usuario: user,
            contrasenia: pass
        };

        //Variable
        datos = {
            credenciales: JSON.stringify(usuario)
        };

        params = new URLSearchParams(datos);


        fetch("api/log/in",{
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            body: params
        })
        .then(response => {
            return response.json();
        })
        .then(data => {

            if (data.exception != null) {
                txtBtnLogin.classList.remove("d-none");
                document.getElementById("loader-login").classList.add("d-none");

                Swal.fire(
                    data.exception,
                    "Inténtalo de nuevo",
                    'error'
                );     

                return;
            }

            if (data.error != null) {
                lblError.innerHTML = data.error;
                lblError.classList.remove("d-none");

                document.getElementById("loader-login").classList.add("d-none");
                txtBtnLogin.classList.remove("d-none");

                return;
            } 

            lblError.innerHTML = "";
            lblError.classList.add("d-none");

            contLogin.classList.remove("animate__fadeInDown");
            contLogin.classList.add("animate__bounceOut");

            document.getElementById("loader-login").classList.add("d-none");
            txtBtnLogin.classList.remove("d-none");

            localStorage.setItem("usuario", JSON.stringify(data));

            setTimeout(function () {
                window.location.href = "inicio.html";
            }, 1200);

            txtBtnLogin.classList.remove("d-none");

        });

    }    
}


