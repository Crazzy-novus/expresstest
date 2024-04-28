import User from "../models/User.js"
import Role from '../models/Role.js';
import Club from '../models/Clubs.js';
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).populate("roles", "role") // take all  value from data base
        
        return next(CreateSuccess(200, "Users fetched successfully", users));
    } catch (error) {
        return next(CreateError(500,"Internal Server error", error.message));
    }
}


export const getSingleUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate("roles", "role")
        .populate("member_in", 'logo club_name')
        .populate("registered_events", 'logo club_name')
        .populate("staff_in", 'logo club_name')
        .populate("organizer_in", 'logo club_name')
        .populate("registered_events", 'img eventname'); 
        // id is get from the url
        if (!user) {
            return next(CreateError(404,"User not found"));
        }
        return next(CreateSuccess(200, "User fetched successfully", user));
    } catch (error) { 
        return next(CreateError(500,"Internal Server error" , error.message));
    }
}
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params; // get the user id from the request parameters
        const updateFields = req.body; // get the updated fields from the request body

        // Find the user by id and update the specified fields
        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedUser) {
            return next(CreateError(404, "User not found"));
        }

        return next(CreateSuccess(200, "User updated successfully", updatedUser));
    } catch (error) {
        return next(CreateError(500, "Internal Server error", error.message));
    }
}

export const updateRole = async (req, res, next) => {
    
    try {
        const { id } = req.params; // get the user id from the request parameters
        console.log(req.body.role);
        // get the updated role from the request body
        const role = await Role.findOne({ role:  req.body.role }); // find the role by name in the roles collection
        const clubId = req.body.clubId;
        if (!role) {
            return next(CreateError(404, "Role not found"));
        }


        const updateFields = role._id; // update the roles field in the updateFields object
        if (role.role === 'admin' || role.role === 'super-admin') {
            const updatedUser = await User.findByIdAndUpdate(id, { roles: updateFields , isAdmin: true}, { new: true });
            if (!updatedUser) {
                return next(CreateError(404, "User not found"));
            }
    
            return next(CreateSuccess(200, "User role updated successfully", updatedUser));
        }
        else if (role.role === 'staff'){
            const newOrganizer = {
                organizer_id: id, // replace with actual user ID
                role: 'staff' // replace with actual role
            };
            const updatedUser = await User.findByIdAndUpdate(id, { roles: updateFields, isAdmin: false,  $push: { staff_in: clubId } } , { new: true });
            const club = await Club.findById(clubId);
            const existingOrganizer = club.organizer.find(org => org.organizer_id.toString() === newOrganizer.organizer_id.toString());

            if (!existingOrganizer) {
                const updatedClub = await Club.findByIdAndUpdate(clubId, { $push: { organizer: newOrganizer }, $addToSet: { members: id } },{ new: true } );
                if (!updatedClub) {
                    return next(CreateError(404, "User not found"));
                }
            }
            if (!updatedUser) {
                return next(CreateError(404, "User not found"));
            }
            
    
            return next(CreateSuccess(200, "User role updated successfully", updatedUser));
        }

        else if (role.role === 'ob'){
            const newOrganizer = {
                organizer_id: id, // replace with actual user ID
                role: 'ob' // replace with actual role
            };
            const updatedUser = await User.findByIdAndUpdate(id, { roles: updateFields, isAdmin: false,  $push: { organizer_in: clubId } } , { new: true });
            const club = await Club.findById(clubId);
            const existingOrganizer = club.organizer.find(org => org.organizer_id.toString() === newOrganizer.organizer_id.toString());

            if (!existingOrganizer) {
                const updatedClub = await Club.findByIdAndUpdate(clubId, { $push: { organizer: newOrganizer }, $addToSet: { members: id } },{ new: true } );
                if (!updatedClub) {
                    return next(CreateError(404, "User not found"));
                }
            }
            if (!updatedUser) {
                return next(CreateError(404, "User not found"));
            }
            
    
            return next(CreateSuccess(200, "User role updated successfully", updatedUser));
        }
  
    } catch (error) {
        console.log(error);
        return next(CreateError(500, "IError occures here", error));
    }
}

export const revokeRole = async (req, res, next) => {
    try {
        const { id } = req.params; // get the user id from the request parameters
        const role = await Role.findOne({ role: 'student' }); // find the role by name in the roles collection
        if (!role) {
            return next(CreateError(404, "Role not found"));
        }
        const updateFields = role._id; // update the roles field in the updateFields object
        const user = await User.findById(id).populate("roles", "role");
        const {roles} = user;
      
        const organizerIn = user.organizer_in;
        if( roles[0].role === 'ob') {
          
            const Organizer = {
                organizer_id: id, 
                role: 'ob' 
            };
            for (const clubId of organizerIn) {
                const clubid = clubId.toString();
    
                await Club.findByIdAndUpdate(clubid, { $pull: { organizer: Organizer } });
            }
        }
        else {
            
            const Organizer = {
                organizer_id: id, // replace with actual user ID
                role: 'staff' // replace with actual role
            };
            for (const clubId of organizerIn) {
                const clubid = clubId.toString();
    
                await Club.findByIdAndUpdate(clubid, { $pull: { organizer: Organizer } });
            }

        }
        
        
        const updatedUser = await User.findByIdAndUpdate(id, { roles: updateFields , $unset: { organizer_in: "" , isAdmin: false}}, { new: true });

        if (!updatedUser) {
            return next(CreateError(404, "User not found"));
        }
        return next(CreateSuccess(200, "User role updated successfully", updatedUser));
    } catch (error) {
        console.log(error);
        return next(CreateError(500, "Internal Server error", error));
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        
        const { id } = req.params; // get the user id from the request parameters

        // Find the user by id and delete it
        const deletedUser = await User.findByIdAndDelete(id);

        
        if (!deletedUser) {
            return next(CreateError(404, " error here User not found"));
        }

        return next(CreateSuccess(200, "User deleted successfully", deletedUser));
    } catch (error) {
        return next(CreateError(500, "Internal Server error", error.message));
    }
}
