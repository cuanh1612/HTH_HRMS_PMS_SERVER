import { Request, Response } from 'express';
import { LeaveType } from '../entities/LeaveType';
import handleCatchError from '../utils/catchAsyncError';

const leaveTypeController = {
  getAll: handleCatchError(async (_: Request, res: Response) => {
    const leaveTypes = await LeaveType.find();
    return res.status(200).json({
      code: 200,
      success: true,
      leaveTypes,
      message: 'Get all employees successfully',
    });
  }),

  create: handleCatchError(async (req: Request, res: Response) => {
    const dataNewLeaveType: LeaveType = req.body;

    //Create new data new leave type
    const createLeaveType = LeaveType.create(dataNewLeaveType);
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
