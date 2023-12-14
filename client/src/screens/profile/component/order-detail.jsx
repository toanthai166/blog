import { Button, Col, Image, Row } from "antd";
import { numberWithDots } from "../../../ultis/pagination";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { FORMAT_TIME } from "../../admin/order";
import { RowItem } from "../../../components/row-item";
import { ReceiptIcon } from "../../../assets";
import { ResponseMessage } from "../../../components/response-message";
import { ReviewOrder } from "./review-order";
import { MasterTable } from "../../../components/master-table/master-table";
import ProfileLayout from "./profile-layout";
import { useGetOrderById } from "../../../hooks/order.hook";

const convertStatusOrder = (status) => {
  switch (status) {
    case "wait-for-confirm":
      return "Chờ xác nhận";
    case "shipping":
      return "Đang giao";
    case "delivered":
      return "Đã giao";
    case "complete":
      return "Hoàn thành";
    default:
      return "Đã hủy";
  }
};

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

const OrderDetail = () => {
  const { id = "" } = useParams();
  const { order } = useGetOrderById(id);
  const [note, setNote] = useState();
  useEffect(() => {
    if (order) {
      setNote(order?.note);
    }
  }, [order]);

  const [openCancel, setOpenCancel] = useState(false);
  const [openReview, setOpenReview] = useState(false);

  const handleCancelOrder = useCallback(() => {
    setOpenCancel(true);
  }, []);

  const renderActions = useCallback(() => {
    switch (order?.status) {
      case "cancel":
        return (
          <div className="flex items-center gap-x-12px">
            {/* <Button type="primary" onClick={handleReCreateOrder}>
              Mua lại
            </Button> */}
          </div>
        );
      case "wait-for-confirm":
        return (
          <div className="flex items-center gap-x-12px">
            <Button type="primary" onClick={handleCancelOrder}>
              Hủy đơn hàng
            </Button>
          </div>
        );
      // case "shipping":
      //   return (
      //     <div className="flex items-center gap-x-12px ">
      //       <Button
      //         type="primary"
      //         onClick={() => handleChangeStatus(OrderStatusEnum.COMPLETE)}
      //       >
      //         Đã nhận hàng
      //       </Button>
      //     </div>
      //   );
      // case "delivered":
      //   return (
      //     <div className="flex items-center gap-x-12px">
      //       <Button
      //         type="primary"
      //         onClick={() => handleChangeStatus(OrderStatusEnum.COMPLETE)}
      //       >
      //         Hoàn thành
      //       </Button>
      //     </div>
      //   );
      case "complete":
        return (
          order?.userCanReview && (
            <div className="flex items-center gap-x-12px">
              <Button type="primary" onClick={() => setOpenReview(true)}>
                Đánh giá
              </Button>
            </div>
          )
        );

      default:
        break;
    }
  }, [handleCancelOrder, order?.status, order?.userCanReview]);

  const renderMessageByStatus = useCallback(() => {
    switch (order?.status) {
      case "cancel":
        return (
          <ResponseMessage
            gray
            className="text-white bg-slate-500"
            icon={<ReceiptIcon fill="#fff" />}
          >
            Đơn hàng đã bị hủy
          </ResponseMessage>
        );
      case "wait-for-confirm":
        return (
          <ResponseMessage
            info
            className="text-white "
            icon={<ReceiptIcon fill="#fff" />}
          >
            Đơn hàng đang chờ xác nhận từ người bán
          </ResponseMessage>
        );
      case "shipping":
        return (
          <ResponseMessage
            warning
            className="text-white bg-[#ca6d48]"
            icon={<ReceiptIcon fill="#fff" />}
          >
            Đơn hàng đang giao đến bạn
          </ResponseMessage>
        );
      case "delivered":
        return (
          <ResponseMessage
            success
            className="text-white bg-[#f8764f]"
            icon={<ReceiptIcon fill="#fff" />}
          >
            Đơn hàng đã giao đến bạn
          </ResponseMessage>
        );
      case "complete":
        return (
          <ResponseMessage
            success
            className="text-white bg-[#f8764f]"
            icon={<ReceiptIcon fill="#fff" />}
          >
            Đơn hàng đã hoàn thành
          </ResponseMessage>
        );
      default:
        break;
    }
  }, [order?.status]);

  if (!order) return null;
  return (
    <ProfileLayout>
      <div className="flex flex-col gap-5">
        <div className=" flex justify-between mt-5">
          <span className="text-xl font-semibold">
            <span className="cursor-pointer"></span> Thông tin chi tiết đơn hàng
          </span>
          <span> {renderActions()}</span>
        </div>

        <div>{renderMessageByStatus()}</div>
        <div className="">
          <Row gutter={20}>
            <Col span={16}>
              <div className="bg-white space-y-1 p-5">
                <h2 className="uppercase text-base leading-6 font-semibold border-b border-t-0 border-l-0 border-r-0 border-solid border-grayscale-border mb-3 pb-[12px]">
                  Địa chỉ nhận hàng
                </h2>
                <p className="text-base font-normal">
                  Tên người nhận: {order?.addresses?.fullname}
                </p>
                <p className="text-base font-normal">
                  Địa chỉ: {order?.addresses?.addressMoreInfo}
                  {", " + order?.addresses?.addressName}
                </p>
                <p className="text-base font-normal">
                  Điện thoại liên hệ {order?.addresses?.phone}
                </p>
                <p className="text-base font-normal"></p>
              </div>

              <div className="bg-white p-5 mt-5">
                <MasterTable
                  data={order?.product ?? []}
                  columns={column}
                  total={order?.product?.length ?? 0}
                  bordered
                  expandable={{
                    defaultExpandAllRows: true,
                    showExpandColumn: true,
                    columnWidth: "3%",
                    expandedRowRender: (order) => {
                      return (
                        <div className="my-3">
                          <span className="text-grayscale-gray text-base leading-5">
                            Ghi chú:
                          </span>
                          <span className="text-grayscale-black text-base leading-5 ml-3">
                            {note}
                          </span>
                        </div>
                      );
                    },
                  }}
                />

                <div className="flex justify-end mr-5">
                  <h3 className="text-lg">
                    Khuyến mại: {numberWithDots(order?.discount) + " đ"}
                  </h3>
                </div>
                <div className="flex justify-end mr-5">
                  <h2 className="text-lg">
                    Tổng tiền: {numberWithDots(order?.total) + " đ"}
                  </h2>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className="bg-white p-5">
                <h2 className="uppercase text-base leading-6 font-semibold">
                  thông tin đơn hàng
                </h2>
                <RowItem
                  wrapperStyle="py-4"
                  label="Mã đơn hàng"
                  value={order?.code}
                />
                <RowItem
                  wrapperStyle="pb-4"
                  label="Trạng thái"
                  value={convertStatusOrder(order?.status)}
                />
                <RowItem
                  wrapperStyle="pb-4"
                  label="Thời gian đặt"
                  value={dayjs(order?.createdAt).format(FORMAT_TIME)}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {openReview && (
        <ReviewOrder
          open={openReview}
          setOpen={setOpenReview}
          products={order?.product}
          onFinish={(values) => {
            console.log(values);
          }}
        />
      )}
    </ProfileLayout>
  );
};

export default OrderDetail;
