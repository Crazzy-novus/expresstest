import express from 'express';
import { verifyAdmin } from '../utils/verifyToken.js';

import { createRole, getAllRoles, updateRole, deleteRole } from '../controllers/role.controller.js';


const router = express.Router();  // Through router we can create get post methods for apis

            /* For all CRUD operation we have creates the routes here and the logic for the api routes 
                are written in controller folder. and we just call the controller here
            */
// Create a new role in DB
router.post("/create", createRole );

// Update role in DB
router.put("/update/:id", verifyAdmin, updateRole);

// Get all roles from DB
router.get('/getAll', getAllRoles);

// Delete role from DB
router.delete('/deleteRole/:id', deleteRole);

export default router; // Exporting the router so it could be used in server file
