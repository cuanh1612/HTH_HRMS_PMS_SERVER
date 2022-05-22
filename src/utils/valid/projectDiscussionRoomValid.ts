import { createOrUpdateProjectDiscussionRoomPayload } from "../../type/createOrUpdateProjectDiscussionRoomPayload"

export const projectDiscussionRoomValid = {
	createOrUpdate: (
		{ title, description, project_discussion_category, project }: createOrUpdateProjectDiscussionRoomPayload,
	) => {
		let messageError = ''

		//Check exist datas
		if (!title || !description || !project_discussion_category || !project ) {
			messageError = 'Please enter full field'
			return messageError
		}

		

		return messageError
	},
}