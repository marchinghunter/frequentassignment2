import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './Router/router.js'; 

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: process.env.Frontend,
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.listen(PORT, () => {
  console.log('Server is running');
});