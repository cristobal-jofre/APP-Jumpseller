import { Router } from 'express';

const router = Router();

// Get render of views

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/xd', (req, res) => {
    res.send('<h1>dfdsf</h1>');
});

export default router;