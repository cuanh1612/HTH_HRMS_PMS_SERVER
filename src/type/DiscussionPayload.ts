import { Discussion } from '../entities/Discussion'

export type createOrUpdateDiscussionPayload = Discussion & {
	contract: number
    employee: number
    client: number
}
