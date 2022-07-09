import { createOrUpdateJobOfferLetterPayload } from '../../type/JobOfferLetterPayload'

export const jobOfferLetterValid = {
	createOrUpdate: ({
		job,
		job_application,
		salary,
		expected_joining_date,
		exprise_on,
		rate
	}: createOrUpdateJobOfferLetterPayload) => {
		let messageError = ''

		//check exist data
		if (!job || !job_application || !salary || !expected_joining_date || !exprise_on || !rate) {
			messageError = 'Please enter full field 1'
			return messageError
		}

		return messageError
	},
}