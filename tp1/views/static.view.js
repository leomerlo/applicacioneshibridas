import { pageWrapper, navBar, projectList } from '../utils/views.utils.js'

function viewHomePage(projects) {
  const nav = navBar();
  const html = `
    ${nav}
    <div class="container">
      <h1>Mi Portfolio</h1>
    </div>
  `;

  return pageWrapper('Home', html);
}

export {
  viewHomePage
}