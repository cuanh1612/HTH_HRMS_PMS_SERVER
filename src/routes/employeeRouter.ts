import express from 'express';
import employeeController from '../controllers/empoyeeController';

const employeeRouter = express.Router();

employeeRouter.post('/', employeeController.create);

export default employeeRouter;
