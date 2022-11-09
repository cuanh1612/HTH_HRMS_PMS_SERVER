import { enumCurrency } from '../../entities/Project.entity'
import { createOrUpdateProjectPayload } from '../../type/ProjectPayload'

export const projectValid = {
	createOrUpdate: (
		{ name, start_date, deadline, employees, currency }: createOrUpdateProjectPayload,
		typeValid: 'create' | 'update'
	) => {
		let messageError = ''

		//Check exist datas
		if (!name || !start_date || !deadline) {
			messageError = 'Please enter full field'
			return messageError
		}

		if (typeValid === 'create' && !employees) {
			messageError = 'Pleas enter full field'
			return messageError
		}

		//Check valid time
		const StartDateProject = new Date(start_date)
		const EndDateProject = new Date(deadline)
		if (EndDateProject < StartDateProject) {
			messageError = 'Deadline date project must be greater than start date project'
			return messageError
		}

		//Check enum currency
		if (
			currency &&
			currency !== enumCurrency.EUR &&
			currency !== enumCurrency.GBP &&
			currency !== enumCurrency.INR &&
			currency !== enumCurrency.USD &&
			currency !== enumCurrency.VND
		) {
			messageError = 'Status not valid'
			return messageError
		}

		return messageError
	},
}
