import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

/**
 * Detect if running in Vercel or a serverless container environment
 * where the application filesystem is read-only except for /tmp.
 */
export const isVercel = Boolean(
  process.env.VERCEL ||
  process.env.VERCEL_ENV ||
  process.env.NOW_REGION ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

/**
 * Upload directory resolution:
 * - If process.env.UPLOAD_DIR is set, use that path.
 * - On Vercel / serverless: use /tmp/uploads (only /tmp is writable).
 * - In local development: use ../../uploads relative to this file (backend/uploads).
 */
export const uploadDir = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : isVercel
    ? path.join('/tmp', 'uploads')
    : path.resolve(__dirname, '../../uploads');

/**
 * Safely ensure the upload directory exists without crashing on read-only filesystems.
 */
export const ensureUploadDirExists = (): void => {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (error) {
    console.warn(`[StayBite Upload] Warning: Unable to create upload directory at "${uploadDir}":`, error);
  }
};

// Safely attempt initialization at module load
ensureUploadDirExists();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (err: any) {
      console.error(`[StayBite Upload] Error creating upload destination "${uploadDir}":`, err);
      cb(err, uploadDir);
    }
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/pdf'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Allowed formats: JPG, PNG, WEBP, MP4, WEBM, PDF'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  }
});
