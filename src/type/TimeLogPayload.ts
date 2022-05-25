import { Time_log } from '../entities/Time_Log'

export type createOrUpdatetTimeLogPayload = Time_log & {
	project: number
	task: number
	employee: number
}
