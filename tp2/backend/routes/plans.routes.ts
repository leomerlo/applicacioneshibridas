import { Router } from 'express';
import * as controller from '../controllers/plans.controller.js';
import { validateToken, addProfileIdToBody } from '../middleware/token.middleware.js';
import { validateDoctor, validatePatient } from '../middleware/profile.validate.middleware.js';

const router = Router();

router.get('/plan', [validateToken, addProfileIdToBody], controller.getPlan);
router.post('/plan', [validateToken, addProfileIdToBody], controller.generatePlan);
router.get('/plan/list', [validateToken, addProfileIdToBody], controller.getList);

router.get('/plans', [validateToken, addProfileIdToBody, validateDoctor], controller.getPlans);
router.post('/plan/doc', [validateToken, addProfileIdToBody, validateDoctor], controller.generateDocPlan);
router.post('/plan/:planId/:patientId', [validateToken, addProfileIdToBody, validateDoctor, validatePatient], controller.assignPlan);
router.delete('/plan/:planId', [validateToken, addProfileIdToBody, validateDoctor], controller.deletePlan);

export default router;