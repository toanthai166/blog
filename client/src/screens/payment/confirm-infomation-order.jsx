import { useCallback, useMemo, useState } from "react";
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Descriptions,
  Divider,
  Radio,
  Row,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import { SubHeader } from "../../components/sub-header/SubHeader";
import { AppRoutes } from "../../helpers/app-routes";
import { numberWithDots } from "../../ultis/pagination";
import TextArea from "antd/es/input/TextArea";
import { useCreateOrder } from "../../hooks/order.hook";
import { Link } from "react-router-dom";

export const ConfirmInfomationOrder = ({
  discount,
  productsBuy,
  address,
  totalPayment,
  onReChooseAddress,
  onReChooseVoucher,
  carts = [],
}) => {
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

    const payment = Math.floor(totalPayment - total);
    return payment;
  }, [discount, totalPayment]);

  console.log("totalPayments :>> ", totalPayments);
  const handleUserCreateOrder = useCallback(() => {
    if (discount) {
      handleCreateOrder({
        items: carts,
        total: totalPayments ? totalPayments : totalPayment,
        addressId: address.id,
        discountId: discount.id,
        note: note,
      });
    } else {
      handleCreateOrder({
        items: carts,
        total: totalPayments ? totalPayments : totalPayment,
        addressId: address.id,
        note: note,
      });
    }
  }, [
    address?.id,
    carts,
    discount,
    handleCreateOrder,
    note,
    totalPayment,
    totalPayments,
  ]);

  return (
    <div>
      <Breadcrumb
        className="text-2xl pt-10 "
        items={[
          {
            title: <Link to={AppRoutes.home}>Trang chủ</Link>,
          },
          {
            title: <sppan>Đặt hàng</sppan>,
          },
        ]}
      />
      <div className="pb-40">
        <Row gutter={24}>
          <Col span={16} className="bg-white p-6 rounded-md mt-10 pb-10">
            <div className="px-6">
              <h2 className="uppercase text-lg font-semibold">
                Địa chỉ nhận hàng
              </h2>
              <Divider className="my-12px" />
              <div className="flex justify-between items-center">
                <div className="text-lg items-center font-semibold flex gap-1 leading-18px line-clamp-1">
                  {address?.fullname}
                  {address?.isDefault && (
                    <span className="text-base text-primary inline pl-8px">
                      (Địa chỉ mặc định)
                    </span>
                  )}
                </div>
                <Button
                  type="default"
                  className="hover:cursor-pointer font-semibold text-sm text-primary"
                  onClick={onReChooseAddress}
                >
                  Thay đổi
                </Button>
              </div>
              <p className="text-base text-grayscale-gray leading-18px">
                {address?.phone}
              </p>
              <p className="text-base text-grayscale-gray leading-18px">
                {address?.addressName}
              </p>
            </div>
            <table className="w-full border mt-6">
              <tr className="border">
                <th className="border bg-slate-100 py-3">Sản phẩm</th>
                <th className="border bg-slate-100 py-3">Số lượng</th>
                <th className="border bg-slate-100 py-3">Đơn giá</th>
                <th className="border bg-slate-100 py-3">Thành tiền</th>
              </tr>
              {carts.map((p) => {
                const product = productsBuy.find(
                  (it) => it?.product._id === p?.productId
                );
                return (
                  <>
                    <tr>
                      <td className="border p-4">
                        <div className="flex" key={product?.product?.id}>
                          {product?.product?.image && (
                            <img
                              className="w-[80px] h-20"
                              src={product?.product?.image}
                            />
                          )}
                          <span className="pl-3 text-lg font-medium leading-5 line-clamp-1">
                            {product?.product?.name}
                          </span>
                        </div>
                      </td>
                      <td className="border p-4"> {p?.quantity}</td>
                      <td className="border p-4">
                        {numberWithDots(product?.product?.unitPrice) + " đ "}
                      </td>
                      <td className="border p-4">
                        {numberWithDots(
                          p?.quantity * (product?.product?.unitPrice ?? 1)
                        ) + " đ "}
                      </td>
                    </tr>
                  </>
                );
              })}
            </table>

            <div className="flex gap-5 mt-5">
              <span className="text-base">
                Ghi chú đơn hàng: <span className="text-red-700">*</span>
              </span>
              <TextArea
                className="flex-1"
                showCount
                rows={3}
                maxLength={255}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </Col>
          <Col span={8}>
            <div className="bg-white mt-10 mb-6 p-5 rounded">
              <h2 className="uppercase mb-5 text-base font-semibold">
                Mã giảm giá
              </h2>
              <div
                className="hover:cursor-pointer p-4  mb-5 flex items-center justify-between border border-solid border-grayscale-border rounded"
                onClick={() => onReChooseVoucher()}
              >
                <div className="border border-solid border-primary rounded-lg text-primary text-base px-2 py-1">
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
            <div className="bg-white  p-5">
              <h2 className="uppercase mb-5 text-lg font-medium">
                Phương thức thanh toán
              </h2>
              <div className="px-16px py-[10px] flex items-center justify-between">
                <span className="text-base leading-5 font-medium">
                  Thanh toán khi nhận hàng
                </span>
                <Radio checked disabled />
              </div>
            </div>
            <div className="bg-white p-5">
              <div className="px-16px py-[10px] flex items-center justify-between">
                <span className="text-base leading-5 ">Tổng thanh toán </span>
                <span className="font-semibold text-lg">
                  {numberWithDots(
                    totalPayments ? totalPayments : totalPayment
                  ) + " đ"}
                </span>
              </div>
            </div>
            <div
              className=" left-[240px] right-0 bottom-0
           px-24px mt-5 py-8px flex justify-end"
            >
              <Button
                type="primary"
                loading={mutation.isLoading}
                onClick={handleUserCreateOrder}
                disabled={
                  !address || !productsBuy || mutation.isLoading || !note
                }
              >
                Đặt mua
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
