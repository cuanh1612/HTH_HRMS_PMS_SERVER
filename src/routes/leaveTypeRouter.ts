import express from 'express';
import leaveTypeController from '../controllers/leaveTypeController';

const leaveTypeRouter = express.Router();

leaveTypeRouter.post('/', leaveTypeController.create);

leaveTypeRouter.get('/', leaveTypeController.getAll);


export default leaveTypeRouter;
