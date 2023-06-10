import { Router } from 'express'
import * as controller from '../controllers/profile.controller.js';
import { validateToken } from '../middleware/token.validate.middleware.js';
import { validateProfileData } from '../middleware/profile.validate.middleware.js';

const router = Router();

router.get('/profile', [validateToken], controller.getProfile);
router.post('/profile', [validateToken, validateProfileData], controller.updateProfile);

export default router;