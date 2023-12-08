import {
  Divider,
  Popconfirm,
  Table,
  Tabs,
  Tag,
  Tooltip,
  notification,
} from "antd";
import ProfileLayout from "./profile-layout";
import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { numberWithDots, DefaultPagination } from "../../../ultis/pagination";
import dayjs from "dayjs";
import { FORMAT_TIME } from "../../admin/order";
import { AppRoutes } from "../../../helpers/app-routes";
import { useQueryClient } from "react-query";
import { useOrder, useUpdateOrder } from "../../../hooks/order.hook";
import {
  CloseOutlined,
  SendOutlined,
  EyeOutlined,
  HomeOutlined,
  CheckOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const tabs = [
  {
    key: "wait_for_confirm",
    label: `Chờ xác nhận`,
  },
  {
    key: "shipping",
    label: `Đang giao`,
  },
  {
    key: "delivered",
    label: `Đã giao`,
  },
  {
    key: "complete",
    label: `Hoàn thành`,
  },
  {
    key: "cancel",
    label: `Đơn huỷ`,
  },
];

const MyOrder = ({ id }) => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
    status: "wait_for_confirm",
  });
  const { orders, isLoading } = useOrder({ ...filter, userId: id });
  const [tabActive, setTabActive] = useState("wait_for_confirm");
  const { handleUpdateOrder, mutation } = useUpdateOrder();

  const handleChangeTab = (key) => {
    const newStatus = key;
    setParams((p) => {
      p.set("status", newStatus);
      return p;
    });
    setTabActive(newStatus);
    setFilter({ ...filter, status: newStatus, page: 1 });

    switch (newStatus) {
      case "complete":
        setColumns(orderCompletedColumn);
        break;
      case "cancel":
        setColumns(orderCancelColumn);
        break;
      default:
        setColumns(defaultColumns);
    }
  };
  const onChangePage = (newPage) => {
    setFilter({ ...filter, page: newPage });
  };

  const client = useQueryClient();

  const handleChangeStatusToShipping = useCallback(
    async (record) => {
      try {
        handleUpdateOrder({
          id: record?.id,
          status: "shipping",
        });

        client.invalidateQueries(`orders?status=wait_for_confirm`);
        notification.success({
          message: `Đơn hàng ${record?.code} đã chuyển sang trạng thái đang giao`,
        });
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Lỗi khi cập nhật đơn hàng:", error);
        notification.error({
          message: "Có lỗi xảy ra khi cập nhật đơn hàng",
        });
      }
    },
    [client, handleUpdateOrder]
  );
  const handleChangeStatusToShiped = useCallback(
    async (record) => {
      try {
        handleUpdateOrder({
          id: record?.id,
          status: "delivered",
        });

        client.invalidateQueries(`orders?status=wait_for_confirm`);
        notification.success({
          message: `Đơn hàng ${record?.code} đã chuyển sang trạng thái đã giao`,
        });
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Lỗi khi cập nhật đơn hàng:", error);
        notification.error({
          message: "Có lỗi xảy ra khi cập nhật đơn hàng",
        });
      }
    },
    [client, handleUpdateOrder]
  );
  const handleChangeStatusToCompleted = useCallback(
    async (record) => {
      try {
        handleUpdateOrder({
          id: record?.id,
          status: "complete",
        });

        client.invalidateQueries(`orders?status=wait_for_confirm`);
        notification.success({
          message: `Đơn hàng ${record?.code} đã chuyển sang trạng thái hoàn thành`,
        });
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Lỗi khi cập nhật đơn hàng:", error);
        notification.error({
          message: "Có lỗi xảy ra khi cập nhật đơn hàng",
        });
      }
    },
    [client, handleUpdateOrder]
  );

  const renderActionsByStatus = (status, record) => {
    switch (status) {
      case "wait_for_confirm":
        return (
          <div className="flex gap-2 justify-end">
            <Tooltip title="Xác nhận đơn hàng" className="hover:cursor-pointer">
              <Tag
                color="green"
                onClick={() => handleChangeStatusToShipping(record)}
              >
                <SendOutlined />
              </Tag>
            </Tooltip>
            <span className="translate-y-0.5 text-grayscale-border">|</span>
            <Popconfirm
              title="Hủy đơn hàng"
              //   okButtonProps={{ disabled: mutation.isLoading }}
              onConfirm={() => {
                handleUpdateOrder({ id: record.id, status: "cancel" });
              }}
              description="Bạn có chắc chắn hủy đơn hàng này?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Tooltip title="Hủy đơn hàng">
                <Tag className="hover:cursor-pointer" color="#f50">
                  <CloseOutlined />
                </Tag>
              </Tooltip>
            </Popconfirm>
            <span className="translate-y-0.5 text-grayscale-border">|</span>
            <Tooltip title="Xem chi tiết">
              <Tag
                className="hover:cursor-pointer"
                color="gold"
                onClick={() =>
                  navigate(AppRoutes.adminOrderDetailId(record.id))
                }
              >
                <EyeOutlined />
              </Tag>
            </Tooltip>
          </div>
        );
      case "shipping":
        return (
          <div className="flex items-center justify-center">
            <Tooltip title="Đã giao hàng" className="hover:cursor-pointer">
              <Tag
                color="green"
                onClick={() => handleChangeStatusToShiped(record)}
              >
                <HomeOutlined />
              </Tag>
            </Tooltip>
            <Tooltip title="Xem chi tiết">
              <Tag
                className="hover:cursor-pointer"
                color="gold"
                onClick={() =>
                  navigate(AppRoutes.adminOrderDetailId(record.id))
                }
              >
                <EyeOutlined />
              </Tag>
            </Tooltip>
          </div>
        );
      case "delivered":
        return (
          <div className="flex items-center justify-center">
            <Tooltip
              title="Hoàn thành đơn hàng"
              className="hover:cursor-pointer"
            >
              <Tag
                color="green"
                onClick={() => handleChangeStatusToCompleted(record)}
              >
                <CheckOutlined />
              </Tag>
            </Tooltip>
            <Tooltip title="Xem chi tiết">
              <Tag
                className="hover:cursor-pointer"
                color="gold"
                onClick={() =>
                  navigate(AppRoutes.adminOrderDetailId(record.id))
                }
              >
                <EyeOutlined />
              </Tag>
            </Tooltip>
          </div>
        );
      default:
        return (
          <p
            className="text-primary hover:cursor-pointer"
            onClick={() => navigate(AppRoutes.adminOrderDetailId(record.id))}
          >
            Xem chi tiết
          </p>
        );
    }
  };
  const defaultColumns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
      render: (code) => <span>{code}</span>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      width: "40%",
      render: (product) => {
        return product?.map((it, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex">
              <img
                className="w-[50px] h-[50px] rounded object-cover"
                src={it?.product?.image}
              />
              <span className="pl-3 text-base font-medium leading-5">
                {it?.product?.name}
              </span>
            </div>
            {idx !== product.length - 1 && <Divider />}
          </div>
        ));
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (product) => {
        return product?.map((it, idx) => (
          <div key={"quantity" + it?.id} className="flex flex-col">
            <div className="h-[30px] mb-8px">{"x" + it?.quantity}</div>
            {idx !== product.length - 1 && <Divider />}
          </div>
        ));
      },
    },
    {
      title: "Đơn giá",
      dataIndex: "product",
      key: "product",
      render: (product) => {
        return product?.map((it, idx) => (
          <div className="flex flex-col" key={"unitPrice" + it?.id}>
            <div className="h-[30px] mb-8px">
              {numberWithDots(it?.product?.unitPrice) + "đ"}
              {idx !== product.length - 1 && <Divider />}
            </div>
          </div>
        ));
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <span className="font-semibold">{numberWithDots(total) + "đ"}</span>
      ),
    },
    {
      title: "Thời gian đặt hàng",
      dataIndex: "createAt",
      key: "createAt",
      render: (createAt) => <span>{dayjs(createAt).format("DD/MM/YYYY")}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      dataIndex: "status",
      render: (status, _record) => renderActionsByStatus(status, _record),
    },
  ];
  const orderCompletedColumn = () => [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mã đơn hàng",
      key: "code",
      dataIndex: "code",
      render: (code) => <spa>{code}</spa>,
      width: "10%",
    },
    {
      title: "Sản phẩm",
      key: "product",
      dataIndex: "product",
      width: "40%",

      render: (product) => {
        return product?.map((it, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex">
              <img
                className="w-[50px] h-[50px] rounded object-cover"
                src={it?.product?.image}
              />
              <span className="pl-3 text-base font-medium leading-5">
                {it?.product?.name}
              </span>
            </div>
            {idx !== product.length - 1 && <Divider />}
          </div>
        ));
      },
    },
    {
      title: "Số lượng",
      key: "product",
      dataIndex: "product",
      align: "right",
      width: "10%",
      render: (product) => {
        return product?.map((it, idx) => (
          <div key={"quantity" + it?.id} className="flex flex-col">
            <div className="h-[30px] mb-8px">{"x" + it?.quantity}</div>
            {idx !== product.length - 1 && <Divider />}
          </div>
        ));
      },
    },
    {
      title: "Đơn giá",
      key: "unitPrice",
      dataIndex: "product",
      align: "right",
      width: "15%",
      render: (product) => {
        return product?.map((it, idx) => (
          <div className="flex flex-col" key={"unitPrice" + it?.id}>
            <div className="h-[30px] mb-8px">
              {numberWithDots(it?.product?.unitPrice) + "đ"}
              {idx !== product.length - 1 && <Divider />}
            </div>
          </div>
        ));
      },
    },
    {
      title: "Tổng cộng",
      key: "total",
      dataIndex: "total",
      align: "right",
      width: "15%",
      render: (total) => (
        <span className="font-semibold">{numberWithDots(total) + "đ"}</span>
      ),
    },
    {
      title: "Thời gian đặt",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "center",
      width: "10%",
      render: (_createdAt) => dayjs(_createdAt).format(FORMAT_TIME),
    },
    {
      title: "Thời gian hoàn thành",
      key: "statusDetail",
      dataIndex: "statusDetail",
      align: "center",
      width: "10%",
      render: (statusDetail) =>
        dayjs(statusDetail?.createdAt).format(FORMAT_TIME),
    },
    {
      title: "Tùy chọn",
      dataIndex: "status",
      key: "action",
      align: "right",
      width: "10%",
      render: (status, _record) => {
        console.log(status);
        renderActionsByStatus(status, _record);
      },
    },
  ];
  const orderCancelColumn = () => [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mã đơn hàng",
      key: "code",
      dataIndex: "code",
      render: (code) => <span>{code}</span>,
      width: "10%",
    },
    {
      title: "Sản phẩm",
      key: "product",
      dataIndex: "product",
      width: "40%",
      render: (product) => {
        return product?.map((it, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex">
              <img
                className="w-[50px] h-[50px] rounded object-cover"
                src={it?.product?.image}
              />
              <span className="pl-3 text-base font-medium leading-5">
                {it?.product?.name}
              </span>
            </div>
            {idx !== product.length - 1 && <Divider />}
          </div>
        ));
      },
    },
    {
      title: "Số lượng",
      key: "quantity",
      dataIndex: "quantity",
      align: "right",
      width: "10%",
      render: (product) => {
        console.log("product :>> ", product);
        return product?.map((it, idx) => (
          <div key={"quantity" + it?.id} className="flex flex-col">
            <div className="h-[30px] mb-8px">{"x" + it?.quantity}</div>
            {idx !== product.length - 1 && <Divider />}
          </div>
        ));
      },
    },
    {
      title: "Đơn giá",
      key: "unitPrice",
      dataIndex: "product",
      align: "right",
      width: "15%",
      render: (product) => {
        return product?.map((it, idx) => (
          <div className="flex flex-col" key={"unitPrice" + it?.id}>
            <div className="h-[30px] mb-8px">
              {numberWithDots(it?.product?.unitPrice) + "đ"}
              {idx !== product.length - 1 && <Divider />}
            </div>
          </div>
        ));
      },
    },
    {
      title: "Tổng cộng",
      key: "total",
      dataIndex: "total",
      align: "right",
      width: "15%",
      render: (total) => (
        <span className="font-semibold">{numberWithDots(total) + "đ"}</span>
      ),
    },
    {
      title: "Thời gian đặt",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "center",
      width: "10%",
      render: (_createdAt) => dayjs(_createdAt).format(FORMAT_TIME),
    },
    {
      title: "Thời gian hủy",
      key: "statusDetail",
      dataIndex: "statusDetail",
      align: "center",
      width: "10%",
      render: (statusDetail) =>
        dayjs(statusDetail?.createdAt).format(FORMAT_TIME),
    },
    {
      title: "Tùy chọn",
      dataIndex: "status",
      key: "action",
      align: "right",
      width: "10%",
      render: (status, _record) => renderActionsByStatus(status, _record),
    },
  ];
  const [columns, setColumns] = useState(defaultColumns);
  return (
    <ProfileLayout>
      <div className="flex flex-col gap-5 w-full item-banner">
        <div className="bg-white p-5 font-medium text-lg rounded-lg">
          Đơn hàng của tôi
        </div>
        <div className="bg-white rounded-lg h-full min-h-[500px]">
          <Tabs
            className="px-5"
            items={tabs}
            activeKey={tabActive}
            onChange={handleChangeTab}
          />

          <div className="bg-white mx-5 mt-5">
            {/* <h2 className="text-lg font-semibold p-5">
              {orders?.totalResults} đơn hàng tất cả
            </h2> */}
            <Table
              size="small"
              bordered
              columns={columns}
              dataSource={orders?.results}
              pagination={{
                ...DefaultPagination,
                onChange: onChangePage,
                current: Number(filter?.page),
                total: orders?.totalResults,
              }}
              scroll={{ y: "calc(100vh - 320px)" }}
            />
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default MyOrder;
