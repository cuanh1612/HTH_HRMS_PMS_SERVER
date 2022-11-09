import { Interview } from "../entities/Interview.entity"


export type createOrUpdateInterviewPayload = Interview & {
	candidate: number
	interviewer: number[]
    start_time: string
	isSendReminder: boolean
}
