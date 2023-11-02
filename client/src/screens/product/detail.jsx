import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetProductById } from "../../hooks/product.hook";
import { Breadcrumb, Button, Col, Drawer, InputNumber, Row, Spin } from "antd";
import { AppRoutes } from "../../helpers/app-routes";
import { numberWithDots } from "../../ultis/pagination";
import { useCallback, useState } from "react";
import { CartIcon } from "../../assets";
const minQuantity = 1;

const ProductDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const { product, isLoading } = useGetProductById(id);
  console.log(product);

  const hanldeAddToCart = () => {
    console.log(1);
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
                      onClick={hanldeAddToCart}
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
        onClose={() => setIsOpenDrawer(false)}
        open={isOpenDrawer}
      >
        fsdf
      </Drawer>
    </Spin>
  );
};

export default ProductDetail;
