import { Button, Popconfirm, Spin, Switch, Table, Tag, Tooltip } from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import { AppRoutes } from "../../../helpers/app-routes";
import { useState } from "react";
import { DefaultPagination } from "../../../ultis/pagination";
import {
  useAdminBlog,
  useChangeIsActiveBlog,
  useDeleteBlog,
} from "../../../hooks/blog.hook";
import { useNavigate } from "react-router-dom";

const BlogManagement = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
    title: "",
  });
  const { blogs, isLoading } = useAdminBlog({ ...filter });

  const { handleDeleteBlog, mutation } = useDeleteBlog();
  const { handleChangeIsActiveBlog } = useChangeIsActiveBlog();

  const handleChangeStatus = (row) => {
    const { id, isActive } = row;
    handleChangeIsActiveBlog({ blogId: id, isActive: !isActive });
  };

  const listBlog = blogs?.results
    ? blogs?.results?.map((item, index) => ({
        ...item,
        key: item.id,
        index: ++index,
      }))
    : [];

  const onChangePage = (newPage) => {
    setFilter({ ...filter, page: newPage });
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "40%",
      render: (text) => <span className="text-base font-medium">{text}</span>,
    },
    {
      title: "Tên danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => <a>{category?.name}</a>,
    },
    {
      title: "Trạng thái",
      key: "isActive",
      width: "10%",
      render: (it) => {
        return (
          <Popconfirm
            title={`Bạn có chắc muốn cập nhật trạng thái khảo sát ?`}
            okText="Đồng ý"
            cancelText="Huỷ bỏ"
            placement="topLeft"
            onConfirm={() => handleChangeStatus(it)}
          >
            <Switch checked={it?.isActive} size="default" />
          </Popconfirm>
        );
      },
    },

    {
      title: "Action",
      key: "id",
      dataIndex: "id",
      align: "center",
      render: (id) => {
        return (
          <div className="flex gap-2 justify-center">
            <Tooltip title="Sửa">
              <Tag
                className="hover:cursor-pointer"
                color="blue"
                onClick={() => navigate(AppRoutes.blogEditById(id))}
              >
                <EditOutlined />
              </Tag>
            </Tooltip>
            <span className="translate-y-0.5 text-grayscale-border">|</span>
            <Popconfirm
              title="Xóa bài viết"
              okButtonProps={{ disabled: mutation.isLoading }}
              onConfirm={() => {
                handleDeleteBlog(id);
              }}
              description="Bạn có chắc chắn xóa bài viết này?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Tooltip title="Xóa">
                <Tag className="hover:cursor-pointer" color="#f50">
                  <DeleteOutlined />
                </Tag>
              </Tooltip>
            </Popconfirm>
            <span className="translate-y-0.5 text-grayscale-border">|</span>
            <Tooltip title="Xem chi tiết">
              <Tag
                className="hover:cursor-pointer"
                color="gold"
                onClick={() => navigate(AppRoutes.blogDetailId(id))}
              >
                <EyeOutlined />
              </Tag>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  return (
    <Spin spinning={isLoading}>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Bài viết", to: AppRoutes.blog },
        ]}
        rightContent={
          <Button
            type="default"
            onClick={() => {
              navigate(AppRoutes.createBlog);
            }}
          >
            Tạo bài viết mới
          </Button>
        }
      />
      <div className="bg-white mx-5 mt-5 rounded-lg">
        <h2 className="text-lg font-semibold p-5">
          {blogs?.totalResults} bài viết tất cả
        </h2>
        <Table
          size="small"
          className="p-5"
          bordered
          columns={columns}
          dataSource={listBlog}
          pagination={{
            ...DefaultPagination,
            onChange: onChangePage,
            current: Number(filter?.page),
            total: blogs?.totalResults,
          }}
          scroll={{ y: "calc(100vh - 320px)" }}
        />
      </div>
      <div></div>
    </Spin>
  );
};

export default BlogManagement;
