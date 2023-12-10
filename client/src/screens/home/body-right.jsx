import { Button, Col } from "antd";
import { SidebarItem } from ".";
import { iconFollow } from "../../components/follow";
import FollowItem from "../../components/follow/FollowItem";
import { useGetUserById } from "../../hooks/user.hook";
import { useCategoriesIsActive } from "../../hooks/category.hook";
import { AppRoutes } from "../../helpers/app-routes";
import { useNavigate } from "react-router-dom";

const BodyRight = () => {
  const navigate = useNavigate();
  const { user } = useGetUserById("6511970295f985291808ae60");
  const { categories } = useCategoriesIsActive();

  return (
    <Col span={7} data-aos="fade-left" className="p-6">
      <SidebarItem title="Giới thiệu">
        <>
          <img
            src={user.image}
            alt=""
            className="rounded-full w-[180px] h-[180px] block mx-auto mb-5"
          />
          <div className="text-xl text-center text-black font-bold mb-5">
            {user.name}
          </div>

          <span className="text-sm text-center">{user.description}</span>
        </>
      </SidebarItem>
      <SidebarItem title="Theo dõi">
        <div className="w-full justify-center grid grid-cols-2 gap-3 flex-col  ">
          {iconFollow.map((item) => (
            <div
              key={item.title}
              className=" flex justify-between text-sm mb-0"
            >
              <FollowItem data={item}></FollowItem>
            </div>
          ))}
        </div>
      </SidebarItem>
      <SidebarItem title="Đăng kí" data-aos="zoom-out-left">
        <iframe
          width="auto"
          height="300"
          frameBorder="0"
          src="https://www.youtube.com/embed/2oDlGDaIiig?autoplay=1&loop=1"
          // title="Kiến Thức Hay - Tập 1: 50 món ăn  Việt Nam ?"
          // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </SidebarItem>{" "}
      <SidebarItem title="Danh sách danh mục">
        <div className="flex gap-2 flex-col items-start">
          {categories.map((it) => (
            <Button
              type="default"
              onClick={() =>
                navigate(AppRoutes.search, {
                  state: {
                    categoryId: it.id,
                    name: it.name,
                  },
                })
              }
              className="hover:translate-x-3 transition-all duration-500 font-medium text-base"
              key={it.id}
            >
              {it.name}
            </Button>
          ))}
        </div>
      </SidebarItem>
    </Col>
  );
};

export default BodyRight;
