import { createOrUpdateDiscussionPayload } from '../../type/DiscussionPayload'

export const discussionValid = {
	createOrUpdate: ({ employee, client, contract, content }: createOrUpdateDiscussionPayload) => {
		let messageError = ''

		if (!(employee || client) || !contract || !content) {
			messageError = 'Pleas enter full field'
			return messageError
		}

		return messageError
	},
}
