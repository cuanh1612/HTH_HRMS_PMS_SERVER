import express from 'express'
import roomController from '../controllers/roomController'

const projectRouter = express.Router()

projectRouter.get('/', roomController.getAll)

export default projectRouter