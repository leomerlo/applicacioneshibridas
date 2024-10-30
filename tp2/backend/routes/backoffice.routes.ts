import { Router } from 'express'
import * as controller from '../controllers/backoffice.controller.js';
import { validateToken } from '../middleware/token.middleware.js';
import { validateAdmin } from '../middleware/profile.validate.middleware.js';

const router = Router();

router.get('/dashboard',[validateToken, validateAdmin], controller.getDashboard);
router.post('/account',[validateToken, validateAdmin], controller.createUser);
router.get('/account/:profileId',[validateToken, validateAdmin], controller.getUser);
router.patch('/account/:profileId',[validateToken, validateAdmin], controller.editUser);
router.post('/account/activate/:profileId',[validateToken, validateAdmin], controller.activateUser);
router.delete('/account/:profileId',[validateToken, validateAdmin], controller.deleteUser);

export default router;