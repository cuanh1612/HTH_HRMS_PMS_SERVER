import express from 'express';
import leaveController from '../controllers/leaveController';

const leaveRouter = express.Router();

leaveRouter.post('/', leaveController.create);
leaveRouter.post('/delete_many', leaveController.deleteMany);

leaveRouter.get('/', leaveController.getAll);

leaveRouter.delete('/:leaveId', leaveController.delete);

export default leaveRouter;
