import { createOrUpdateJobApplicationPayload } from '../../type/JobApplicationPayload'

export const jobApplicationValid = {
	createOrUpdate: ({
		name,
		jobs,
		email,
		mobile,
		location,
		picture,
	}: createOrUpdateJobApplicationPayload) => {
		let messageError = ''

		//check exist data
		if (!name || !jobs || !email || !mobile || !location || !picture) {
			messageError = 'Please enter full field'
			return messageError
		}

		const validEmail = validateEmail(email)
		if (!validEmail) {
			messageError = 'Email not valid'
			return messageError
		}

		return messageError
	},
}

//Check valid email function
function validateEmail(email: string) {
	const res =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return res.test(String(email).toLowerCase())
}
