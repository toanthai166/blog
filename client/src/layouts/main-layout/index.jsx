import { Avatar, Tabs } from "antd";
import "../../styles/style.css";
import { Logo } from "../../assets";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helpers/app-routes";

// eslint-disable-next-line react/prop-types
const Layouts = ({ children }) => {
  const navigate = useNavigate();
  const onChange = (key) => {
    switch (key) {
      case "1":
        navigate(AppRoutes.home);
        break;
      case "2":
        navigate(AppRoutes.secret);
        break;
    }
  };

  const items = [
    {
      key: "1",
      label: "Trang chủ",
    },
    {
      key: "2",
      label: "Bí quyết",
    },
    {
      key: "3",
      label: "My book",
    },
    {
      key: "4",
      label: "Giới thiệu",
    },
    {
      key: "5",
      label: "Liên hệ",
    },
  ];

  return (
    <div className="bg-neutral-100">
      <header>
        <div className="flex justify-between p-5 mx-40 ">
          <div className="flex gap-5 items-center">
            <Logo className="w-14 h-14" />
            <span>FLOUR & BUTTER</span>
          </div>
          <div className="flex items-center gap-5">
            <Tabs
              accessKey="0"
              defaultActiveKey="0"
              items={items}
              onChange={onChange}
            />
            <div className="flex items-center gap-5">
              <Avatar
                className="-translate-y-2"
                size="small"
                icon={<UserOutlined />}
              />
              <span className="-translate-y-2">Login</span>
            </div>
          </div>
        </div>
      </header>
      <div className="container">{children}</div>
      <footer className="grid grid-cols-9 grid-rows-1 gap-12 pb-20 mt-20">
        <div className="col-span-2 col-start-2">4</div>
        <div className="col-start-5 flex flex-col gap-5">
          <h2>Site</h2>
          <div className="flex flex-col gap-2">
            <span className="cursor-pointer">My Recipes </span>
            <span className="cursor-pointer">My Book</span>
            <span className="cursor-pointer"> About</span>
            <span className="cursor-pointer"> Contact</span>
          </div>
        </div>

        <div className="col-start-6 flex flex-col gap-5">
          <h2>Contact</h2>
          <div className="flex flex-col gap-2">
            <span className="cursor-pointer">info@mysite.com </span>
            <span className="cursor-pointer">123-456-7890</span>
          </div>
        </div>
        <div className="col-start-7 flex flex-col gap-5">
          <h2>Legal</h2>
          <div className="flex flex-col gap-2">
            <span
              className="cursor-pointer"
              onClick={() => navigate(AppRoutes.faq)}
            >
              FAQ
            </span>
            <span className="cursor-pointer">Shipping & Returns</span>
            <span className="cursor-pointer">Private Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layouts;
