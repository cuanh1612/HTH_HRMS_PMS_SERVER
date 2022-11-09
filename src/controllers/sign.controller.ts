import { Request, Response } from 'express';
import { Contract } from '../entities/Contract.entity';
import { Job_offer_letter } from '../entities/Job_Offer_Letter.entity';
import { Sign } from '../entities/Sign.entity';
import { createOrUpdateSignPayload } from '../type/SignPayload';
import handleCatchError from '../utils/catchAsyncError';

const signController = {
  createConTractSign: handleCatchError(async (req: Request, res: Response) => {
    const {contract, ...dataNewSign}: createOrUpdateSignPayload = req.body;

    //Check exist contract
    const existingContract = await Contract.findOne({
        where: {
            id: contract
        }
    })

    if(!existingContract) return res.status(400).json({
        code: 400,
        success: false,
        message: 'Contract does not exist in the system',
    })

    //Check contract signed
    if(existingContract.sign) return res.status(400).json({
        code: 400,
        success: false,
        message: 'Contract has been signed',
    })

    //Create new sign 
    const newSign = await Sign.create({
        ...dataNewSign
    }).save()

    //Update relationship with contract
    await Contract.update(existingContract.id, {
        sign: newSign
    })

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Signed contract successfully',
    });
  }),

  createJobOfferSign: handleCatchError(async (req: Request, res: Response) => {
    const {jobOfferLetter, ...dataNewSign}: createOrUpdateSignPayload = req.body;

    //Check exist job offer letter
    const existingJobOfferLetter = await Job_offer_letter.findOne({
        where: {
            id: jobOfferLetter
        }
    })

    if(!existingJobOfferLetter) return res.status(400).json({
        code: 400,
        success: false,
        message: 'Job offer letter does not exist in the system',
    })

    //Check job offer letter signed
    if(existingJobOfferLetter.sign) return res.status(400).json({
        code: 400,
        success: false,
        message: 'Job offer letter has been signed',
    })

    //Create new sign 
    const newSign = await Sign.create({
        ...dataNewSign
    }).save()

    //Update relationship with job offer letter
    await Job_offer_letter.update(existingJobOfferLetter.id, {
        sign: newSign
    })

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Signed job offer letter successfully',
    });
  }),
};

export default signController;