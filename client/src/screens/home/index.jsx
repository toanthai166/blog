import {
  App,
  Button,
  Divider,
  FloatButton,
  Spin,
  Pagination,
  Row,
  Col,
} from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import {} from "../../assets";
import PostItem from "../../components/post-item";
import { useBlog } from "../../hooks/blog.hook";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helpers/app-routes";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { iconFollow } from "../../components/follow";
import FollowItem from "../../components/follow/FollowItem";
import dayjs from "dayjs";
import { FORMAT_TIME } from "../admin/discount";

const Home = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
    isActive: true,
  });
  const { blogs, isLoading } = useBlog({ ...filter });
  const listBlog = blogs.results;
  const changePagination = (newPage) => {
    console.log(newPage);
  };

  return (
    <Spin spinning={isLoading}>
      <div>
        <div className="item-banner flex w-full justify-center mb-20 ">
          <Swiper
            grabCursor="true"
            slidesPerView={"auto"}
            modules={[Autoplay, Navigation, Scrollbar, A11y]}
            navigation
            loop={true}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
          >
            {listBlog?.length > 0 &&
              listBlog?.map((post) => (
                <SwiperSlide key={post.id}>
                  <div className="banneritem h-[660px] w-full relative">
                    <a href={post.slug}>
                      <img
                        src={post.image}
                        alt=""
                        className="w-full h-full object-cover "
                      />
                    </a>
                    <div
                      className="
      banner-content flex flex-col absolute bottom-0 bg-[rgba(0,0,0,0.3)] text-white w-full px-10 py-3 h-[116px]"
                    >
                      <span className=" bg-yellow-200 p-0 rounded max-w-[80px] text-slate-900 text-sm font-medium  w-full text-center mb-2">
                        {post.category.name}
                      </span>
                      <a
                        href={post.slug}
                        className="text-lg font-medium mb-3 hover:underline"
                      >
                        <span>{post.title}</span>
                      </a>
                      <div className="flex justify-start  bottom-0 text-slate-500 text-xs  gap-1 mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className=" text-xs text-white  "> </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        <div className="bg-slate-100">
          <Divider className="flex justify-center items-center mt-10 p-14 text-3xl">
            Phổ biến
          </Divider>
        </div>
        <div data-aos="fade-up" className=" bg-white p-2">
          {listBlog?.length > 0 && (
            <div className="grid grid-cols-6 grid-rows-2 gap-1 ">
              <div className="col-span-3 ">
                <PostItem it={listBlog[0]} className="h-[320px]" />
              </div>
              <div className="col-span-3 col-start-4">
                <PostItem it={listBlog[1]} className="h-[320px]" />
              </div>
              <div className="col-span-2 row-start-2">
                <PostItem it={listBlog[2]} className="h-[200px]" />
              </div>
              <div className="col-span-2 col-start-3 row-start-2">
                <PostItem it={listBlog[3]} className="h-[200px]" />
              </div>
              <div className="col-span-2 col-start-5 row-start-2">
                <PostItem it={listBlog[4]} className="h-[200px]" />
              </div>
            </div>
          )}
        </div>
        <Row>
          <Col span={16} data-aos="fade-right" className="p-2">
            <div className=" grid grid-cols-2 gap-5">
              {listBlog?.map((it) => (
                <div className="w-full mb-20" key={it.id}>
                  <img
                    className="w-full h-full max-h-[320px] object-cover"
                    src={it.image}
                    alt=""
                  />
                  <div className="p-2 flex flex-col gap-1">
                    <h2 className="text-xl text-[#a62b00] font-medium line-clamp-1 ">
                      {it.title}
                    </h2>
                    <span>{dayjs(it.createdAt).format(FORMAT_TIME)}</span>
                    <Button
                      type="dashed"
                      onClick={() => navigate(AppRoutes.postDetailId(it.id))}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              defaultCurrent={1}
              total={blogs?.totalResults}
              onChange={changePagination}
            />
          </Col>
          <Col span={8} data-aos="fade-left" className="p-2">
            <SidebarItem title="About me">
              <>
                <img
                  src=""
                  alt=""
                  className="rounded-full w-[180px] h-[180px] block mx-auto mb-5"
                />
                <div className="text-xl text-center text-black font-bold mb-5">
                  Toàn Thái
                </div>

                <span className="text-sm">
                  Become a Fullstack Developer. Dedicate your time and leverage
                  your company's skills
                </span>
              </>
            </SidebarItem>
            <SidebarItem title="Follow Us">
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
                width="500"
                height="300"
                src="https://www.youtube.com/embed/2oDlGDaIiig"
                title="Kiến Thức Hay - Tập 1: 50 món ăn  Việt Nam ?"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </SidebarItem>{" "}
          </Col>
        </Row>
        {/* <div className=" flex gap-5 p-5">
          <div className="w-[65%]" data-aos="fade-right">
            <div className=" grid grid-cols-2 gap-5">
              {listBlog?.map((it) => (
                <div className="w-full mb-20" key={it.id}>
                  <img
                    className="w-full h-full max-h-[320px] object-cover"
                    src={it.image}
                    alt=""
                  />
                  <div className="p-2 flex flex-col gap-1">
                    <h2 className="text-xl text-[#a62b00] font-medium line-clamp-1 ">
                      {it.title}
                    </h2>
                    <span>{dayjs(it.createdAt).format(FORMAT_TIME)}</span>
                    <Button
                      type="dashed"
                      onClick={() => navigate(AppRoutes.postDetailId(it.id))}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              defaultCurrent={1}
              total={blogs?.totalResults}
              onChange={changePagination}
            />
          </div>

          <div className="flex-1" data-aos="fade-left">
            <SidebarItem title="About me">
              <>
                <img
                  src=""
                  alt=""
                  className="rounded-full w-[180px] h-[180px] block mx-auto mb-5"
                />
                <div className="text-xl text-center text-black font-bold mb-5">
                  Toàn Thái
                </div>

                <span className="text-sm">
                  Become a Fullstack Developer. Dedicate your time and leverage
                  your company's skills
                </span>
              </>
            </SidebarItem>
            <SidebarItem title="Follow Us">
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
                width="500"
                height="300"
                src="https://www.youtube.com/embed/2oDlGDaIiig"
                title="Kiến Thức Hay - Tập 1: 50 món ăn  Việt Nam ?"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </SidebarItem>{" "}
            <SidebarItem title="TAGS">
              <div className="grid grid-cols-3 gap-1">
                {categories?.map((category) => (
                  <div
                    key={category.id}
                    className="p-2 text-slate-400  cursor-pointer hover:text-white font-medium hover:bg-yellow-300  "
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            </SidebarItem>
          </div>
        </div> */}

        <FloatButton.BackTop />
      </div>
    </Spin>
  );
};

export default Home;

export const SidebarItem = ({ children, title = "" }) => {
  return (
    <div className="   flex flex-col mb-10">
      <span className=" w-full border text-center border-slate-300 py-2 mb-10">
        {title}
      </span>
      {children}
    </div>
  );
};
