var icon = document.querySelector(".fa-lock");
function togglePassword() {
    var passwordField = document.getElementById("txtPassword");

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


function iniciarSesion() {
    document.getElementById("txtBtnLogin").classList.add("d-none");
    document.getElementById("loader-login").classList.remove("d-none");

    let usuario = {
        nombre_usuario: document.getElementById("txtUser").value,
        contrasenia: document.getElementById("txtPassword").value
    };

    //Variable
    datos = {
        credenciales: JSON.stringify(usuario)
    };
    params = new URLSearchParams(datos);
    fetch("api/log/in?",
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
                    document.getElementById("txtBtnLogin").classList.remove("d-none");
                    document.getElementById("loader-login").classList.add("d-none");

                    document.getElementById("lblError").innerHTML = "Ha ocurrido un error. ERROR 502.";
                    document.getElementById("lblError").classList.remove("d-none");
                    return;
                }

                if (data.error) {
                    document.getElementById("lblError").innerHTML = "Usuario / Contraseña incorrectos";
                    document.getElementById("lblError").classList.remove("d-none");
                    document.getElementById("loader-login").classList.add("d-none");
                    document.getElementById("txtBtnLogin").classList.remove("d-none");
                } else {
                    document.getElementById("lblError").innerHTML = "";
                    document.getElementById("lblError").classList.add("d-none");

                    document.getElementById("contenedor-login").classList.remove("animate__fadeInDown");
                    document.getElementById("contenedor-login").classList.add("animate__bounceOut");

                    document.getElementById("loader-login").classList.add("d-none");
                    document.getElementById("txtBtnLogin").classList.remove("d-none");

                    localStorage.setItem("usuario", JSON.stringify(data));
                    setTimeout(function () {
                        window.location.href = "inicio.html";
                    }, 1000);
                }
                document.getElementById("txtBtnLogin").classList.remove("d-none");

            });
}


