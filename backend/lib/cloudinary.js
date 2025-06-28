import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.coudinary_name,
    api_key: process.env.coudinary_api,
    api_secret: process.env.coudinary_api_secret
});

export default cloudinary;