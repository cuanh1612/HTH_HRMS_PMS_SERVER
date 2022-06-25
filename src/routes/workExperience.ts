import express from "express";
import workExperienceController from "../controllers/workExperienceController";


const workExperienceRouter = express.Router()

workExperienceRouter.post('/', workExperienceController.create)

workExperienceRouter.delete('/:id', workExperienceController.delete)

workExperienceRouter.get('/', workExperienceController.getAll)

workExperienceRouter.get('/:id', workExperienceController.getdetail)

workExperienceRouter.put('/:id', workExperienceController.update)

export default workExperienceRouter
