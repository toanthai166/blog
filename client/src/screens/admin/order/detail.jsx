import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetOrderById, useUpdateOrder } from "../../../hooks/order.hook";
import { Button, Descriptions, Table, notification } from "antd";
import { DefaultPagination, numberWithDots } from "../../../ultis/pagination";

import dayjs from "dayjs";
import { FORMAT_TIME } from ".";
import { useQueryClient } from "react-query";
import {
  getNameCategoriesEntity,
  orderStatusText,
} from "../../../ultis/function";

const DetailOrder = () => {
  const { id = "" } = useParams();
  const { order } = useGetOrderById(id);
  const { handleUpdateOrder } = useUpdateOrder();

  console.log(order);

  const columns = [
    {
      title: `STT`,
      dataIndex: "index",
      align: "center",
      width: "5%",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      key: "name",
      dataIndex: "name",
    },
    {
      title: `Số lượng`,
      dataIndex: "quantity",
      align: "center",
      width: "10%",
    },
    {
      title: `Đơn giá`,
      dataIndex: "unitPrice",
      align: "center",
      width: "10%",
      render: (v) => numberWithDots(v),
    },
    {
      title: `Giá`,
      dataIndex: "total",
      align: "right",
      render: (v) => numberWithDots(v),
    },
  ];
  const [showCancelOrder, setShowCancelOrder] = useState(false);
  // const [cancelOrderMutation, { loading: canceling }] =
  //   useAdminCancelOrderMutation({
  //     onError(error) {
  //       showNotification(
  //         "error",
  //         "Hủy đơn hàng thất bại",
  //         showGraphQLErrorMessage(error, true)
  //       );
  //     },
  //     onCompleted() {
  //       showNotification("success", `Hủy đơn hàng thành công ${order?.code}`);
  //       setShowCancelOrder(false);
  //       navigate(-1);
  //     },
  //   });
  // const handleCancelOrder = useCallback(
  //   (values) => {
  //     if (!order) return;
  //     const input = {
  //       orderId: order.id,
  //       ...values,
  //     };
  //     cancelOrderMutation({ variables: { input } });
  //   },
  //   [order, cancelOrderMutation]
  // );

  // const loading = useMemo(
  //   () => orderLoading || updating,
  //   [orderLoading, updating]
  // );
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

  const actionsByOrderStatus = useCallback(() => {
    switch (order?.status) {
      case "wait_for-confirm":
        return (
          <div className="flex items-center justify-center gap-x-20px">
            <Button size="small" onClick={() => setShowCancelOrder(true)}>
              Hủy đơn hàng
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={handleChangeStatusToShipping}
            >
              Xác nhận đơn hàng
            </Button>
          </div>
        );

      case "shipping":
        return (
          <Button
            size="small"
            type="primary"
            onClick={handleChangeStatusToShiped}
          >
            Đã giao hàng
          </Button>
        );

      case "delivered":
        return (
          <Button
            size="small"
            type="primary"
            onClick={handleChangeStatusToCompleted}
          >
            Hoàn thành đơn hàng
          </Button>
        );

      default:
        return null;
    }
  }, []);

  if (!order) return null;
  return (
    <div>
      <>
        <div className="flex justify-between items-center">
          {actionsByOrderStatus()}
        </div>
        <h2 className="mb-[12px]">Thông tin khách hàng</h2>
        <Descriptions column={1} labelStyle={{ width: "150px" }}>
          <Descriptions.Item label="Mã đơn hàng">
            {order?.code}
          </Descriptions.Item>
          <Descriptions.Item label="Tên khách hàng">
            {order?.addresses?.fullname}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {order?.addresses?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {order?.addresses?.addressMoreInfo} {order?.addresses?.addressName}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái đơn hàng">
            {order?.status && orderStatusText(order.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian đặt hàng">
            {order?.createdAt && dayjs(order.createdAt).format(FORMAT_TIME)}
          </Descriptions.Item>
          {order?.status === "cancel" && (
            <Descriptions.Item label="Thời gian huỷ">
              {order?.statusDetail?.createdAt &&
                dayjs(order?.statusDetail?.createdAt).format(FORMAT_TIME)}
            </Descriptions.Item>
          )}
          {order?.status === "cancel" && (
            <Descriptions.Item label="Lý do hủy đơn">
              {getNameCategoriesEntity(order?.statusDetail?.reasons ?? [])}
            </Descriptions.Item>
          )}
          {order?.status === "cancel" && (
            <Descriptions.Item label="Ghi chú hủy đơn">
              {order?.statusDetail?.note}
            </Descriptions.Item>
          )}
          {order?.status === "delivered" && (
            <Descriptions.Item label="Thời gian đã giao hàng">
              {order?.updatedAt && dayjs(order?.updatedAt).format(FORMAT_TIME)}
            </Descriptions.Item>
          )}
          {order?.status === "complete" && (
            <Descriptions.Item label="Thời gian hoàn thành">
              {order?.updatedAt && dayjs(order?.updatedAt).format(FORMAT_TIME)}
            </Descriptions.Item>
          )}
        </Descriptions>

        {order?.product && (
          <>
            <h2 className="mb-[12px] mt-[36px]">Thông tin sản phẩm</h2>
            <Table
              size="small"
              bordered
              columns={columns}
              // dataSource={listOrder}
              pagination={{
                ...DefaultPagination,
                total: order?.totalResults,
              }}
              scroll={{ y: "calc(100vh - 320px)" }}
            />
            <div className="flex justify-end font-bold text-[18px] mt-[18px]">
              <span className="pr-[140px]">Tổng tiền:</span>
              <span className="text-18px">
                {numberWithDots(order?.total) + " đ"}
              </span>
            </div>
          </>
        )}
        {/* {showCancelOrder && (
          <CancelOrder
            open={showCancelOrder}
            onCancel={() => setShowCancelOrder(false)}
            onCompleted={handleCancelOrder}
            categoryTypeEnum={CategoryTypeEnum.CANCEL_ORDER_REASON_BY_PARTNER}
            loading={canceling}
          />
        )} */}
      </>
    </div>
  );
};

export default DetailOrder;
