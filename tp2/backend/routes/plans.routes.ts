import { Router } from 'express';
import * as controller from '../controllers/plans.controller.js';
import { validateToken, addProfileIdToBody } from '../middleware/token.middleware.js';
import { validateDoctor, validatePatient } from '../middleware/profile.validate.middleware.js';
import { Request, Response } from 'express';

const router = Router();

router.get('/plan', [validateToken, addProfileIdToBody], controller.getPlan);
router.post('/plan/new', [validateToken, addProfileIdToBody], controller.generateRecipies);
router.get('/plan/:planId', [validateToken, addProfileIdToBody, validateDoctor], controller.getPlanById);
router.post('/plan', [validateToken, addProfileIdToBody], controller.generatePlan);
router.post('/plan/list', [validateToken, addProfileIdToBody], controller.getList);
router.post('/plan/replace/:day/:meal', [validateToken, addProfileIdToBody], controller.replaceRecipie);
router.get('/plan/assistant/thread/:id', [validateToken, addProfileIdToBody], controller.assistantGetThreadMessages);
router.post('/plan/assistant/thread', [validateToken, addProfileIdToBody], controller.assistantStartThread);
router.post('/plan/assistant/message', [validateToken, addProfileIdToBody], controller.assistantAddMessage);
router.post('/plan/assistant/plan', [validateToken, addProfileIdToBody], controller.assistantGeneratePlan);

router.get('/plans', [validateToken, addProfileIdToBody, validateDoctor], controller.getPlans);
router.post('/plan/doc', [validateToken, addProfileIdToBody, validateDoctor], controller.generateDocPlan);
router.post('/plan/:planId/:patientId', [validateToken, addProfileIdToBody, validateDoctor, validatePatient], controller.assignPlan);
router.delete('/plan/:planId', [validateToken, addProfileIdToBody, validateDoctor], controller.deletePlan);

export default router;