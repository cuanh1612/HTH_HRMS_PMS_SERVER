import express from 'express';
import leaveTypeController from '../controllers/leaveType.controller';
import { checkAuth } from '../utils/middleware/checkAuth';

const leaveTypeRouter = express.Router();

leaveTypeRouter.post('/', checkAuth(['Admin']), leaveTypeController.create);

leaveTypeRouter.get('/', leaveTypeController.getAll);


export default leaveTypeRouter;
