import { useCallback, useMemo, useState } from "react";
import { Avatar, Button, Col, Descriptions, Divider, Radio, Row } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { SubHeader } from "../../components/sub-header/SubHeader";
import { AppRoutes } from "../../helpers/app-routes";
import { numberWithDots } from "../../ultis/pagination";
import TextArea from "antd/es/input/TextArea";
import { useCreateOrder } from "../../hooks/order.hook";

export const ConfirmInfomationOrder = ({
  discount,
  productsBuy,
  address,
  totalPayment,
  onReChooseAddress,
  onReChooseVoucher,
  carts = [],
}) => {
  console.log("address", address);
  const [note, setNote] = useState("");
  const { handleCreateOrder, mutation } = useCreateOrder();
  const totalPayments = useMemo(() => {
    const { unit, value = 0 } = discount || {};
    const isPercent = unit === "PERCENTAGE";
    let total = 0;

    if (isPercent) {
      total = (totalPayment * value) / 100;
    } else {
      total -= value;
    }

    const payment = Math.floor(total);
    return payment;
  }, [discount, totalPayment]);

  const handleUserCreateOrder = useCallback(() => {
    handleCreateOrder({
      items: carts,
      total: totalPayments ? totalPayments : totalPayment,
      addressId: address.id,
      note: note,
    });
  }, [
    address?.id,
    carts,
    handleCreateOrder,
    note,
    totalPayment,
    totalPayments,
  ]);

  return (
    <div>
      <SubHeader
        items={[
          {
            title: "Trang chủ",
            to: AppRoutes.home,
          },
          // {
          //   title: AppRoutes.shopping.list.label,
          //   to: AppRoutes.shopping.list.value,
          // },
          {
            title: "Đặt hàng",
          },
        ]}
      />
      <div className="bg-ghost-white p-20px">
        <Row gutter={20}>
          <Col span={16}>
            <div className=" mb-16px p-20px">
              <h2 className="uppercase">Địa chỉ nhận hàng</h2>
              <Divider className="my-12px" />
              <div className="flex justify-between items-center">
                <div className="text-[13px] font-semibold leading-18px line-clamp-1">
                  {address?.fullname}
                  {address?.isDefault && (
                    <span className="text-[13px] text-primary inline pl-8px">
                      (Địa chỉ mặc định)
                    </span>
                  )}
                </div>
                <span
                  className="hover:cursor-pointer font-semibold text-[13px] text-primary"
                  onClick={onReChooseAddress}
                >
                  Thay đổi
                </span>
              </div>
              <p className="text-[13px] text-grayscale-gray leading-18px">
                {address?.phone}
              </p>
              <p className="text-[13px] text-grayscale-gray leading-18px">
                {address?.addressName}
              </p>
            </div>
            <div className="bg-white p-20px">
              <Descriptions
                className="w-full "
                bordered
                column={{ xl: 2, lg: 2, md: 2 }}
              >
                <Descriptions.Item
                  label="Sản phẩm"
                  labelStyle={{ backgroundColor: "#fff", textAlign: "center" }}
                  contentStyle={{ textAlign: "center" }}
                >
                  Số lượng
                </Descriptions.Item>
                <Descriptions.Item
                  label="Đơn giá"
                  labelStyle={{ backgroundColor: "#fff", textAlign: "center" }}
                  contentStyle={{ textAlign: "center" }}
                >
                  Thành tiền
                </Descriptions.Item>
                {carts.map((p) => {
                  const product = productsBuy.find(
                    (it) => it?.product._id === p?.productId
                  );
                  return (
                    <>
                      <Descriptions.Item
                        label={
                          <div className="flex" key={product?.product?.id}>
                            {product?.product?.image && (
                              <Avatar
                                shape="square"
                                src={product?.product?.image}
                              />
                            )}
                            <span className="pl-12px text-14px font-medium leading-20px line-clamp-1">
                              {product?.product?.name}
                            </span>
                          </div>
                        }
                        labelStyle={{
                          backgroundColor: "#fff",
                          color: "rgba(19, 19, 19, 1)",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                        contentStyle={{
                          backgroundColor: "#fff",
                          color: "rgba(19, 19, 19, 1)",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {p?.quantity}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          numberWithDots(product?.product?.unitPrice) + "đ "
                        }
                        labelStyle={{
                          backgroundColor: "#fff",
                          color: "rgba(19, 19, 19, 1)",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                        contentStyle={{
                          backgroundColor: "#fff",
                          color: "rgba(19, 19, 19, 1)",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        {numberWithDots(
                          p?.quantity * (product?.product?.unitPrice ?? 1)
                        ) + "đ "}
                      </Descriptions.Item>
                    </>
                  );
                })}
              </Descriptions>
            </div>
          </Col>
          <Col span={8}>
            <div className="bg-white mb-16px p-20px">
              <h2 className="uppercase mb-20px">Mã giảm giá</h2>
              <div
                className="hover:cursor-pointer px-16px py-[10px] flex items-center justify-between border border-solid border-grayscale-border rounded"
                onClick={() => onReChooseVoucher()}
              >
                <div className="border border-solid border-primary rounded-lg text-primary px-8px py-[4px]">
                  {discount
                    ? `Mã giảm  ${discount?.value} ${
                        discount?.unit === "PERCENTAGE" ? " %" : " đ"
                      }`
                    : "Chọn mã giảm giá"}
                </div>
                {discount ? (
                  <span className="text-primary">Thay đổi</span>
                ) : (
                  <RightOutlined />
                )}
              </div>
            </div>
            <div className="bg-white mb-16px p-20px">
              <h2 className="uppercase mb-20px">Phương thức thanh toán</h2>
              <div className="px-16px py-[10px] flex items-center justify-between">
                <span className="text-14px leading-20px ">
                  Thanh toán khi nhận hàng
                </span>
                <Radio checked disabled />
              </div>
            </div>
            <div className="bg-white mb-16px p-20px">
              <div className="px-16px py-[10px] flex items-center justify-between">
                <span className="text-14px leading-20px ">
                  Tổng thanh toán{" "}
                </span>
                <span className="font-semibold text-18px">
                  {numberWithDots(
                    totalPayments ? totalPayments : totalPayment
                  ) + " đ"}
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <div className="flex gap-5">
          <span>Ghi chú đơn hàng:</span>
          <TextArea
            showCount
            rows={2}
            maxLength={255}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div
          className="fixed left-[240px] right-0 bottom-0
         bg-white px-24px py-8px flex justify-end"
        >
          <Button
            type="primary"
            loading={mutation.isLoading}
            onClick={handleUserCreateOrder}
            disabled={!address || !productsBuy || mutation.isLoading}
          >
            Đặt mua
          </Button>
        </div>
      </div>
    </div>
  );
};
