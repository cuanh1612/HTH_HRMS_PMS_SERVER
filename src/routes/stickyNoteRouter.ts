import express from 'express'
import stickyNoteController from '../controllers/stickyNoteController'
import { checkAuth } from '../utils/middleware/checkAuth'


const stickyNoteRouter = express.Router()

stickyNoteRouter.post('/', checkAuth(['Admin']), stickyNoteController.create)


stickyNoteRouter.put('/:id', checkAuth(['Admin']), stickyNoteController.update)

stickyNoteRouter.get('/:id', stickyNoteController.getDetail)
stickyNoteRouter.get('/', stickyNoteController.getByEmployee)

stickyNoteRouter.delete('/:id', checkAuth(['Admin']), stickyNoteController.delete)


export default stickyNoteRouter