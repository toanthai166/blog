import {
  Button,
  Divider,
  Popconfirm,
  Table,
  Tabs,
  Tag,
  Tooltip,
  message,
  notification,
} from "antd";
import ProfileLayout from "./profile-layout";
import { useCallback, useEffect, useState } from "react";
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
import { ModalCustomize } from "../../../components/modal-customize";
import TextArea from "antd/es/input/TextArea";

const reasons = ["Không liên hệ được người bán", "Tôi muốn mua sản phẩm khác"];

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
  const [note, setNote] = useState();
  const [open, setOpen] = useState(false);
  const [tabActive, setTabActive] = useState("wait_for_confirm");
  const { handleUpdateOrder, mutation } = useUpdateOrder({ ...filter });
  const handleChangeNote = (e) => setNote(e.target.value);

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

        // setFilter({ ...filter, status: "" });
        // navigate("?info=myOrder&status=shipping");
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
    [handleUpdateOrder, navigate]
  );
  const handleChangeStatusToShiped = useCallback(
    async (record) => {
      try {
        handleUpdateOrder({
          id: record?.id,
          status: "delivered",
        });

        // setFilter({ ...filter, status: "" });
        // navigate("?info=myOrder&status=delivered");
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
    [handleUpdateOrder, navigate]
  );
  const handleChangeStatusToCompleted = useCallback(
    async (record) => {
      try {
        handleUpdateOrder({
          id: record?.id,
          status: "complete",
        });

        // setFilter({ ...filter, status: "delivered" });
        // navigate("?info=myOrder&status=complete");
        notification.success({
          message: `Đơn hàng ${record?.code} đã chuyển sang trạng thái hoàn thành`,
        });
      } catch (error) {
        console.error("Lỗi khi cập nhật đơn hàng:", error);
        notification.error({
          message: "Có lỗi xảy ra khi cập nhật đơn hàng",
        });
      }
    },
    [filter, handleUpdateOrder]
  );
  const [selectedReason, setSelectedReason] = useState([]);
  const [idCancel, setIdCancel] = useState("");

  const handleSelected = useCallback(
    (id) => {
      const exist = selectedReason.includes(id);

      if (!exist) {
        setSelectedReason([...selectedReason, id]);
        return;
      }
      setSelectedReason(selectedReason.filter((i) => i !== id));
    },
    [selectedReason]
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
            <div
              className="cursor-pointer"
              type="text"
              onClick={() => {
                setOpen(true);
                setIdCancel(record.id);
              }}
            >
              <Tag className="hover:cursor-pointer" color="#f50">
                <CloseOutlined />
              </Tag>
            </div>
            <span className="translate-y-0.5 text-grayscale-border">|</span>
            <Tooltip title="Xem chi tiết">
              <Tag
                className="hover:cursor-pointer"
                color="gold"
                onClick={() => navigate(AppRoutes.orderDetailId(record.id))}
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
                onClick={() => navigate(AppRoutes.orderDetailId(record.id))}
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
                onClick={() => navigate(AppRoutes.orderDetailId(record.id))}
              >
                <EyeOutlined />
              </Tag>
            </Tooltip>
          </div>
        );
      case "complete":
      default:
        return (
          <Tooltip title="Xem chi tiết">
            <Tag
              className="hover:cursor-pointer"
              color="gold"
              onClick={() => navigate(AppRoutes.orderDetailId(record.id))}
            >
              <EyeOutlined />
            </Tag>
          </Tooltip>
        );
    }
  };
  const defaultColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "id",
      width: "10%",
      render: (code) => <span>{code.slice(0, 7)}</span>,
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
      dataIndex: "product",
      key: "quantity",
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
      dataIndex: "product",
      key: "product",
      width: "10%",
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
      dataIndex: "total",
      key: "total",
      width: "8%",

      render: (total) => (
        <span className="font-semibold">{numberWithDots(total) + "đ"}</span>
      ),
    },
    {
      title: "Thời gian đặt hàng",
      dataIndex: "createAt",
      key: "createAt",
      width: "10%",

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
      title: "Mã đơn hàng",
      key: "code",
      dataIndex: "id",
      render: (code) => <spa>{code.slice(0, 7)}</spa>,
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
      width: "10%",
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
      render: (status, record) => {
        return (
          <Tooltip title="Xem chi tiết">
            <Tag
              className="hover:cursor-pointer"
              color="gold"
              onClick={() => navigate(AppRoutes.orderDetailId(record.id))}
            >
              <EyeOutlined />
            </Tag>
          </Tooltip>
        );
      },
    },
  ];
  const orderCancelColumn = () => [
    {
      title: "Mã đơn hàng",
      key: "code",
      dataIndex: "id",
      render: (code) => <span>{code.slice(0, 7)}</span>,
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
      render: (status, record) => {
        return (
          <Tooltip title="Xem chi tiết">
            <Tag
              className="hover:cursor-pointer"
              color="gold"
              onClick={() => navigate(AppRoutes.orderDetailId(record.id))}
            >
              <EyeOutlined />
            </Tag>
          </Tooltip>
        );
      },
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
      <ModalCustomize
        open={open}
        title="Chọn lý do hủy đơn hàng"
        okText="Xác nhận"
        okButtonProps={{ disabled: selectedReason.length <= 0 }}
        // cancelButtonProps={{
        //   disabled: loading,
        // }}
        onOk={() => {
          const arr = [...selectedReason];
          arr.push(note);
          const content = JSON.stringify(arr);
          console.log(content);

          handleUpdateOrder({
            id: idCancel,
            status: "cancel",
            content: content,
          });
          notification.success({ message: "Bạn đã hủy đơn hàng thành công" });
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      >
        <>
          <div className="h-[440px] overflow-y-auto text-smleading-18px ">
            {(reasons || []).map((reason, key) => (
              <div
                onClick={() => handleSelected(reason)}
                className={`px-4 py-3 mt-4 border border-[#EEEEEE] border-solid rounded mb-3 last:mb-0 cursor-pointer ${
                  selectedReason.includes(reason)
                    ? "border-red-600 border-solid bg-[#FFFDF6]"
                    : ""
                }`}
                key={key}
              >
                {reason}
              </div>
            ))}

            <TextArea
              placeholder="Nhập lý do khác"
              value={note}
              maxLength={255}
              onChange={handleChangeNote}
              showCount
            />
          </div>
        </>
      </ModalCustomize>
    </ProfileLayout>
  );
};

export default MyOrder;
