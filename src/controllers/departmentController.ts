
import { Request, Response } from 'express';
import { Department } from '../entities/Department';
import handleCatchError from "../utils/catchAsyncError";

const departmentController = {
    //Create new department
    create: handleCatchError(async (req: Request, res: Response) => {
        const dataNewDepartment: Department = req.body
        const {name} = req.body
        const createdDepartment = await Department.create(dataNewDepartment).save()
        
        const existingName = await Department.findOne({
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
            department: createdDepartment,
            message: 'Created new Department successfully'
        })
      

    }),
    //update department
    update: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const { name } = req.body
        const dataUpdateDepartment: Department = req.body

        const existingDepartment = await Department.findOne({
            where: {
                id: Number(id),
            },
        })

        const existingName = await Department.findOne({
            where: {
                name: String(name)
            }
        })
         
        //check existed Department
        if (!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            })
        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            })
        await Department.update(existingDepartment.id, {
            ...dataUpdateDepartment
        })

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Department successfully'
        })

    }),
    //Get all department
    getAll: handleCatchError(async (_: Request, res: Response) => {
        const departments = await Department.find()
        return res.status(200).json({
            code: 200,
            success: true,
            departments: departments,
            message: 'Get all department successfully',

        })
    }),
    //Get detail department
    getDetail: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingDepartment = await Department.findOne({
            where: {
                id: Number(id),
            },
        })

        if (!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            })
        return res.status(200).json({
            code: 200,
            success: true,
            departments: existingDepartment,
            message: 'Get detail of Department successfully',
        })
    }),
    delete: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingDepartment = await Department.findOne({
            where: {
                id: Number(id),
            },
        })

        if (!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            })

        //Delete Department
        await existingDepartment.remove()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete Department successfully',
        })
    }),
}


export default departmentController