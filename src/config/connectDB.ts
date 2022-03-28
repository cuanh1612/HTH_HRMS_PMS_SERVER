import { createConnection } from 'typeorm';
import { Avatar } from '../entities/Avatar';
import { Department } from '../entities/Department';
import { Designation } from '../entities/Designation';
import { Employee } from '../entities/Employee';
import { Leave } from '../entities/Leave';
import { LeaveType } from '../entities/LeaveType';

const connectDB = () => {
  createConnection({
    type: 'postgres',
    database: 'HTH_HRMS_PMS',
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [Employee, Avatar, Designation, Department, Leave, LeaveType],
  })
    .then(() => {
      console.log('Connected DB successfully.');
    })
    .catch((error) => {
      console.log('Connect DB false.', error);
    });
};

export default connectDB;
