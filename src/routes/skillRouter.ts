import express from "express";
import skillController from "../controllers/skillController";
import { checkAuth } from "../utils/middleware/checkAuth";


const skillRouter = express.Router()

skillRouter.post('/', checkAuth(['Admin']), skillController.createmany)

skillRouter.delete('/:id', checkAuth(['Admin']), skillController.delete)

skillRouter.post('/delete-many', checkAuth(['Admin']), skillController.deletemany)

skillRouter.get('/', skillController.getAll)

skillRouter.get('/:id', skillController.getdetail)

skillRouter.put('/:id', checkAuth(['Admin']), skillController.update)

export default skillRouter
