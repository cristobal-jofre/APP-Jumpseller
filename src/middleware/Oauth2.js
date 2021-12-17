import axios from 'axios'; 
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
            redirect_uri: 'https://localhost:8000/api/auth/Oauth2/callback',
            // redirect_uri: 'https://jumpseller.herokuapp.com/api/auth/Oauth2/callback',
            scope: ['read_products', 'write_products', 'read_hooks', 'write_hooks', 'read_orders', 'write_orders']
        });

        return res.status(200).json({
            msg: 'Autenticación completada exitosamente',
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
        redirect_uri: 'https://localhost:8000/api/auth/Oauth2/callback',
        // redirect_uri: 'https://jumpseller.herokuapp.com/api/auth/Oauth2/callback',
        scope: ['read_products', 'write_products', 'read_hooks', 'write_hooks', 'read_orders', 'write_orders']    
    };

    try {
        const { token } = await client.getToken(tokenParams);
        console.log(token)
        res.cookie('auth', JSON.stringify(token));
        res.redirect('http://localhost:8000/login')
        // res.redirect('https://jumpseller.herokuapp.com/products')
    } catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener el token',
            error
        })
    }
};

export const authenticationPerk = async (req, res) => {
    try {
        const { email, password } = req.body
    
        const body = {
            email,
            password
        }
    
        const { data } = await axios.post(`http://localhost:3000/shield/api/v1/user/login`, body);
        const { accessToken } = data;
        const response = await axios.post(`http://localhost:3000/shield/api/v1/apiKey/create`, null, {
            headers: {
                'x-access-token': accessToken,        
            }
        });
        
        const { key, secret } = response.data.data;
        const { id, role } = data.data;
        const result = {
            dataAccess: {
                accessToken,
                key,
                secret
            },
            dataUser: {
                email,
                id, 
                role
            }
        }

        return res.status(200).json({
            msg: "Sesión iniciada",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Error al autenticar con Perk',
            error
        })
    }
};