import express from 'express'
import projectDiscussionReplyController from '../controllers/projectDiscussionReplyController'


const projectDiscussionReplyRouter = express.Router()

projectDiscussionReplyRouter.post('/', projectDiscussionReplyController.create)

projectDiscussionReplyRouter.get('/project-discussion-room/:projectDiscussionRoomId', projectDiscussionReplyController.getByProjectDiscussionRoom)

projectDiscussionReplyRouter.delete('/:reply_id', projectDiscussionReplyController.delete)

projectDiscussionReplyRouter.put('/:reply_id', projectDiscussionReplyController.update)

export default projectDiscussionReplyRouter