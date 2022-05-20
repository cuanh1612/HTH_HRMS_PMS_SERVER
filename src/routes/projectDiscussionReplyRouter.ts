import express from 'express'
import projectDiscussionReplyController from '../controllers/projectDiscussionReplyController'


const projectDiscussionReplyRouter = express.Router()

projectDiscussionReplyRouter.post('/', projectDiscussionReplyController.create)

projectDiscussionReplyRouter.get('/project-discussion-room/:projectDiscussionRoomId', projectDiscussionReplyController.getByProjectDiscussionRoom)

projectDiscussionReplyRouter.get('/:reply_id', projectDiscussionReplyController.getDetail)

projectDiscussionReplyRouter.delete('/:reply_id', projectDiscussionReplyController.delete)

projectDiscussionReplyRouter.put('/:reply_id', projectDiscussionReplyController.update)

export default projectDiscussionReplyRouter