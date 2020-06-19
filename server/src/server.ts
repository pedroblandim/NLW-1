import express from 'express'; // npm install @types/express -D
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();

app.use(cors()); // define os domínios que possuem permissão de acesso a api
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads'))); // servir arquivos estáticos

app.listen(3333);