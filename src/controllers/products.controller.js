import axios from 'axios';

export const getProducts = async (req, res) => {
    try {
        const { access_token } = JSON.parse(req.cookies.auth) || undefined;

        if (!access_token) {
            return res.status(403).json({
                msg: 'Acceso denegado'
            })
        }

        const { data } = await axios.get(`https://api.jumpseller.com/v1/products.json`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        });

        const result = data.length > 0 ? data.map(value => {
            return { ...value.product, category: value.product.categories[0].name }
        }) : [];

        return res.status(200).json({
            msg: 'Productos obtenidos exitosamente',
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener los productos',
            error
        });
    }
};

export const addWarranty = async (req, res) => {
    try {
        const { access_token } = JSON.parse(req.cookies.auth) || undefined;

        if (!access_token) {
            return res.status(403).json({
                msg: 'Acceso denegado'
            })
        }

        const { data } = req.body;

        data.forEach(async (product) => {
            const { idProduct, variants } = product;
            variants.forEach(async (variant) => {
                const variantBody = { variant: variant };
                console.log(variantBody)
                const response = await axios.post(`https://api.jumpseller.com/v1/products/${idProduct}/variants.json`, variantBody, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    }
                });
            })
        })

        return res.status(200).json({
            msg: 'Garantias agregadas exitosamente'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al agregar los seguros',
            error
        });
    }
};

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