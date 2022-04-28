import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Contract } from '../entities/Contract'
import { Contract_file } from '../entities/Contract_File'
import { createOrUpdatetContractFilesPayload } from '../type/ContractFilePayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'

const contractFileController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const { files, contract } = req.body as createOrUpdatetContractFilesPayload

		//Check exist contract
		const existingContract = await Contract.findOne({
			where: {
				id: contract,
			},
		})

		if (!existingContract)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract does not exist in the system',
			})

		//Create new contract file
		if (Array.isArray(files)) {
			files.map(async (file) => {
				await Contract_file.create({
					...file,
                    contract: existingContract
				}).save()
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create new contract files success successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { contractFileId, contractId } = req.params

		//auth Header here is "Bearer accessToken"
		const authHeader = req.header('Authorization')
		const accessToken = authHeader && authHeader.split(' ')[1]

		if (!accessToken)
			return res.status(401).json({
				code: 401,
				success: false,
				message: 'Not authenticated to perform operations',
			})

		//Decode user
		const decodeUser: UserAuthPayload = verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET as Secret
		) as UserAuthPayload

		//Check exist contract
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

		//Check auth
		if (
			(decodeUser.role !== 'Admin' && decodeUser.role !== 'Client') ||
			(decodeUser.role === 'Client' && decodeUser.email !== existingContract.client.email)
		)
			return res.status(400).json({
				code: 403,
				success: false,
				message: 'You are not authorized to take this action',
			})

		//Check exist contract file
		const existingContractFile = await Contract_file.findOne({
			where: {
				id: Number(contractFileId),
				contract: {
					id: Number(contractId),
				},
			},
		})

		if (!existingContractFile)
			return res.status(400).json({
				code: 400,
				success: false,
				message: `Contract file does not exist in the system ${contractFileId} ${contractId}`,
			})

		//Delete contract file
		await existingContractFile.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete contract file success successfully',
		})
	}),

	getAll: handleCatchError(async (req: Request, res: Response) => {
		const { contractId } = req.params

        //Check exist contract
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

        //Get all contract file 
        const contractFiles = await Contract_file.find({
            where: {
                contract: {
                    id: Number(contractId)
                }
            },
            order: {
                createdAt: "DESC"
            }
        })

        return res.status(200).json({
			code: 200,
			success: true,
            contractFiles,
			message: 'Get all contract files success successfully',
		})
	}),
}

export default contractFileController
