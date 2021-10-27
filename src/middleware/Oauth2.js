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
            redirect_uri: 'http://localhost:8000/api/auth/Oauth2/callback',
            scope: ['read_orders']
        });

        return res.status(200).json({
            msg: 'exito',
            redirect: authorizationUri
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'malo',
            error
        })
    }
};

export const getToken = async (req, res) => {
    const code = req.url.split('=')[1];
    const tokenParams = {
        code: code,
        redirect_uri: 'http://localhost:8000/api/auth/Oauth2/callback',
        scope: ['read_orders']
    };

    try {
        const data = await client.getToken(tokenParams);
        console.log(data)
        res.redirect('http://localhost:8000/xd')
    } catch (error) {
        return res.status(500).json({
            msg: 'malo',
            error
        })
    }
}