import { Request, Response } from 'express'
import { Project_discussion_category } from '../entities/Project_Discussion_Category'
import handleCatchError from '../utils/catchAsyncError'

const projectDiscussionCategory = {
    //Create new project discussion category
    create: handleCatchError(async (req: Request, res: Response) => {
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        console.log("sdafsadfasdfsa");
        
        const dataNewCategory: Project_discussion_category = req.body
        const { name } = dataNewCategory

        //Check existing name
        const existingName = await Project_discussion_category.findOne({
            where: {
                name: String(name),
            },
        })

        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project discussion category already exist in the system',
            })

        const createdproject_discussion_category = await Project_discussion_category.create(dataNewCategory).save()

        return res.status(200).json({
            code: 200,
            success: true,
            project_discussion_category: createdproject_discussion_category,
            message: 'Created new project discussion category successfully',
        })
    }),
    //Update project category
    update: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const dataUpdateproject_discussion_category: Project_discussion_category = req.body
        const { name } = dataUpdateproject_discussion_category

        const existingproject_discussion_category = await Project_discussion_category.findOne({
            where: {
                id: Number(id),
            },
        })

        //check existed project_category
        if (!existingproject_discussion_category)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project category does not exist in the system',
            })

        if (name !== existingproject_discussion_category.name) {
            const existingName = await Project_discussion_category.findOne({
                where: {
                    name: String(name),
                },
            })

            if (existingName)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'project_category already exist in the system',
                })
        }

        await Project_discussion_category.update(existingproject_discussion_category.id, {
            ...dataUpdateproject_discussion_category,
        })

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update project category successfully',
        })
    }),

    //Get all project category
    getAll: handleCatchError(async (_: Request, res: Response) => {
        const project_discussion_categories = await Project_discussion_category.find()
        return res.status(200).json({
            code: 200,
            success: true,
            project_discussion_categories: project_discussion_categories,
            message: 'Get all project discussion categories successfully',
        })
    }),

    //Get detail project discussion category
    getDetail: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingproject_discussion_category = await Project_discussion_category.findOne({
            where: {
                id: Number(id),
            },
        })

        if (!existingproject_discussion_category)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'project discussion category does not exist in the system',
            })

        return res.status(200).json({
            code: 200,
            success: true,
            project_category: existingproject_discussion_category,
            message: 'Get detail of project discussion category successfully',
        })
    }),

    //delete project discussion category
    delete: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingproject_discussion_category = await Project_discussion_category.findOne({
            where: {
                id: Number(id),
            },
        })

        if (!existingproject_discussion_category)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project category does not exist in the system',
            })

        //Delete project discussion category
        await existingproject_discussion_category.remove()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete project discussion category successfully',
        })
    }),

}

export default projectDiscussionCategory