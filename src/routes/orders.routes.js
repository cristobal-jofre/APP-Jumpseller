import { Router } from 'express';
import { getTokenOrder } from '../controllers/orders.controller';

const router = Router();

// Get
router.get('/', getTokenOrder);

export default router;