import { Request, Response } from 'express';

export const uploadSingle = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
};

export const uploadMultiple = (req: Request, res: Response): void => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ success: false, message: 'No files uploaded' });
    return;
  }

  const urls = files.map((file) => `/uploads/${file.filename}`);
  res.json({
    success: true,
    message: `${files.length} files uploaded successfully`,
    urls
  });
};
