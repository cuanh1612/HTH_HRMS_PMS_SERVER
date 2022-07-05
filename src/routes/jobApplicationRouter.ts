import express from "express";
import jobApplicationController from "../controllers/jobApplicationController";


const jobApplicationRouter = express.Router()


jobApplicationRouter.post('/', jobApplicationController.create)

jobApplicationRouter.delete('/delete-many', jobApplicationController.delete)

jobApplicationRouter.delete('/delete-many', jobApplicationController.deleteMany)


jobApplicationRouter.get('/', jobApplicationController.getAll)

jobApplicationRouter.get('/:id', jobApplicationController.getDetail)

jobApplicationController.get('/:id', jobApplicationController.getByJob)

jobApplicationRouter.put('/:id', jobApplicationController.update)

jobApplicationRouter.put('/change-status', jobApplicationController.changeStatusMany)

jobApplicationRouter.post('/change-skills', jobApplicationController.changeSkills)

export default jobApplicationRouter
