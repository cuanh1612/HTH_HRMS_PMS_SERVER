import express from "express";
import jobController from "../controllers/job.controller";


const jobRouter = express.Router()


jobRouter.post('/', jobController.create)

jobRouter.delete('/:id', jobController.delete)

jobRouter.post('/delete-many', jobController.deleteMany)

jobRouter.get('/', jobController.getAll)

jobRouter.get('/:id', jobController.getDetail)

jobRouter.put('/status/:id', jobController.updateStatus)

jobRouter.put('/:id', jobController.update)

jobRouter.put('/change-status', jobController.changeStatusMany)

export default jobRouter
