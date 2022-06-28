import { Request, Response } from 'express'
import { Work_Experience } from '../entities/Work_Experience'
import handleCatchError from "../utils/catchAsyncError"




const workExperienceController = {
    create: handleCatchError(async (req: Request, res: Response) =>{
        const { name } = req.body

        if(!name){
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field',
            })
        }

        const add_result = await Work_Experience.create({
            name: name
        }).save()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create work experience type success',
            result: add_result,
        })
    }),

   

    getAll: handleCatchError(async (_: Request, res: Response) =>{
            const workExperiences = await Work_Experience.find()

            return res.status(200).json({
                code: 200,
                success: true,
                workExperiences,
                message: 'get all work_experience types success'
            })
    }),

    update: handleCatchError(async ( req: Request, res: Response) => {
        const {id} = req.params
        const dataUpdateWorkExperience = req.body
        
        const existingworkexperience = await Work_Experience.findOne({
            where: {
                id: Number(id),
            }
        })

        if(!existingworkexperience)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Work experience does not existing in the system',
            })
        
        ;(existingworkexperience.name = dataUpdateWorkExperience.name),

        await existingworkexperience.save()

        return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update work experience  success',
		})
        
    }),

    getdetail: handleCatchError(async (req: Request,  res: Response) =>{
        const {id} = req.params

        const existingworkexperience = await Work_Experience.findOne({
            where: {
                id: Number(id)
            }
        })

        if(!existingworkexperience)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Work experience does not existing in the system',
            })
        
        return res.status(200).json({
            code: 200,
            success: true,
            workExperience: existingworkexperience,
            message: 'Get detail of work experience success'
        })
    }),

    delete: handleCatchError(async (req: Request, res: Response) =>{
        const {id} = req.params

        const existingworkexperience = await Work_Experience.findOne({
            where: {
                id: Number(id),
            }
        })

        if(!existingworkexperience)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Work experience does not existing in the system',
            })
    
            await existingworkexperience.remove()

        return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete work experience type success',
		})
    }),

    
}

export default workExperienceController