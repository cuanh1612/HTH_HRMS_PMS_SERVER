import { enumRole } from '../../entities/Employee'
import { createOrUpdateEmployeePayload } from '../../type/EmployeePayload'

export const employeeValid = {
	createOrUpdate: (
		{
			employeeId,
			name,
			email,
			password,
			joining_date,
			hourly_rate,
			role,
			department,
			designation,
		}: createOrUpdateEmployeePayload,
		type: 'create' | 'update'
	) => {
		let messageError = ''
		if (
			!employeeId ||
			!name ||
			!email ||
			!joining_date ||
			!hourly_rate ||
			!department ||
			!designation
		) {
			messageError = 'Please enter full field'
			return messageError
		}

		if (type === 'create') {
			if (!password) {
				messageError = 'Please enter password'
				return messageError
			}
		}

		if (
			role &&
			role !== enumRole.ADMIN &&
			role !== enumRole.EMPLOYEE &&
			role !== enumRole.MANAGER
		) {
			messageError = 'Role not valid'
			return messageError
		}

		const validEmail = validateEmail(email)
		if (!validEmail) {
			messageError = 'Email not valid'
			return messageError
		}

		return messageError
	},

	changeRole: (employeeId: string, role: string) => {
		let messageError = ''

		if (!employeeId || !role) {
			messageError = 'Pleas enter full field'
			return messageError
		}

		if (role !== enumRole.ADMIN && role !== enumRole.EMPLOYEE && role !== enumRole.MANAGER) {
			messageError = 'Role not valid'
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

//Check valid password
export const validatePassword = (password: string)=> {
	const res = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
	return res.test(String(password).toLowerCase());
  }
