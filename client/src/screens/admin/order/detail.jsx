import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderById, useUpdateOrder } from "../../../hooks/order.hook";
import { Button, Descriptions, Image, Table, notification } from "antd";
import { DefaultPagination, numberWithDots } from "../../../ultis/pagination";
import { IoIosArrowBack } from "react-icons/io";
import dayjs from "dayjs";
import { FORMAT_TIME } from ".";
import { useQueryClient } from "react-query";
import {
  getNameCategoriesEntity,
  orderStatusText,
} from "../../../ultis/function";

const DetailOrder = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const { order } = useGetOrderById(id);
  const { handleUpdateOrder } = useUpdateOrder();

  const column = [
    {
      title: "Sản phẩm",
      key: "product",
      dataIndex: "product",
      width: "30%",
      render: (_, it) => {
        return (
          <div className="flex">
            <div className="w-[70px] h-[70px]">
              <Image
                className="w-[70px] h-[70px] rounded object-cover"
                src={it?.product?.image}
              />
            </div>
            <span className="pl-3 text-base font-medium leading-5">
              {it?.product?.name}
            </span>
          </div>
        );
      },
    },
    {
      title: "Số lượng",
      key: "product",
      dataIndex: "product",
      align: "right",
      width: "10%",
      render: (_, it) => {
        return <span>{"x" + it?.quantity}</span>;
      },
    },
    {
      title: "Đơn giá",
      key: "unitPrice",
      dataIndex: "unitPrice",
      align: "right",
      width: "15%",
      render: (_, it) => {
        return <span>{numberWithDots(it?.product?.unitPrice) + " đ"}</span>;
      },
    },
    {
      title: "Tổng cộng",
      key: "total",
      dataIndex: "total",
      align: "right",
      width: "15%",
      render: (_, r) => (
        <span className="font-semibold">
          {numberWithDots(r?.quantity * r?.product?.unitPrice) + " đ"}
        </span>
      ),
    },
  ];

  const client = useQueryClient();

  const handleChangeStatusToShipping = useCallback(
    async (record) => {
      try {
        handleUpdateOrder({
          id: record?.id,
          status: "shipping",
        }).then(() => {
          client.invalidateQueries(`orders?status=wait_for_confirm`);
          notification.success({
            message: `Đơn hàng ${record?.code} đã chuyển sang trạng thái đang giao`,
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
  const handleChangeStatusToShiped = useCallback(
    async (record) => {
      try {
        handleUpdateOrder({
          id: record?.id,
          status: "delivered",
        }).then(() => {
          client.invalidateQueries(`orders?status=wait_for_confirm`);
          notification.success({
            message: `Đơn hàng ${record?.code} đã chuyển sang trạng thái đã giao`,
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

  const actionsByOrderStatus = useCallback(() => {
    switch (order?.status) {
      case "wait_for-confirm":
        return (
          <div className="flex items-center justify-center gap-x-20px">
            <Button
              size="small"
              type="primary"
              onClick={() => handleChangeStatusToShipping(order)}
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
            onClick={() => handleChangeStatusToShiped(order)}
          >
            Đã giao hàng
          </Button>
        );

      case "delivered":
        return (
          <Button
            size="small"
            type="primary"
            onClick={() => handleChangeStatusToCompleted(order)}
          >
            Hoàn thành đơn hàng
          </Button>
        );

      default:
        return null;
    }
  }, [
    handleChangeStatusToCompleted,
    handleChangeStatusToShiped,
    handleChangeStatusToShipping,
    order,
  ]);

  if (!order) return null;
  return (
    <div className="p-5">
      <div className="text-xl font-semibold mb-10 flex justify-between">
        <div>
          <Button type="link" onClick={() => navigate(-1)}>
            <IoIosArrowBack />
          </Button>{" "}
          <span> Thông tin chi tiết đơn hàng</span>
        </div>
        {actionsByOrderStatus()}
      </div>
      <div className="text-lg">
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
              columns={column}
              dataSource={order?.product}
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
      </div>
    </div>
  );
};

export default DetailOrder;
