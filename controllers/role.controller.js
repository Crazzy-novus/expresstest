import Role from '../models/Role.js';
import { CreateSuccess } from '../utils/success.js';
import { CreateError } from "../utils/error.js";


export const createRole = async (req, res, next) => {
    try {
        if (req.body.role && req.body.role !== '') {
            
            const newRole = new Role(req.body);
            await newRole.save();
            return next (CreateSuccess(200,"Role Created")) // send a success message
        }
        else {
            return next(CreateError(403, "Role NOT created ::: ", error.message)); // send an error message
            

        }
    }
    catch (error) {
        return next(CreateError(404, "Server error ::: ", error.message)); // send an error message

    }
}

export const updateRole = async (req, res, next) => {
    
    try {
        const role = await Role.findById({_id: req.params.id});  // To get particular id from DB
        
        if (role) {
            const newData = await Role.findByIdAndUpdate(
                req.params.id,
                {$set: req.body},
                { new: true }
            );
            return next (CreateSuccess(200,"Role updated"))
        }
        else {
            return next(CreateError(403, "Role Update failed ::: ", error.message)); // send an error message

        }

    }
    catch (error) {
        return next(CreateError(404, "Server error ::: ", error)); // send an error message

    }
}  

export const  getAllRoles = async (req, res, next) => {

    try {
        const roles = await Role.find({}); // Not specifing any condition to get all roles in the database
        return res.status(200).send(roles);

    }
    catch (error) {
        return res.status(500).send(error.message);
    }

}

export const deleteRole = async (req, res, next) => {
    try {
        const roleId = req.params.id;  // To get particular id from DB
        const role = await Role.findById({_id: roleId}); // To get role in DB
        if (role) {
            await Role.findByIdAndDelete(roleId); // To delete role from DB
            return res.send("Role deleted");
        }
        else {
            return res.status(404).send("Role not found");
        }
    }
    catch( reeor){
        return res.status(500).send(error.message);
    }
}
