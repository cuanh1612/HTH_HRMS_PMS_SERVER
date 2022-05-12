import { createOrUpdateEventPayload } from '../../type/EventPayload'

export const eventValid = {
	createOrUpdate: ({
		name,
		color,
		where,
		starts_on_date,
		ends_on_date,
		employeeEmails,
		clientEmails,
		isRepeat,
		repeatEvery,
		typeRepeat,
		cycles,
		starts_on_time,
		ends_on_time
	}: createOrUpdateEventPayload) => {
		let messageError = ''

		if (
			!name ||
			!color ||
			!where ||
			!starts_on_date ||
			!ends_on_date ||
			!employeeEmails ||
			!clientEmails ||
			!starts_on_time ||
			!ends_on_time
		) {
			messageError = 'Pleas enter full field 1'
			return messageError
		}

		if (!Array.isArray(employeeEmails) || employeeEmails.length === 0) {
			messageError = 'Pleas select Employees'
			return messageError
		}

		if (!Array.isArray(clientEmails) || clientEmails.length === 0) {
			messageError = 'Pleas select Clients'
			return messageError
		}

		if (isRepeat) {
			if (!repeatEvery || !typeRepeat || !cycles) {
				messageError = 'Pleas enter full field to repeat event'
				return messageError
			}
		}

		//Check date valid
		const dateStarts = new Date(starts_on_date)
		const dateEnds = new Date(ends_on_date)
		if (dateEnds < dateStarts) {
			messageError = 'The time of ends on the date must be greater than start on date'
			return messageError
		}

		return messageError
	}, 
}
