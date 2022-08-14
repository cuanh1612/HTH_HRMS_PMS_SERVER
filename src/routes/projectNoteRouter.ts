import express from 'express'
import projectNoteController from '../controllers/projectNoteController'
import { checkAuth } from '../utils/middleware/checkAuth'


//Check auth in controller

const projectNoteRouter = express.Router()

projectNoteRouter.post('/', checkAuth([]),  projectNoteController.create)

projectNoteRouter.put('/:projectNoteId',  projectNoteController.update)

projectNoteRouter.delete('/:projectNoteId',  projectNoteController.delete)

projectNoteRouter.post('/delete-many',  projectNoteController.deleteMany)

projectNoteRouter.get('/project/:projectId',  projectNoteController.getByProject)

projectNoteRouter.get('/:projectNoteId',  projectNoteController.getDetail)

export default projectNoteRouter

