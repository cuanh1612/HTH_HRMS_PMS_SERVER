import express from "express";
import statusController from "../controllers/statusController";

 
 const statusRouter = express.Router()

 statusRouter.post('/', statusController.create)
 
 statusRouter.get('/:projectId', statusController.getAll)
 
 statusRouter.put('/position', statusController.changeposition)
 statusRouter.put('/:id', statusController.update)

 statusRouter.delete('/:id', statusController.delete)


 export default statusRouter