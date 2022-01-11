import { Router } from 'express';
import {addWarranty, getProducts, deleteWarranty } from '../controllers/products.controller';

const router = Router();

// Get
router.get('/', getProducts);

// Post
router.post('/addWarranty', addWarranty);

// Delete
router.delete('/deleteWarranty', deleteWarranty);

export default router;