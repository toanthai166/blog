import {
  FloatButton,
  Spin,
  Pagination,
  Row,
  Col,
  Tabs,
  Collapse,
  Input,
  Button,
  Form,
  Select,
} from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { ClockCircleOutlined, SearchOutlined } from "@ant-design/icons";
import "swiper/css";
import { HeartIcon } from "../../assets";
import { useBlog } from "../../hooks/blog.hook";
import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helpers/app-routes";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import dayjs from "dayjs";
import { FORMAT_TIME } from "../admin/discount";
import BodyRight from "./body-right";
import { useFAQ } from "../../hooks/faq.hook";
import {
  useAddToListFavorites,
  useRemoveToListBlogs,
} from "../../hooks/listFavorite.hook";
import { useCategoriesIsActive } from "../../hooks/category.hook";
import { ModalCustomize } from "../../components/modal-customize/modal-customize";

const Home = () => {
  const navigate = useNavigate();
  const [isFaq, setIsFaq] = useState(false);
  const [open, setOpen] = useState(false);
  const auth = JSON.parse(localStorage.getItem("auth"))?.data?.user;

  const [filter, setFilter] = useState({
    limit: 5,
    title: undefined,
    page: 1,
    isActive: true,
    categoryId: undefined,
  });
  const { hanldeAddToListBlogs, mutation } = useAddToListFavorites(filter);
  const { handleRemoveToListBlogs, mutation: mutationDelete } =
    useRemoveToListBlogs(filter);

  const { categories } = useCategoriesIsActive();

  const categoriesTypeOptions = useMemo(
    () =>
      categories?.map((it) => ({
        label: it.name,
        value: it.id,
      })),
    [categories]
  );

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

  const handleAddToFavoriteBlog = (id) => {
    if (auth == undefined) {
      setOpen(true);
    } else {
      hanldeAddToListBlogs({ blogId: id });
    }
  };
  const handleRemoveToFavoriteBlog = (id) => {
    if (auth == undefined) {
      setOpen(true);
    } else {
      handleRemoveToListBlogs({ blogId: id });
    }
  };

  const handleFilter = useCallback(
    (values) => {
      setFilter({ ...filter, ...values, page: 1 });
    },
    [filter]
  );
  if (blogs?.results?.length == 0)
    return (
      <Spin spinning={isLoading}>
        <div>
          <Row>
            <BodyRight />
            <Col span={17} data-aos="fade-right" className="p-6 rounded-md">
              <div className="bg-white  rounded w-full">
                <Form
                  size="middle"
                  onFinish={handleFilter}
                  className=" p-5 information-form-vehicle"
                >
                  <Row className="space-x-5">
                    <Col span={10}>
                      <Form.Item name="title">
                        <Input placeholder="Tìm kiếm theo tên bài viết"></Input>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item name="categoryId">
                        <Select
                          options={categoriesTypeOptions}
                          placeholder="Chọn danh mục"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Áp dụng
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
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
                            <span className=" bg-red-500 p-0 rounded max-w-[80px] text-slate-900 text-sm font-medium  w-full text-center mb-2">
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
                <div className="bg-white mt-10 rounded-lg w-full h-[300px] flex items-center flex-col justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-20 h-20 "
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h2 className="font-medium text-3xl text-red-600 mt-10">
                    Không tìm thấy bài viết
                  </h2>
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
  return (
    <Spin spinning={isLoading}>
      <div>
        <Row>
          <BodyRight />
          <Col span={17} data-aos="fade-right" className="p-6 rounded-md">
            <div className="bg-white mb-5  rounded w-full">
              <Form
                size="middle"
                onFinish={handleFilter}
                className="p-5 information-form-vehicle"
              >
                <Row className="space-x-5">
                  <Col span={10}>
                    <Form.Item name="title">
                      <Input placeholder="Tìm kiếm theo tên bài viết"></Input>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="categoryId">
                      <Select
                        options={categoriesTypeOptions}
                        placeholder="Chọn danh mục"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Áp dụng
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
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
                          <span className=" bg-red-700 p-1 rounded max-w-[200px]  text-base font-medium text-white  w-full text-center mb-2">
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
                  <div key={it.id} data-aos="zoom-in-up">
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
                          className="w-full h-[70px] line-clamp-3 text-base font-normal"
                          dangerouslySetInnerHTML={{ __html: it.content }}
                        ></div>
                        {it.isFavorite ? (
                          <Button
                            loading={mutationDelete.isLoading}
                            disabled={mutationDelete.isLoading}
                            type="primary"
                            className="w-14 h-10"
                            onClick={() => handleRemoveToFavoriteBlog(it?.id)}
                          >
                            <HeartIcon />
                          </Button>
                        ) : (
                          <Button
                            loading={mutation.isLoading}
                            disabled={mutation.isLoading}
                            type="text"
                            className="w-14 h-10"
                            onClick={() => handleAddToFavoriteBlog(it?.id)}
                          >
                            <HeartIcon />
                          </Button>
                        )}
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
      <ModalCustomize
        title="Đăng nhập để tiếp tục"
        footer=""
        onCancel={() => setOpen(false)}
        open={open}
      >
        <div className="flex flex-col items-center justify-center gap-10">
          <img
            src="../../public/image/blog-am-thuc.png"
            alt=""
            className="w-20 h-20 mt-5"
          />
          <Button type="default" onClick={() => navigate(AppRoutes.login)}>
            Đến trang đăng nhập
          </Button>
          <div>
            Bạn chưa có tài khoản?
            <Button type="link" onClick={() => navigate(AppRoutes.register)}>
              Đăng kí
            </Button>
          </div>
        </div>
      </ModalCustomize>
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
