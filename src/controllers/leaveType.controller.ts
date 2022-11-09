import { Request, Response } from 'express';
import { Leave_type } from '../entities/Leave_Type.entity';
import handleCatchError from '../utils/catchAsyncError';

const leaveTypeController = {
  getAll: handleCatchError(async (_: Request, res: Response) => {
    const leaveTypes = await Leave_type.find();
    return res.status(200).json({
      code: 200,
      success: true,
      leaveTypes,
      message: 'Get all employees successfully',
    });
  }),

  create: handleCatchError(async (req: Request, res: Response) => {
    const dataNewLeaveType: Leave_type = req.body;

    //Create new data new leave type
    const createLeaveType = Leave_type.create(dataNewLeaveType);
    const createdLeaveType = await createLeaveType.save();

    return res.status(200).json({
      code: 200,
      success: true,
      leaveType: createdLeaveType,
      message: 'Created leave successfully',
    });
  }),
};

export default leaveTypeController;
