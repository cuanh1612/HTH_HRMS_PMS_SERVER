import { Request, Response } from 'express'
import { Designation } from '../entities/Designation'
import handleCatchError from '../utils/catchAsyncError'

const designationController = {
	//Create new designation
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewDesignation: Designation = req.body
		const { name } = dataNewDesignation

		//check if the name of the designation already exists
		const existingName = await Designation.findOne({
			where: {
				name: String(name),
			},
		})

		if (existingName)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Department does not exist in the system',
			})

		const createDesignation = await Designation.create(dataNewDesignation).save()

		return res.status(200).json({
			code: 200,
			success: true,
			designation: createDesignation,
			message: 'Created new designation successfully',
		})
	}),
	//update designation
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateDesignation: Designation = req.body
		const { name } = dataUpdateDesignation

		//Check existing designation
		const existingDesignation = await Designation.findOne({
			where: {
				id: Number(id),
			},
		})
		//check existed designation
		if (!existingDesignation)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'designation does not exist in the system',
			})

		if (name !== existingDesignation.name) {
			//check if the name of the designation already exists
			const existingName = await Designation.findOne({
				where: {
					name: String(name),
				},
			})
			if (existingName)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Designation already exist in the system',
				})
		}

        //Update
		await Designation.update(existingDesignation.id, {
			...dataUpdateDesignation,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update designation successfully',
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

		const existingDesignation = await Designation.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingDesignation)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'designation does not exist in the system',
			})
		return res.status(200).json({
			code: 200,
			success: true,
			designation: existingDesignation,
			message: 'Get detail of designation successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingDesignation = await Designation.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingDesignation)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'designation does not exist in the system',
			})

		//Delete designation
		await existingDesignation.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete designation successfully',
		})
	}),
}

export default designationController
