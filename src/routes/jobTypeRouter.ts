import express from "express";
import jobTypeController from "../controllers/jobTypeController";


const jobTypeRouter = express.Router()

jobTypeRouter.post('/', jobTypeController.create)

jobTypeRouter.delete('/:id', jobTypeController.delete)

jobTypeRouter.get('/', jobTypeController.getAll)

jobTypeRouter.get('/:id', jobTypeController.getdetail)

jobTypeRouter.put('/:id', jobTypeController.update)

export default jobTypeRouter
