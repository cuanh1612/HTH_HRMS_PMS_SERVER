import { Discussion } from '../entities/Discussion.entity'

export type createOrUpdateDiscussionPayload = Discussion & {
	contract: number
    employee: number
    client: number
}
