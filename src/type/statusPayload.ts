import { Status } from '../entities/Status'


export type createOrUpdateStatusPayload = Status & {project: number}
