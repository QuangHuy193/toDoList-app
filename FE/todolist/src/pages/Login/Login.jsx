import { Form, Input, Button } from "antd";

import { useNavigate } from "react-router-dom";
import HomeButton from "../../components/HomeButton/HomeButton";
import { login } from "../../services/API/userApi";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await login(values); // gọi API login
      const { token } = res.data;

      if (token) {
        // Lưu token vào localStorage
        localStorage.setItem("token", token);

        navigate("/"); // quay về dashboard
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu!"
      );
    }
  };

  return (
    <>
      <HomeButton />
      <div className={cx("login-container")}>
        <h2 className={cx("login-title")}>Đăng nhập</h2>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 8, message: "Mật khẩu phải từ 8 ký tự trở lên!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="default" block onClick={() => navigate("/register")}>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default Login;
