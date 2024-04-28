import clubs from '../models/Clubs.js';
import { CreateSuccess } from '../utils/success.js';
import { CreateError } from "../utils/error.js";



export const createClub = async (req, res, next) => {
    try {
        
        if (req.body && Object.keys(req.body).length > 0) {
            
                const newClub = new clubs(req.body);
                
                
                await newClub.save();
                return next(CreateSuccess(200, "Club Created successfully", newClub)); // send a success message
            } else {
                return next(CreateError(403, "Club NOT created ::: ", error.message)); // send an error message
            }
        
    }
    catch (error) {
        return next(CreateError(404, "Server error ::: ", error.message)); // send an error message

    }
}

export const  getAllClubs = async (req, res, next) => {

    try {
        const club = await clubs.find({}).populate("organizer.organizer_id");  // Not specifing any condition to get all roles in the database
        
        return next(CreateSuccess(200, "All Clubs", club));  // send a success message

    }
    catch (error) {
        return next(CreateError(404, "Server error ::: ", error.message));  // send an error message
    }

}

export const updateClub = async (req, res, next) => {
    
    try {
        const { id } = req.params; // get the user id from the request parameters
        const updateFields = req.body; // get the updated fields from the request body
        
        // Find the user by id and u pdate the specified fields
        const updatedUser = await clubs.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedUser) {
            return next(CreateError(404, "User not found"));
        }

        return next(CreateSuccess(200, "User updated successfully", updatedUser));
    } catch (error) {
        console.log(error);
        return next(CreateError(500, "error occur here", error.message));
    }
}