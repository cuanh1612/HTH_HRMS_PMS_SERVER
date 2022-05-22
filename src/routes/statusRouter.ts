import express from "express";
import statusController from "../controllers/statusController";

 
 const statusRouter = express.Router()

 statusRouter.post('/', statusController.create)
 
 statusRouter.get('/normal/:projectId', statusController.getAll)
 statusRouter.get('/:projectId', statusController.getAllWithTask)

 
 statusRouter.put('/position', statusController.changeposition)
 statusRouter.put('/:id', statusController.update)

 statusRouter.delete('/:id', statusController.delete)


 export default statusRouter