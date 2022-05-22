import { enumNoteType } from '../../entities/Project_Note'
import { createOrUpdatetProjectNotePayload } from '../../type/projectNotePayLoad'

export const projectNoteValid = {
	createOrUpdate: ({
		project,
		employees,
		title,
		note_type,
	}: createOrUpdatetProjectNotePayload) => {
		let messageError = ''

		//Check exist datas
		if (!title || !project) {
			messageError = 'Please enter full field'
			return messageError
		}

		if (note_type === enumNoteType.PRIVATE && !employees) {
			messageError = 'Please enter full field'
			return messageError
		}

		return messageError
	},
}
