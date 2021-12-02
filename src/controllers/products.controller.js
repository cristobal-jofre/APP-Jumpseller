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
            return { ...value.product, category:value.product.categories[0].name }
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
} 