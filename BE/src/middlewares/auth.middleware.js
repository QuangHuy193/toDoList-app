const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Lấy token sau 'Bearer '

    if (!token) {
        return res.status(401).json({ message: "Không có token, vui lòng đăng nhập" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecret");
        req.user = decoded; // Lưu thông tin user vào req để controller dùng
        next(); // Cho request đi tiếp
    } catch (err) {
        return res.status(403).json({ message: "Token không hợp lệ" });
    }
};
