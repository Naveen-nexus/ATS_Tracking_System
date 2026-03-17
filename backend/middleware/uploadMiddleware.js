const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  // Use memory storage or just regular uploads folder? 
  // For Cloudinary, usually we can use memory storage OR disk storage and then upload.
  // Using disk storage temporarily is simpler if we don't have a buffer stream uploader ready.
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype) || 
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                   file.mimetype === 'application/msword';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Resumes only (PDF, DOC, DOCX)!');
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
