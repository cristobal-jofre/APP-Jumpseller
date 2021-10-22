import { Router } from 'express';

const router = Router();

// Get render of views

router.get('/', (req, res) => {
    res.render('index');
});

export default router;