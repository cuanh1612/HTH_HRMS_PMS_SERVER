import { Company_Info } from '../../entities/Company_Info.entity'

export const companyInfoValid = {
	createOrUpdate: (
		{ name, email, website, phone }: Company_Info	) => {
		let messageError = ''
		if (!name || !email || !website || !phone) {
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
