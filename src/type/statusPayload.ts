import { Status } from '../entities/Status.entity'


export type createOrUpdateStatusPayload = Status & {project: number}
