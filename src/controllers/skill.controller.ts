import { Request, Response } from 'express'
import { Skill } from '../entities/Skill.entity'
import handleCatchError from '../utils/catchAsyncError'

const skillController = {
	createMany: handleCatchError(async (req: Request, res: Response) => {
		const { skills }: { skills: string[] } = req.body

		if (!Array.isArray(skills) || skills.length < 1)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter name of skill',
			})

		await Promise.all(
			skills.map(async (skill) => {
				return new Promise(async (resolve) => {
					await Skill.create({
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

		const existingSkill = await Skill.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingSkill)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Skill does not existing in the system',
			})
		;(existingSkill.name = dataUpdateSkill.name), await existingSkill.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update skill success',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingSkill = await Skill.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingSkill)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Skill does not existing in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			skill: existingSkill,
			message: 'Get detail of skill success',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingSkill = await Skill.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingSkill)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Skill does not existing in the system',
			})

		await existingSkill.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete skill success',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { skills } = req.body

		//check array of skill
		if (!Array.isArray(skills) || !skills)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Skill does not exist in the system',
			})

		await Promise.all(
			skills.map(async (id: number) => {
				return new Promise(async (resolve) => {
					const existingskill = await Skill.findOne({
						where: {
							id: id,
						},
					})

					if (existingskill) await Skill.remove(existingskill)
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
