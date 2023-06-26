import express from "express";
import * as controller from "../controllers/projects.controller.js";

const routes = express.Router();

routes.get('/projects/new', controller.getNewForm);
routes.post('/projects/new', controller.saveProject);

routes.get('/projects/:id/edit', controller.getEditForm);
routes.post('/projects/:id/edit', controller.editProject);

routes.get('/projects/:id/delete', controller.getDeleteConfirm);
routes.post('/projects/:id/delete', controller.deleteProject);

routes.get('/projects/:section', controller.getSection);
routes.get('/projects/:section/:technologies', controller.getFilteredList);

export default routes;