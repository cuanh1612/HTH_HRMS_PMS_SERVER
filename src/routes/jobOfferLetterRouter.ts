import express from "express";
import jobOfferLetterController from "../controllers/jobOfferLetterController";


const jobOfferLetterRouter = express.Router()


jobOfferLetterRouter.post('/', jobOfferLetterController.create)

jobOfferLetterRouter.delete('/:id', jobOfferLetterController.delete)

jobOfferLetterRouter.post('/delete-many', jobOfferLetterController.deleteMany)

jobOfferLetterRouter.get('/', jobOfferLetterController.getAll)

jobOfferLetterRouter.get('/:id', jobOfferLetterController.getDetail)

jobOfferLetterRouter.get('/job/:JobId', jobOfferLetterController.getByJob)

jobOfferLetterRouter.put('/:id', jobOfferLetterController.update)

export default jobOfferLetterRouter
