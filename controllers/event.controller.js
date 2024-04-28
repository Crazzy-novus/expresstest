import { CreateSuccess } from '../utils/success.js';

import { CreateError } from '../utils/error.js';
import Clubs from '../models/Clubs.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

// Function to store an event
export const createEvent = async (req, res, next) => {
    try {
        
        // Find the club based on the club name
        const club = await Clubs.findOne({ club_name: req.body.club_name });
        

        // Check if the club exists
        if (!club) {
            console.error('Club not found');
            return;
        }
        const event = new Event({clubId: club, ...req.body});
        // Save the event to the database
        try {
            const savedEvent = await event.save();
            return next(CreateSuccess(200, "Event Created successfully", savedEvent));
            // Continue with your logic after saving the event...
          } catch (err) {
            console.error('Database error:', err);
          }
        
        
    } catch (error) {
        return next(CreateError(500, "error", error));  
    }
};

// Function to get all events
export const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find({count: { $gt: 0 }});
        return next(CreateSuccess(200, "Events fetched successfully", events));
    } catch (error) {
        return next(CreateError(500, "error", error));  
    }
};

// Function to increment count and add participant to event
export const registerEvent = async (req, res, next) => {
    try {
        const { eventId, userId } = req.params;

        // Find the event based on the eventId
        const event = await Event.findById(eventId);

        // Check if the event exists
        if (!event) {
            console.error('Event not found');
            return;
        }

        // Increment the count value
        event.count -= 1;

        // Add the userId to participants field
        

        // Save the updated event to the database
        try {
            event.participants.push(userId);
            const updatedEvent = await event.save();
            const updatedUser = await User.findByIdAndUpdate(userId, { $push: { registered_events: eventId } });

            if(!updatedUser){
                return next(CreateError(404, "User not found"));
            }
            
            return next(CreateSuccess(200, "Event updated successfully", updatedEvent));
            // Continue with your logic after updating the event...
        } catch (err) {
            console.error('Database error:', err);
        }
    } catch (error) {
        return next(CreateError(500, "error", error));
    }
};


