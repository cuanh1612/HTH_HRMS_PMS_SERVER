import { Request, Response } from 'express'
import { Hourly_rate_project } from '../entities/Hourly_rate_project'
import handleCatchError from '../utils/catchAsyncError'

const hourlyRateController = {
	//update holiday
	update: handleCatchError(async (req: Request, res: Response) => {
		const { idProject, idEmployee, hourly_rate} = req.body

        if(!idProject || !idEmployee || !hourly_rate) {
            return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter full fieererlds',
			})
            
        }

        const existHourlyRate = await Hourly_rate_project.findOne({
            where: {
                project: {
                    id: Number(idProject)
                },
                employee: {
                    id: Number(idEmployee)
                }
            }
        })

        if(!existHourlyRate) {
            return res.status(400).json({
				code: 400,
				success: false,
				message: 'This employee is not involved in this project',
			})
        }
        
        existHourlyRate.hourly_rate = Number(hourly_rate)
        await existHourlyRate.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update hourly rate successfully',
		})
	}),
}

export default hourlyRateController
