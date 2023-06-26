import express from "express";
import * as controller from "../controllers/clients.controller.js";

const routes = express.Router();

routes.get('/clients/', controller.getClientList);

routes.get('/clients/new', controller.getNewClientForm);
routes.post('/clients/new', controller.saveClient);

routes.get('/clients/:id/edit', controller.getEditClientForm);
routes.post('/clients/:id/edit', controller.updateClient);

routes.get('/clients/:id/delete', controller.getDeleteConfirm);
routes.post('/clients/:id/delete', controller.deleteClient);

routes.get('/client/:id', controller.getClientInfo);

export default routes;