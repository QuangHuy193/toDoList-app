import { Table, Button, Popconfirm, message } from "antd";
import {
  getTasks,
  deleteTaskById,
  updateTaskStatus,
} from "../../services/API/tasksApi";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../utils/toastService";
import { CheckSquareOutlined, BorderOutlined } from "@ant-design/icons";
import styles from "./TaskTable.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default function TaskTable({ editingTask, setEditingTask, refresh }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data.tasks);
    } catch (err) {
      message.error("Lỗi tải tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  const deleteTask = async (id) => {
    try {
      await deleteTaskById(id);
      showSuccess("Xóa task thành công");
      fetchTasks();
    } catch (err) {
      showError.error(err.response?.data?.message || "Không thể xóa task");
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      const newStatus = status === "done" ? "todo" : "done";
      const res = await updateTaskStatus(id, newStatus);
      showSuccess(res.data.message || "Cập nhật trạng thái thành công");
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      showError(
        err.response?.data?.message || "Không thể chỉnh trạng thái của task"
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const columns = [
    { title: "Tiêu đề", dataIndex: "title", align: "center", key: "title" },
    {
      title: "Mô tả",
      dataIndex: "description",
      align: "center",
      key: "description",
    },
    {
      title: "Hạn chót",
      dataIndex: "deadline",
      align: "center",
      key: "deadline",
    },
    {
      title: "Đã hoàn thành",
      dataIndex: "status",
      align: "center",
      key: "status",
      render: (_, record) =>
        record.status === "done" ? (
          <CheckSquareOutlined
            style={{ color: "green", fontSize: "18px" }}
            onClick={() => toggleStatus(record.id, record.status)}
          />
        ) : (
          <BorderOutlined
            style={{ color: "gray", fontSize: "18px" }}
            onClick={() => toggleStatus(record.id, record.status)}
          />
        ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {editingTask?.id===record.id ? (
            <Button className={cx("warning-btn")} onClick={() => setEditingTask(null)}>
              Hủy
            </Button>
          ) : (
            <Button type="primary" onClick={() => setEditingTask(record)}>
              Sửa
            </Button>
          )}

          <Popconfirm title="Xóa task?" onConfirm={() => deleteTask(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return <Table dataSource={tasks} columns={columns} rowKey="id" />;
}
