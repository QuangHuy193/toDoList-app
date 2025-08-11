const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// đăng ký
exports.register = (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra dữ liệu
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
  }

  // Kiểm tra username tồn tại chưa
  db.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    async (err, results) => {
      if (err)
        return res.status(500).json({ message: "Lỗi server", error: err });

      if (results.length > 0) {
        return res.status(400).json({ message: "tên đăng nhập đã tồn tại" });
      }

      // Mã hoá password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Thêm user vào DB
      db.query(
        "INSERT INTO user (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        (err, result) => {
          if (err)
            return res.status(500).json({ message: "Lỗi server", error: err });

          return res.status(201).json({ message: "Đăng ký thành công" });
        }
      );
    }
  );
};

// đăng nhập
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
    }

    db.query("SELECT * FROM user WHERE username = ?", [username], async (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi server", error: err });

        if (results.length === 0) {
            return res.status(400).json({ message: "Sai tên đăng nhập và mật khẩu" });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Sai tên đăng nhập và mật khẩu" });
        }

        // Tạo token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || "mysecret",
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Đăng nhập thành công",
            token
        });
    });
};

// lấy thông tin
exports.getUserInfo = (req, res) => {
  const userId = req.user.id;

  const sql = "SELECT id, username FROM user WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin user:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ user: results[0] });
  });
};

