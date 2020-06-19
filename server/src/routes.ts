import express from 'express';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router(); // desacoplar rotas do arquivo principal

const pointsController = new PointsController();
const itemsController = new ItemsController();

// métodos padrões de controllers: 
//      index, show, create, update, delete
routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.post('/points', pointsController.create);


export default routes;

// Estudos extras: 
//      Service Pattern
//      Repository Pattern (Data Mapper)