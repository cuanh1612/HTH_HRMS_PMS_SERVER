import { createOrUpdateProjectDiscussionReplyPayload } from "../../type/ProjectDiscussionReplyPayload"


export const projectDiscussionReplyValid = {
	createOrUpdate: (
		{ project_discussion_room, employee, project, reply }: createOrUpdateProjectDiscussionReplyPayload,
	) => {
		let messageError = ''

		//Check exist datas
		if (!reply || !project_discussion_room|| !employee  || !project ) {
			messageError = 'Please enter full field'
			return messageError
		}

		

		return messageError
	},
}