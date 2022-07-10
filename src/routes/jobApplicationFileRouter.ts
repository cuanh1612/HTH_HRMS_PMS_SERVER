import express from 'express'
import jobApplicationFileController from '../controllers/jobApplicationFileController'
import { checkAuth } from '../utils/middleware/checkAuth'

const jobApplicationFileRouter = express.Router()

jobApplicationFileRouter.post(
	'/',
	checkAuth(['Admin', 'Employee']),
	jobApplicationFileController.create
)

jobApplicationFileRouter.delete(
	'/:jobApplicationFileId/job-application/:jobApplicationId',
	checkAuth(['Admin', 'Employee']),
	jobApplicationFileController.delete
)

jobApplicationFileRouter.get(
	'/job-application/:jobApplicationId',
	jobApplicationFileController.getAll
)

export default jobApplicationFileRouter
