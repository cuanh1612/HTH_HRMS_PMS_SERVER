import { Event } from '../entities/Event'

export type createOrUpdateEventPayload = Event & {
	employeeEmails: string[]
	clientEmails: string[]
    isRepeat: boolean
	repeatEvery: number
	typeRepeat: 'Day' | 'Week' | 'Month' | 'Year'
	cycles: number
}
