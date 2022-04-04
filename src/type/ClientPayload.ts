import { Client } from '../entities/Client'

export type createOrUpdatetClientPayload = Client & {
	client_category: number
	client_sub_category: number
}
