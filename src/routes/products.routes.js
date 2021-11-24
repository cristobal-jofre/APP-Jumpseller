import { Router } from 'express';
import { getProducts } from '../controllers/products.controller';

const router = Router();

// Get
router.get('/', getProducts);

export default router;