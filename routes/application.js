import express from 'express';
import { createApplication, getApplications, getallApplications, updateApplication, deleteApplication } from '../controllers/application.controller.js'; // Importing the controller for application
import {  verifyStaff } from '../utils/verifyToken.js';
import { sendEmail } from '../utils/sendMail.js';

const router = express.Router();  // Through router we can create get post methods for apis

router.post("/createappliaction", createApplication);

router.get("/getapplications/:userId/:clubId", getApplications);

router.get("/getallapplications/", verifyStaff, getallApplications);

router.put("/approved/:applicationId", verifyStaff, updateApplication, sendEmail);

router.delete("/deleteapplication/:applicationId", verifyStaff, deleteApplication, sendEmail);

export default router; // Exporting the router so it could be used in server file
