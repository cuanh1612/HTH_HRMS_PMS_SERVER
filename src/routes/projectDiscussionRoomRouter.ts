import express from 'express'
import projectDiscussionRoomController from '../controllers/projectDiscussionRoomController'


const projectDiscussionRoomRouter = express.Router()

projectDiscussionRoomRouter.post('/', projectDiscussionRoomController.create)

projectDiscussionRoomRouter.get('/:id', projectDiscussionRoomController.getDetail)
projectDiscussionRoomRouter.get('/project/:project_id', projectDiscussionRoomController.getByProject)
projectDiscussionRoomRouter.delete('/:id', projectDiscussionRoomController.Delete)

export default projectDiscussionRoomRouter