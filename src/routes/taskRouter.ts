import express from "express"
import taskController from "../controllers/taskController"


const taskRouter = express.Router()

taskRouter.post('/', taskController.create)

taskRouter.get('/', taskController.getAll)
taskRouter.get('/:id', taskController.getDetail)

taskRouter.delete('/:id', taskController.delete)
taskRouter.post('/delete-many', taskController.deletemany)

taskRouter.put('/position', taskController.changeposition)
taskRouter.put('/:id', taskController.update)



export default taskRouter