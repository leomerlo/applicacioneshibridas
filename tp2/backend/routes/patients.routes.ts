import { Router } from 'express'
import * as controller from '../controllers/patients.controller.js';
import { validateToken } from '../middleware/token.middleware.js';
import { addProfileIdToBody } from '../middleware/token.middleware.js';
import { validateDoctor } from '../middleware/profile.validate.middleware.js';
import { validateProfileData } from '../middleware/profile.validate.middleware.js';

const router = Router();

router.get('/patients', [validateToken, addProfileIdToBody, validateDoctor], controller.getPatients);
router.post('/patient', [validateToken, addProfileIdToBody, validateDoctor], controller.addPatient);

router.get('/patient/:patientId', [validateToken, addProfileIdToBody, validateDoctor], controller.getPatient);
router.patch('/patient/:patientId', [validateToken, addProfileIdToBody, validateDoctor], controller.updatePatient);
router.delete('/patient/:patientId', [validateToken, addProfileIdToBody, validateDoctor], controller.deletePatient);

export default router;