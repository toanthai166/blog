import { useCallback, useEffect, useState } from "react";
import { Spin } from "antd";
import { useLocation } from "react-router-dom";

import { ChooseAddress } from "../../components/choose-address";
import { ChooseVoucher } from "../../components/choose-voucher/choose-voucher";
import { ConfirmInfomationOrder } from "./confirm-infomation-order";

const CreateOrderStep = {
  chooseProducts: "chooseProducts",
  chooseAddress: "chooseAddress",
  chooseVoucher: "chooseVoucher",
  confirmInfomation: "confirmInfomation",
};

const Payment = () => {
  const { state } = useLocation();
  const { products, isCart, totalPayment, carts } = state;

  const [step, setStep] = useState(CreateOrderStep.chooseProducts);

  const [openChooseAddress, setOpenChooseAddress] = useState(false);
  const [addressSelected, setAddressSelected] = useState();

  const [openChooseVoucher, setOpenChooseVoucher] = useState(false);
  const [voucherSelected, setVoucherSelected] = useState();

  const resetModal = useCallback(() => {
    setOpenChooseAddress(false);
    setOpenChooseVoucher(false);
  }, []);

  const handleRechooseAddress = useCallback(() => {
    setOpenChooseAddress(true);
    setStep(CreateOrderStep.chooseAddress);
  }, []);

  const handleRechooseVoucher = useCallback(() => {
    setOpenChooseVoucher(true);
    setStep(CreateOrderStep.chooseVoucher);
  }, []);

  const handleCancelChooseAddress = useCallback(
    (value) => {
      setAddressSelected(value);
      resetModal();
    },
    [resetModal]
  );

  const handleSaveAddress = useCallback((value) => {
    setAddressSelected(value);
    setOpenChooseAddress(false);
  }, []);

  const handleCancelChooseVoucher = useCallback(() => {
    resetModal();
  }, [resetModal]);

  const handleSaveVoucher = useCallback(
    (value) => {
      setVoucherSelected(value);
      setOpenChooseVoucher(false);
      setStep(CreateOrderStep.confirmInfomation);
    },
    [setVoucherSelected]
  );

  useEffect(() => {
    if (isCart && step === CreateOrderStep.chooseProducts) {
      setStep(CreateOrderStep.chooseAddress);
      setOpenChooseAddress(true);
    }
  }, [isCart, step]);

  return (
    <Spin spinning={false}>
      {step === CreateOrderStep.chooseAddress && openChooseAddress && (
        <ChooseAddress
          open={openChooseAddress}
          setOpen={setOpenChooseAddress}
          onCancel={handleCancelChooseAddress}
          onFinish={handleSaveAddress}
          defaultAddress={addressSelected}
        />
      )}
      {step === CreateOrderStep.chooseVoucher && openChooseVoucher && (
        <ChooseVoucher
          open={openChooseVoucher}
          setOpen={setOpenChooseVoucher}
          onCancel={handleCancelChooseVoucher}
          onFinish={handleSaveVoucher}
          productIds={carts.map((item) => item.productId)}
          priceOfOrder={totalPayment}
          defaultVoucher={voucherSelected}
        />
      )}
      <ConfirmInfomationOrder
        productsBuy={products}
        address={addressSelected}
        totalPayment={totalPayment}
        discount={voucherSelected}
        products={products}
        onReChooseAddress={handleRechooseAddress}
        onReChooseVoucher={handleRechooseVoucher}
        isCart={!!isCart}
        carts={carts}
      />
    </Spin>
  );
};
export default Payment;
