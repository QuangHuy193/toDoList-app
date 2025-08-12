import { Form, Input, DatePicker, Button } from "antd";
import { createTask, updateTask } from "../../services/API/tasksApi";
import { showError, showSuccess } from "../../utils/toastService";
import { useEffect } from "react";
import dayjs from "dayjs";

export default function TaskForm({ editingTask, onSuccess }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        ...editingTask,
        deadline: editingTask.deadline ? dayjs(editingTask.deadline) : null, // convert
      });
    } else {
      form.resetFields(); // reset khi thêm mới
    }
  }, [editingTask]);

  const onFinish = async (values) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        deadline: values.deadline.format("YYYY-MM-DD HH:mm:ss"),
      };

      if (editingTask) {
        await updateTask(editingTask.id, payload);
        showSuccess("Cập nhật task thành công!");     
        onSuccess(); // refresh list
      } else {
        await createTask(payload);
        showSuccess("Thêm task thành công!");
        form.resetFields();
        onSuccess(); // refresh list
      }
    } catch (err) {
      showError(err.response?.data?.message || "Lỗi server");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="title"
        label="Tiêu đề"
        rules={[{ required: true, message: "Nhập tiêu đề" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô tả"
        rules={[{ required: true, message: "Nhập mô tả" }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        name="deadline"
        label="Hạn chót"
        rules={[{ required: true, message: "Chọn hạn chót" }]}
      >
        <DatePicker showTime />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        {editingTask ? "Cập nhật task" : "Thêm Task"}
      </Button>
    </Form>
  );
}
