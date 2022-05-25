import { createOrUpdateTaskCommentPayload } from '../../type/TaskCommentPayload'

export const taskCommentValid = {
	createOrUpdate: ({ project, content }: createOrUpdateTaskCommentPayload) => {
		let messageError = ''

		if ( !project || !content) {
			messageError = 'Pleas enter full field'
			return messageError
		}

		return messageError
	},
}
