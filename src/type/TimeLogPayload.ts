import { Time_log } from '../entities/Time_Log.entity'

export type createOrUpdateTimeLogPayload = Time_log & {
	project: number
	task: number
	employee: number
}
