import { pageWrapper, navBar, projectList, formatProjectCategory } from '../utils/views.utils.js'

function viewProjectsPage(projects, technologies, category) {
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

function viewForm() {
  const nav = navBar();
  const html = `
    ${nav}
    <div class="container">
      <form method="POST" action="/projects/new">
        <div class="mb-3">
          <label for="name" class="form-label">Nombre:</label>
          <input type="text" name="name" class="form-control" id="name" />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Descripción:</label>
          <textarea type="text" class="form-control" name="description" id="description"></textarea>
        </div>
        <div class="mb-3">
          <label for="link" class="form-label">Link:</label>
          <input type="text" class="form-control" name="link" id="link" />
        </div>
        <div class="mb-3">
          <label for="img" class="form-label">Imagen:</label>
          <input type="text" class="form-control" name="img" id="img" />
        </div>
        <div class="mb-3">
          <span> Section: </span>
          <input type="radio" name="section" value="Mobile" id="section-mobile" />
          <label for="section-mobile" class="form-label">Mobile</label>
          <input type="radio" name="section" value="Landing Page" id="section-landing" />
          <label for="section-landing" class="form-label">Landing Page</label>
          <input type="radio" name="section" value="Web App" id="section-webapp" />
          <label for="section-webapp" class="form-label">Web App</label>
          <input type="radio" name="section" value="eCommerce" id="section-eCom" />
          <label for="section-eCom" class="form-label">E-commerce</label>
          <input type="radio" name="section" value="Games" id="section-games" />
          <label for="section-games" class="form-label">Games</label>
        </div>
        <div class="mb-3">
          <label for="technologies" class="form-label">Tecnologias: (separadas por coma)</label>
          <input type="text" name="technologies" class="form-control" id="technologies" />
        </div>
        <div class="mb-3">
          <button class="btn btn-primary">Crear</button>
        </div>
      </form>
    </div>
  `;
  return pageWrapper(`Nuevo Proyecto`, html);
}

export {
  viewProjectsPage,
  viewForm
}