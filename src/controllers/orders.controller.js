import axios from 'axios';

/*
product_category
product_sku
invoice_number
client_name
client_last_name
client_id
client_adress
client_city
client_email
product_price
product_unit_price
warranty_date
product_date
product_brand
product_model
payment
warranty_period
warranty_period_unit
sponsor
warranty_price
warranty_unit_price
plan_id_perk
*/

export const getTokenOrder = async (req, res) => {
    try {
        const { access_token } = JSON.parse(req.cookies.auth) || undefined;

        if (!access_token) {
            return res.status(403).json({
                msg: 'Acceso denegado'
            })
        }

        username='7777c45ba294b79467155e2027793a6e';
        password='16f3ac88b7753e581365e6dc32a1adc5cb408642a0963f0cd4';
        
        const data = axios.get(`https://api.jumpseller.com/v1/store/info.json`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            auth: {
                username,
                password
            }
        });
        console.log(data);
        
    } catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener el token',
            error
        });
    }
};

// export const verifyTokens = async (req, res) => {

// }