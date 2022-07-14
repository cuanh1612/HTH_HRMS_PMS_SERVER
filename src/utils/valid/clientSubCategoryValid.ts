import { createOrUpdateClientSubCategoryPayload } from '../../type/ClientSubCategoryPayload'

export const clientSubCategoryValid = {
	createOrUpdate: (
		{ name }: createOrUpdateClientSubCategoryPayload,
	) => {
		let messageError = ''
		if (!name) {
			messageError = 'Please enter full field'
			return messageError
		}

		return messageError
	},
}

