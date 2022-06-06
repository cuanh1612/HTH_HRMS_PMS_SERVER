import { createOrUpdatetNotificationPayload } from '../../type/NotificationPayload'

export const notificationValid = {
	createOrUpdate: ({ content, url }: createOrUpdatetNotificationPayload) => {
		let messageError = ''

		if (!content || !url ) {
			messageError = 'Pleas enter full field'
			return messageError
		}

		return messageError
	},
}
