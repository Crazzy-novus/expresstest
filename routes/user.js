import express from 'express';
import { getAllUsers, getSingleUser, updateRole, updateUser, deleteUser, revokeRole } from '../controllers/user.controller.js';
import { verifyUser, verifyAdmin, verifyStaff } from '../utils/verifyToken.js';

const router = express.Router();

// get all users
router.get('/', verifyAdmin, getAllUsers);

router.get('/staff', verifyStaff, getAllUsers);

// get a single user
router.get('/user', verifyUser, getSingleUser );

// update a user
router.put('/updateuser/:id', verifyUser, updateRole);

// update a user
router.put('/updateuserdetails/:id', verifyUser, updateUser);

router.delete("/deleteuser/:id", verifyAdmin, deleteUser);

router.put('/revokeuser/:id',  verifyUser, revokeRole )


export default router;

