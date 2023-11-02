import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetProductById } from "../../hooks/product.hook";
import {
  Breadcrumb,
  Button,
  Col,
  Drawer,
  Input,
  InputNumber,
  Row,
  Spin,
  Table,
} from "antd";
import { AppRoutes } from "../../helpers/app-routes";
import { numberWithDots } from "../../ultis/pagination";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CartIcon } from "../../assets";
import { useAddToCart, useCart } from "../../hooks/cart.hook";
const minQuantity = 1;

const ProductDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [idsSelected, setIdSelected] = useState([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const auth = localStorage.getItem("auth");
  const user = JSON.parse(auth);
  const { cart } = useCart(user?.user.id);
  const [checkInputAll, setCheckInputAll] = useState();
  const [quantityByProduct, setQuantityByProduct] = useState([]);

  const { hanldeAddToCart } = useAddToCart();

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

  const handleChangeInput = useCallback(
    (e, product) => {
      console.log(e);
      console.log("product", product);
      const { value, checked } = e.target;
      console.log(value);

      if (checked === true && !idsSelected.includes(value)) {
        setIdSelected([...idsSelected, value]);
      }
      if (checked === false) {
        const newArr = idsSelected.filter((id) => id !== value);
        setIdSelected(newArr);
        if (newArr.length === 0) {
          setCheckInputAll(false);
        }
      }
    },
    [idsSelected]
  );

  const { product, isLoading } = useGetProductById(id);

  const hanldeAddProductToCart = () => {
    hanldeAddToCart({ id: id, quantity: quantity });
    setIsOpenDrawer(true);
  };

  const handleChangeQuantity = useCallback(
    (isIncrease = false) => {
      if (isIncrease) {
        setQuantity(
          quantity + 1 > (product?.quantity ?? 1)
            ? product?.quantity ?? 1
            : quantity + 1
        );
        return;
      }
      setQuantity(quantity - 1 < minQuantity ? minQuantity : quantity - 1);
    },
    [product?.quantity, quantity]
  );
  const handleChangeQuantityProduct = useCallback(
    (quantity = 1, product, isIncrease = false) => {
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

  const columns = useMemo(
    () => [
      {
        title: "",
        dataIndex: "",
        key: "",
        width: 50,
        render: (record) => {
          return (
            <Input
              value={record.quantity}
              className="w-5 h-5 hover:cursor-pointer"
              checked={!!idsSelected.includes(record.product._id)}
              onChange={(e) => handleChangeInput(e, record.product._id)}
              type="checkbox"
            />
          );
        },
      },
      {
        title: "",
        dataIndex: "",
        key: "",
        render: (item) => {
          const value = quantityByProduct.find((it) => {
            return it?.productId == item.product._id;
          })?.quantity;
          return (
            <div className="full h-[90px] flex  gap-3">
              <img
                className="w-[90px] h-[90px] object-cover relative hover:cursor-pointer"
                src={item?.product.image ?? ""}
                alt="Ảnh sản phẩm"
              />
              <div className="flex flex-col gap-1">
                <h2
                  className="w-[210px] text-[14px] h-[90px] font-semibold hover:cursor-pointer"
                  onClick={() => {
                    setIsOpenDrawer(false);
                    navigate(AppRoutes.productDetailId(item.product._id));
                  }}
                >
                  {item?.product?.name}
                </h2>
                <span className="text-sm text-primary">
                  {numberWithDots(item?.product.unitPrice ?? 0) + " đ"}
                </span>
                <InputNumber
                  id="quantity-cart"
                  className="w-[140px] text-center"
                  addonBefore={
                    <span
                      className={`p-2 hover:cursor-pointer`}
                      onClick={() =>
                        handleChangeQuantityProduct(value, item?.product)
                      }
                    >
                      -
                    </span>
                  }
                  addonAfter={
                    <span
                      className={`px-2 py-[8px] hover:cursor-pointer`}
                      onClick={() =>
                        handleChangeQuantityProduct(value, item?.product, true)
                      }
                    >
                      +
                    </span>
                  }
                  value={String(value)}
                  min={1}
                  max={item?.product?.quantity}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [
      handleChangeInput,
      handleChangeQuantityProduct,
      idsSelected,
      navigate,
      quantityByProduct,
    ]
  );
  return (
    <Spin spinning={isLoading}>
      <Breadcrumb
        className="text-2xl  "
        items={[
          {
            title: <Link to={AppRoutes.home}>Trang chủ</Link>,
          },
          {
            title: <Link to={AppRoutes.product}>Sản phẩm</Link>,
          },
          {
            title: <span>{product.name}</span>,
          },
        ]}
      />

      <div className=" mt-10 hidden-arrow-input">
        <Row className="">
          <Col md={24} lg={24} xl={12}>
            <div className="p-20px h-full w-full">
              <Row gutter={8}>
                <Col span={24}>
                  <div className="h-[450px]">
                    <img
                      src={product.image ?? ""}
                      alt="Ảnh sản phẩm"
                      className="w-full h-full object-fill"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col md={24} lg={24} xl={12}>
            <div className="flex flex-col justify-between content-between h-[490px] p-5">
              <div>
                <h2 className="line-clamp-2 text-[17px] py-[4px]  leading-[22px]">
                  {product?.name}
                </h2>
                <div className="flex items-end text-12px mb-16px">
                  {/* <Rate value={product?.reviewSummary?.starAverage} disabled /> */}
                  <p className="text-[12px] px-[4px] pb-[3px]">
                    {product?.reviewSummary?.starAverage ?? 0}
                  </p>
                  <span className="text-[12px] inline text-grayscale-gray pb-[3px]">
                    {"(" + (product?.reviewSummary?.total ?? 0) + " đánh giá)"}
                  </span>
                </div>
                <div className="p-[12px] bg-ghost-white">
                  <h4 className="text-primary font-normal">
                    {numberWithDots(product?.unitPrice ?? 0) + " đ"}
                  </h4>
                </div>
              </div>
              <div>
                <div className="flex items-center">
                  <label
                    htmlFor="quantity-cart"
                    className="text-grayscale-gray text-[13px] leading-18px pr-[40px]"
                  >
                    Chọn số lượng:
                  </label>
                  <InputNumber
                    id="quantity-cart"
                    className="w-[140px] text-center"
                    addonBefore={
                      <span
                        className={`px-6px py-[6px] hover:cursor-pointer`}
                        onClick={() => handleChangeQuantity()}
                      >
                        -
                      </span>
                    }
                    addonAfter={
                      <span
                        className={`px-6px py-[6px] hover:cursor-pointer`}
                        onClick={() => handleChangeQuantity(true)}
                      >
                        +
                      </span>
                    }
                    value={quantity}
                    min={minQuantity}
                    max={product?.quantity}
                  />
                  <span className="text-grayscale-gray text-[13px] leading-18px inline pl-[12px]">
                    {numberWithDots(product?.quantity) ?? 0} sản phẩm có sẵn
                  </span>
                </div>
                <div className="flex items-center gap-x-4 mt-4">
                  <Button className="border border-solid border-primary basis-5/12 w-full">
                    <div
                      className="flex items-center gap-x-[8px] justify-center"
                      onClick={hanldeAddProductToCart}
                    >
                      <CartIcon />
                      <span className="text-primary text-[13px] font-semibold leading-18px">
                        Thêm vào giỏ hàng
                      </span>
                    </div>
                  </Button>
                  <Button
                    type="dashed"
                    className="basis-5/12 w-full"
                    onClick={() =>
                      navigate(AppRoutes.shopping.payment.value, {
                        state: {
                          products: [product],
                          quantityByProduct: [
                            {
                              productId: product?.id,
                              quantity: quantity,
                              note: "",
                            },
                          ],
                          product,
                          defaultQuantity: quantity,
                        },
                      })
                    }
                  >
                    Đặt mua
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <h2>Thông tin chi tiết sách</h2>
        <div
          className="w-full max-w-[590px]"
          dangerouslySetInnerHTML={{ __html: product.description }}
        ></div>
      </div>
      <Drawer
        title="Giỏ hàng"
        className="text-center"
        placement="right"
        size={"large"}
        onClose={() => setIsOpenDrawer(false)}
        open={isOpenDrawer}
      >
        <Table
          size="middle"
          columns={columns}
          dataSource={cart[0]?.products}
          scroll={{ y: "calc(100vh - 380px)" }}
        />
      </Drawer>
    </Spin>
  );
};

export default ProductDetail;
