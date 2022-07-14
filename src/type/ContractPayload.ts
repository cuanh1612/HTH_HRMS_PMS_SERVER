import { Contract } from '../entities/Contract'

export type createOrUpdateContractPayload = Contract & {
	client: number
	contract_type: number
	index: number
}
