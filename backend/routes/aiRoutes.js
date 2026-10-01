import express from 'express';
import {
  uploadAndProcess,
  getUserSessions,
  getSessionById,
  chatWithSession,
  deleteSession,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import {
  chatMessageValidationRules,
  validateRequest,
} from '../middleware/validatorMiddleware.js';

const router = express.Router();

// Apply auth protection to all AI routes
router.use(protect);

// Upload multimodal files & trigger Gemini synthesis
router.post('/process', upload.array('files', 10), uploadAndProcess);

// List user multimodal sessions
router.get('/sessions', getUserSessions);

// Get specific multimodal session
router.get('/sessions/:id', getSessionById);

// Interactive multi-turn chat regarding session files
router.post(
  '/sessions/:id/chat',
  chatMessageValidationRules,
  validateRequest,
  chatWithSession
);

// Delete session and remove stored files
router.delete('/sessions/:id', deleteSession);

export default router;
