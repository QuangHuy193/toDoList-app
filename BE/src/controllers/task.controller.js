const db = require("../config/db");

// thêm task
exports.createTask = (req, res) => {
  const { title, description, deadline } = req.body;
  const userId = req.user.id;

  // Kiểm tra dữ liệu
  if (!title || !description || !deadline) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập điền đầy đủ thông tin" });
  }

  const sql =
    "INSERT INTO tasks (user_id, title, description, deadline) VALUES (?, ?, ?, ?)";
  db.query(sql, [userId, title, description, deadline], (err, result) => {
    if (err) {
      console.error("Lỗi thêm task:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }
    res.status(201).json({
      message: "Thêm task thành công",
      taskId: result.insertId,
    });
  });
};

// lấy task
exports.readTask = (req, res) => {
  const userId = req.user.id; // Lấy từ token đã decode qua middleware

  const sql = "SELECT * FROM tasks WHERE user_id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Lỗi lấy task:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    return res.status(200).json({
      message: "Lấy danh sách task thành công",
      tasks: result,
    });
  });
};

// Cập nhật task (title, description, deadline)
exports.updateTask = (req, res) => {
  const userId = req.user.id; // Lấy từ token
  const taskId = req.params.id;
  const { title, description, deadline } = req.body;

  // Lọc ra dữ liệu hợp lệ
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (deadline !== undefined) updates.deadline = deadline;

  // Nếu không có gì để update
  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "Không có dữ liệu hợp lệ để cập nhật" });
  }

  // Tạo mảng field = ?, field = ?...
  const fields = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(updates);

  const query = `
    UPDATE tasks 
    SET ${fields}
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [...values, taskId, userId], (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật task:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy task hoặc bạn không có quyền sửa" });
    }

    return res.status(200).json({ message: "Cập nhật task thành công" });
  });
};

// Cập nhật trạng thái task
exports.updateTaskStatus = (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const { status } = req.body;

  if (status === undefined) {
    return res.status(400).json({ message: "Vui lòng truyền status" });
  }
  if (status !== "done" && status !== "todo") {
    return res
      .status(400)
      .json({ message: "Vui lòng truyền đúng định dạng status (todo, done" });
  }

  const query = `
    UPDATE tasks
    SET status = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [status, taskId, userId], (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật status:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy task hoặc bạn không có quyền sửa" });
    }

    return res.status(200).json({ message: "Cập nhật status thành công" });
  });
};

// xóa task
exports.deleteTask = (req, res) => {
  const taskId = req.params.id; // lấy id từ URL
  const userId = req.user.id;

  const sql = "DELETE FROM tasks WHERE id = ? AND user_id = ?";

  db.query(sql, [taskId, userId], (err, result) => {
    if (err) {
      console.error("Lỗi xóa task:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Task không tồn tại hoặc không thuộc quyền sở hữu" });
    }

    return res.status(200).json({ message: "Xóa task thành công" });
  });
};
