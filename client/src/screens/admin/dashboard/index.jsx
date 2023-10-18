import { Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../helpers/app-routes";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Trang chủ", "10"),

  getItem("Quản lý bài viết", "1"),
  getItem("Quản lý danh mục", "2"),
  getItem("Quản lý tài khoản", "3"),
  getItem("Quản lý sách", "4"),
  getItem("Quản lý liên hệ", "5"),
  getItem("Thiết lập hồ sơ", "6"),
  getItem("Câu hỏi thường gặp", "7"),
];

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("");
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
        navigate(AppRoutes.book);
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
        <Menu
          theme="dark"
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
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "0 16px",
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
