import { Button } from "antd";
import TaskForm from "../../components/TaskForm/TaskForm";
import TaskTable from "../../components/TaskForm/TaskTable";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className={cx("header")}>
        <div className={cx("header-content")}>
          <h1 className={cx("header-title")}>Quản lý Tasks</h1>
          <Button className={cx("header-login-btn")} onClick={handleLogin}>
            Đăng nhập
          </Button>
        </div>
      </div>
      <TaskForm onSuccess={() => window.location.reload()} />
      <br />
      <TaskTable />
    </div>
  );
}
