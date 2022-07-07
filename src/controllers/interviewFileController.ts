import { Request, Response } from 'express';
import { Interview } from '../entities/Interview';
import { Interview_file } from '../entities/Interview_File';
import { createOrUpdatetInterviewFilesPayload } from '../type/interviewFilePayLoad';
import handleCatchError from "../utils/catchAsyncError";

const interviewFileController = {
    create: handleCatchError(async (req: Request, res: Response) => {
        const { interview, files } = req.body as createOrUpdatetInterviewFilesPayload

        //check exist interview
        const existingInterview = await Interview.findOne({
            where: {
                id: interview,
            }
        })
        if (!existingInterview)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This interview does not exist in the system',
            })
        if (Array.isArray(files)) {
            
            files.map(async (file) => {
                await Interview_file.create({
                    ...file,
                    interview: existingInterview
                }).save()
            })
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new interview files success'
        })
    }),

    delete: handleCatchError(async (req: Request, res: Response) => {
        const { interviewFileId, InterviewId } = req.params

        const existingInterview = await Interview.findOne({
            where: {
                id: Number(InterviewId),
            },
        })
        if (!existingInterview)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This inteview does not existing in the system'
            })

        //check existing interview file
        const existingInterviewFile = await Interview_file.findOne({
            where: {
                id: Number(interviewFileId),
                interview: {
                    id: Number(InterviewId),
                }
            }
        })
        if (!existingInterviewFile)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This interview file does not existing in the system'
            })

        //delete interview file 
        await existingInterviewFile.remove()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete interview file success'
        })
    }),
    getAll: handleCatchError(async (req: Request, res: Response) => {
		const {interviewId } = req.params

        //Check exist inteview
		const existingInterview = await Interview.findOne({
			where: {
				id: Number(interviewId),
			},
		})

		if (!existingInterview)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Interview does not exist in the system',
			})

        //Get all interview file 
        const interviewFiles = await Interview_file.find({
            where: {
               interview: {
                    id: Number(interviewId)
                }
            },
            order: {
                createdAt: "DESC"
            }
        })

        return res.status(200).json({
			code: 200,
			success: true,
           interviewFiles,
			message: 'Get all interview files success successfully',
		})
	}),
}
export default interviewFileController
