import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import hbs from 'nodemailer-express-handlebars'
import {resolve} from 'path'

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
	template,
}: {
	to: string
	subject: string
	text?: string
	template?: string
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

	const optionTransporter: any = {
		viewEngine: {
			extName: ".handlebars",
			partialsDir: resolve(__dirname, "templateViews"),
			defaultLayout: false,
			
		},
		viewPath: resolve(__dirname, "../../views"),
		extName: ".handlebars",
	} 
	transporter.use('compile', hbs(optionTransporter))

	const mailOptions: any = {
		from: `${gmail}`,
		subject,
		text,
		to,
		template
	}
	
	transporter.sendMail( mailOptions,
		function (err) {
			if (err) {
				console.log('error', err)
			} else {
				console.log('send email success')
			}
		}
	)
}

export default sendMail
