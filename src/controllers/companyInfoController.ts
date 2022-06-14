import { Request, Response } from 'express'
import { Company_Info } from '../entities/Company_Info'
import handleCatchError from '../utils/catchAsyncError'

const companyInfoController = {
    //Get info company 
    getInfo: handleCatchError(async (_: Request, res: Response) => {
        const companyInfo = (await Company_Info.find({}))[0]

        if(!companyInfo) {
            //Create new comany info
            const createdCompanyInfo = await Company_Info.create({
                name: "HUPROM",
                email: "hoangdev161201@gmail.com",
                phone: "84833876372",
                website: "huprom.com"
            }).save()

            return res.status(200).json({
                code: 200,
                success: true,
                companyInfo: createdCompanyInfo,
                message: 'Get company info suscessfully',
            })
        }

        return res.status(200).json({
			code: 200,
			success: true,
            companyInfo,
			message: 'Get company info suscessfully',
		})

    }),

	//update companyInfo
	update: handleCatchError(async (req: Request, res: Response) => {
		const {email, website, name, phone}: Company_Info = req.body

		const companyInfo = (await Company_Info.find({}))[0]

        if(!companyInfo) {
            //Create new comany info
            await Company_Info.create({
                name: name ? name : "HUPROM",
                email: email ? email : "hoangdev161201@gmail.com",
                phone: phone ? phone : "84833876372",
                website: website ? website : "huprom.com"
            }).save()

            return res.status(200).json({
                code: 200,
                success: true,
                message: 'Update Company Info Successfully',
            })
        }

        //Update companyInfo
        Company_Info.update(companyInfo.id, {
            name: name ? name : undefined,
            website: website ? website : undefined,
            phone: phone ? phone : undefined,
            email: email ? email : undefined,
        })

        return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update Company Info Successfully',
		})

	}),
}

export default companyInfoController
