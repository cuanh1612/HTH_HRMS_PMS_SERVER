import { Client } from '../entities/Client'

export type createOrUpdateClientPayload = Client & {
	client_category: number
	client_sub_category: number
	index: number
}
