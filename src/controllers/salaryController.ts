import { Request, Response } from 'express'
import { Employee } from '../entities/Employee'
import { Salary } from '../entities/Salary'
import { createOrUpdateSalaryFilesPayload } from '../type/SalaryPayLoad'
import handleCatchError from '../utils/catchAsyncError'
import { salaryValid } from '../utils/valid/salaryValid'

const salaryController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewSalary = req.body as createOrUpdateSalaryFilesPayload
		const { employee } = dataNewSalary

		//Check valid input create new project
		//Check valid
		const messageValid = salaryValid.createOrUpdate(dataNewSalary)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check exist employee
		const existingEmployee = await Employee.find({
			where: {
				id: employee,
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Create new salary
		const createdSalary = await Salary.create({
			...dataNewSalary,
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			salary: createdSalary,
			message: 'Create new Project files successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { salaryId } = req.params

		//Check exist salary
		const existingSalary = await Salary.findOne({
			where: {
				id: Number(salaryId),
			},
		})

		if (!existingSalary)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Salary does not exist in the system',
			})

		//Delete salary
		await existingSalary.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Deleted salary successfully',
		})
	}),

	getAll: handleCatchError(async (_: Request, res: Response) => {
		const salaries: Employee[] = await Employee.createQueryBuilder('employee')
			.leftJoinAndSelect('employee.salaries', 'salary')
			.orderBy('salary.date', 'DESC')
			.getMany()

		const listSalaries = salaries.map(salary => {
			if(salary.salaries && Array.isArray(salary.salaries)){
				let sum = 0
				salary.salaries.map(salaryItem => {
					sum += salaryItem.amount
				})
				return ({
					...salary,
					sumSalaries: sum
				})
			} else {
				return salary
			}
		})

		return res.status(200).json({
			code: 200,
			success: true,
			salaries: listSalaries,
			message: 'Create new Project files success successfully',
		})
	}),

	getHistoryByUser: handleCatchError(async (req: Request, res: Response) => {
		const { employeeId } = req.params

		//Check exist employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: Number(employeeId),
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Get salary history of employee
		const historySalary = await Employee.createQueryBuilder('employee')
			.where('employee.id = :id', {
				id: Number(employeeId),
			})
			.leftJoinAndSelect('employee.salaries', 'salary')
			.orderBy('salary.date', 'DESC')
			.getOne()

		return res.status(200).json({
			code: 200,
			success: true,
			historySalary,
			message: 'Create new Project files successfully',
		})
	}),
}

export default salaryController
