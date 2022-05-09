import { Event } from '../entities/Event'

export type createOrUpdateEventPayload = Event & {
	employees: number[]
	clients: number[]
    isRepeat: boolean
	repeatEvery: number
	typeRepeat: 'Day' | 'Week' | 'Month' | 'Year'
	cycles: number
}
