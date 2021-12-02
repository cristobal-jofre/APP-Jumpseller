import { Router } from 'express';
import { authentication, authenticationPerk, getToken } from '../middleware/Oauth2';

const router = Router();

// Get
router.get('/Oauth2', authentication);
router.get('/Oauth2/callback', getToken);

router.post('/login/perk', authenticationPerk);

export default router;