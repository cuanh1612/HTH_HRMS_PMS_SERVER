import express from "express";
import interviewController from "../controllers/interviewController";


const interviewRouter = express.Router()


interviewRouter.post('/', interviewController.create)

interviewRouter.delete('/:id', interviewController.delete)

interviewRouter.post('/delete-many', interviewController.deleteMany)

interviewRouter.get('/', interviewController.getAll)

interviewRouter.get('/new', interviewController.getNewByDate)

interviewRouter.get('/:id', interviewController.getDetail)

interviewRouter.put('/status/:id', interviewController.updateStatus)

interviewRouter.put('/:id', interviewController.update)

interviewRouter.get('/job/:jobId', interviewController.getByJob)

export default interviewRouter
