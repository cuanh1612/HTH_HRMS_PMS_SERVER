import express from 'express'
import projectDiscussionReplyController from '../controllers/projectDiscussionReplyController'


const projectDiscussionReplyRouter = express.Router()

projectDiscussionReplyRouter.post('/', projectDiscussionReplyController.create)

projectDiscussionReplyRouter.get('/pdiscussion/:pdiscussionId', projectDiscussionReplyController.getByProjectDiscussion)

export default projectDiscussionReplyRouter