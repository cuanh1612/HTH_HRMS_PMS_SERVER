import express from 'express'
import noticeBoardController from '../controllers/noticeBoard.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const noticeBoardRouter = express.Router()

noticeBoardRouter.post('/', checkAuth(['Admin']), noticeBoardController.create)
noticeBoardRouter.get('/', checkAuth([]), noticeBoardController.getAll)
noticeBoardRouter.get('/:noticeBoardId', checkAuth([]), noticeBoardController.getDetail)
noticeBoardRouter.get('/notice-to/:noticeTo', checkAuth([]), noticeBoardController.getAllByNoticeTo)
noticeBoardRouter.put('/:noticeBoardId', checkAuth(['Admin']), noticeBoardController.update)
noticeBoardRouter.delete('/:noticeBoardId', checkAuth(['Admin']), noticeBoardController.delete)
noticeBoardRouter.post('/delete-many', checkAuth(['Admin']), noticeBoardController.deleteMany)

export default noticeBoardRouter
