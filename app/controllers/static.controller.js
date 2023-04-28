import * as view from '../views/static.view.js';

function getHome(req, res) {
  res.send(view.createHomePage());
}

export {
  getHome
}