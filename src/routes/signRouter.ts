import express from 'express'
import signController from '../controllers/signController'

const signRouter = express.Router()

signRouter.post('/', signController.create)

export default signRouter
