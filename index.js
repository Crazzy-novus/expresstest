import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import roleRoute from './routes/role.js';
import AuthRoute from './routes/auth.js';
import UserRoute from './routes/user.js';
import clubRoute from './routes/club.js';
import EventRoute from './routes/event.js';
import ContestRoute from './routes/contest.js';
import ApplicationRoute from './routes/application.js';
import indexRouter from './routes/routerindex.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';



const server = express();


dotenv.config();
server.use(express.json());
server.use(cookieParser());
server.use(cors(
    {
        origin: "https://jolly-forest-02b734500.5.azurestaticapps.net",
        credentials: true
    }));

server.use("/api/role", roleRoute);
server.use("/api/auth", AuthRoute);
server.use("/api/user", UserRoute);
server.use("/api/club", clubRoute);
server.use("/api/event", EventRoute);
server.use("/api/contest", ContestRoute);
server.use("/api/application", ApplicationRoute);
server.use('/', indexRouter);

// Error Handler Middleware


// Response Handler Middleware
server.use((obj, req, res, next) => {
    const statuscode = obj.status || 500;
    const message = obj.message || "Something went wrong";
    return res.status(statuscode).json({
        success: [200,201,204].some(a=> a === obj.status)? true : false,
        status: statuscode,
        message: message,
        stack: obj.stack,
        data: obj.data? obj.data : false
    });
});

// Database connection
const ConnetMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log('DB connected !!!!!!!!!!!!!!!');
    } catch (error) { 
       console.error('Error: ', error.message);
        console.log('DB connection failed');
    }
}

const port = process.env.PORT || 3000;

server.listen(port, function check (error) {
    ConnetMongoDB();
    if (error) {
        console.error('Error: ', error);
    }
    else {
        console.log('Server is listening at http://localhost:3000');
        console.log ("hello server");
        
    }
});