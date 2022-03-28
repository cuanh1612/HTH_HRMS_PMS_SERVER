import { Request, Response } from 'express'
import { Employee } from '../entities/Employee'
import { Leave } from '../entities/Leave'
import { LeaveType } from '../entities/LeaveType'
import { createOrUpdatetLeavePayload } from '../type/LeavePayload'
import handleCatchError from '../utils/catchAsyncError'
import { leaveValid } from '../utils/valid/leaveValid'

const leaveController = {
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const leaves = await Leave.find()
		return res.status(200).json({
			code: 200,
			success: true,
			leaves,
			message: 'Get all leaves successfully',
		})
	}),

	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewLeave: createOrUpdatetLeavePayload = req.body

		//Check valid
		const messageValid = leaveValid.createOrUpdate(dataNewLeave)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check exist employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: dataNewLeave.employee,
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Check exist leave type
		const existingLeaveType = await LeaveType.findOne({
			where: {
				id: dataNewLeave.leave_type,
			},
		})

		if (!existingLeaveType)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Leave type does not exist in the system',
			})

		//Check duration date leave
		if (Array.isArray(dataNewLeave.date)) {
			for (let index = 0; index < dataNewLeave.date.length; index++) {
				const date = dataNewLeave.date[index]

				//Check existing leave date and remove
				const existingLeaveDate = await Leave.createQueryBuilder('leave')
					.where('leave.employeeId = :id', {
						id: dataNewLeave.employee,
					})
					.andWhere('leave.date = :date', {
						date,
					})
					.getOne()

				// Leave already applied for the selected date will update
				if (existingLeaveDate) {
					Leave.update(existingLeaveDate.id, {
						...dataNewLeave,
						date,
					})
				} else {
					//Create new leave
					await Leave.create({
						...dataNewLeave,
						date,
					}).save()
				}
			}
		} else {
			//Check existing leave date and remove
			const existingLeaveDate = await Leave.createQueryBuilder('leave')
				.where('leave.employeeId = :id', {
					id: dataNewLeave.employee,
				})
				.andWhere('leave.date = :date', {
					date: dataNewLeave.date,
				})
				.getOne()

			// Leave already applied for the selected date will update
			if (existingLeaveDate) {
				Leave.update(existingLeaveDate.id, {
					...dataNewLeave,
				})
			} else {
				//Create new leave
				await Leave.create(dataNewLeave).save()
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Created leave successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { leaveId } = req.params

		//Check existing leave
		const existingLeave = await Leave.findOne({
			where: {
				id: Number(leaveId),
			},
		})

		if (!existingLeave)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Leave does not exist in the system',
			})

		//Delete employee
		await existingLeave.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete leave successfully',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { leaves } = req.body
		if (leaves)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please select many leaves to delete',
			})

		for (let index = 0; index < leaves.length; index++) {
			const leaveId = leaves[index]

			//Check existing leave
			const existingLeave = await Leave.findOne({
				where: {
					id: Number(leaveId),
				},
			})

			if (!existingLeave)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Leave does not exist in the system',
				})

			//Delete employee
			await existingLeave.remove()
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete leaves successfully',
		})
	}),
}

export default leaveController
