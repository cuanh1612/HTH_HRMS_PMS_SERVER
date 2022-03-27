import { Request, Response } from 'express';
import { Employee } from '../entities/Employee';
import handleCatchError from '../utils/catchAsyncError';
import { employeeValid } from '../utils/valid/employeeValid';
import argon2 from 'argon2';

const employeeController = {
  create: handleCatchError(async (req: Request, res: Response) => {
    const dataNewEmployee: Employee = req.body;
    console.log(dataNewEmployee);

    //Check valid
    const messageValid = employeeValid.create(dataNewEmployee);

    if (messageValid)
      return res.status(400).json({
        code: 400,
        success: false,
        message: messageValid,
      });

    //Check existing email
    const existingEmployee = await Employee.findOne({
      where: {
        email: dataNewEmployee.email,
      },
    });

    if (existingEmployee)
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Email already exists in the system',
      });

    const hashPassword = await argon2.hash(dataNewEmployee.password);

    //Create new employee
    const newEmployee = Employee.create({
      ...dataNewEmployee,
      password: hashPassword,
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
