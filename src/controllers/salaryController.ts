import { Request, Response } from 'express'
import { Employee } from '../entities/Employee'
import { Salary } from '../entities/Salary'
import { createOrUpdatetSalaryFilesPayload } from '../type/SalaryPayLoad'
import handleCatchError from '../utils/catchAsyncError'
import { salaryValid } from '../utils/valid/salaryValid'

const salaryController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewSalary = req.body as createOrUpdatetSalaryFilesPayload
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
			message: 'Create new Project files success successfully',
		})
	}),

	getAll: handleCatchError(async (_: Request, res: Response) => {
		const salaries = await Employee.createQueryBuilder('employee')
			.leftJoinAndSelect('employee.salaries', 'salary')
			.getMany()

		return res.status(200).json({
			code: 200,
			success: true,
            salaries,
			message: 'Create new Project files success successfully',
		})
	}),
}

export default salaryController
