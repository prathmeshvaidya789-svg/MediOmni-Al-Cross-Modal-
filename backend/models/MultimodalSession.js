import mongoose from 'mongoose';

const FileMetaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  fileCategory: {
    type: String,
    enum: ['image', 'audio', 'document', 'video', 'text', 'other'],
    required: true,
  },
  extractedData: { type: String, default: '' },
  uploadDate: { type: Date, default: Date.now },
});

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  fileReferences: [{ type: String }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const MultimodalSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Untitled Multimodal Analysis',
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      default: null,
    },
    domain: {
      type: String,
      enum: ['Healthcare', 'Legal', 'Research', 'Media', 'General'],
      default: 'Healthcare',
    },
    files: [FileMetaSchema],
    prompt: {
      type: String,
      default: '',
    },
    aiAnalysis: {
      summary: { type: String, default: '' },
      keyFindings: [{ type: String }],
      crossModalCorrelation: { type: String, default: '' },
      riskOrAnomalyAlerts: [{ type: String }],
      recommendedActions: [{ type: String }],
      confidenceScore: { type: Number, min: 0, max: 100, default: 95 },
      rawGeminiResponse: { type: String, default: '' },
    },
    messages: [MessageSchema],
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for user session history queries
MultimodalSessionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('MultimodalSession', MultimodalSessionSchema);
