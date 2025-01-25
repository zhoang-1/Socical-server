const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Lấy token từ tiêu đề yêu cầu HTTP
  if (authHeader) { // Nếu có token
      const token = authHeader.split(' ')[1]; // Loại bỏ từ 'Bearer ' nếu có
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // Xác minh token
          if (err) { // Token không hợp lệ
              res.status(403).json({ data: {}, message: 'Token is not valid!', status: 403 });
          } else { // Token hợp lệ
              req.user = user; // Gán thông tin người dùng vào request
              next(); // Chuyển tiếp sang middleware tiếp theo
          }
      });
  } else { // Không có token
      return res.status(401).json('You are not authenticated!');
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => { // Đầu tiên xác thực token
      if (req.user.role === 'user' || req.user.role === 'admin' || req.user.role === 'viewer') {
          next(); // Nếu vai trò hợp lệ, tiếp tục
      } else { // Nếu không, từ chối quyền
          res.status(403).json({ data: {}, message: 'You are not alowed to do that!', status: 403 });
      }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
      if (req.user.role === 'admin' || req.user.role === 'user') {
          next(); 
      } else {
          res.status(403).json({ data: {}, message: 'You are not alowed to do that!', status: 403 });
      }
  });
};

const verifyTokenAndUserOnly = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'user') { // Chỉ admin mới được phép
            next();
        } else {
            res.status(403).json({ data: {}, message: 'You are not alowed to do that!', status: 403 });
        }
    });
  };

const verifyTokenAndAdminOnly = (req, res, next) => {
  verifyToken(req, res, () => {
      if (req.user.role === 'admin') { // Chỉ admin mới được phép
          next();
      } else {
          res.status(403).json({ data: {}, message: 'You are not alowed to do that!', status: 403 });
      }
  });
};

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin,verifyTokenAndUserOnly, verifyTokenAndAdminOnly};