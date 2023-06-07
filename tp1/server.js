import express from "express";
import path from 'path';
import {fileURLToPath} from 'url';
import staticRoutes from './routes/static.routes.js';
import projectRoutes from './routes/projects.routes.js';
import clientsRoutes from './routes/clients.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));

// Cargamos bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

// Cargamos las rutas
app.use(staticRoutes);
app.use(projectRoutes);
app.use(clientsRoutes);

app.listen(2222, () => {
  console.log('Server corriendo en puerto 2222');
})