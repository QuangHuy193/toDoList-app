import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import TaskForm from "../../components/TaskForm/TaskForm";
import TaskTable from "../../components/TaskTable/TaskTable";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserInfo } from "../../services/API/userApi";
import { showSuccess } from "../../utils/toastService";

const cx = classNames.bind(styles);

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [localSto, setLocalSto] = useState(localStorage.getItem("token") || "");
  const [editingTask, setEditingTask] = useState(null); // lưu task đang sửa
  const [refresh, setRefresh] = useState(false); // trigger reload table

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLocalSto(token);
      getUserInfo()
        .then((res) => {
          setUserName(res.data.user.username);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setUserName("");
    }
  }, [localSto]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLocalSto("");
    window.location.reload()
    showSuccess("Đăng xuất thành công")
  };

  return (
    <div>
      <div className={cx("header")}>
        <div className={cx("header-content")}>
          <h1 className={cx("header-title")}>Quản lý Tasks</h1>
          {userName ? (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className={cx("header-username")}>Xin chào {userName}!</div>
              <Button
                type="link"
                icon={<LogoutOutlined style={{ color: "red" }} />}
                onClick={handleLogout}
                className={cx("logout-btn")}
              ></Button>
            </div>
          ) : (
            <Button className={cx("header-login-btn")} onClick={handleLogin}>
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
      <TaskForm
        onSuccess={() => {
          setEditingTask(null);
          setRefresh(!refresh);
        }}
        editingTask={editingTask}
      />
      <br />
      <TaskTable
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        refresh={refresh}
      />
    </div>
  );
}
