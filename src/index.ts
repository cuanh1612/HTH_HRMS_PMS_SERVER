require('dotenv').config();
import express from 'express';
import connectDB from './config/connectDB';
import mainRouter from './routes/mainRouter';
import 'reflect-metadata';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 4000;

//Create typeorm connection
connectDB();

//Creae and setup express app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

//Routes
mainRouter(app);

app.listen(PORT, () => {
  console.log(`Server listen at http://localhost:${PORT}`);
});
