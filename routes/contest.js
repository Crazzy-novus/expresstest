import express from 'express';
import { createContest, getAllContest, deleteContest } from '../controllers/contest.controller.js'; // Importing the controller for club

const router = express.Router();  // Through router we can create get post methods for apis

            /* For all CRUD operation we have creates the routes here and the logic for the api routes 
                are written in controller folder. and we just call the controller here
            */
// Create a new club in DB
router.post("/createcontest", createContest );

// Get all Clubs from DB
router.get("/getallcontest", getAllContest);

// update a club
//router.put('/deletecontest',  updateContest);

export default router; // Exporting the router so it could be used in server file
