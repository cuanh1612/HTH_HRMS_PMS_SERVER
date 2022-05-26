import nodemailer from 'nodemailer'
import { google } from 'googleapis'

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
const redirectUri = process.env.GOOGLE_REDIRECT_URL
const gmail = process.env.GMAIL

const oAuth2client = new google.auth.OAuth2({
	clientId,
	clientSecret,
	redirectUri,
})

oAuth2client.setCredentials({
	refresh_token: refreshToken,
})

const sendMail = async ({
	to,
	subject,
	text,
	html,
}: {
	to: string
	subject: string
	text?: string
	html?: string
}) => {
	const accessToken = await oAuth2client.getAccessToken()
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: `${gmail}`,
			clientId,
			clientSecret,
			refreshToken,
			accessToken: accessToken as string,
		},
		secure: true,
	})

	transporter.sendMail(
		{
			from: `${gmail}`,
			subject,
			text,
			html,
			to,
		},
		function (err) {
			if (err) {
				console.log('error')
			} else {
				console.log('send email success')
			}
		}
	)
}

export default sendMail
