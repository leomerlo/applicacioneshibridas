import { pageWrapper, navBar, projectList } from '../utils/views.utils.js'

function viewHomePage(projects) {
  const nav = navBar();
  const list = projectList(projects);
  const html = `
    ${nav}
    <div class="container">
      ${list}
    </div>
  `;

  return pageWrapper('Home', html);
}

export {
  viewHomePage
}