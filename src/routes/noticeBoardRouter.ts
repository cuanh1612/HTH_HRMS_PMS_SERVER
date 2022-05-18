import express from 'express'
import noticeBoardController from '../controllers/noticeBoardController'

const noticeBoardRouter = express.Router()

noticeBoardRouter.post('/', noticeBoardController.create)
noticeBoardRouter.get('/', noticeBoardController.getAll)
noticeBoardRouter.get('/:noticeBoardId', noticeBoardController.getDetail)
noticeBoardRouter.put('/:noticeBoardId', noticeBoardController.update)
noticeBoardRouter.delete('/:noticeBoardId', noticeBoardController.delete)
noticeBoardRouter.post('/delete-many', noticeBoardController.deleteMany)

export default noticeBoardRouter
