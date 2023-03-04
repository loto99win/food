import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();


import foodRoute from './routes/food.router';
import userRoute from './routes/user.router';

import { dbConnect } from './configs/database.config';
mongoose.set('strictQuery', false);
dbConnect();


const app = express();

app.use(express.json());

//localhost:4200 front-end
//localhost:2000 back-end

app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}));

app.use('/api/foods', foodRoute);
app.use('/api/users', userRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server on listening at port ${process.env.PORT}`);
});