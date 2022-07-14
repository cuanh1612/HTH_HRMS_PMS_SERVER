import { createOrUpdateNotificationPayload } from '../../type/NotificationPayload'

export const notificationValid = {
	createOrUpdate: ({ content, url }: createOrUpdateNotificationPayload) => {
		let messageError = ''

		if (!content || !url ) {
			messageError = 'Pleas enter full field'
			return messageError
		}

		return messageError
	},
}
