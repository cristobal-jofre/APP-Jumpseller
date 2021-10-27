import { Router } from 'express';
import { authentication, getToken } from '../middleware/Oauth2';

const router = Router();

// Get
router.get('/Oauth2', authentication);
router.get('/Oauth2/callback', getToken);

export default router;