import { Avatar, Button, Divider, Dropdown, Input, Space, Tabs } from "antd";
import "../../styles/style.css";
import { CartIcon, Logo } from "../../assets";
import {
  SettingOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helpers/app-routes";
import { useAuth } from "../../hooks/auth.hook";
import { useEffect, useState } from "react";
import Cart from "../../screens/cart";

const Layouts = ({ children }) => {
  const [user, setUser] = useState();
  const [open, setOpen] = useState(false);

  const { logout, auth } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) setUser(JSON.parse(auth)?.data?.user);
  }, []);

  const onChange = (key) => {
    switch (key) {
      case "1":
        navigate(AppRoutes.home);
        break;
      case "2":
        navigate(AppRoutes.product);
        break;
      case "3":
        navigate(AppRoutes.contact);
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
      label: "Sản phẩm",
    },
    {
      key: "3",
      label: "Liên hệ",
    },
  ];

  return (
    <>
      <header className=" bg-gradient-to-r from-red-700 to-red-500 header shadow-[28px_40px_80px_0px_#18264D59]">
        <div className="flex justify-between p-5  2xl:mx-[12.65%] ">
          <div className="flex gap-5 items-center">
            <img
              src="../../public/image/blog-am-thuc.png"
              alt=""
              className="w-16 h-16"
            />
          </div>

          <div className="flex items-center gap-10">
            <Tabs
              accessKey="0"
              defaultActiveKey="0"
              items={items}
              onChange={onChange}
            />
            <span
              className="cursor-pointer p-2 -translate-y-1"
              onClick={() => setOpen(!open)}
            >
              <ShoppingCartOutlined
                style={{ color: "#fff", fontSize: "24px" }}
              />
            </span>

            {!user ? (
              <span
                className="-translate-y-2 cursor-pointer"
                onClick={() => navigate(AppRoutes.login)}
              >
                Login
              </span>
            ) : (
              <>
                <Dropdown
                  className="-translate-y-1"
                  menu={{
                    items: [
                      {
                        label: (
                          <Button
                            onClick={() => navigate("profile?info=myOrder")}
                            className="w-full"
                            type="dashed"
                          >
                            Đơn hàng của tôi
                          </Button>
                        ),
                        key: "0",
                      },
                      {
                        label: (
                          <Button
                            className="w-full"
                            type="dashed"
                            onClick={() =>
                              navigate("profile?info=address", {
                                state: {
                                  userId: user?.data?.user?.id,
                                },
                              })
                            }
                          >
                            Địa chỉ của tôi
                          </Button>
                        ),
                        key: "1",
                      },
                      {
                        label: (
                          <Button
                            type="dashed"
                            disabled={user.role === "user"}
                            onClick={() => navigate(AppRoutes.admin)}
                          >
                            Đi tới trang quản trị
                          </Button>
                        ),
                        key: "2",
                      },
                      {
                        label: (
                          <Button
                            className="w-full"
                            type="dashed"
                            onClick={() => {
                              navigate(AppRoutes.login);
                              logout();
                            }}
                          >
                            Đăng xuất
                          </Button>
                        ),
                        key: "3",
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <SettingOutlined
                    style={{ color: "#fff", fontSize: "24px" }}
                  />
                </Dropdown>
              </>
            )}
          </div>
        </div>
      </header>
      <section className="2xl:px-[12.65%] bg-slate-100 pb-10">
        {children}
      </section>
      <Cart open={open} setIsOpenDrawer={setOpen}></Cart>
      <footer className="bg-[#2c3e50]">
        <div className="grid grid-cols-9 gap-12 p-20 text-white  2xl:px-[12.65%]">
          <div className="col-span-3 space-y-10 col-start-2">
            <img
              src="../../public/image/blog-am-thuc.png"
              alt=""
              className="w-40 h-40 mx-auto"
            />
            <div className="text-start font-normal text-base">
              Blog ẩm thực chuyên chia sẻ những món ăn ngon, mẹo vặt ăn uống ,
              chế độ dinh dưỡng … Đến với Blog Ẩm thực bạn có thể có được chế độ
              ăn uống phù hợp vừa đảm bảo sức khỏe vừa phù hợp với kinh tế.
            </div>
          </div>
          <div className="col-start-5 flex flex-col gap-5"></div>

          <div className="col-start-7 col-span-3 flex flex-col gap-5">
            <h2 className="text-lg font-semibold">WEBSITE THAM KHẢO</h2>
            <div className="flex flex-col gap-2">
              <Link target="_blank" to={"https://blogsongkhoe.tv/"}>
                Blog Sống Khỏe
              </Link>
              <Link target="_blank" to={"https://blogdulich.tv/"}>
                Blog Du Lịch
              </Link>
              <Link target="_blank" to={"https://blogdep.tv/"}>
                Blog Đẹp
              </Link>
              <Link target="_blank" to={"https://blognoithat.tv/"}>
                Blog Nội Thất
              </Link>
              <Link target="_blank" to={"https://bloggiaitri.tv/"}>
                Blog Giải Trí
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-[#222] w-full py-5 text-center text-white font-semibold text-base">
          COPYRIGHT © 2023
        </div>
      </footer>
    </>
  );
};

export default Layouts;
