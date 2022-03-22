require('dotenv').config();
import express from 'express';
import connectDB from './config/connectDB';
import mainRouter from './routes/mainRouter';
import 'reflect-metadata';

const PORT = process.env.PORT || 4000;

//Create typeorm connection
connectDB();

//Creae and setup express app
const app = express();
app.use(express.json());

//Routes
mainRouter(app);

app.listen(PORT, () => {
  console.log(`Server listen at http://localhost:${PORT}`);
});
