import express from 'express';
import { createWorkspace, getWorkspaces } from '../controllers/workspaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createWorkspace);
router.get('/', getWorkspaces);

export default router;
