import { Avatar, Col, Menu } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { AccountInfo, Address, WishList } from "../../assets";

const menus = [
  {
    url: "myOrder",
    icon: <AccountInfo />,
    title: <span className="font-normal text-base">Đơn đặt hàng</span>,
  },
  {
    url: "address",
    icon: <Address />,
    title: <span className="font-normal text-base">Địa chỉ</span>,
  },
  {
    url: "favorite",
    icon: <WishList />,
    title: <span className="font-normal text-base">Danh dách yêu thích</span>,
  },
];

const TabLeftProfile = () => {
  const user = JSON.parse(localStorage.getItem("auth"))?.data?.user;

  const [activeKey, setActiveKey] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const res = searchParams.get("info");
    res == null ? setActiveKey("myOrder") : setActiveKey(res);
  }, [searchParams]);

  const handleChangeTab = useCallback(
    (e) => {
      setActiveKey(e.key);
      setSearchParams((params) => {
        params.set("info", e.key);
        return params;
      });
    },
    [setSearchParams]
  );
  return (
    <Col span={6}>
      <div className=" rounded-lg p-5 ">
        <div className="p-4 flex flex-col gap-5 mb-4 bg-white">
          <div className="flex gap-4">
            <Avatar
              className="w-14 h-14 items-center"
              style={{ backgroundColor: "#b4755e" }}
              icon={
                <UserOutlined
                  className="translate-y-2"
                  style={{ fontSize: "30px" }}
                />
              }
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">{user?.name}</h2>
              <span className="line-clamp-1">ID: {user?.id?.slice(0, 15)}</span>
            </div>
          </div>
        </div>
        <div className="">
          <Menu
            className="py-5"
            defaultSelectedKeys={["account"]}
            selectedKeys={[activeKey]}
            onClick={(e) => handleChangeTab(e)}
            items={menus.map((item) => {
              const key = item.url;
              return {
                key,
                label: (
                  <div
                    className={`flex h-12 items-center  hover:bg-r-[#f5b102] gap-3 px-5 py-3 `}
                  >
                    <span className=""> {item.icon}</span>
                    <div className="text-base font-semibold">{item.title}</div>
                  </div>
                ),
              };
            })}
          />
        </div>
      </div>
    </Col>
  );
};

export default TabLeftProfile;
