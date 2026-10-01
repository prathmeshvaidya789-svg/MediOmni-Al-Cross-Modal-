import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate safe, unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedOriginal = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedOriginal}`);
  },
});

// Allowed MIME types map
export const ALLOWED_MIME_TYPES = {
  // Images
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'image/gif': 'image',
  'image/bmp': 'image',
  
  // Audio
  'audio/mpeg': 'audio',
  'audio/mp3': 'audio',
  'audio/wav': 'audio',
  'audio/x-wav': 'audio',
  'audio/ogg': 'audio',
  'audio/webm': 'audio',
  'audio/x-m4a': 'audio',
  'audio/m4a': 'audio',
  'audio/aac': 'audio',

  // Documents
  'application/pdf': 'document',
  'text/plain': 'text',
  'text/markdown': 'text',
  'text/csv': 'text',

  // Video
  'video/mp4': 'video',
  'video/webm': 'video',
  'video/quicktime': 'video',
};

// File filter function
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type '${file.mimetype}'. Supported formats: Images (PNG, JPG, WEBP), Audio (MP3, WAV, OGG, M4A), Documents (PDF, TXT, CSV), Video (MP4, WEBM).`
      ),
      false
    );
  }
};

const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '25', 10);

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSizeMB * 1024 * 1024, // in bytes
    files: parseInt(process.env.MAX_FILES_COUNT || '10', 10),
  },
});

export const getFileCategory = (mimetype) => {
  return ALLOWED_MIME_TYPES[mimetype] || 'other';
};
