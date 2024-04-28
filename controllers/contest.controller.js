import Contest from '../models/Contest.js';
import { CreateSuccess } from '../utils/success.js';
import { CreateError } from "../utils/error.js";


export const createContest = async (req, res, next) => {
    
        
        
        if (req.body && Object.keys(req.body).length > 0) {
            
            
                const newContest = new Contest(req.body);
                
                
                try {
                    await newContest.save();
                    return next(CreateSuccess(200, "Contest  Created successfully", newContest)); // send a success message

                } catch (error) {
                    console.log(error);
                    return next(CreateError(403, "Contest NOT created ::: ", error)); // send an error message
                }
            } else {
                return next(CreateError(403, "Contest NOT created ::: ", error.message)); // send an error message
            }
        
    }
    
    


export const  getAllContest = async (req, res, next) => {
    

    try {
        const contests = await Contest.find({});  // Not specifing any condition to get all roles in the database
    
        return next(CreateSuccess(200, "All contests fetch", contests));  // send a success message

    }
    catch (error) {
    
        return next(CreateError(404, "Server error ::: ", error.message));  // send an error message
    }

}


export const deleteContest = async (req, res, next) => {
    try {
        const { name } = req.body;
        const deletedContest = await Contest.findOneAndDelete({ name });
        
        if (deletedContest) {
            return next(CreateSuccess(200, "Contest deleted successfully", deletedContest));
        } else {
            return next(CreateError(404, "Contest not found"));
        }
    } catch (error) {
        return next(CreateError(500, "Server error", error.message));
    }
}

