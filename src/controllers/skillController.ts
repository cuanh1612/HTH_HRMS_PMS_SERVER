import { Request, Response } from 'express'
import { Skill } from '../entities/Skill'
import handleCatchError from '../utils/catchAsyncError'

const skillController = {
	createmany: handleCatchError(async (req: Request, res: Response) => {
		const { skills }: { skills: string[] } = req.body

		if (!Array.isArray(skills) || skills.length < 1)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter name of skill',
			})

		await Promise.all(
			skills.map((skill) => {
				return new Promise((resolve) => {
					Skill.create({
						name: skill,
					}).save()
					resolve(true)
				})
			})
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Add skills success',
		})
	}),

	getAll: handleCatchError(async (_: Request, res: Response) => {
		const skills = await Skill.find()

		return res.status(200).json({
			code: 200,
			success: true,
			skills,
			message: 'get all skills success',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateSkill = req.body

		const existingskill = await Skill.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingskill)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Skill does not existing in the system',
			})
		;(existingskill.name = dataUpdateSkill.name), await existingskill.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update skill success',
		})
	}),

	getdetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingskill = await Skill.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingskill)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Skill does not existing in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			skill: existingskill,
			message: 'Get detail of skill success',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingskill = await Skill.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingskill)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Skill does not existing in the system',
			})

		await existingskill.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete skill success',
		})
	}),

	deletemany: handleCatchError(async (req: Request, res: Response) => {
		const { skills } = req.body

		//check array of skill
		if (!Array.isArray(skills) || !skills)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Skill does not exist in the system',
			})

		const dlManyHandle = async (id: number) => {
			const existingskill = await Skill.findOne({
				where: {
					id: id,
				},
			})

			if (existingskill) await Skill.remove(existingskill)
		}

		await Promise.all(
			skills.map((id: number) => {
				return new Promise((resolve) => {
					dlManyHandle(id)
					resolve(true)
				})
			})
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete skills success',
		})
	}),
}

export default skillController
