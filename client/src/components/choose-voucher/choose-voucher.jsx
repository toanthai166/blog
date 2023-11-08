import { useCallback, useMemo, useState, useEffect } from "react";
import { Button, Form, Input, Pagination, Radio } from "antd";
import dayjs from "dayjs";
import { numberWithDots } from "../../ultis/pagination";
import { ModalCustomize } from "../modal-customize";
import { useDiscount } from "../../hooks/discount.hook";

export const ChooseVoucher = ({
  productIds,
  onFinish,
  priceOfOrder = 0,
  defaultVoucher,
  ...props
}) => {
  const [filter, setFilter] = useState({
    productIds: productIds,
    limit: 10,
    page: 1,
    isActive: true,
  });
  const { discounts } = useDiscount(filter);
  console.log("discounts", discounts);

  const [voucherSelected, setVoucherSelected] = useState();

  const handleFilter = useCallback(
    ({ search }) => {
      setFilter({ ...filter, page: 1, search });
    },
    [filter]
  );

  useEffect(() => {
    setVoucherSelected(defaultVoucher);
  }, [defaultVoucher]);

  return (
    <>
      <ModalCustomize
        title="Chọn hoặc nhập mã giảm giá"
        okButtonProps={{
          disabled: !voucherSelected,
        }}
        {...props}
        onOk={() => onFinish(voucherSelected)}
      >
        <div className="h-[490px] overflow-y-auto">
          {discounts?.map((v) => {
            console.log(v);
            {
              /* if (v?.endDate && dayjs().isBefore(dayjs(v?.endDate))) {
              return null;
            } */
            }
            return (
              <div
                className={`flex gap-x-12px mb-16px ${
                  priceOfOrder < v?.minOrderValue
                    ? "hover:cursor-no-drop opacity-50"
                    : "hover:cursor-pointer"
                }`}
                key={v?.id}
                onClick={() => {
                  if (priceOfOrder < v?.minOrderValue) return;
                  setVoucherSelected(v);
                }}
              >
                <img
                  src="/img/image-voucher.png"
                  alt=""
                  className="w-[90px] h-[90px]"
                />
                <div className="flex-1">
                  <h4 className="line-clamp-2"> {v?.name}</h4>
                  <p>Đơn tối thiểu {numberWithDots(v?.minOrderValue) + " đ"}</p>
                  <p>
                    Giá trị giảm {numberWithDots(v?.value)}
                    {v?.unit === "PERCENTAGE" ? "%" : " đ"}
                  </p>
                </div>
                <Radio checked={voucherSelected?.id === v?.id} />
              </div>
            );
          })}
          <div className="float-right my-20px">
            <Pagination
              current={filter?.page}
              // total={discounts?.meta?.totalItems}
              pageSize={filter?.limit}
              onChange={(newPage) => setFilter({ ...filter, page: newPage })}
            />
          </div>
        </div>
      </ModalCustomize>
    </>
  );
};
