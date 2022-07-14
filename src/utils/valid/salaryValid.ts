import { createOrUpdateSalaryFilesPayload } from '../../type/SalaryPayLoad'

export const salaryValid = {
	createOrUpdate: ({ amount, type, employee, date }: createOrUpdateSalaryFilesPayload) => {
		let messageError = ''

		if (!employee || !type || !employee || !date) {
			messageError = 'Pleas enter full field'
			return messageError
		}

		if (amount <= 0){
			messageError = 'Amount must than 0'
			return messageError
		}

		return messageError
	},
}
