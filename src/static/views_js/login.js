addErrorStyle = (errors) => {
    let arrayErrores = Object.keys(errors);
    arrayErrores.map((err) => {
        $(`.${err}`).show();
    });
};


login = async() => {
    let data = {
        email: $("#email").val(),
        password: $("#password").val(),
    }

    let config = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };
    const rawResponse = await fetch(`./api/auth/login/perk`, config);
    const response  = await rawResponse.json();

    if (rawResponse.status === 200) {
        const { dataAccess, dataUser } = response.data;
        localStorage.setItem('dataUser', JSON.stringify(dataUser));
        localStorage.setItem('dataAccess', JSON.stringify(dataAccess));
        localStorage.setItem("token", response.token);
        swal({
            title: "Inicio de sesión exitoso",
            icon: "success",
            text: response.msg,
        }).then(() => {
            window.open("./products", "_self");
        });

    } else {
        if (response.errors !== undefined)
            addErrorStyle(response.errors);
        swal({
            title: "Error al iniciar sesión",
            icon: "error",
            text: response.msg,
        });
    } 
};

// Button login 
$("#btnLogin").on("click", login);