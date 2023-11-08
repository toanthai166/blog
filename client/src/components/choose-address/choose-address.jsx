import { useEffect, useMemo, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { ModalCustomize } from "../modal-customize";
import { useAddress } from "../../hooks/address.hook";
import { Address } from "../../assets";

export const ChooseAddress = ({ onCancel, open, onFinish, defaultAddress }) => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth");
  const user = JSON.parse(auth);

  const { addresses } = useAddress(user?.user.id);

  const listAddress = useMemo(() => {
    const addressClone = addresses[0]?.addresses;
    const idxAddressDefault = addressClone?.findIndex((i) => i?.isDefault);
    if (idxAddressDefault > 0) {
      const addresDefault = addressClone[idxAddressDefault];
      addressClone.splice(idxAddressDefault, 1);
      addressClone.unshift(addresDefault);
    }
    return addressClone;
  }, [addresses]);

  const [addressSelected, setAddressSelected] = useState();

  useEffect(() => {
    if (listAddress && listAddress.length > 0 && !addressSelected) {
      const addressDefault = listAddress?.find((it) => it?.isDefault);
      setAddressSelected(addressDefault ?? listAddress[0]);
    }
  }, [addressSelected, listAddress]);

  useEffect(() => {
    setAddressSelected(defaultAddress);
  }, [defaultAddress]);

  return (
    <>
      <ModalCustomize
        title="Địa chỉ nhận hàng"
        okButtonProps={{
          title: "Chọn mã giảm giá",
          disabled: !addressSelected,
        }}
        cancelButtonProps={{
          className: "hidden",
        }}
        onOk={() => onFinish(addressSelected)}
        open={open}
        onCancel={() => onCancel(addressSelected)}
      >
        {listAddress && listAddress?.length > 0 ? (
          <div className="h-[400px] overflow-x-auto">
            {listAddress.map((add) => (
              <div
                className={`border border-solid  rounded flex gap-x-12px p-16px mb-16px hover:cursor-pointer ${
                  addressSelected?.id === add?.id
                    ? "border-[#FFC42C]"
                    : "border-slate-200"
                }`}
                key={"address" + add?.id}
                onClick={() => setAddressSelected(add)}
              >
                <div className="basis-1/12 w-[32px] h-[32px] rounded-full bg-primary flex justify-center items-center">
                  <Address fill="#fff" />
                </div>
                <div className="flex-1">
                  <h4 className="line-clamp-1">{add?.addressName}</h4>
                  <p className="text-[13px] text-grayscale-gray line-clamp-1">
                    {add?.mapAddress}
                  </p>
                  {add?.isDefault && (
                    <div className="text-primary">Địa chỉ mặc định</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <Button
              type="primary"
              onClick={() => navigate("/profile?info=address")}
            >
              Thêm địa chỉ
            </Button>
          </div>
        )}
      </ModalCustomize>
    </>
  );
};
