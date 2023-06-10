import * as view from '../views/clients.view.js';
import * as clientsService from '../service/clients.service.js';
import * as projectsService from '../service/projects.service.js';

function getClientList(req, res) {
  clientsService.getAllClients().then((clients) => {
    res.send(view.viewClientList(clients));
  });
}

function getNewClientForm(req, res) {
  res.send(view.viewClientForm());
}

function getEditClientForm(req, res) {
  clientsService.getClientById(req.params.id).then((client) => {
    res.send(view.viewClientForm(client));
  });
}

function saveClient(req, res) {
  const client = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
  }
  clientsService.saveClient(client).then(() => {
    clientsService.getAllClients().then((clients) => {
      res.send(view.viewClientList(clients, { variant: "success", text: "El cliente fue creado con éxito" }));
    });
  }).catch((error) => {
    const message = {
      variant: 'danger',
      text: `Hubo un problema al crear el cliente, intentelo nuevamente.`,
    };
    res.send(view.viewClientForm({}, message));
  });;
}

function updateClient(req, res) {
  const client = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
  }
  clientsService.updateClient(req.params.id, client).then(() => {
    clientsService.getAllClients().then((clients) => {
      res.send(view.viewClientList(clients, { variant: "success", text: "El cliente fue editado con éxito" }));
    });
  }).catch((error) => {
    const message = {
      variant: 'danger',
      text: `Hubo un problema al guardando el cliente, intentelo nuevamente.`,
    };
    res.send(view.viewClientForm({}, message));
  });
}

function getDeleteConfirm(req, res) {
  clientsService.getClientById(req.params.id).then((client) => {
    res.send(view.confirmDelete(client));
  });
}

function deleteClient(req, res) {
  clientsService.deleteClient(req.params.id).then((result) => {
    res.redirect('/clients');
  }).catch((error) => {
    const message = {
      variant: 'danger',
      text: `Hubo un problema al guardando el cliente, intentelo nuevamente.`,
    };
    res.send(view.confirmDelete({}, message));
  });
}

function getClientInfo(req, res) {
  clientsService.getClientById(req.params.id).then((client) => {
    projectsService.getProjectsByClient(req.params.id).then((projects) => {
      client.projects = projects;
      res.send(view.viewClientInfo(client));
    });
  });
}

export {
  getClientList,
  getNewClientForm,
  getEditClientForm,
  updateClient,
  saveClient,
  getDeleteConfirm,
  deleteClient,
  getClientInfo
}