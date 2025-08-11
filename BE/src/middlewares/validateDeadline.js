// Middleware kiểm tra deadline hợp lệ
function validateDeadline(req, res, next) {
  const { deadline } = req.body;

  if (!deadline) return next();

  const deadlineDate = new Date(deadline);
  const now = new Date();

  if (isNaN(deadlineDate.getTime())) {
    return res.status(400).json({ message: "Ngày deadline không hợp lệ" });
  }

  if (deadlineDate <= now) {
    return res.status(400).json({ message: "Deadline phải lớn hơn thời điểm hiện tại" });
  }

  next();
}

module.exports = validateDeadline;
