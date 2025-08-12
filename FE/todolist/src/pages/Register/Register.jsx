import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import HomeButton from "../../components/HomeButton/HomeButton";
import { register } from "../../services/API/userApi";
import { showError, showSuccess } from "../../utils/toastService";

const cx = classNames.bind(styles);

function Register() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await register(values);
      showSuccess(
        "Đăng ký thành công! đang chuyển hướng sang trang đăng nhập."
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      showError(
        err.response?.data?.message || "Đăng ký thất bại, thử lại sau!"
      );
    }
  };

  return (
    <>
      <HomeButton />
      <div className={cx("register-container")}>
        <h2 className={cx("register-title")}>Đăng ký</h2>
        <Form name="register" onFinish={onFinish} layout="vertical">
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
            hasFeedback
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default Register;
