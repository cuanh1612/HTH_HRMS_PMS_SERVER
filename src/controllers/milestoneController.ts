import { Request, Response } from "express";
import { Milestone } from "../entities/Milestone";
import handleCatchError from "../utils/catchAsyncError";

const mileStoneController = {
    create: handleCatchError( async (req: Request, res: Response) =>{
        const {title, summary} = req.body

        if (! title)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter title of milestone',
            })
        
        await Milestone.create({
            title: title,
            summary: summary
        }).save()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create milestone success'
        })
    }),
    update: handleCatchError( async ( req: Request, res: Response) =>{
        const { id } = req.params
        const dataUpdateMileStone: Milestone = req.body

        const existingMileStone = Milestone.findOne({
            where: {
                id: Number(id)
            }
        })

        if(!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Milestone does not existing in the system',
            })

        await Milestone.update(dataUpdateMileStone.id, {
            ...dataUpdateMileStone,
        })

        return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update milestone successfully',
		})

    }),
    getAll: handleCatchError( async (_: Request, res: Response) =>{
        const milestones = await Milestone.find()
        return res.status(200).json({
			code: 200,
			success: true,
			milestones: milestones,
			message: 'Get all milestone successfully',
		})
    }),
    
    getDetail: handleCatchError( async ( req: Request, res:Response) =>{
        const {id} = req.params
        
        const existingMileStone = await Milestone.findOne({
            where:{
                id: Number(id)
            }
        })

        if(!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system'
            })
        
        return res.status(200).json({
            code: 200,
            success: true,
            milestone: existingMileStone,
            message: 'Get detail of milestone success'
        })

    }),
    
    delete: handleCatchError( async (req: Request, res: Response) =>{
        const {id} = req.params
        
        const existingMileStone = await Milestone.findOne({
            where:{
                id: Number(id)
            }
        })

        if(!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system'
            })
        
        await existingMileStone.remove()
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete of milestone success'
        }) 
    }),

    deleteMany: handleCatchError(async (req: Request, res: Response)=>{
        const { milestones } = req.body
		//check array of milestones
		console.log(milestones)
		if (!Array.isArray(milestones) || !milestones)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'milestone does not exist in the system',
			})

		for (let index = 0; index < milestones.length; index++) {
			const itemmilestone = milestones[index]
			const existingmilestone = await Milestone.findOne({
				where: {
					id: Number(itemmilestone),
				},
			})
			if (existingmilestone) {
				await existingmilestone.remove()
			}
		}
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete milestones successfully',
		})
    }),
    
}

export default mileStoneController