import fs from 'fs';
import storageService from '../services/storageService.js';
import { getFileCategory } from '../middleware/uploadMiddleware.js';
import geminiService from '../services/geminiService.js';

/**
 * @route   POST /api/ai/process
 * @desc    Upload multimodal files and synthesize insights via Google Gemini
 * @access  Private
 */
export const uploadAndProcess = async (req, res) => {
  try {
    const { title, prompt, domain, workspaceId } = req.body;
    const uploadedFiles = req.files || [];

    if (!uploadedFiles.length && (!prompt || !prompt.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one multimodal file (image, audio, PDF) or a text query prompt.',
      });
    }

    const fileRecords = uploadedFiles.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      fileCategory: getFileCategory(file.mimetype),
      uploadDate: new Date().toISOString(),
    }));

    const userId = req.user._id || req.user.id;

    // Create session record
    const session = await storageService.createSession({
      title: title?.trim() || `Multimodal Synthesis - ${new Date().toLocaleDateString()}`,
      user: userId,
      workspace: workspaceId || null,
      domain: domain || req.user.preferences?.defaultDomain || 'Healthcare',
      files: fileRecords,
      prompt: prompt?.trim() || '',
      status: 'processing',
    });

    // Perform multimodal analysis with Google Gemini
    try {
      const analysisResult = await geminiService.analyzeMultimodalFiles({
        files: fileRecords,
        prompt: prompt || '',
        domain: session.domain,
      });

      const aiAnalysis = {
        summary: analysisResult.summary || 'Analysis completed.',
        keyFindings: analysisResult.keyFindings || [],
        crossModalCorrelation: analysisResult.crossModalCorrelation || '',
        riskOrAnomalyAlerts: analysisResult.riskOrAnomalyAlerts || [],
        recommendedActions: analysisResult.recommendedActions || [],
        confidenceScore: analysisResult.confidenceScore || 95,
        rawGeminiResponse: analysisResult.rawGeminiResponse || '',
      };

      const initialMessage = {
        role: 'assistant',
        content: `**Executive Synthesis:**\n${analysisResult.summary}\n\n**Cross-Modal Correlation:**\n${analysisResult.crossModalCorrelation}`,
        fileReferences: fileRecords.map((f) => f.originalName),
        timestamp: new Date().toISOString(),
      };

      const updatedSession = await storageService.updateSession(session._id, {
        aiAnalysis,
        messages: [initialMessage],
        status: 'completed',
      });

      return res.status(201).json({
        success: true,
        message: 'Multimodal processing and synthesis completed successfully.',
        session: updatedSession || { ...session, aiAnalysis, messages: [initialMessage], status: 'completed' },
      });
    } catch (aiError) {
      console.error('[Gemini AI Processing Error]:', aiError);
      await storageService.updateSession(session._id, {
        status: 'failed',
        errorMessage: aiError.message,
      });

      return res.status(500).json({
        success: false,
        message: `Multimodal analysis failed: ${aiError.message}`,
      });
    }
  } catch (error) {
    console.error('[AI Upload & Process Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during multimodal upload and processing.',
    });
  }
};

/**
 * @route   GET /api/ai/sessions
 * @desc    Get all multimodal sessions for current user
 * @access  Private
 */
export const getUserSessions = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const sessions = await storageService.getUserSessions(userId);

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve sessions.',
    });
  }
};

/**
 * @route   GET /api/ai/sessions/:id
 * @desc    Get specific multimodal session by ID
 * @access  Private
 */
export const getSessionById = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const session = await storageService.getSessionById(req.params.id, userId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Multimodal session not found or unauthorized.',
      });
    }

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching session.',
    });
  }
};

/**
 * @route   POST /api/ai/sessions/:id/chat
 * @desc    Ask follow-up multimodal question in session
 * @access  Private
 */
export const chatWithSession = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id || req.user.id;
    const session = await storageService.getSessionById(req.params.id, userId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or unauthorized.',
      });
    }

    // Add user message
    await storageService.addSessionMessage(session._id, {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    });

    const currentMessages = session.messages || [];

    // Call Gemini with full context
    const aiReplyText = await geminiService.chatWithMultimodalContext({
      files: session.files,
      history: currentMessages,
      newMessage: message,
      domain: session.domain,
    });

    // Add assistant response
    const assistantMessage = {
      role: 'assistant',
      content: aiReplyText,
      fileReferences: (session.files || []).map((f) => f.originalName),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = await storageService.addSessionMessage(session._id, assistantMessage);

    return res.status(200).json({
      success: true,
      reply: aiReplyText,
      messages: updatedMessages || [...currentMessages, { role: 'user', content: message }, assistantMessage],
    });
  } catch (error) {
    console.error('[Session Chat Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating AI response.',
    });
  }
};

/**
 * @route   DELETE /api/ai/sessions/:id
 * @desc    Delete session and clean up stored files
 * @access  Private
 */
export const deleteSession = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const session = await storageService.getSessionById(req.params.id, userId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
      });
    }

    // Remove files from disk
    for (const file of (session.files || [])) {
      if (file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkErr) {
          console.warn(`[File Delete Warning] Could not remove file ${file.path}:`, unlinkErr.message);
        }
      }
    }

    await storageService.deleteSession(req.params.id, userId);

    return res.status(200).json({
      success: true,
      message: 'Session and associated multimodal files deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting session.',
    });
  }
};
