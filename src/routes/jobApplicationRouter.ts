import express from "express";
import jobApplicationController from "../controllers/jobController";


const jobApplicationRouter = express.Router()


jobApplicationRouter.post('/', jobApplicationController.create)

jobApplicationRouter.delete('/delete-many', jobApplicationController.delete)

jobApplicationRouter.delete('/delete-many', jobApplicationController.deleteMany)


jobApplicationRouter.get('/', jobApplicationController.getAll)

jobApplicationRouter.get('/:id', jobApplicationController.getDetail)

jobApplicationRouter.put('/:id', jobApplicationController.update)

jobApplicationRouter.put('/change-status', jobApplicationController.changeStatusMany)

export default jobApplicationRouter
