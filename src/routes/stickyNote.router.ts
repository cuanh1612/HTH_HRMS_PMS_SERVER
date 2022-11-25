import express from 'express'
import stickyNoteController from '../controllers/stickyNote.controller'
import { checkAuth } from '../utils/middleware/checkAuth'


const stickyNoteRouter = express.Router()

stickyNoteRouter.post('/', checkAuth([]), stickyNoteController.create)


stickyNoteRouter.put('/:id', checkAuth([]), stickyNoteController.update)

stickyNoteRouter.get('/:id', stickyNoteController.getDetail)
stickyNoteRouter.get('/', stickyNoteController.getByEmployee)

stickyNoteRouter.delete('/:id', checkAuth([]), stickyNoteController.delete)


export default stickyNoteRouter