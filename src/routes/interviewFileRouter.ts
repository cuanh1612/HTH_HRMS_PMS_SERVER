import express from 'express'
import interviewFileController from '../controllers/interviewFileController'
import { checkAuth } from '../utils/middleware/checkAuth'


const interviewFileRouter = express.Router()

interviewFileRouter.post('/', checkAuth(['Admin', 'Employee']),  interviewFileController.create)

interviewFileRouter.delete('/:interviewFileId/interview/:InterviewId', checkAuth(['Admin', 'Employee']),  interviewFileController.delete)

interviewFileRouter.get('/interview/:interviewId',  interviewFileController.getAll)

export default interviewFileRouter

