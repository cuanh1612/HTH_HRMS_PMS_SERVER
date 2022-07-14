import { createOrUpdateTimeLogPayload } from '../../type/TimeLogPayload'
import { compareDateTime } from '../helper'

export const timeLogValid = {
	createOrUpdate: ({
		project,
		task,
		employee,
		starts_on_date,
		starts_on_time,
		ends_on_date,
		ends_on_time,
	}: createOrUpdateTimeLogPayload) => {
		let messageError = ''

		if (
			!employee ||
			!project ||
			!task ||
			!starts_on_date ||
			!starts_on_time ||
			!ends_on_date ||
			!ends_on_time
		) {
			messageError = 'Please enter full field'
			return messageError
		}

		//Check time
		const resultCheckTime = compareDateTime(new Date(starts_on_date).toLocaleDateString(), new Date(ends_on_date).toLocaleDateString(), starts_on_time, ends_on_time)
		if(resultCheckTime) {
			messageError = 'The end time must be greater than the start time of the time log'
			return messageError
		}

		return messageError
	},
}
