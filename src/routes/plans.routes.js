import { Router } from 'express';
import { getPlans } from '../controllers/plans.controllers';

const router = Router();

// Get
router.get('/', getPlans);

export default router;