import { Router } from 'express';

import { CreateSuccess } from '../utils/success.js';
var router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  next(CreateSuccess(200, {message: "Welcome to Meptrix API"}));
});

export default router;