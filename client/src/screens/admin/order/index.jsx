import {
  Divider,
  Popconfirm,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
  notification,
} from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import {
  CloseOutlined,
  SendOutlined,
  EyeOutlined,
  HomeOutlined,
  CheckOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import { AppRoutes } from "../../../helpers/app-routes";
import { useCallback, useState } from "react";
import { DefaultPagination, numberWithDots } from "../../../ultis/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOrder, useUpdateOrder } from "../../../hooks/order.hook";
import dayjs from "dayjs";
import { useQueryClient } from "react-query";
import { ModalCustomize } from "../../../components/modal-customize";
import TextArea from "antd/es/input/TextArea";

export const FORMAT_TIME = "DD/MM/YYYY HH:mm";
const reasons = ["Không liên hệ được người mua", "Sản phẩm bị lỗi"];

const OrderManagement = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const [note, setNote] = useState();
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState([]);
  const [idCancel, setIdCancel] = useState("");

  const [tabActive, setTabActive] = useState("wait_for_confirm");
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
    status: "wait_for_confirm",
  });
  const { orders, isLoading } = useOrder({ ...filter });
  const { handleUpdateOrder, mutation } = useUpdateOrder();

  const listOrder = orders?.results
    ? orders?.results?.map((item, index) => ({
        ...item,
        key: item.id,
        index: ++index,
      }))
    : [];

  const onChangePage = (newPage) => {
    setFilter({ ...filter, page: newPage });
  };

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
  const client = useQueryClient();

  const handleChangeStatusToShipping = useCallback(
    async (record) => {
      console.log("record :>> ", record);
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

  const handleChangeNote = (e) => setNote(e.target.value);

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
        }).then(() => {
          client.invalidateQueries(`orders?status=wait_for_confirm`);
          notification.success({
            message: `Đơn hàng ${record?.code} đã chuyển sang trạng thái hoàn thành`,
          });
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
          <Tooltip title="Xem chi tiết">
            <Tag
              className="hover:cursor-pointer"
              color="gold"
              onClick={() => navigate(AppRoutes.adminOrderDetailId(record.id))}
            >
              <EyeOutlined />
            </Tag>
          </Tooltip>
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
      dataIndex: "id",
      key: "code",
      render: (code) => <span>{code.slice(0, 8)}</span>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      width: "25%",
      render: (product) => {
        return product?.map((it, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex">
              <img
                className="w-20 h-20 rounded object-cover"
                src={it?.product?.image}
              />
              <span className="pl-12px text-base font-medium leading-5 line-clamp-1">
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
      key: "product",
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
      width: "180px",
      dataIndex: "status",
      render: (status, _record) => renderActionsByStatus(status, _record),
    },
  ];
  const orderCompletedColumn = () => [
    {
      title: "Mã đơn hàng",
      key: "code",
      dataIndex: "id",
      render: (code) => <spa>{code.slice(0, 8)}</spa>,
      width: "10%",
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      width: "25%",
      render: (product) => {
        return product?.map((it, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex">
              <img
                className="w-20 h-20 rounded object-cover"
                src={it?.product?.image}
              />
              <span className="pl-12px text-base font-medium leading-5 line-clamp-1">
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
      render: (status, record) => (
        <Tooltip title="Xem chi tiết">
          <Tag
            className="hover:cursor-pointer"
            color="gold"
            onClick={() => navigate(AppRoutes.adminOrderDetailId(record.id))}
          >
            <EyeOutlined />
          </Tag>
        </Tooltip>
      ),
    },
  ];
  const orderCancelColumn = () => [
    {
      title: "Mã đơn hàng",
      key: "code",
      dataIndex: "id",
      render: (code) => <span>{code.slice(0, 8)}</span>,
      width: "10%",
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      width: "25%",
      render: (product) => {
        return product?.map((it, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex">
              <img
                className="w-20 h-20 rounded object-cover"
                src={it?.product?.image}
              />
              <span className="pl-12px text-base font-medium leading-5 line-clamp-1">
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
      render: (status, record) => (
        <Tooltip title="Xem chi tiết">
          <Tag
            className="hover:cursor-pointer"
            color="gold"
            onClick={() => navigate(AppRoutes.adminOrderDetailId(record.id))}
          >
            <EyeOutlined />
          </Tag>
        </Tooltip>
      ),
    },
  ];
  const [columns, setColumns] = useState(defaultColumns);

  const handleChangeTab = (key) => {
    const newStatus = key;
    setParams((p) => {
      p.set("status", newStatus);
      return p;
    });
    setTabActive(newStatus);
    console.log(newStatus);
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

  return (
    <Spin spinning={isLoading}>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Đơn hàng", to: null },
        ]}
      />
      <div className="item-banner px-5">
        <Tabs items={tabs} activeKey={tabActive} onChange={handleChangeTab} />
      </div>

      <div className="bg-white mx-5 mt-5 ">
        <h2 className="text-lg font-semibold p-5">
          {orders?.totalResults} đơn hàng tất cả
        </h2>
        <Table
          size="small"
          bordered
          className="p-5"
          columns={columns}
          dataSource={listOrder}
          pagination={{
            ...DefaultPagination,
            onChange: onChangePage,
            current: Number(filter?.page),
            total: orders?.totalResults,
          }}
          scroll={{ y: "calc(100vh - 320px)" }}
        />
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
    </Spin>
  );
};

export default OrderManagement;
