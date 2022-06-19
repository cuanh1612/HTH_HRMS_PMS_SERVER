import { Request, Response } from 'express'
import { Like } from 'typeorm'
import { Holiday } from '../entities/Holiday'
import handleCatchError from '../utils/catchAsyncError'

const holidayController = {
	//Create new holiday
	create: handleCatchError(async (req: Request, res: Response) => {
		const { holidays }: { holidays: Holiday[] } = req.body

		for (let index = 0; index < holidays.length; index++) {
			const itemHoliday = holidays[index]

			//Check date holiday
			const existingHoliday = await Holiday.findOne({
				where: {
					holiday_date: new Date(itemHoliday.holiday_date),
				},
			})
			if (!existingHoliday) {
				await Holiday.create({
					occasion: itemHoliday.occasion,
					holiday_date: itemHoliday.holiday_date,
				}).save()
			} else {
				//update name holiday
				existingHoliday.occasion = itemHoliday.occasion
				await existingHoliday.save()
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Created new holidays successfully',
		})
	}),

	//update holiday
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateholiday: Holiday = req.body

		//Check date holiday existing and delete
		const existingHolidayDate = await Holiday.findOne({
			where: {
				holiday_date: new Date(dataUpdateholiday.holiday_date),
			},
		})

		if (existingHolidayDate){
			await existingHolidayDate.remove()
		}

		//Check existing date holiday
		const existingholiday = await Holiday.findOne({
			where: {
				id: Number(id),
			},
		})

		//check existed holiday
		if (!existingholiday)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'holiday does not exist in the system',
			})

		await Holiday.update(existingholiday.id, {
			...dataUpdateholiday,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update holiday successfully',
		})
	}),
	//Get all holiday
	getAll: handleCatchError(async (req: Request, res: Response) => {
		const { month, year } = req.query

		const holidays = await Holiday.find()
		var data: Holiday[] = holidays
		if(month) {
			data = holidays.filter(e=> {
				return new Date(e.holiday_date).getMonth() + 1 >= Number(month)
			})
		}
		if(year) {
			data = holidays.filter(e=> {
				return new Date(e.holiday_date).getFullYear()  >= Number(year)
			})
		}
		return res.status(200).json({
			code: 200,
			success: true,
			holidays: data,
			message: 'Get all holiday successfully',
		})
	}),
	//Get detail holiday
	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingholiday = await Holiday.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingholiday)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'holiday does not exist in the system',
			})
		return res.status(200).json({
			code: 200,
			success: true,
			holiday: existingholiday,
			message: 'Get detail of holiday successfully',
		})
	}),
	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingholiday = await Holiday.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingholiday)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Holiday does not exist in the system',
			})

		//Delete holiday
		await existingholiday.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete holiday successfully',
		})
	}),

	deletemany: handleCatchError(async (req: Request, res: Response) => {
		const { holidays } = req.body
		//check array of holidays
		console.log(holidays)
		if (!Array.isArray(holidays) || !holidays)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Holiday does not exist in the system',
			})

		for (let index = 0; index < holidays.length; index++) {
			const itemHoliday = holidays[index]
			const existingholiday = await Holiday.findOne({
				where: {
					id: Number(itemHoliday),
				},
			})
			if (existingholiday) {
				await existingholiday.remove()
			}
		}
		
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete holidays successfully',
		})
	}),
}

export default holidayController
