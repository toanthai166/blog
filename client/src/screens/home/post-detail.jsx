import { Link, useParams } from "react-router-dom";
import { useGetBlogById } from "../../hooks/blog.hook";
import { Avatar, Breadcrumb, Button, Divider, Spin } from "antd";
import { useCallback, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useComment, useCreateComment } from "../../hooks/comment.hook";
import relativeTime from "dayjs/plugin/relativeTime";

import dayjs from "dayjs";
import { SidebarItem } from ".";
import { iconFollow } from "../../components/follow";
import FollowItem from "../../components/follow/FollowItem";
import "dayjs/locale/vi";
import { AppRoutes } from "../../helpers/app-routes";
dayjs.locale("vi");
dayjs.extend(relativeTime);

const PostDetail = () => {
  const { id = "" } = useParams();
  const [edit, setEdit] = useState(false);
  const [filter] = useState({
    limit: 100,
    page: 1,
  });
  const [comment, setComment] = useState("");
  const { comments, isLoading: loadingGetComment } = useComment(id);
  const { blog, isLoading } = useGetBlogById(id);
  const { handleCreateComment, mutation } = useCreateComment();

  const createComment = useCallback(() => {
    handleCreateComment({ content: comment, blogId: id });
    setComment("");
    setEdit(false);
  }, [comment, handleCreateComment, id]);
  return (
    <Spin spinning={isLoading || loadingGetComment}>
      <Breadcrumb
        className="text-2xl font-semibold mt-10 px-10 "
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
      <div className=" flex gap-5 p-10">
        <div className="w-[65%]" data-aos="fade-right">
          <div className="flex flex-col  w-full mt-10 gap-5">
            <h2 data-aos="fade-right" className="text-2xl font-bold leading-6">
              {blog.title}
            </h2>
            <img
              className="w-full max-w-[800px] object-cover rounded-lg"
              src={blog.image ?? ""}
              alt=""
            />
            <div
              className="post-detail mx-auto text-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
            <div>
              <h2>Tags:</h2>
              <div> Popular</div>
            </div>
            <Divider></Divider>
            <div>
              <h2>Comment</h2>
              <Divider />
              <TextArea
                maxLength={255}
                className="mb-10"
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
                    <Avatar src="" alt="" />
                    <div className="flex flex-col">
                      <span>{it?.user?.name}</span>
                      {dayjs(it?.createdAt).fromNow()}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="ml-10">{it?.content}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 my-20" data-aos="fade-left">
          {" "}
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
          <SidebarItem title="Đăng kí">
            <iframe
              width="500"
              height="300"
              src="https://www.youtube.com/embed/2oDlGDaIiig"
              title="Kiến Thức Hay - Tập 1: 50 món ăn  Việt Nam ?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </SidebarItem>{" "}
          {/* <SidebarItem title="TAGS">
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
            </SidebarItem> */}
        </div>
      </div>
    </Spin>
  );
};

export default PostDetail;
