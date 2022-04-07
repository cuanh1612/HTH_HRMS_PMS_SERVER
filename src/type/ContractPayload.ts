import { Contract } from '../entities/Contract'

export type createOrUpdatetContractPayload = Contract & {
	client: number
}
