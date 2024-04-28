import express from 'express';
import { createEvent, getAllEvents, registerEvent } from '../controllers/event.controller.js'; // Importing the controller for club

const router = express.Router();  // Through router we can create get post methods for apis

            /* For all CRUD operation we have creates the routes here and the logic for the api routes 
                are written in controller folder. and we just call the controller here
            */
// Create a new club in DB
router.post("/createevent", createEvent );

router.get("/getallevent", getAllEvents);

router.put("/registerevent/:eventId/:userId", registerEvent);

export default router; // Exporting the router so it could be used in server file
