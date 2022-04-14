import { Request, Response } from 'express'
import { Contract } from '../entities/Contract'
import { ContractType } from '../entities/ContractType'
import handleCatchError from '../utils/catchAsyncError'

const contractTypeController = {
	//Create new contractype
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewContractType: ContractType = req.body
		const { name } = dataNewContractType

		//check if the name of the contract type already exists
		const existingContractType = await ContractType.findOne({
			where: {
				name: String(name),
			},
		})

		if (existingContractType)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract type already exist in the system',
			})

		const createdContractType = await ContractType.create(dataNewContractType).save()

		return res.status(200).json({
			code: 200,
			success: true,
			contractType: createdContractType,
			message: 'Created new contract type successfully',
		})
	}),

	//update contract type
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpContractType: ContractType = req.body
        console.log(dataUpContractType);
        
		const { name } = dataUpContractType

		const existingContractType = await ContractType.findOne({
			where: {
				id: Number(id),
			},
		})
		//check existed contract type
		if (!existingContractType)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract type does not exist in the system',
			})

        //Check exist name
        if(name !== existingContractType.name){
			console.log('asdf sdfkl sdjf gion ne');
			
            const exisitingName = await ContractType.findOne({
                where: {
                    name
                }
            })

			console.log(exisitingName);
			

            if(exisitingName) 	return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract type already exist in the system',
			})
        }

		await ContractType.update(existingContractType.id, {
			...dataUpContractType,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update contract type successfully',
		})
	}),

	//Get all contract types
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const contractTypes = await ContractType.find()
		return res.status(200).json({
			code: 200,
			success: true,
			contractTypes,
			message: 'Get all designation successfully',
		})
	}),

	//Get detail contract type
	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingContractType = await ContractType.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingContractType)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract type does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			contractType: existingContractType,
			message: 'Get detail of contract type successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingContractType = await Contract.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingContractType)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract type does not exist in the system',
			})

		//Delete contract type
		await existingContractType.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete contract type successfully',
		})
	}),
}

export default contractTypeController
