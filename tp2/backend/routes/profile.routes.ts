import { Router } from 'express'
import * as controller from '../controllers/profile.controller.js';
import { validateToken } from '../middleware/token.middleware.js';
import { validateProfileData } from '../middleware/profile.validate.middleware.js';
import { addAccountIdToBody } from '../middleware/token.middleware.js';

const router = Router();

router.get('/profile', [validateToken], controller.getProfile);
router.patch('/profile', [validateToken, addAccountIdToBody, validateProfileData], controller.updateProfile);

export default router;