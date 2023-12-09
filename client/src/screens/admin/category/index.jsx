import { Button, Popconfirm, Switch, Table, Tag, Tooltip } from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import { AppRoutes } from "../../../helpers/app-routes";
import { useNavigate } from "react-router-dom";
import { DefaultPagination } from "../../../ultis/pagination";

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  useCategories,
  useChangeIsActiveCategory,
  useDeleteCate,
} from "../../../hooks/category.hook";
import { useState } from "react";

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
  });
  const onChangePage = (newPage) => {
    setFilter({ ...filter, page: newPage });
  };

  const { categories } = useCategories({ ...filter });
  const listCategories = categories?.results
    ? categories?.results?.map((item, index) => ({
        ...item,
        key: item.id,
        index: ++index,
      }))
    : [];

  const { handleChangeIsActiveCate } = useChangeIsActiveCategory({ ...filter });
  const { handleDeleteCate, mutation } = useDeleteCate({ ...filter });

  const handleChangeStatus = async (row) => {
    const { id, isActive } = row;
    await handleChangeIsActiveCate({ categoryId: id, isActive: !isActive });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text) => <a className="text-base font-medium">{text}</a>,
    },
    {
      title: "Trạng thái",
      key: "isActive",
      render: (it) => {
        return (
          <Popconfirm
            title={`Bạn có chắc muốn cập nhật trạng thái danh mục ?`}
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
      render: (id) => {
        return (
          <div className="flex gap-2 justify-end">
            <Tooltip title="Sửa">
              <Tag
                className="hover:cursor-pointer"
                color="blue"
                onClick={() => navigate(AppRoutes.categoryEditById(id))}
              >
                <EditOutlined />
              </Tag>
            </Tooltip>
            <span className="translate-y-0.5 text-grayscale-border">|</span>
            <Popconfirm
              title="Xóa danh mục"
              okButtonProps={{ disabled: mutation.isLoading }}
              onConfirm={() => {
                handleDeleteCate(id);
              }}
              description="Bạn có chắc chắn xóa danh mục này?"
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
                onClick={() => navigate(AppRoutes.categoryDetailId(id))}
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
    <>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Danh mục", to: AppRoutes.category },
        ]}
        rightContent={
          <Button
            type="default"
            onClick={() => {
              navigate(AppRoutes.createCate);
            }}
          >
            Thêm danh mục
          </Button>
        }
      />
      <div className="bg-white mx-5 mt-5">
        <h2 className="text-lg font-semibold p-5">
          {categories.totalResults} danh mục tất cả
        </h2>
        <Table
          size="small"
          className="p-6"
          bordered
          columns={columns}
          dataSource={listCategories}
          pagination={{
            ...DefaultPagination,
            onChange: onChangePage,
            current: Number(filter?.page),
            total: categories?.totalResults,
          }}
          scroll={{ y: "calc(100vh - 320px)" }}
        />
      </div>
      <div></div>
    </>
  );
};

export default CategoryManagement;
