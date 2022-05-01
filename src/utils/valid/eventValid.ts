import { createOrUpdateEventPayload } from '../../type/EventPayload'

export const eventValid = {
	createOrUpdate: ({
		name,
		color,
		where,
		starts_on_date,
		ends_on_date,
		employees,
		clients,
		isRepeat,
		repeatEvery,
		typeRepeat,
		cycles,
	}: createOrUpdateEventPayload) => {
		let messageError = ''

		if (
			!name ||
			!color ||
			!where ||
			!starts_on_date ||
			!ends_on_date ||
			!employees ||
			!clients
		) {
			messageError = 'Pleas enter full field'
			return messageError
		}

		if (!Array.isArray(employees) || employees.length === 0) {
			messageError = 'Please select Employees'
			return messageError
		}

		if (!Array.isArray(clients) || clients.length === 0) {
			messageError = 'Please select Clients'
			return messageError
		}

		if (isRepeat) {
			if (!repeatEvery || !typeRepeat || !cycles) {
				messageError = 'Please enter full field to repeat event'
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
