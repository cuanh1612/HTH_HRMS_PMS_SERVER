import express from 'express'
import contactController from '../controllers/contact.controller'
const contactRouter = express.Router()

contactRouter.post('/', contactController.send)

export default contactRouter
