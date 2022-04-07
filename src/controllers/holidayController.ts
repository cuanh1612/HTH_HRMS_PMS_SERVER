
import { Request, Response } from 'express';
import { Holiday } from '../entities/Holiday';
import handleCatchError from "../utils/catchAsyncError";

const holidayController = {
    //Create new holiday
    create: handleCatchError(async (req: Request, res: Response) => {

        const { holidays }: { holidays: Holiday[] } = req.body

        for (let index = 0; index < holidays.length; index++) {
            const itemHoliday = holidays[index];

            const existingName = await Holiday.findOne({
                where: {
                    holiday_date: itemHoliday.holiday_date,
                    occasion: itemHoliday.occasion
                }
            })
            if (!existingName) {

                await Holiday.create({
                    occasion: itemHoliday.occasion,
                    holiday_date: itemHoliday.holiday_date
                }).save()
            }
            console.log('tjhvg hjkhkhbk');

        }

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Created new holiday successfully',
        })

    }),

    //update holiday
    update: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const dataUpdateholiday: Holiday = req.body

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
            ...dataUpdateholiday
        })

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update holiday successfully'
        })

    }),
    //Get all holiday
    getAll: handleCatchError(async (_: Request, res: Response) => {
        const holidays = await Holiday.find()
        return res.status(200).json({
            code: 200,
            success: true,
            holidays: holidays,
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
            holidays: existingholiday,
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
        const { holidays } = req.params
        //check array of holidays
        if (!Array.isArray(holidays) || !holidays)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Holiday does not exist in the system'
            })

        for (let index = 0; index < holidays.length; index++) {
            const itemHoliday = holidays[index];
            const existingholiday = await Holiday.findOne({
                where: {
                    id: itemHoliday.id
                }
            })
            if (!existingholiday)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Holiday does not exist in the system',
                })
            await existingholiday.remove()

        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete holiday successfully',
        })


    })
}


export default holidayController