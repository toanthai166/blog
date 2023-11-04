import { Button, Drawer, Input, InputNumber, Table } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCart, useRemoveToCart } from "../../hooks/cart.hook";
import { numberWithDots } from "../../ultis/pagination";

const minQuantity = 1;

const Cart = ({ open, setIsOpenDrawer }) => {
  const [quantityByProduct, setQuantityByProduct] = useState([]);
  const auth = localStorage.getItem("auth");
  const user = JSON.parse(auth);
  const { cart } = useCart(user?.user.id);

  const { handleRemoveToCart } = useRemoveToCart();

  const handleChangeQuantityProduct = useCallback(
    (quantity, product, isIncrease) => {
      let newQuantity = 0;
      if (isIncrease) {
        newQuantity =
          quantity + 1 > (product?.quantity ?? 1)
            ? product?.quantity ?? 1
            : quantity + 1;
      } else {
        newQuantity = quantity - 1 < minQuantity ? minQuantity : quantity - 1;
      }

      setQuantityByProduct(
        quantityByProduct.map((it) => {
          if (it?.productId === product?.id)
            return { ...it, quantity: newQuantity };
          return it;
        })
      );
    },
    [quantityByProduct]
  );

  useEffect(() => {
    if (cart[0]?.products && cart[0]?.products.length > 0) {
      setQuantityByProduct(
        cart[0]?.products.map((it) => ({
          productId: it?.product._id,
          quantity: it?.quantity,
        }))
      );
    }
  }, [cart]);

  const handleRemoveProduct = useCallback(
    (id) => {
      handleRemoveToCart({ productId: id });
    },
    [handleRemoveToCart]
  );
  const [productsBuy, setProductsBuy] = useState([]);

  // thêm id vào mảng
  const handleChangeInput = useCallback(
    (e) => {
      const { value, checked } = e.target;

      if (checked === true && !productsBuy.includes(value)) {
        const item = quantityByProduct.find((it) => it.productId === value);
        setProductsBuy([...productsBuy, item]);
      }
      if (checked === false) {
        const item = productsBuy.filter((it) => it.productId !== value);
        setProductsBuy(item);
      }
    },
    [productsBuy, quantityByProduct]
  );
  const columnDefault = useMemo(
    () => [
      {
        title: "",
        dataIndex: "product",
        key: "product",
        width: "3%",
        render: (product) => {
          return (
            <Input
              value={product._id}
              className="w-5 h-5 hover:cursor-pointer"
              checked={
                !!productsBuy.some((item) => item?.productId === product._id)
              }
              onChange={(e) => handleChangeInput(e)}
              type="checkbox"
            />
          );
        },
      },
      {
        title: "Sản phẩm",
        key: "",
        dataIndex: "",
        width: "25%",
        render: (item) => {
          return (
            <div className="full h-[90px] flex  gap-3">
              <img
                className="w-[90px] h-[90px] object-cover relative hover:cursor-pointer"
                src={item?.product?.image ?? ""}
                alt="Ảnh sản phẩm"
              />
              <span>{item?.product?.name}</span>
            </div>
          );
        },
      },
      {
        title: "Số lượng",
        key: "quantity",
        dataIndex: "quantity",
        align: "center",
        width: "15%",
        render: (quantity, item) => {
          const value = quantityByProduct.find((it) => {
            return it?.productId == item.product._id;
          })?.quantity;
          return (
            <InputNumber
              id="quantity-cart"
              className="w-[140px] text-center"
              addonBefore={
                <span
                  className={`px-6px py-[6px] hover:cursor-pointer`}
                  onClick={() =>
                    handleChangeQuantityProduct(value, item?.product)
                  }
                >
                  -
                </span>
              }
              addonAfter={
                <span
                  className={`px-6px py-[8px] hover:cursor-pointer`}
                  onClick={() =>
                    handleChangeQuantityProduct(value, item?.product, true)
                  }
                >
                  +
                </span>
              }
              value={value}
              min={1}
              max={item?.product?.quantity}
            />
          );
        },
      },

      {
        title: "Đơn giá",
        key: "unitPrice",
        dataIndex: "product",
        align: "right",
        width: "10%",
        render: (product) => numberWithDots(product?.unitPrice) + "đ",
      },
      {
        title: "Tùy chọn",
        key: "total",
        dataIndex: "product",
        align: "center",
        width: "10%",
        render: (product, item) => (
          <div className="flex justify-center items-center gap-x-12px">
            <span
              className="hover:cursor-pointer text-error"
              onClick={() => handleRemoveProduct(item?.product?._id)}
            >
              Xóa
            </span>
          </div>
        ),
      },
    ],
    [
      handleChangeInput,
      handleChangeQuantityProduct,
      handleRemoveProduct,
      productsBuy,
      quantityByProduct,
    ]
  );

  const totalPayment = productsBuy.reduce((total, productQuantity) => {
    const product = cart[0]?.products.find(
      (item) => item.product._id === productQuantity.productId
    );

    if (product) {
      return total + product.product.unitPrice * productQuantity.quantity;
    } else {
      return total;
    }
  }, 0);

  return (
    <div>
      <Drawer
        title="Giỏ hàng"
        className="text-center"
        placement="right"
        size={"large"}
        onClose={() => setIsOpenDrawer(false)}
        open={open}
        footer={
          <div className="flex justify-end shadow-md p-3 gap-5 items-center rounded-md">
            <span className="text-14px leading-20px">
              Tổng thanh toán ({productsBuy.length ?? 0} sản phẩm):
            </span>
            <span className="text-14px font-semibold leading-20px">
              {numberWithDots(totalPayment) + " đ"}
            </span>
            <Button type="dashed">Đặt mua</Button>
          </div>
        }
      >
        <Table
          size="middle"
          columns={columnDefault}
          dataSource={cart[0]?.products}
          scroll={{ y: "calc(100vh - 380px)" }}
        />
      </Drawer>
    </div>
  );
};

export default Cart;
