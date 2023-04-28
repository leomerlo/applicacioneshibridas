import path from 'path';
import {fileURLToPath} from 'url';
import express from "express";
import staticRoutes from "./routes/static.routes.js";
import alumnosRoutes from "./routes/alumnos.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(staticRoutes);
app.use(alumnosRoutes);
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.listen(2023, () => {
  console.log('Server corriendo en puerto 2023');
})

