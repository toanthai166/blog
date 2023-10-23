import { Button, Popconfirm, Spin, Switch, Table, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { AppRoutes } from "../../../helpers/app-routes";
import { useState } from "react";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import { DefaultPagination, numberWithDots } from "../../../ultis/pagination";
import {
  useChangeIsActiveProduct,
  useDeleteProduct,
  useProduct,
} from "../../../hooks/product.hook";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
  });
  const { products, isLoading } = useProduct({ ...filter });

  const { handleDeleteProduct, mutation } = useDeleteProduct();
  const { handleChangeIsActiveProduct } = useChangeIsActiveProduct();

  const handleChangeStatus = (row) => {
    const { id, isActive } = row;
    handleChangeIsActiveProduct({ id: id, isActive: !isActive });
  };

  const listProduct = products?.results
    ? products?.results?.map((item, index) => ({
        ...item,
        key: item.id,
        index: ++index,
      }))
    : [];
  console.log(listProduct);

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
      title: "Tên cuốn sách",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "end",
      render: (price) => <span>{numberWithDots(price) + " đ"}</span>,
    },
    {
      title: "Trạng thái",
      key: "isActive",
      render: (it) => {
        return (
          <Popconfirm
            title={`Bạn có chắc muốn cập nhật trạng thái sản phẩm ?`}
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
                onClick={() => navigate(AppRoutes.productEditById(id))}
              >
                <EditOutlined />
              </Tag>
            </Tooltip>
            <span className="translate-y-0.5 text-grayscale-border">|</span>
            <Popconfirm
              title="Xóa bài viết"
              okButtonProps={{ disabled: mutation.isLoading }}
              onConfirm={() => {
                handleDeleteProduct(id);
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
                onClick={() => navigate(AppRoutes.productDetailId(id))}
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
          { title: "Sản phẩm", to: AppRoutes.product },
        ]}
        rightContent={
          <Button
            type="default"
            onClick={() => {
              navigate(AppRoutes.createProduct);
            }}
          >
            Thêm mới
          </Button>
        }
      />
      <div className="bg-white mx-5 mt-5">
        <h2 className="text-lg font-semibold p-5">
          {listProduct?.totalResults} sản phẩm tất cả
        </h2>
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={listProduct}
          pagination={{
            ...DefaultPagination,
            onChange: onChangePage,
            current: Number(filter?.page),
            total: listProduct?.totalResults,
          }}
          scroll={{ y: "calc(100vh - 320px)" }}
        />
      </div>
      <div></div>
    </Spin>
  );
};

export default ProductManagement;
