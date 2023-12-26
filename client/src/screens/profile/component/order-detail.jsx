import { Button, Col, Image, Row } from "antd";
import { numberWithDots } from "../../../ultis/pagination";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { FORMAT_TIME } from "../../admin/order";
import { RowItem } from "../../../components/row-item";
import { ReceiptIcon } from "../../../assets";
import { ResponseMessage } from "../../../components/response-message";
import { ReviewOrder } from "./review-order";
import { MasterTable } from "../../../components/master-table/master-table";
import ProfileLayout from "./profile-layout";
import { FaAngleLeft } from "react-icons/fa6";
import { useGetOrderById } from "../../../hooks/order.hook";
import { useCreateReview } from "../../../hooks/review.hook";

const convertStatusOrder = (status) => {
  switch (status) {
    case "wait_for_confirm":
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
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const { order } = useGetOrderById(id);
  const [note, setNote] = useState();
  useEffect(() => {
    if (order) {
      setNote(order?.note);
    }
  }, [order]);
  const totalCost = order?.product?.reduce((acc, curr) => {
    const product = curr.product;
    const quantity = curr.quantity;
    const cost = product.unitPrice * quantity;
    return acc + cost;
  }, 0);

  const discounts = useMemo(() => {
    const { unit, value = 0 } = order?.discount || {};
    console.log("unit :>> ", unit);
    const isPercent = unit === "PERCENTAGE";
    let total = 0;

    if (isPercent) {
      total = (totalCost * value) / 100;
    } else {
      total -= value;
    }

    const payment = Math.floor(total);
    return payment;
  }, [order?.discount, totalCost]);

  const [openReview, setOpenReview] = useState(false);
  const { handleCreateReview } = useCreateReview(setOpenReview);

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
      case "wait_for_confirm":
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
          <div className="flex gap-1">
            <Button type="text" onClick={() => navigate(-1)}>
              <FaAngleLeft className="w-4 h-4" />
            </Button>
            <span className="text-xl font-semibold ">
              <span className="cursor-pointer"></span> Thông tin chi tiết đơn
              hàng
            </span>
          </div>
          <span>
            {order?.status == "complete" && (
              <div className="flex items-center gap-x-12px">
                <Button type="primary" onClick={() => setOpenReview(true)}>
                  Đánh giá
                </Button>
              </div>
            )}
          </span>
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
                  Tên người nhận:{" "}
                  <span className="font-medium">
                    {order?.addresses?.fullname}
                  </span>
                </p>
                <p className="text-base font-normal">
                  Địa chỉ:
                  <span className="font-medium">
                    {order?.addresses?.addressMoreInfo}
                    {", " + order?.addresses?.addressName}
                  </span>
                </p>
                <p className="text-base font-normal">
                  Điện thoại liên hệ{" "}
                  <span className="font-medium">{order?.addresses?.phone}</span>
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
                    expandedRowRender: () => {
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
                    Khuyến mại: {numberWithDots(discounts) + " đ"}
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
                {order?.id && (
                  <RowItem
                    wrapperStyle="py-4"
                    label="Mã đơn hàng"
                    value={order?.id.slice(0, 7)}
                  />
                )}
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
                {order?.statusDetail?.timeCancel && (
                  <RowItem
                    wrapperStyle="pb-4"
                    label="Thời gian hủy"
                    value={dayjs(order?.statusDetail?.timeCancel).format(
                      FORMAT_TIME
                    )}
                  />
                )}
                {order?.statusDetail?.user && (
                  <div className="flex gap-1">
                    <span className="w-[50%] text-base">Được hủy bởi:</span>
                    <div className="text-base">
                      {order?.statusDetail?.user?.role === "user"
                        ? "Người mua"
                        : "Người bán"}
                    </div>
                  </div>
                )}
                {order?.statusDetail?.timeConfirm && (
                  <RowItem
                    wrapperStyle="pb-4"
                    label="Thời gian xác nhận"
                    value={dayjs(order?.statusDetail?.timeConfirm).format(
                      FORMAT_TIME
                    )}
                  />
                )}
                {order?.statusDetail?.timeDelivered && (
                  <RowItem
                    wrapperStyle="pb-4"
                    label="Thời gian giao hàng"
                    value={dayjs(order?.statusDetail?.timeDelivered).format(
                      FORMAT_TIME
                    )}
                  />
                )}{" "}
                {order?.statusDetail?.timeComplete && (
                  <RowItem
                    wrapperStyle="pb-4"
                    label="Thời gian hoàn thành"
                    value={dayjs(order?.statusDetail?.timeComplete).format(
                      FORMAT_TIME
                    )}
                  />
                )}
                {order?.statusDetail?.content && (
                  <div className="flex gap-1">
                    <span className="w-[90%] text-base">Nội dung hủy:</span>
                    <div>
                      {JSON.parse(order?.statusDetail?.content).map(
                        (it, index) => (
                          <span className="text-base" key={index}>
                            {it + ","}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
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
            handleCreateReview({
              productId: order.product[0]?.product._id,
              rating: values.products[0]?.rating,
              comment: values.products[0]?.comment,
            }).then(() => {
              setOpenReview(false);
            });
          }}
        />
      )}
    </ProfileLayout>
  );
};

export default OrderDetail;
