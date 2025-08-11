import { Form, Input, DatePicker, Button, message } from "antd";
import { createTask } from "../../services/API/tasksApi";

export default function TaskForm({ onSuccess }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        deadline: values.deadline.format("YYYY-MM-DD HH:mm:ss"),
      };
      await createTask(payload);
      message.success("Thêm task thành công!");
      form.resetFields();
      onSuccess(); // refresh list
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi server");
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
        Thêm Task
      </Button>
    </Form>
  );
}
