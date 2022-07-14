import express from "express";
import locationController from "../controllers/locationController";


const locationRouter = express.Router()


locationRouter.post('/', locationController.createMany)

locationRouter.delete('/delete-many', locationController.deleteMany)

locationRouter.delete('/:id', locationController.delete)

locationRouter.get('/', locationController.getAll)

locationRouter.get('/:id', locationController.getDetail)

locationRouter.put('/:id', locationController.update)

export default locationRouter
