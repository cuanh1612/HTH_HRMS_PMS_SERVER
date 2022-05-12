import { Request, Response } from 'express'
import { getManager  } from 'typeorm'
import { Attendance } from '../entities/Attendance'
import { Employee } from '../entities/Employee'
import { createOrUpdateAttendacePayload } from '../type/AttendacePayload'
import handleCatchError from '../utils/catchAsyncError'
import { attendanceValid } from '../utils/valid/attendanceValid'

const attendanceController = {
	getAll: handleCatchError(async (req: Request, res: Response) => {
		const {date} = req.query
	
		let data = await Employee.find({
			select: {
				id: true,
				name: true,
				avatar: {
					url: true,
				},
				attendances: true
			}
		})

		if(date) {
			data.map(employee=> {
				employee.attendances = employee.attendances.filter(attendance=> {
					return new Date(attendance.date) <= new Date(date as string)
				})
			})
		}

		return res.json({
			code: 200,
			success: true,
			message: 'Mark attendances successfully',
			data: data || []
		})
	}),

	insertOne: handleCatchError(async (req: Request, res: Response) => {
		const {employee, date } : Attendance = req.body
		
		const messageValid = attendanceValid.insertOne(req.body)
		if(messageValid) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})
		}

		const user = await Employee.findOne({
			select: {
				attendances: true
			},
			where: {
				id: Number(employee)
			}
		})

		if(!user) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User not exist',
			})
		}

		const attendanceExist = user?.attendances.find(attendance=> {
		
			return new Date(attendance.date).toLocaleDateString() == new Date(new Date(date).setHours(0,0,0,0)).toLocaleDateString()
		})

		if (attendanceExist) {
			console.log('fdsdfsdf')
			 await Attendance.update(attendanceExist.id, {
				...req.body,
				employee: user,
				date: new Date(date)
			})
		
		} else {
			await Attendance.insert({
				...req.body,
				employee: user,
				date: new Date(date)
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Check attendance successfully',
		})
	}),

	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewAttendances: createOrUpdateAttendacePayload = req.body
		const { mark_attendance_by, dates, employees, month, year, employee, date } =
			dataNewAttendances

		//Check valid
		const messageValid = attendanceValid.createOrUpdate(dataNewAttendances)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		if (mark_attendance_by === 'Date' && dates.length > 0 && employees.length > 0) {
			for (let index = 0; index < dates.length; index++) {
				const date = dates[index]

				for (let index = 0; index < employees.length; index++) {
					const employeeId = employees[index]

					//Get exist employee
					const existingEmployee = await Employee.findOne({
						where: {
							id: Number(employeeId),
						},
					})

					//Check exist attendance
					const existingAttendance = await getManager()
						.getRepository(Attendance)
						.createQueryBuilder('attendance')
						.where('attendance.employeeId = :id', { id: employeeId })
						.andWhere('attendance.date = :date', { date })
						.getOne()

					//Create new attendance
					existingEmployee &&
						!existingAttendance &&
						(await Attendance.create({
							...dataNewAttendances,
							date,
							employee: existingEmployee,
						}).save())
				}
			}
		} else if (mark_attendance_by === 'Month' && employees.length > 0) {
			//Set date start mark attendance is 1
			let dateMark = new Date(`4-1-${year}`)

			//Get date next month
			const dateNextMonth = new Date(`${Number(month) + 1}-1-${year}`)

			//Get date now -1
			let dateNow = new Date()
			dateNow.setDate(dateNow.getDate() - 1)

			while (dateMark < dateNextMonth && dateMark < dateNow) {
				for (let index = 0; index < employees.length; index++) {
					const employeeId = employees[index]

					//Get exist employee
					const existingEmployee = await Employee.findOne({
						where: {
							id: Number(employeeId),
						},
					})

					//Check exist attendance
					const existingAttendance = await getManager()
						.getRepository(Attendance)
						.createQueryBuilder('attendance')
						.where('attendance.employeeId = :id', { id: employeeId })
						.andWhere('attendance.date = :date', { date: dateMark })
						.getOne()

					//Create new attendance
					existingEmployee &&
						!existingAttendance &&
						(await Attendance.create({
							...dataNewAttendances,
							date: dateMark,
							employee: existingEmployee,
						}).save())

					//increase datemark 1 day
					dateMark.setDate(dateMark.getDate() + 1)
				}
			}
		} else {
			//Get exist employee
			const existingEmployee = await Employee.findOne({
				where: {
					id: Number(employee),
				},
			})

			//Check exist attendance
			const existingAttendance = await getManager()
				.getRepository(Attendance)
				.createQueryBuilder('attendance')
				.where('attendance.employeeId = :id', { id: employee })
				.andWhere('attendance.date = :date', { date })
				.getOne()

			//Create new attendance
			existingEmployee &&
				!existingAttendance &&
				(await Attendance.create({
					...dataNewAttendances,
					date,
					employee: existingEmployee,
				}).save())
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Mark attendances successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpAttendances: Attendance = req.body

		//Check exist attendance
		const exisitingAttendance = await Attendance.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!exisitingAttendance)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Attendance does not exist in the system',
			})

		await Attendance.update(id, {
			...dataUpAttendances,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update attendance successfully',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		//Check existing attendance
		const existingAttendance = await Attendance.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingAttendance)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Attendance does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			attendance: existingAttendance,
			message: 'Get detail attendance successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		//Check existing attendance
		const existingAttendance = await Attendance.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingAttendance)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Attendance does not exist in the system',
			})

		//Delete attendance
		await existingAttendance.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete attendance successfully',
		})
	}),
}

export default attendanceController
