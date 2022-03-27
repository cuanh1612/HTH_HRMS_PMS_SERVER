import { Request, Response } from 'express';
import { Employee } from '../entities/Employee';
import handleCatchError from '../utils/catchAsyncError';
import { employeeValid } from '../utils/valid/employeeValid';

const employeeController = {
  create: handleCatchError(async (req: Request, res: Response) => {
    const dataNewEmployee: Employee = req.body;

    //Check valid
    const messageValid = employeeValid.create(dataNewEmployee);

    if (messageValid)
      return res.status(400).json({
        code: 400,
        success: false,
        message: messageValid,
      });

    //Create new employee
    const newEmployee = Employee.create({
      ...dataNewEmployee,
    });

    const createdEmployee = await newEmployee.save();

    return res.status(200).json({
      code: 200,
      success: true,
      employee: createdEmployee,
      message: 'Created new employee successfully',
    });
  }),
};

export default employeeController;
