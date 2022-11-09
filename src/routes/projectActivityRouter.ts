import express from 'express'
import projectActivityController from '../controllers/projectActivity.controller'

const projectActivityRouter = express.Router()


projectActivityRouter.get('/:projectId', projectActivityController.getByProject)

export default projectActivityRouter
