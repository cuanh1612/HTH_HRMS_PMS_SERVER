import { Notice_board } from '../../entities/Notice_Board'

export const noticeBoardValid = {
	createOrUpdate: ({ notice_to, heading, details }: Notice_board) => {
		let messageError = ''

		if (!notice_to || !heading || !details) {
			messageError = 'Pleas enter full field'
			return messageError
		}

		return messageError
	},
}
