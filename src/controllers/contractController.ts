import { Request, Response } from 'express'
import { Client } from '../entities/Client'
import { Company_logo } from '../entities/CompanyLogo'
import { Contract } from '../entities/Contract'
import { createOrUpdatetContractPayload } from '../type/ContractPayload'
import handleCatchError from '../utils/catchAsyncError'
import { contractValid } from '../utils/valid/contractValid'

const contractController = {
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const contracts = await Contract.find()
		return res.status(200).json({
			code: 200,
			success: true,
			contracts,
			message: 'Get all contracts successfully',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { contractId } = req.params

		//Check existing contract
		const existingContract = await Contract.findOne({
			where: {
				id: Number(contractId),
			},
		})

		if (!existingContract)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			contract: existingContract,
			message: 'Get detail contract successfully',
		})
	}),

	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewContract: createOrUpdatetContractPayload = req.body

		//Check valid
		const messageValid = contractValid.createOrUpdate(dataNewContract)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing client
		const existingClient = await Client.findOne({
			where: {
				id: dataNewContract.client,
			},
		})

		if (!existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client does not exists in the system',
			})

		//Create new contract
		const newContract = await Contract.create({
			...dataNewContract,
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			contract: newContract,
			message: 'Created new contract successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const dataUpdateContract: createOrUpdatetContractPayload = req.body
		const { contractId } = req.params

		//Check valid
		const messageValid = contractValid.createOrUpdate(dataUpdateContract)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing contract
		const existingContract = await Contract.findOne({
			where: {
				id: Number(contractId),
			},
		})

		if (!existingContract)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract does not exist in the system',
			})

		if (dataUpdateContract.client) {
			//Check existing client
			const existingClient = await Client.findOne({
				where: {
					id: dataUpdateContract.client,
				},
			})

			if (!existingClient)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Client does not exist in the system',
				})
		}

		//Check exist and update company avatar
		const { company_logo, ...dataUpdateContractBase } = dataUpdateContract
		let newCompanyLogo: Company_logo | null = null

		if (company_logo) {
			if (existingContract.company_logo) {
				const existingCompanyLogo = await Company_logo.findOne({
					where: {
						id: existingContract.company_logo.id,
					},
				})

				if (existingCompanyLogo) {
					await Company_logo.update(existingCompanyLogo.id, {
						...company_logo,
					})
				}
			} else {
				newCompanyLogo = await Company_logo.create({
					...company_logo,
				}).save()
			}
		}

		//Update contract
		await Contract.update(
			{
				id: existingContract.id,
			},
			{
				...dataUpdateContractBase,
				...(newCompanyLogo
					? {
							company_logo: newCompanyLogo,
					  }
					: {}),
			}
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated contract successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { contractId } = req.params

		//Check existing contract
		const existingContract = await Contract.findOne({
			where: {
				id: Number(contractId),
			},
		})

		if (!existingContract)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract does not exist in the system',
			})

		//Delete contract
		await existingContract.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete contract successfully',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { contracts } = req.body
		if (!contracts || !Array.isArray(contracts))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please select many contracts to delete',
			})

		for (let index = 0; index < contracts.length; index++) {
			const contractId = contracts[index]

			//Check existing contract
			const existingContract = await Contract.findOne({
				where: {
					id: Number(contractId),
				},
			})

			if (existingContract) {
				//Delete contract
				await existingContract.remove()
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete contracts successfully',
		})
	}),
}

export default contractController
