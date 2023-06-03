import { pageWrapper, navBar, projectList, formatProjectCategory } from '../utils/views.utils.js'

function viewProjectsPage(projects, technologies, category, message) {
  const nav = navBar();
  const list = projectList(projects);
  const formattedFilter = formatProjectCategory(category);
  let techList = '';
  technologies.forEach((tech) => {
    techList += `<div class="col"><a href="/projects/${category}/${tech.toLowerCase()}">${tech}</a></div>`
  });
  const html = `
    ${nav}
    <div class="container">
      ${ message ? `<div class="alert alert-${message.variant}">${message.text}</div>` : '' }
      <h1>Projectos en categoria: ${formattedFilter}</h1>
      <div class="row">
        <div class="col">Filtro por tecnologia</div>
        ${techList}
      </div>
      ${list}
    </div>
  `;

  return pageWrapper(`Projectos en categoria ${formattedFilter}`, html);
}

function viewForm(project, message) {
  let action = {};
  if (!project || project === {}) {
    action = {
      type: "new",
      path: `/projects/new`
    };
    project = {
      name: "",
      description: "",
      link: "",
      img: "",
      section: "",
      technologies: [],
    }
  } else {
    action = {
      type: "edit",
      path: `/projects/${project.id}/edit`
    };
  }
  const nav = navBar();
  const html = `
    ${nav}
    <div class="container">
      ${ message ? `<div class="alert alert-${ message.variant }" alert-dismissible role="alert">${ message.text }</div>` : '' }
      <form method="POST" action="${action.path}">
        <div class="mb-3">
          <label for="name" class="form-label">Nombre:</label>
          <input type="text" required name="name" class="form-control" id="name" value="${project.name}" />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Descripción:</label>
          <textarea type="text" required class="form-control" name="description" id="description">${project.description}</textarea>
        </div>
        <div class="mb-3">
          <label for="link" class="form-label">Link:</label>
          <input type="text" required class="form-control" name="link" id="link" value="${project.link}" />
        </div>
        <div class="mb-3">
          <label for="img" class="form-label">Imagen:</label>
          <input type="text" required class="form-control" name="img" id="img" value="${project.img}" />
        </div>
        <div class="mb-3">
          <span> Section: </span>
          <input type="radio" required name="section" ${ project.section === 'Mobile' ? "checked" : "" } value="Mobile" id="section-mobile" />
          <label for="section-mobile" class="form-label">Mobile</label>
          <input type="radio" required name="section" ${ project.section === 'Landing Page' ? "checked" : "" } value="Landing Page" id="section-landing" />
          <label for="section-landing" class="form-label">Landing Page</label>
          <input type="radio" required name="section" ${ project.section === 'Web App' ? "checked" : "" } value="Web App" id="section-webapp" />
          <label for="section-webapp" class="form-label">Web App</label>
          <input type="radio" required name="section" ${ project.section === 'eCommerce' ? "checked" : "" } value="eCommerce" id="section-eCom" />
          <label for="section-eCom" class="form-label">E-commerce</label>
          <input type="radio" required name="section" ${ project.section === 'Games' ? "checked" : "" } value="Games" id="section-games" />
          <label for="section-games" class="form-label">Games</label>
        </div>
        <div class="mb-3">
          <label for="technologies" class="form-label">Tecnologias: (separadas por coma)</label>
          <input type="text" required name="technologies" class="form-control" id="technologies" value="${project.technologies}" />
        </div>
        <div class="mb-3">
          <button class="btn btn-primary">${ action.type === 'new' ? 'Crear' : 'Guardar cambios' }</button>
        </div>
      </form>
    </div>
  `;
  return pageWrapper(`${action === 'new' ? "Nuevo Proyecto" : "Editar proyecto"}`, html);
}

function confirmDelete(project) {
  const nav = navBar();
  const html = `
    ${ nav }
    <div class="container">
      <form method="POST" action="/projects/${project.id}/delete">
        <input type="hidden" name="id" value="${project.id}" />
        <div class="alert alert-danger my-3" role="alert">
          Está seguro de que quiere borrar el proyecto ${project.name}?
          <div class="mt-3">
            <button class="btn btn-danger" type="submit">Confirmar</button>
            <a href="/home" class="btn btn-secondary">Cancelar</a>
          </div>
        </div>
      </div>
    </div>
  `;
  return pageWrapper("Eliminando proyecto", html);
}

export {
  viewProjectsPage,
  viewForm,
  confirmDelete
}