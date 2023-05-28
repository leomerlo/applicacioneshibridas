import { pageWrapper, navBar, projectList, formatProjectCategory } from '../utils/views.utils.js'

function viewProjectsPage(projects, category) {
  const nav = navBar();
  const list = projectList(projects);
  const formattedFilter = formatProjectCategory(category);
  const html = `
    ${nav}
    <div class="container">
      <h1>Projectos en categoria: ${formattedFilter}</h1>
      ${list}
    </div>
  `;

  return pageWrapper(`Projectos en categoria ${formattedFilter}`, html);
}

export {
  viewProjectsPage
}