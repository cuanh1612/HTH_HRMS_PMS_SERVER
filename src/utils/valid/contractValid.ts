import { enumCurrency } from '../../entities/Contract'
import { createOrUpdatetContractPayload } from '../../type/ContractPayload'

export const contractValid = {
	createOrUpdate: ({
		subject,
		start_date,
		contract_value,
		currency,
		client,
	}: createOrUpdatetContractPayload) => {
		let messageError = ''
		if (!subject || !start_date || !contract_value || !currency || !client) {
			messageError = 'Please enter full field'
			return messageError
		}

		if (
			currency !==
			(enumCurrency.EUR &&
				enumCurrency.GBP &&
				enumCurrency.INR &&
				enumCurrency.USD &&
				enumCurrency.VND)
		){
			messageError = 'Currentcy not valid'
			return messageError
		}
			return messageError
	},
}
