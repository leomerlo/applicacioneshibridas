import { Router } from 'express'
import * as controller from '../controllers/backoffice.controller.js';
import * as profileController from '../controllers/profile.controller.js';
import { validateToken } from '../middleware/token.middleware.js';
import { validateAdmin, validateProfileData } from '../middleware/profile.validate.middleware.js';
import { addAccountIdToBody } from '../middleware/token.middleware.js';

const router = Router();

router.get('/dashboard',[validateToken, addAccountIdToBody, validateAdmin], controller.getDashboard);
router.post('/account',[validateToken, addAccountIdToBody, validateAdmin], controller.createUser);
router.get('/account/:profileId',[validateToken, addAccountIdToBody, validateAdmin], controller.getUser);
router.patch('/account/:profileId',[validateToken, addAccountIdToBody, validateAdmin, validateProfileData], controller.editUser);

export default router;