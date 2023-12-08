import {
  FloatButton,
  Spin,
  Pagination,
  Row,
  Col,
  Tabs,
  Collapse,
  Input,
} from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { ClockCircleOutlined, SearchOutlined } from "@ant-design/icons";
import "swiper/css";
import {} from "../../assets";
import { useBlog } from "../../hooks/blog.hook";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helpers/app-routes";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import dayjs from "dayjs";
import { FORMAT_TIME } from "../admin/discount";
import BodyRight from "./body-right";
import { useFAQ } from "../../hooks/faq.hook";
import { debounce } from "lodash";

const Home = () => {
  const navigate = useNavigate();
  const [isFaq, setIsFaq] = useState(false);
  const [filter, setFilter] = useState({
    limit: 5,
    title: "",
    page: 1,
    isActive: true,
  });
  console.log("filter :>> ", filter);

  const { faqs } = useFAQ({
    limit: 100,
    page: 1,
    isActive: true,
  });

  const { blogs, isLoading } = useBlog({ ...filter });
  const listBlog = blogs.results;

  const changePagination = (newPage) => {
    setFilter({ ...filter, page: newPage });
  };

  const onChange = (key) => {
    switch (key) {
      case "1":
        setIsFaq(false);
        break;
      case "2":
        setIsFaq(true);
        break;
    }
  };
  const items = [
    {
      key: "1",
      label: "Bài viết",
    },

    {
      key: "2",
      label: "Câu hỏi ngắn",
    },
  ];

  const itemsFaq = faqs?.data?.results?.map((it, index) => ({
    key: index,
    label: <span className="text-[#A62B00]">{it.title}</span>,
    children: <div dangerouslySetInnerHTML={{ __html: it.description }}></div>,
  }));
  const handleChangeSearch = debounce((e) => {
    setFilter({ ...filter, page: 1, title: e.target.value });
  }, 800);

  return (
    <Spin spinning={isLoading}>
      <div>
        <Row>
          <BodyRight />
          <Col span={17} data-aos="fade-right" className="p-6 rounded-md">
            <div className="w-full mb-5 ">
              <Input
                onChange={handleChangeSearch}
                className="w-full"
                placeholder="Tìm kiếm theo tên bài viết"
                addonAfter={<SearchOutlined />}
              />
            </div>
            <div className="item-banner flex flex-col  w-full justify-center mb-10 bg-white">
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
                      <div className="banneritem h-[310px] w-full relative">
                        <a href={post.slug}>
                          <img
                            src={post.image}
                            alt=""
                            className="w-full h-full object-cover "
                          />
                        </a>
                        <div className="banner-content flex flex-col gap-5 absolute bottom-0 bg-[rgba(0,0,0,0.3)] text-white w-full px-10 py-3 h-full items-center justify-center">
                          <span className=" bg-yellow-200 p-0 rounded max-w-[80px] text-slate-900 text-sm font-medium  w-full text-center mb-2">
                            {post.category.name}
                          </span>
                          <Link
                            to={AppRoutes.postDetailId(post?.id)}
                            className=" text-3xl font-bold leading-8 w-full max-w-[600px] text-center"
                          >
                            <span>{post.title}</span>
                          </Link>
                          <div className="flex justify-start items-center  bottom-0 text-slate-500 text-xs  gap-1 mb-3">
                            <div>
                              <ClockCircleOutlined
                                style={{ color: "#ffffff" }}
                              />
                            </div>
                            <span className=" text-base text-white font-normal">
                              {dayjs(post.createdAt).format("DD/MM/YYYY")}{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
              <Tabs
                accessKey="0"
                defaultActiveKey="0"
                className="px-4"
                items={items}
                onChange={onChange}
              />
            </div>
            {!isFaq ? (
              <div className=" grid gap-[1px] bg-white p-6">
                {listBlog?.map((it) => (
                  <div key={it.id}>
                    <div className="w-full flex gap-10 " key={it.id}>
                      <img
                        className="w-full max-w-[300px] h-full max-h-[320px] object-cover hover:rounded-lg rounded-md hover:scale-105 duration-500 transition-all"
                        src={it.image}
                        alt=""
                      />

                      <div className=" flex flex-col gap-1">
                        <Link
                          to={AppRoutes.postDetailId(it?.id)}
                          className="text-2xl text-[#a62b00] font-semibold line-clamp-1 "
                        >
                          {it.title}
                        </Link>
                        <div className="space-x-2">
                          <ClockCircleOutlined
                            style={{ color: "black", opacity: 10 }}
                          />
                          <span className="text-base font-medium opacity-70">
                            {dayjs(it.createdAt).format(FORMAT_TIME)}
                          </span>
                        </div>
                        <div
                          className="w-full h-[120px] line-clamp-5 text-base font-normal"
                          dangerouslySetInnerHTML={{ __html: it.content }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-full h-[1px] bg-slate-300 my-6"></div>
                  </div>
                ))}
                <Pagination
                  defaultCurrent={1}
                  defaultActiveKey={1}
                  defaultPageSize={5}
                  className="flex justify-end"
                  total={blogs?.totalResults}
                  onChange={changePagination}
                />
              </div>
            ) : (
              <div className="bg-white rounded-md p-6">
                <Collapse
                  defaultActiveKey={["1"]}
                  expandIconPosition="end"
                  onChange={onChange}
                  items={itemsFaq}
                />
              </div>
            )}
          </Col>
        </Row>

        <FloatButton.BackTop />
      </div>
    </Spin>
  );
};

export default Home;

export const SidebarItem = ({ children, title = "" }) => {
  return (
    <div className="flex flex-col mb-10 border p-6 bg-white rounded-lg">
      <span className="text-start text-[#9c3a17] text-xl font-semibold mb-10">
        {title}
      </span>
      {children}
    </div>
  );
};
