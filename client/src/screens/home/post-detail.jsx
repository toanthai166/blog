import { Link, useNavigate, useParams } from "react-router-dom";
import { useBlog, useGetBlogById } from "../../hooks/blog.hook";
import { Avatar, Breadcrumb, Button, Col, Divider, Row, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { UserOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useComment, useCreateComment } from "../../hooks/comment.hook";
import relativeTime from "dayjs/plugin/relativeTime";

import dayjs from "dayjs";
import { SidebarItem } from ".";
import { iconFollow } from "../../components/follow";
import FollowItem from "../../components/follow/FollowItem";
import "dayjs/locale/vi";
import { AppRoutes } from "../../helpers/app-routes";
import { Navigation, Scrollbar, A11y, Autoplay } from "swiper/modules";
import BodyRight from "./body-right";
import { ModalCustomize } from "../../components/modal-customize/modal-customize";

dayjs.locale("vi");
dayjs.extend(relativeTime);

const PostDetail = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { id = "" } = useParams();
  const [edit, setEdit] = useState(false);
  const auth = JSON.parse(localStorage.getItem("auth"))?.data?.user;

  const [comment, setComment] = useState("");
  const { comments, isLoading: loadingGetComment } = useComment(id);
  const { blog, isLoading } = useGetBlogById(id);
  const { blogs } = useBlog({
    limit: 10,
    page: 1,
    categoryId: blog.categoryId,
    title: "",
  });

  const { handleCreateComment, mutation } = useCreateComment();

  const createComment = useCallback(() => {
    if (auth == undefined) {
      setOpen(true);
    } else {
      handleCreateComment({ content: comment, blogId: id });
      setComment("");
      setEdit(false);
    }
  }, [auth, comment, handleCreateComment, id]);
  return (
    <Spin spinning={isLoading || loadingGetComment}>
      <Breadcrumb
        className="text-xl pt-10 font-medium px-6"
        items={[
          {
            title: <Link to={AppRoutes.home}>Trang chủ</Link>,
          },
          {
            title: <Link>Bài viết</Link>,
          },
          {
            title: <span className="line-clamp-1">{blog?.title}</span>,
          },
        ]}
      />
      <Row>
        <BodyRight />
        <Col span={17} data-aos="fade-right" className="p-6 post-details">
          <div className="flex flex-col  w-full rounded-lg gap-5 bg-white p-6">
            <h2
              data-aos="fade-right"
              className="text-2xl font-semibold leading-6"
            >
              {blog.title}
            </h2>
            <img
              className="w-full max-w-[800px] object-cover rounded-lg"
              src={blog.image ?? ""}
              alt=""
            />
            <div
              className="text-start mx-auto space-y-1 text-lg scroll-my-0"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
            <Divider></Divider>
            <div className="bg-white p-6">
              <h2 className="font-semibold text-xl leading-6">Bình luận</h2>
              <Divider />
              <TextArea
                maxLength={255}
                className="mb-10 text-base"
                showCount
                value={comment}
                rows={2}
                placeholder="Nhập bình luận của bạn"
                onChange={(e) => setComment(e.target.value)}
                onClick={() => setEdit(true)}
              />
              {edit && (
                <div className="flex justify-end gap-5">
                  <Button
                    onClick={() => {
                      setEdit(false);
                      setComment("");
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    onClick={createComment}
                    disabled={mutation.isLoading}
                    loading={mutation.isLoading}
                  >
                    Gửi
                  </Button>
                </div>
              )}
            </div>

            <div>
              {comments?.map((it) => (
                <div
                  key={it?.id}
                  className="space-y-4 mb-7"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                >
                  <div className="flex gap-5">
                    <Avatar
                      style={{ backgroundColor: "#b4755e" }}
                      icon={<UserOutlined />}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg ">
                        {it?.user?.name}
                      </span>
                      <span className="opacity-90">
                        {dayjs(it?.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="px-14 font-normal text-base">
                      {it?.content}
                    </span>
                  </div>
                  <Divider></Divider>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 bg-white  p-6">
            <span className="font-semibold text-xl left-6">
              Bài viết tương tự
            </span>
          </div>
          <Swiper
            grabCursor="true"
            // slidesPerView={"auto"}
            // modules={[Autoplay, Navigation, Scrollbar, A11y]}
            // navigation
            loop={true}
            // pagination={{ clickable: true }}
            // scrollbar={{ draggable: true }}
            // autoplay={{ delay: 2500, disableOnInteraction: false }}
          >
            {blogs?.results?.length > 0 &&
              blogs?.results?.map((post) => (
                <SwiperSlide key={post.id} className="p-6 bg-white">
                  <div className="w-full flex flex-col gap-2">
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-[180px] object-cover rounded-lg"
                    />
                    <div className="line-clamp-2 font-medium text-lg">
                      {post.title}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </Col>
      </Row>
      <ModalCustomize
        title="Đăng nhập để tiếp tục"
        footer=""
        onCancel={() => setOpen(false)}
        open={open}
      >
        <div className="flex flex-col items-center justify-center gap-10">
          <img src="../../public/image/logo.png" alt="" className="w-16 h-16" />
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

export default PostDetail;
