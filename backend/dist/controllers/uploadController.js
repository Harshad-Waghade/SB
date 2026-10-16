"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = void 0;
const uploadSingle = (req, res) => {
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
exports.uploadSingle = uploadSingle;
const uploadMultiple = (req, res) => {
    const files = req.files;
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
exports.uploadMultiple = uploadMultiple;
//# sourceMappingURL=uploadController.js.map