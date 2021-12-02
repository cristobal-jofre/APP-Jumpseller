
export const getPlans = (req, res) =>{
    try{
        
    
    } catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener los seguros',
            error
        });
    }    
}