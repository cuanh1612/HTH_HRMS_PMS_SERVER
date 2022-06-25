import express from 'express'
import projectFileController from '../controllers/projectFileController'
import { checkAuth } from '../utils/middleware/checkAuth'


const projectFileRouter = express.Router()

projectFileRouter.post('/', checkAuth([]),  projectFileController.create)

projectFileRouter.delete('/:projectFileId/project/:projectId', checkAuth([]),  projectFileController.delete)

projectFileRouter.get('/project/:projectId', checkAuth([]),  projectFileController.getAll)

export default projectFileRouter

