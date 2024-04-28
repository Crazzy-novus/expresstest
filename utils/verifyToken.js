import jwt from 'jsonwebtoken';
import { CreateError } from './error.js';
import { CreateSuccess } from './success.js';
import Role from '../models/Role.js';


export const verifyToken = (req, res, next) => {

    // verify the cookiee token
    
    const token = req.cookies.access_token;
    
    if (!token) {
        return next(CreateError(401, "You are nto authenticated!"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err){
            return next(CreateError(403, "Token is not valid!"));
        }
        else{
            
            req.user = user;
        }
        next();
    });
}

export const verifyUser = (req, res, next) => {

    // verify the cookiee token
    verifyToken(req, res, () => {
        
        try {
            if (req.user._id || req.user.isAdmin ) {
               
                next();
            }
            else{
                return next(CreateError(403, "Not authorized/////////////"));
            }
        } catch (error) {
            console.log(error);
            return next(CreateError(403, "cookies error"), error);
            
        }
    })
}

export const verifyAdmin = (req, res, next) => {

    // verify the cookiee token
    
    verifyToken(req, res, () => {
        
        if (req.user.isAdmin) {
            
            next();
        }
        else{
            return next(CreateError(403, "Not authorized********"));
        }
        
    });
}

export const verifyStaff = (req, res, next) => {

    // verify the cookiee token
    
    verifyToken(req, res, async () => {
        const staffRole = await Role.findOne({ role: 'staff' });
        if (!staffRole) {
        console.log('Staff role not found');
        return next(CreateError(403, " Role Not Found"));
        }    
       
        if (req.user.roles[0]._id == staffRole._id) {
            next();
        } else {
            return next(CreateError(403, req.user.roles[0].role+" Not authorized"));
        }
        
    });
}

