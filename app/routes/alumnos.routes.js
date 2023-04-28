import express from 'express';
import * as controller from '../controllers/alumnos.controller.js';

const routes = express.Router();

routes.get('/alumnos', controller.getListadoAlumnos);

routes.get('/alumnos/nuevo', controller.getAlumnoNewForm);
routes.post('/alumnos/nuevo', controller.saveAlumno);

routes.get('/alumnos/:legajo', controller.getAlumnoByLegajo);

routes.get('/alumnos/:legajo/edit', controller.getAlumnoEditForm);
routes.post('/alumnos/:legajo/edit', controller.editAlumno);

routes.get('/alumnos/:legajo/delete', controller.deleteAlumnoForm);
routes.post('/alumnos/:legajo/delete', controller.deleteAlumno);

export default routes;