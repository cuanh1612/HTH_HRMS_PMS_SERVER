import { Request, Response } from 'express'
import handleCatchError from '../utils/catchAsyncError'
import sendMail from '../utils/sendNotice'

const contactController = {
    send: handleCatchError(async (req: Request, res: Response) => {
        const {email, subject, content}:{[index: string]: string} = req.body
        await sendMail({
            to: `${process.env.GMAIL}`,
            subject: `${email} - ${subject}`,
            text: content,
            from: email 
        })

        return res.status(200).json({
			code: 200,
			success: true,
			message: 'Send Email successfully',
		})

    }),
}

export default contactController
