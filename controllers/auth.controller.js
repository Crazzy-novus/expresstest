import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import { CreateSuccess } from '../utils/success.js';
import { CreateError } from "../utils/error.js";
import UserToken from "../models/UserToken.js";

export const register  = async (req, res, next) => {
    //return next(CreateError(500,"My custom error!!"));
    try {
        const role = await Role.find({role: req.body.roles}); // find the role of the user
        console.log(role)
        // check if the role exists
        const salt = await bcrypt.genSalt(10); // generate salt for hashing the password
        const hashedPassword = await bcrypt.hash(req.body.password, salt); // hash the password
        const newUser = new User({ // create a new user 
        email: req.body.email,//
        password: hashedPassword,
        isAdmin: req.body.roles === "admin"? true: req.body.roles === "super_admin"? true: false,
        roles: role,
    });
    await newUser.save(); // save the user to the database
    return next(CreateSuccess(200, "User registered Successfully "));
    } catch (error) {
        console.log(error.message)
        return next(CreateError(500, error.message));
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email}).populate("roles", "role"); // find the user by email 

        if (!user) { // check if the user exists
            return next(CreateError(400, "User not found"));
        }
        const {roles} = user; // get the role of the user

        const validPassword = await bcrypt.compare(req.body.password, user.password); // compare the password
        if (!validPassword) { // check if the password is valid
            return next(CreateError(400, "Invalid Password"));
        }
        if (req.body.roles !== roles[0].role) {
            return next(CreateError(400, "Invalid Role"));
        }
        
        const token = jwt.sign({
            _id: user._id,
            roles: roles,
            isAdmin: user.isAdmin // create a token
        }, process.env.JWT_SECRET);

        res.cookie("access_token", token, {httpOnly: true});
        return next(CreateSuccess(200, "User registered Successfully  test goes here", user)); // send a success message
        
    } catch (error) {
        return next(CreateError(500, error.message));
    }
    
}

export const sendemail = async (req, res, next) => {
    
    const email = req.body.email;
    
    const user = await User.findOne({email: email});
    console.log(user);
    if (!user){
        return next(CreateError(404, "User Not found to reset Password"));
    }
    const payload = {
        email: req.body.email
    }
    const expireTime = 300;
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: expireTime}); 
    const newToken = UserToken( {
        userId: user._id,
        token: token
    });

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
        subject: "reset Password",
        html: `<!-- reset-password-template.hbs -->
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
        </head>
        <body style="font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
        
            <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; width: 400px; margin: auto;">
        
                <header style="background-color: #007BFF; color: #ffffff; padding: 20px; text-align: center;">
                    <h1 style="font-size: 24px; margin: 0;">Password Reset</h1>
                </header>
        
                <section style="padding: 20px;">
                    <p>Hello ${ user.email },</p>
                    <p>You have requested to reset your password. Click the link below to reset your password:</p>
                    <a href="${process.env.LIVE_URL}/resetpassword/${token}" style="background-color: #007BFF; color: #ffffff; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">Reset Password</a>
                    <p>If you did not request this, please ignore this email.</p>
                </section>
        
                <footer style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #888;">© 2022 Your Company</p>
                </footer>
        
            </div>
        
        </body>
        </html>
        `,
    };
    mailTransporter.sendMail(mailDetails, async (err, data) => {
        if(err){
            console.log(err);
            return next (CreateError(500, "Error sending the email"));
        }
        else {
            await newToken.save();
            return next(CreateSuccess(200, "Email sent successfully"));
        }
    })
}


export const resetPassword = async (req, res, next) => {
    const token = req.body.token;
    const newPassword = req.body.password;

    jwt.verify(token, process.env.JWT_SECRET, async (err, data)=> {
        if (err){
            return next(CreateError(400, "Invalid Token"));
        }else {
            const response = data;
            const user = await User.findOne({email: response.email});
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(newPassword, salt);
            user.password = encryptedPassword;
            try{
                const updatedUser = await User.findOneAndUpdate(
                    {_id: user._id},
                    {$set: user},
                    {new: true}

                )
                return next (CreateSuccess(200, "Password reset success"));
            } catch (error) {
                return next (CreateError (500, "Something went wrong"));
            }
        }
    });
}

