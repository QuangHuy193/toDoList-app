import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./HomeButton.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function HomeButton() {
  const navigate = useNavigate();

  return (
    <HomeOutlined
      className={cx("home-icon")}
      onClick={() => navigate("/")}
    />
  );
}

export default HomeButton;
