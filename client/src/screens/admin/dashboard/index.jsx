import { Button, Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import "../../../styles/index.css";

import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../helpers/app-routes";
import { useAuth } from "../../../hooks/auth.hook";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Quản lý bài viết", "1"),
  getItem("Quản lý danh mục", "2"),
  getItem("Quản lý tài khoản", "3"),
  getItem("Quản lý sách", "4"),
  getItem("Quản lý đơn hàng", "8"),
  getItem("Quản lý liên hệ", "5"),
  getItem("Thiết lập hồ sơ", "6"),
  getItem("Câu hỏi thường gặp", "7"),
  getItem("Quản lý mã giảm giá", "9"),
];

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();

  const { logout } = useAuth();
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth?.user?.role == "user") navigate(AppRoutes.home);
  }, [navigate]);

  const [activeMenu] = useState("");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleChange = (e) => {
    console.log(e.key);
    switch (e.key) {
      case "10":
        navigate(AppRoutes.admin);
        break;
      case "1":
        navigate(AppRoutes.blog);
        break;
      case "2":
        navigate(AppRoutes.category);
        break;
      case "3":
        navigate(AppRoutes.user);
        break;
      case "4":
        navigate(AppRoutes.productManagement);
        break;
      case "5":
        navigate(AppRoutes.contactManagement);
        break;
      case "6":
        navigate(AppRoutes.profile_management);
        break;
      case "7":
        navigate(AppRoutes.faqManagement);
        break;
      case "8":
        navigate(AppRoutes.orderManagement);
        break;
      case "9":
        navigate(AppRoutes.discountManagement);
        break;
      default:
        return null;
    }
  };
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider collapsible collapsed={false}>
        <img
          src="../../public/image/blog-am-thuc.png"
          alt=""
          className="w-10 h-10 mx-auto mt-5"
        />
        <Menu
          theme="dark"
          className="py-6"
          defaultSelectedKeys={[activeMenu]}
          activeKey={activeMenu}
          mode="inline"
          onClick={(e) => handleChange(e)}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "10px 24px",
            background: "#ccc",
          }}
        >
          <div className="flex justify-end p-4">
            <Button
              type="primary"
              onClick={() => {
                navigate(AppRoutes.login);
                logout();
              }}
            >
              Đăng xuất
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "0 0",
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          ©2023
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
