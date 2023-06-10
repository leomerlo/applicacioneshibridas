import { pageWrapper, navBar, projectList } from '../utils/views.utils.js'

function viewClientList(clients, message) {
  const nav = navBar();
  let clientList = '';
  clients.forEach((client) => {
    clientList += `
      <div class="col-12">
        <div>
          <img src="${client.image}" />
        </div>
        <div>
          <a>Nombre: ${client.name}</span>
          <span>Descripcion: ${client.description}</span>
          <div>
            <a href="/clients/${client._id}/edit">Editar</a>
            <a href="/clients/${client._id}/delete">Eliminar</a>
          </div>
          <a href="/client/${client._id}">Ver mas</a>
        </div>
      </div>`
  });
  const html = `
    ${nav}
    <div class="container">
      ${ message ? `<div class="alert alert-${message.variant}">${message.text}</div>` : '' }
      <div class="d-flex justify-content-between">
        <h1>Mis Clientes</h1>
        <div class="d-flex">
          <a href="/clients/new" class="btn btn-primary d-flex align-items-center">Nuevo cliente</a>
        </div>
      </div>
      <div class="row">
        ${clientList}
      </div>
    </div>
  `;

  return pageWrapper(`Mis Clientes`, html);
}

function viewClientForm(client = {},message) {
  const nav = navBar();
  let action = {
    type: "edit",
    path: `/clients/${client._id}/edit`
  };
  if (!client.name) {
    action = {
      type: "new",
      path: "/clients/new"
    };
    client = {
      name: "",
      description: "",
      image: ""
    }
  }
  const html = `
    ${nav}
    <div class="container">
      ${ message ? `<div class="alert alert-${message.variant}">${message.text}</div>` : '' }
      <form method="POST" action="${action.path}">
        <div class="d-flex justify-content-between">
          <h1>${action.type === 'new' ? 'Nuevo Cliente' : 'Editando Cliente'}</h1>
          <div class="d-flex">
            <button type="submit" class="btn btn-primary d-flex align-items-center">${action.type === 'new' ? 'Nuevo' : 'Guardar'} cliente</button>
          </div>
        </div>
        <div class="mb-2">
          <label for="name" class="form-label">Nombre:</label>
          <input type="text" class="form-control" name="name" id="name" value="${client.name}" required />
        </div>
        <div class="mb-2">
          <label for="" class="form-label">Descripción:</label>
          <textarea class="form-control" id="description" name="description">${client.description}</textarea>
        </div>
        <div class="mb-2">
          <label for="image" class="form-label">Foto:</label>
          <input type="text" class="form-control" name="image" id="image" value="${client.image}" required />
        </div>
      </form>
    </div>
  `;

  return pageWrapper(`${ action.type === "new" ? "Nuevo cliente" : "Editando cliente"}`, html);
}

function confirmDelete(client) {
  const nav = navBar();
  const html = `
    ${ nav }
    <div class="container">
      <form method="POST" action="/clients/${client._id}/delete">
        <div class="alert alert-danger my-3" role="alert">
          Está seguro de que quiere borrar el cliente ${client.name}?
          <div class="mt-3">
            <button class="btn btn-danger" type="submit">Confirmar</button>
            <a href="/clients" class="btn btn-secondary">Cancelar</a>
          </div>
        </div>
      </div>
    </div>
  `;
  return pageWrapper("Eliminando cliente", html);
}

function viewClientInfo(client) {
  const nav = navBar();
  const projects = projectList(client.projects);
  const html = `
    ${ nav }
    <div class="container">
      <div class="d-flex justify-content-between">
        <h1>Información del cliente ${client.name}</h1>
        <div class="d-flex">
          <a href="/clients/${client._id}/edit" class="btn btn-primary d-flex align-items-center">Editar</a>
          <a href="/clients/${client._id}/delete" class="btn btn-danger d-flex align-items-center">Eliminar</a>
        </div>
        <p>${client.description}</p>
        ${projects}
      </div>
    </div>
  `;

  return pageWrapper(`Información del cliente ${client.name}`, html);
}

export {
  viewClientList,
  viewClientForm,
  confirmDelete,
  viewClientInfo
}