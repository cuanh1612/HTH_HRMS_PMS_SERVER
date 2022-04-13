import { Request, Response } from 'express';
import { Contract } from '../entities/Contract';
import { Sign } from '../entities/Sign';
import { createOrUpdateSignPayload } from '../type/SignPayload';
import handleCatchError from '../utils/catchAsyncError';

const signController = {
  create: handleCatchError(async (req: Request, res: Response) => {
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
};

export default signController;