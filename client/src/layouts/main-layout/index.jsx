import { Avatar, Button, Divider, Dropdown, Input, Space, Tabs } from "antd";
import "../../styles/style.css";
import { Address, CartIcon, Logo } from "../../assets";
import {
  SettingOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helpers/app-routes";
import { useAuth, useLogout } from "../../hooks/auth.hook";
import { useEffect, useState } from "react";
import Cart from "../../screens/cart";

const Layouts = ({ children }) => {
  const [user, setUser] = useState();
  const [open, setOpen] = useState(false);

  const { logout, auth } = useAuth();
  const { handleLogout } = useLogout();

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
  console.log("user :>> ", user);
  const logOut = () => {
    handleLogout({ refreshToken: auth?.data?.tokens?.refresh.token });
    logout();
    navigate(AppRoutes.login);
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
      <header className=" bg-gradient-to-r from-red-700 to-red-500 header shadow-[28px_40px_80px_0px_#18264D59] fixed justify-between w-full z-50">
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
              <button
                className="-translate-y-2 border bg-white px-10 py-2 rounded-lg"
                onClick={() => navigate(AppRoutes.login)}
              >
                <span className=" font-medium text-xl">Đăng nhập</span>
              </button>
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
                            onClick={logOut}
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
      <div className="2xl:px-[12.65%] bg-slate-100 pb-10 pt-32 z-30">
        {children}
      </div>
      <Cart open={open} setIsOpenDrawer={setOpen}></Cart>
      <footer className="bg-[#2c3e50]">
        <div className="grid grid-cols-11 gap-12 p-20 text-white  2xl:px-[12.65%]">
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

          <div className="col-start-6 col-span-2 flex flex-col gap-5">
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
          <div className="col-start-9 col-span-3 flex flex-col gap-5">
            <h2 className="text-lg font-semibold">Liên hệ</h2>
            <div className="flex flex-col gap-2">
              <div className="flex gap-5 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 opacity-50"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0l-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z"
                  />
                </svg>
                <Link to={"tel:0382203388"}>038.220.3388</Link>
              </div>
              <div className="flex gap-5 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 opacity-50"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>

                <span>vutoanthai166@gmail.com</span>
              </div>
              <div className="flex gap-5 items-center">
                <Address className="w-8 h-8"></Address>
                <Link to={"/"}>40 SN, Đức Thắng, Q.Bắc Từ Liêm, Hà Nội</Link>
              </div>
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
