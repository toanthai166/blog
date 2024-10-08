import {
  Button,
  Drawer,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCart, useRemoveToCart } from "../../hooks/cart.hook";
import { numberWithDots } from "../../ultis/pagination";
import { AppRoutes } from "../../helpers/app-routes";
import { useNavigate } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";

const minQuantity = 1;

const Cart = ({ open, setIsOpenDrawer }) => {
  const navigate = useNavigate();
  const [quantityByProduct, setQuantityByProduct] = useState([]);
  const auth = localStorage.getItem("auth");
  const user = JSON.parse(auth)?.data;
  const { cart } = useCart(user?.user?.id);
  const [productOrder, setProductOrder] = useState([]);

  const { handleRemoveToCart, mutation } = useRemoveToCart();

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
      console.log(JSON.stringify(cart[0]?.products));
      const product = cart[0]?.products?.find((it) => it.product._id === value);

      if (checked === true && !productsBuy.includes(value)) {
        const item = quantityByProduct.find((it) => it.productId === value);
        setProductsBuy([...productsBuy, item]);
        setProductOrder([...productOrder, product]);
      }
      if (checked === false) {
        const item = productsBuy.filter((it) => it.productId !== value);
        const newProductOrder = productOrder.filter(
          (it) => it.product._id !== value
        );
        setProductOrder(newProductOrder);
        setProductsBuy(item);
      }
    },
    [cart, productOrder, productsBuy, quantityByProduct]
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
        title: <span className="text-lg">Sản phẩm</span>,
        key: "",
        dataIndex: "",
        width: "30%",
        render: (item) => {
          return (
            <div className="full h-[90px] flex  gap-3">
              <img
                className="w-[90px] h-[90px] object-cover relative hover:cursor-pointer"
                src={item?.product?.image ?? ""}
                alt="Ảnh sản phẩm"
              />
              <span className="font-medium text-lg">{item?.product?.name}</span>
            </div>
          );
        },
      },
      {
        title: <span className="text-lg">Số lượng</span>,
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
        title: <span className="text-lg">Đơn giá</span>,
        key: "unitPrice",
        dataIndex: "product",
        align: "right",
        width: "10%",
        render: (product) => (
          <span className="font-normal text-base">
            {numberWithDots(product?.unitPrice) + " đ"}
          </span>
        ),
      },
      {
        title: <span className="text-lg">Tùy chọn</span>,
        key: "total",
        dataIndex: "product",
        align: "center",
        width: "10%",
        render: (product, item) => (
          <div className="flex justify-center items-center gap-x-12px">
            <Popconfirm
              title="Xóa bài viết"
              cancelText="Hủy"
              okText="Xóa"
              okButtonProps={{ disabled: mutation.isLoading }}
              onConfirm={() => handleRemoveProduct(item?.product?._id)}
              description="Bạn có chắc chắn xóa sản phẩm này ra khỏi giở hàng?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Tooltip title="Xóa">
                <Tag className="hover:cursor-pointer" color="#f50">
                  Xóa
                </Tag>
              </Tooltip>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [
      handleChangeInput,
      handleChangeQuantityProduct,
      handleRemoveProduct,
      mutation.isLoading,
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
            <span className="text-base leading-5">
              Tổng thanh toán ({productsBuy.length ?? 0} sản phẩm):
            </span>
            <span className="text-base font-semibold leading-5">
              {numberWithDots(totalPayment) + " đ"}
            </span>
            <Button
              type="primary"
              disabled={
                !productsBuy || (productsBuy && productsBuy.length === 0)
              }
              onClick={() => {
                setIsOpenDrawer(false);
                navigate(AppRoutes.payment, {
                  state: {
                    products: productOrder,
                    carts: productsBuy,
                    quantityByProduct: quantityByProduct.filter(
                      (it) =>
                        !!productsBuy.find(
                          (i) => i?.productId === it?.productId
                        )
                    ),
                    isCart: true,
                    totalPayment,
                  },
                });
              }}
            >
              Đặt mua
            </Button>
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
