import express from "express";
import locationController from "../controllers/locationController";


const locationRouter = express.Router()


locationRouter.post('/', locationController.createmany)

locationRouter.delete('/delete-many', locationController.deletemany)

locationRouter.delete('/:id', locationController.delete)

locationRouter.get('/', locationController.getAll)

locationRouter.get('/:id', locationController.getdetail)

locationRouter.put('/:id', locationController.update)

export default locationRouter
