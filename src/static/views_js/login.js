
login = async() => {
    let data = {
        email: $("#email").val(),
        password: $("#password").val(),
        // environment: $("#environment").val(),
    }

    console.log(data);

    let config = {
        method: 'POST',
        body: data,
    };

    console.log(config)
    const rawResponse = await fetch(`./api/auth/login/perk`, config);
    const response = await rawResponse.json();
    console.log(response)

    window.open("./products", "_self");
};

// Button login 
$("#btnLogin").on("click", login);