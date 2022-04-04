import { createOrUpdatetClientSubCategoryPayload } from '../../type/ClientSubCategoryPayload'

export const clientSubCategoryValid = {
	createOrUpdate: (
		{ name, client_category }: createOrUpdatetClientSubCategoryPayload,
	) => {
		let messageError = ''
		if (!name || !client_category) {
			messageError = 'Please enter full field'
			return messageError
		}

		return messageError
	},
}

