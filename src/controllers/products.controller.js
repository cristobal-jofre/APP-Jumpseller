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
        const requests = [];

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }

        data.map((product) => { // cambio de async
            const { idProduct, variants } = product;
            variants.map((variant) => { // cambio de async
                const variantBody = { variant: variant };
                requests.push(
                    {
                        url: `https://api.jumpseller.com/v1/products/${idProduct}/variants.json`,
                        params: variantBody,
                    }
                )
            })
        })
        console.log(requests[0].params)
        axios.all(requests.map((request) => axios.post(request.url, request.params, { headers })))
            .then(() => {
                return res.status(200).json({
                    msg: 'Garantias agregadas exitosamente'
                })
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al agregar las garantías',
            error
        });
    }
};

const doRequest = (url) => {
    axios.post(url, variantBody, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    })
}

export const deleteWarranty = async (req, res) => {
    try {
        const { access_token } = JSON.parse(req.cookies.auth) || undefined;

        if (!access_token) {
            return res.status(403).json({
                msg: 'Acceso denegado'
            })
        }

        const { idProduct, options } = req.body;

        await axios.delete(`https://api.jumpseller.com/v1/products/${idProduct}/options/${options}.json`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        });

        return res.status(200).json({
            msg: 'Garantias eliminadas exitosamente'
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Error al eliminar las garantias',
            error
        });
    }
};