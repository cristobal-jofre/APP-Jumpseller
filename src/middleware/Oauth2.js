import {
    AuthorizationCode
} from 'simple-oauth2';
import {
    app_secret,
    cliente_id
} from '../config.json';

const HOST = 'https://accounts.jumpseller.com/oauth/authorize';

const config = {
    client: {
        id: cliente_id,
        secret: app_secret
    },
    auth: {
        tokenHost: HOST
    }
};

const client = new AuthorizationCode(config);

export const authentication = async (req, res) => {
    try {
        const authorizationUri = client.authorizeURL({
            //redirect_uri: 'https://localhost:8000/api/auth/Oauth2/callback',
            redirect_uri: 'https://jumpseller.herokuapp.com/api/auth/Oauth2/callback',
            scope: ['read_products', 'write_products']
        });

        return res.status(200).json({
            msg: 'exito',
            redirect: authorizationUri
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Error al solicitar los permisos',
            error
        })
    }
};

export const getToken = async (req, res) => {
    const code = req.url.split('=')[1];
    const tokenParams = {
        code: code,
        //redirect_uri: 'https://localhost:8000/api/auth/Oauth2/callback',
        redirect_uri: 'https://jumpseller.herokuapp.com/api/auth/Oauth2/callback',
        scope: ['read_products', 'write_products']
    };

    try {
        const { token } = await client.getToken(tokenParams);
        res.cookie('auth', JSON.stringify(token));
        //res.redirect('https://localhost:8000/products')
        res.redirect('https://jumpseller.herokuapp.com/products')
    } catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener el token',
            error
        })
    }
}