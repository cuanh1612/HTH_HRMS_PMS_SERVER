import { Interview } from "../entities/Interview"


export type createOrUpdateInterviewPayload = Interview & {
	candidate: number
	interviewer: number[]
    start_time: string
	isSendReminder: boolean
}
