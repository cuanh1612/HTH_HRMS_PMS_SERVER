import handleCatchError from "../utils/catchAsyncError"
import { Request, Response } from 'express'
import { Location } from "../entities/Location"




const locationController = {
   
    createmany: handleCatchError(async (req: Request, res: Response) =>{
        const {locations} : {locations:string[]} = req.body

        if (!Array.isArray(locations) || locations.length <1)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter name of location'
            })

        await Promise.all(locations.map(async location =>{
            return new Promise( async resolve => {

                await Location.create({
                    name: location
                }).save()
                resolve(true)

            })
        }))
        
        return res.status(200).json({
			code: 200,
			success: true,
			message: 'Add location success',
		})

    }),

    getAll: handleCatchError(async (_: Request, res: Response) =>{
            const locations = await Location.find()

            return res.status(200).json({
                code: 200,
                success: true,
                locations,
                message: 'get all locations success'
            })
    }),

    update: handleCatchError(async ( req: Request, res: Response) => {
        const {id} = req.params
        const dataUpdatelocation = req.body
        
        const existinglocation = await Location.findOne({
            where: {
                id: Number(id),
            }
        })

        if(!existinglocation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Location does not existing in the system',
            })
        
        ;(existinglocation.name = dataUpdatelocation.name),

        await existinglocation.save()

        return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update location success',
		})
        
    }),

    getdetail: handleCatchError(async (req: Request,  res: Response) =>{
        const {id} = req.params

        const existinglocation = await Location.findOne({
            where: {
                id: Number(id)
            }
        })

        if(!existinglocation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'location does not existing in the system',
            })
        
        return res.status(200).json({
            code: 200,
            success: true,
            location: existinglocation,
            message: 'Get detail of location success'
        })
    }),

   
    deletemany: handleCatchError(async (req: Request, res: Response) =>{
        const {locations} = req.body

        //check array of location
        if( !Array.isArray(locations) || !locations)
            return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Location does not exist in the system',
            })
        await Promise.all(
            locations.map(async (id: number) => {
                return new Promise(async (resolve) =>{
                    const existinglocation = await Location.findOne({
                        where: {
                            id: id,
                        },
                    })

                    if (existinglocation) await Location.remove(existinglocation)
                    resolve(true)
                })
            })
        )

        return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete Location success',
		})
    })



}

export default locationController