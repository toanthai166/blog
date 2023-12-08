import { useEffect, useMemo, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { ModalCustomize } from "../modal-customize";
import { useAddress } from "../../hooks/address.hook";

export const ChooseAddress = ({ onCancel, open, onFinish, defaultAddress }) => {
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth");
  const user = JSON.parse(auth)?.data;

  const { addresses } = useAddress(user?.user?.id);

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
  console.log("listAddress", listAddress);

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
          <div className="h-[400px] flex gap-10 flex-col overflow-x-auto">
            {listAddress.map((add) => (
              <div
                className={`border border-solid  rounded flex items-center  gap-x-4 p-16px mb-16px p-5 hover:cursor-pointer ${
                  addressSelected?.id === add?.id
                    ? "border-red-500"
                    : "border-slate-200"
                }`}
                key={"address" + add?.id}
                onClick={() => setAddressSelected(add)}
              >
                <div className=" w-[32px] h-[32px] rounded-full bg-primary flex justify-center items-center">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 20 20"
                    fill="#919699"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.9999 11.8079C8.2249 11.8079 6.7749 10.3662 6.7749 8.58288C6.7749 6.79954 8.2249 5.36621 9.9999 5.36621C11.7749 5.36621 13.2249 6.80788 13.2249 8.59121C13.2249 10.3745 11.7749 11.8079 9.9999 11.8079ZM9.9999 6.61621C8.91657 6.61621 8.0249 7.49954 8.0249 8.59121C8.0249 9.68288 8.90824 10.5662 9.9999 10.5662C11.0916 10.5662 11.9749 9.68288 11.9749 8.59121C11.9749 7.49954 11.0832 6.61621 9.9999 6.61621Z" />
                    <path d="M9.9999 18.967C8.76657 18.967 7.5249 18.5003 6.55824 17.5753C4.0999 15.2087 1.38324 11.4337 2.40824 6.94199C3.33324 2.86699 6.89157 1.04199 9.9999 1.04199C9.9999 1.04199 9.9999 1.04199 10.0082 1.04199C13.1166 1.04199 16.6749 2.86699 17.5999 6.95033C18.6166 11.442 15.8999 15.2087 13.4416 17.5753C12.4749 18.5003 11.2332 18.967 9.9999 18.967ZM9.9999 2.29199C7.5749 2.29199 4.45824 3.58366 3.63324 7.21699C2.73324 11.142 5.1999 14.5253 7.43324 16.667C8.8749 18.0587 11.1332 18.0587 12.5749 16.667C14.7999 14.5253 17.2666 11.142 16.3832 7.21699C15.5499 3.58366 12.4249 2.29199 9.9999 2.29199Z" />
                  </svg>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <h4 className="line-clamp-1 text-xl">{add?.addressName}</h4>
                  <p className=" text-grayscale-gray line-clamp-1">
                    {add?.addressMoreInfo}
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
