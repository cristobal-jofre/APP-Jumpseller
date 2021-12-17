import { Router } from 'express';
import {addWarranty, getProducts } from '../controllers/products.controller';

const router = Router();

// Get
router.get('/', getProducts);

// Post
router.post('/addWarranty', addWarranty);

export default router;