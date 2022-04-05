import { createOrUpdatetClientSubCategoryPayload } from '../../type/ClientSubCategoryPayload'

export const clientSubCategoryValid = {
	createOrUpdate: (
		{ name }: createOrUpdatetClientSubCategoryPayload,
	) => {
		let messageError = ''
		if (!name) {
			messageError = 'Please enter full field'
			return messageError
		}

		return messageError
	},
}

