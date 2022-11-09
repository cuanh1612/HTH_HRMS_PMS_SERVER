import { Contract } from '../entities/Contract.entity'

export type createOrUpdateContractPayload = Contract & {
	client: number
	contract_type: number
	index: number
}
