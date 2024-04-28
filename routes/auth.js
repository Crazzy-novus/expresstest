import express from 'express';
import { login, register, resetPassword, sendemail } from '../controllers/auth.controller.js';

const router = express.Router();

// Register the User
router.post('/register', register);

// Login the User
router.post('/login', login);

// Send the email to the user email address for password reset 
router.post ('/sendemail', sendemail);

router.post('/resetpassword', resetPassword);


// Register as admin


export default router;