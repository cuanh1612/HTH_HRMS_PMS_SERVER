import { Request, Response } from 'express';
import { Designation } from '../entities/Designation';
import handleCatchError from "../utils/catchAsyncError";

const designationController = {
    //Create new designation
    create: handleCatchError(async (req: Request, res: Response) => {
        const dataNewdesignation: Designation = req.body
        const { name } = req.body
        const createddesignation = await Designation.create(dataNewdesignation).save()

        //check if the name of the designation already exists
        const existingName = await Designation.findOne({
            where: {
                name: String(name)
            }
        })

        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            })


        return res.status(200).json({
            code: 200,
            success: true,
            designation: createddesignation,
            message: 'Created new designation successfully'
        })

    }),
    //update designation
    update: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const { name } = req.body
        const dataUpdatedesignation: Designation = req.body

        //check if the name of the designation already exists
        const existingName = await Designation.findOne({
            where: {
                name: String(name)
            }
        })
        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            })

        const existingdesignation = await Designation.findOne({
            where: {
                id: Number(id),
            },
        })
        //check existed designation
        if (!existingdesignation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'designation does not exist in the system',
            })
        await Designation.update(existingdesignation.id, {
            ...dataUpdatedesignation
        })

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update designation successfully'
        })

    }),
    //Get all designation
    getAll: handleCatchError(async (_: Request, res: Response) => {
        const designations = await Designation.find()
        return res.status(200).json({
            code: 200,
            success: true,
            designations: designations,
            message: 'Get all designation successfully',

        })
    }),
    //Get detail designation
    getDetail: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingdesignation = await Designation.findOne({
            where: {
                id: Number(id),
            },
        })

        if (!existingdesignation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'designation does not exist in the system',
            })
        return res.status(200).json({
            code: 200,
            success: true,
            designations: existingdesignation,
            message: 'Get detail of designation successfully',
        })
    }),
    delete: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingdesignation = await Designation.findOne({
            where: {
                id: Number(id),
            },
        })

        if (!existingdesignation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'designation does not exist in the system',
            })

        //Delete designation
        await existingdesignation.remove()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete designation successfully',
        })
    }),
}


export default designationController