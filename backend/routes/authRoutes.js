import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerValidationRules,
  loginValidationRules,
  validateRequest,
} from '../middleware/validatorMiddleware.js';

const router = express.Router();

router.post('/register', registerValidationRules, validateRequest, register);
router.post('/login', loginValidationRules, validateRequest, login);
router.get('/me', protect, getMe);

export default router;
