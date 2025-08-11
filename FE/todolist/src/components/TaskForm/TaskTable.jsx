import { Table, Button, Popconfirm, message } from "antd";
import { getTasks, deleteTaskById } from "../../services/API/tasksApi";
import { useEffect, useState } from "react";

export default function TaskTable() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data.tasks);
    } catch (err) {
      message.error("Lỗi tải tasks");
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskById(id)
      message.success("Xóa task thành công");
      fetchTasks();
    } catch (err) {
      message.error("Không thể xóa task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const columns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Hạn chót", dataIndex: "deadline", key: "deadline" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Xóa task?"
          onConfirm={() => deleteTask(record.id)}
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return <Table dataSource={tasks} columns={columns} rowKey="id" />;
}
