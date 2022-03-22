import { createConnection } from 'typeorm';
import { User } from '../entities/User';

const connectDB = () => {
  createConnection({
    type: 'postgres',
    database: 'HTH_HRMS_PMS',
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User]
  })
    .then(() => {
      console.log('Connected DB successfully.');
    })
    .catch((error) => {
      console.log('Connect DB false.', error);
    });
};

export default connectDB;
