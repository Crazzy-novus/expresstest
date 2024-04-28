import ClubApplication from "../models/ClubApplication.js";
import User from "../models/User.js";
import Club from "../models/Clubs.js";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";
import { sendEmail } from "../utils/sendMail.js";

export const createApplication = async (req, res, next) => {
    
    try {
        
        if (req.body && Object.keys(req.body).length > 0) {
            
                const newClubApplication = new ClubApplication(req.body);
                
                
                await newClubApplication.save();
                return next(CreateSuccess(200, "ClubApplication Created successfully", newClubApplication)); // send a success message
            } else {
                
                return next(CreateError(403, "ClubApplication NOT created ::: ", error.message)); // send an error message
            }
        
    }
    catch (error) {
        
        return next(CreateError(404, "Server error ::: ", error)); // send an error message

    }
}

export const getApplications = async (req, res, next) => {
   
    try {
        const { userId, clubId } = req.params;
    
        const clubApplications = await ClubApplication.findOne({ClubId: clubId, UserId: userId});
        if (!clubApplications) {
            return next(CreateError(404, "ClubApplications not found", clubApplications)); // send an error message
        }

        return next(CreateSuccess(200, "ClubApplications fetched successfully", clubApplications)); // send a success message
    } catch (error) {

        return next(CreateError(404, "Server error ::: ", error)); // send an error message
    }
}

export const getallApplications = async (req, res, next) => {
    try {
        const application = await ClubApplication.find({status: "pending"})
        .populate("ClubId", 'club_name')
        .populate("UserId", 'name profile email branch year');
        
        if (!application) {
            return next(CreateError(404, "ClubApplications not found", application)); // send an error message
        }
        return next(CreateSuccess(200, "ClubApplications fetched successfully", application)); // send a success message
    } catch (error) {
        return next(CreateError(404, "Server error ::: ", error)); // send an error message
    } 
}  

export const updateApplication = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const application = await ClubApplication.findByIdAndUpdate(applicationId, { status: "approved" }, { new: true });
        if (!application) {
            return next(CreateError(404, "ClubApplication not found", application)); // send an error message
        }
        const {userId, clubId } = req.body;

        const user = await User.findByIdAndUpdate(userId, { $push: { member_in: clubId } }, { new: true });

        if (!user) {
            return next(CreateError(404, "User not found", user)); // send an error message
        }
        const club = await Club.findByIdAndUpdate(clubId, { $push: { members: userId } }, { new: true });

        if (!club) {
            return next(CreateError(404, "Club not found", club)); // send an error message
        }

        // Call the send email function here
        let responseObj = {
            email: user.email,
            name: user.name,
            type: "approval",
            clubName: club.club_name,
            message: "ClubApplication updated successfully",
            application: application
          };

        req.responseObj = responseObj;
        next(); // send a success message
    } catch (error) {
        return next(CreateError(404, "Server error ::: ", error)); // send an error message
    }
}

export const deleteApplication = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const application = await ClubApplication.findByIdAndDelete(applicationId);
        if (!application) {
            return next(CreateError(404, "ClubApplication not found", application)); // send an error message
        }
        const {UserId, ClubId } = application;
        const user = await User.findByIdAndUpdate(UserId, { $pull: { member_in: ClubId } }, { new: true });

        if (!user) {
            return next(CreateError(404, "User not found", user)); // send an error message
        }

        const club = await Club.findByIdAndUpdate(ClubId, { $pull: { members: UserId } }, { new: true });

        if (!club) {
            return next(CreateError(404, "Club not found", club)); // send an error message
        }
        let responseObj = {
            email: user.email,
            name: user.name,
            type: "rejection",
            clubName: club.club_name,
            message: "ClubApplication updated successfully",
            application: application
        };
        req.responseObj = responseObj;
        next(); // send a success message
    } catch (error) {
        res.status(404).json(CreateError(404, "Server error ::: ", error)); // send an error message
    }
}
