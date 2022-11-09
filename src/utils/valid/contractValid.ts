import { enumCurrency } from '../../entities/Contract.entity'
import { createOrUpdateContractPayload } from '../../type/ContractPayload'

export const contractValid = {
	createOrUpdate: ({
		subject,
		start_date,
		contract_value,
		currency,
		client,
	}: createOrUpdateContractPayload) => {
		let messageError = ''
		if (!subject || !start_date || !contract_value || !currency || !client) {
			messageError = 'Please enter full field'
			return messageError
		}

		if (
			currency !== enumCurrency.EUR &&
			currency !== enumCurrency.GBP &&
			currency !== enumCurrency.INR &&
			currency !== enumCurrency.USD &&
			currency !== enumCurrency.VND
		) {
			messageError = 'Currentcy not valid'
			return messageError
		}
		return messageError
	},
}
