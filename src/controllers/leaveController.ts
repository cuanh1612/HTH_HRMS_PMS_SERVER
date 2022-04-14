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

	getDetail: handleCatchError(async (req: Request, res: Response) => {
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

		return res.status(200).json({
			code: 200,
			success: true,
			leave: existingLeave,
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
		if (dataNewLeave.dates && Array.isArray(dataNewLeave.dates)) {
			for (let index = 0; index < dataNewLeave.dates.length; index++) {
				const date = new Date(dataNewLeave.dates[index])

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
						employee: existingEmployee,
						leave_type: existingLeaveType,
						status: dataNewLeave.status,
						reason: dataNewLeave.reason,
						duration: dataNewLeave.duration,
						date,
					})
				} else {
					//Create new leave
					await Leave.create({
						employee: existingEmployee,
						leave_type: existingLeaveType,
						status: dataNewLeave.status,
						reason: dataNewLeave.reason,
						duration: dataNewLeave.duration,
						date,
					}).save()
				}
			}
		} else {
			const date = new Date(dataNewLeave.date)

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
					employee: existingEmployee,
					leave_type: existingLeaveType,
					status: dataNewLeave.status,
					reason: dataNewLeave.reason,
					duration: dataNewLeave.duration,
					date,
				})
			} else {
				//Create new leave
				await Leave.create({
					employee: existingEmployee,
					leave_type: existingLeaveType,
					status: dataNewLeave.status,
					reason: dataNewLeave.reason,
					duration: dataNewLeave.duration,
					date,
				}).save()
			}
		}

		console.log(dataNewLeave.dates)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Created leave successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const dataUpdateLeave: createOrUpdatetLeavePayload = req.body
		const { leaveId } = req.params

		//Check valid
		const messageValid = leaveValid.createOrUpdate(dataUpdateLeave)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing leave
		const leaveUpdate = await Leave.findOne({
			where: {
				id: Number(leaveId),
			},
		})

		if (!leaveUpdate)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Leave does not exist in the system',
			})

		//Check leave accepted or rejected`
		if (leaveUpdate.status !== 'Pending')
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This leave has been processed and cannot be updated',
			})

		//Check exist employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: leaveUpdate.employee.id,
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
				id: dataUpdateLeave.leave_type,
			},
		})

		if (!existingLeaveType)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Leave type does not exist in the system',
			})

		//Check existing leave date and remove
		const existingLeaveDate = await Leave.createQueryBuilder('leave')
			.where('leave.employeeId = :id', {
				id: leaveUpdate.employee.id,
			})
			.andWhere('leave.date = :date', {
				date: dataUpdateLeave.date,
			})
			.getOne()

		// Leave already applied for the selected date will delete
		if (existingLeaveDate && existingLeaveDate.date !== leaveUpdate.date) {
			await existingLeaveDate.remove()
		}

		//Update leave
		await Leave.update(Number(leaveId), {
			date: new Date(dataUpdateLeave.date),
			reason: dataUpdateLeave.reason,
			duration: dataUpdateLeave.duration,
			leave_type: dataUpdateLeave.leave_type,
			status: dataUpdateLeave.status
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated leave successfully',
		})
	}),

	updateStatus: handleCatchError(async (req: Request, res: Response) => {
		const { leaveId } = req.params
		const { status } = req.body

		//Check valid
		const messageValid = leaveValid.updateStatus(status)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

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

		//Update status leave
		await Leave.update(leaveId, {
			status,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated leave successfully',
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
		if (!leaves)
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

			if (existingLeave) {
				//Delete employee
				await existingLeave.remove()
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete leaves successfully',
		})
	}),
}

export default leaveController
