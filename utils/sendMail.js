import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

import { CreateSuccess } from '../utils/success.js';
import { CreateError } from "../utils/error.js";
import UserToken from "../models/UserToken.js";


export const sendEmail = async (req, res, next) => {
    try {
        
        // Get the user details
        const { email, name, type, clubName, application } = req.responseObj; // get responseObj from req

        // Generate the email content based on the type
        let subject, text;
        if (type === 'approval') {
            subject = 'Application Approved';
            text = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Approved Application</title>
                <!-- Tailwind CSS -->
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="bg-gray-100">
                <div class="max-w-2xl mx-auto py-8 px-4">
                    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                        <!-- Header -->
                        <div class="bg-gray-900 text-white px-4 py-2">
                            <h1 class="text-lg font-semibold">Approved</h1>
                        </div>
                        <!-- Content -->
                        <div class="p-4">
                            <p class="text-gray-700">Dear ${name},</p>
                            <p class="text-gray-700">We are excited to inform you that your application to join our club ${clubName} has been approved! Welcome aboard!</p>
                            <!-- Greeting -->
                            <p class="text-gray-700">Thank you for choosing to be a part of our community.</p>
                            <p class="text-gray-700">Best regards,</p>
                            <p class="text-gray-700">[Meptrix]</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `;
        } else if (type === 'rejection') {
            subject = 'Application Rejected';
            text = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Rejected Application</title>
                <!-- Tailwind CSS -->
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="bg-gray-100">
                <div class="max-w-2xl mx-auto py-8 px-4">
                    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                        <!-- Header -->
                        <div class="bg-gray-900 text-white px-4 py-2">
                            <h1 class="text-lg font-semibold">Rejected</h1>
                        </div>
                        <!-- Content -->
                        <div class="p-4">
                            <p class="text-gray-700">Dear ${name},</p>
                            <p class="text-gray-700">We regret to inform you that your application to join our club ${clubName} has been rejected.</p>
                            <!-- Reason for Rejection -->
                            <p class="text-gray-700">Unfortunately, we are unable to proceed with your application at this time. We appreciate your interest nonetheless.</p>
                            <p class="text-gray-700">Best regards,</p>
                            <p class="text-gray-700">[Meptrix]</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `;
        } else {
            throw new Error('Invalid email type');
        }

        // Create the email transporter
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user:"duraivignesh222_bcs25@mepcoeng.ac.in",
                pass: "Durai@22*"
            }
    
        });

        let mailDetails = {
            from: "duraivigneshcs@gmail.com",
            to: email,
            subject: "Club Application"+ type + "for" + clubName + "Club",
            html:text};
        // Send the email
        mailTransporter.sendMail(mailDetails, async (err, data) => {
            if(err){
                console.log(err);
                return next (CreateError(500, "Error sending the email"));
            }
            else {
                
                return next(CreateSuccess(200, "Email sent successfully"),application);
            }
        })

       
    } catch (error) {
        // Handle error and return error response
        console.log(error);
        return next(CreateError(400, 'Failed to send email', error.message));
    }
}
