import express from "express";
import skillController from "../controllers/skillController";


const skillRouter = express.Router()


skillRouter.post('/', skillController.create)

skillRouter.post('/', skillController.createmany)

skillRouter.delete('/:id', skillController.delete)

skillRouter.delete('/delete-many', skillController.deletemany)

skillRouter.get('/', skillController.getAll)

skillRouter.get('/:id', skillController.getdetail)

skillRouter.put('/:id', skillController.update)

export default skillRouter
