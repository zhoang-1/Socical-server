const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu trữ file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Lưu file vào thư mục uploads/
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file thành thời gian + đuôi file
    }
});

// Bộ lọc file
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif/;
    const allowedVideoTypes = /mp4|mov|avi|mkv/;

    const extName = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) || 
                    allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());

    const mimeType = allowedImageTypes.test(file.mimetype) || 
                     allowedVideoTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        cb('Error: Chỉ cho phép tải lên ảnh hoặc video!');
    }
};

// Giới hạn kích thước file: ảnh 5MB, video 50MB
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Tối đa 50MB cho video
    fileFilter: fileFilter
});

module.exports = upload;
