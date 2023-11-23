var icon = document.querySelector(".fa-lock");
function togglePassword() {
    var passwordField = document.getElementById("passwordField");

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
                    console.log('Error interno del servidor. Intente nuevamente más tarde.');
                    return;
                }

                if (data.error) {
                    document.getElementById("lblError").innerHTML = "Usuario / Contraseña incorrectos";
                    document.getElementById("lblError").classList.remove("d-none");
                } else {
                    document.getElementById("lblError").innerHTML = "";
                    document.getElementById("lblError").classList.add("d-none");

                    localStorage.setItem("usuario", JSON.stringify(data));

                    window.location = "inicio.html";
                }
            });
}


