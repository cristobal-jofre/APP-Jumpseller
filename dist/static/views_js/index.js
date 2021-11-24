const authorizationOauth2 = async () => {
    try {
        const dataRaw = await fetch(`./api/auth/Oauth2/`);
        if (dataRaw.status === 200) {
            const { redirect } = await dataRaw.json();
            window.open(redirect, '_self')
        } else {
            throw new Error("Error en la autenticación");
        }
    } catch (error) {
        console.log(error)
    }
};

$("#app").on("click", authorizationOauth2);