import { enumNoteType } from '../../entities/Project_Note.entity'
import { createOrUpdateProjectNotePayload } from '../../type/projectNotePayLoad'

export const projectNoteValid = {
	createOrUpdate: ({
		project,
		employees,
		title,
		note_type,
	}: createOrUpdateProjectNotePayload) => {
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
