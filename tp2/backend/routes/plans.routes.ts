import { Router } from 'express';
import * as controller from '../controllers/plans.controller.js';
import { validateToken, addProfileIdToBody } from '../middleware/token.middleware.js';

const router = Router();

router.get('/plan', [validateToken, addProfileIdToBody], controller.getPlan);
router.post('/plan', [validateToken, addProfileIdToBody], controller.generatePlan);
router.post('/plan/list', [validateToken, addProfileIdToBody], controller.getList);

export default router;