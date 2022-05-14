import express from 'express'
import projectFileController from '../controllers/projectFileController'


const projectFileRouter = express.Router()

projectFileRouter.post('/',  projectFileController.create)

projectFileRouter.delete('/:projectFileId/project/:projectId',  projectFileController.delete)

projectFileRouter.get('/project/:projectId',  projectFileController.getAll)

export default projectFileRouter

