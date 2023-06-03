function pageWrapper(title, content) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <title>${title}</title>
      </head>
      <body>${content}</body>
      <script src="/js/bootstrap.bundle.min.js"></script>
    </html>
  `;

  return html
}

function navBar(active) {
  const html = `
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">TP 1</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="/">Home</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Projectos
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="/projects/mobile">Mobile</a></li>
              <li><a class="dropdown-item" href="/projects/landingPage">Landing Page</a></li>
              <li><a class="dropdown-item" href="/projects/webApp">Web App</a></li>
              <li><a class="dropdown-item" href="/projects/eCommerce">E-commerce</a></li>
              <li><a class="dropdown-item" href="/projects/games">Games</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/projects/new">+ Crear nuevo proyecto</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  `;
  return html;
}

function formatProjectCategory(category) {
  const result = category.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function projectList(projects) {
  let projectList = "";
  let html;

  if(projects.length > 0) {
    projects.forEach(project => {
      let techList = "";
      project.technologies.forEach((tech) => {
        techList += `<li>${tech}</li>`;
      });
      projectList += `
      <li>
        <img src="${project.img}" role="presentation"/>
        <h2><a href="/projects/${project.id}">${project.name}</a></h2> - <a href="/projects/${project.id}/edit">Editar</a> - <a href="/projects/${project.id}/delete">Eliminar</a>
        <p>${project.description}</p>
        <ul>${techList}</ul>
        <a href="${project.link}">Repositorio</a>
      </li>
      `
    });
    html = `
      <ul>${projectList}</ul>
    `;
  } else {
    html = `<h2>No hay projectos para mostrar.</h2>`
  }

  return html;
}

export {
  pageWrapper,
  navBar,
  projectList,
  formatProjectCategory
}