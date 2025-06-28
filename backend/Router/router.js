import express from 'express';
import {updateUserProfile,getUserProfile,fetchSampleCountry} from '../Controller/fjdController.js'; 

const router = express.Router();


router.put("/users/:id", updateUserProfile);
router.get("/users/:id", getUserProfile);
router.get("/country", fetchSampleCountry);

export default router;
