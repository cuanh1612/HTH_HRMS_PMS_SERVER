import { createOrUpdatetTimeLogPayload } from '../../type/TimeLogPayload'

export const timeLogValid = {
	createOrUpdate: ({
		project,
		task,
		employee,
		starts_on_date,
		starts_on_time,
		ends_on_date,
		ends_on_time,
	}: createOrUpdatetTimeLogPayload) => {
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
		const 

		return messageError
	},
}
