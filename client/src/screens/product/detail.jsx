import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetProductById, useProduct } from "../../hooks/product.hook";
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  InputNumber,
  Rate,
  Row,
  Spin,
} from "antd";
import { AppRoutes } from "../../helpers/app-routes";
import { numberWithDots } from "../../ultis/pagination";
import { useCallback, useState } from "react";
import { CartIcon } from "../../assets";
import { useAddToCart } from "../../hooks/cart.hook";
import Cart from "../cart";
import { ModalCustomize } from "../../components/modal-customize/modal-customize";
import { ProductReview } from "./component/review";
const minQuantity = 1;

const ProductDetail = () => {
  const [open, setOpen] = useState(false);

  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const auth = JSON.parse(localStorage.getItem("auth"))?.data?.user;
  const [filter] = useState({
    limit: 100,
    page: 1,
    isActive: true,
  });

  const { hanldeAddToCart } = useAddToCart();

  const { product, isLoading } = useGetProductById(id);
  const { products } = useProduct(filter);
  const listproduct = products?.results?.filter((it) => it.id !== product._id);
  console.log("product :>> ", product);
  const hanldeAddProductToCart = () => {
    if (auth == undefined) {
      setOpen(true);
    } else {
      hanldeAddToCart({ id: id, quantity: quantity });
      setIsOpenDrawer(true);
    }
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
        className="text-2xl p-6 pt-10 italic font-medium"
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

      <div className=" mt-10 hidden-arrow-input product-detail">
        <Row className="space-x-10">
          <Col span={11} className="flex flex-col gap-5 ">
            <div className="p-20px  w-full p-6 bg-white rounded-lg">
              <Row gutter={8}>
                <Col span={24}>
                  <div className="h-full max-h-[550px]">
                    <img
                      src={product.image ?? ""}
                      alt="Ảnh sản phẩm"
                      className="w-full h-full object-fill"
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <div className="flex flex-col gap-5 bg-slate-50 p-6 rounded-lg ">
              <span className="text-base font-semibold left-6">
                Sản phẩm tương tự
              </span>
              <div className="grid grid-cols-3 gap-5">
                {listproduct?.map((it) => (
                  <div
                    key={it.id}
                    className="flex flex-col gap-4 p-4 rounded-lg bg-white overflow-hidden"
                  >
                    <img
                      src={it?.image}
                      alt=""
                      className="hover:scale-110 duration-500 transition-all"
                    />
                    <Link
                      to={AppRoutes.productDetailId(it.id)}
                      className="text-base font-medium h-[70px]"
                    >
                      {it?.name}
                    </Link>
                    <span>
                      <Rate allowHalf disabled value={it?.rating} />
                    </span>
                    <span className="font-medium text-base leading-9 text-red-600">
                      <span className="text-black"> Giá:</span>{" "}
                      {numberWithDots(it?.unitPrice ?? 0) + " đ"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <ProductReview />
            </div>
          </Col>
          <Col span={12} className="flex flex-col gap-5 ">
            <div className="flex flex-col  justify-start  p-5 bg-white rounded-lg">
              <div className="flex flex-col gap-1">
                <h2 className="line-clamp-2 text-xl font-medium text-[#db7550] py-[4px]  leading-[22px]">
                  {product?.name}
                </h2>
                <span className="flex gap-5 mb-10 mt-2">
                  <Rate allowHalf disabled value={product?.rating} />
                  <span className="text-base font-normal translate-y-1">
                    ( {product?.totalReview} lượt đánh giá)
                  </span>
                </span>
                <div className="bg-ghost-white">
                  <h4 className="text-primary font-normal text-base">
                    <span>Giá: </span>
                    <span className="font-medium text-[#db7550]">
                      {" "}
                      {numberWithDots(product?.unitPrice ?? 0) + " đ"}
                    </span>
                  </h4>
                </div>
              </div>
              <div>
                <div className="flex items-center">
                  <label
                    htmlFor="quantity-cart"
                    className="text-grayscale-gray text-base leading-5 pr-[40px]"
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
                  <span className="text-grayscale-gray text-base leading-5 inline pl-[12px]">
                    {numberWithDots(
                      product?.quantity > 0 ? product?.quantity : 0 + " "
                    )}
                    sản phẩm có sẵn
                  </span>
                </div>
                <div className="flex items-center gap-x-4 mt-4">
                  <Button
                    disabled={product.quantity <= 0}
                    className="border border-solid border-primary basis-5/12 w-full"
                  >
                    <div
                      className="flex items-center gap-x-[8px] justify-center"
                      onClick={hanldeAddProductToCart}
                    >
                      <CartIcon />
                      <span className="text-primary text-base font-semibold leading-5">
                        Thêm vào giỏ hàng
                      </span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 bg-white p-6 rounded-lg">
              <span className="text-base font-semibold left-6">
                Thông tin chi tiết
              </span>
              <div>
                <div className="grid grid-cols-2">
                  <span className="opacity-70">Nhà xuất bản</span>
                  <span className="font-normal">{product?.issuingCompany}</span>
                </div>
                <Divider></Divider>
              </div>
              <div>
                <div className="grid grid-cols-2">
                  <span className="opacity-70">Năm xuất bản</span>
                  <span className="font-normal">
                    {product?.publicationDate}
                  </span>
                </div>
                <Divider></Divider>
              </div>
              <div>
                <div className="grid grid-cols-2">
                  <span className="opacity-70">Loại bìa</span>
                  <span className="font-normal">{product?.coverType}</span>
                </div>
                <Divider></Divider>
              </div>
              <div>
                <div className="grid grid-cols-2">
                  <span className="opacity-70">Số trang</span>
                  <span className="font-normal">{product?.numberOfPages}</span>
                </div>
                <Divider></Divider>
              </div>
              <div>
                <div className="grid grid-cols-2">
                  <span className="opacity-70">Kích thước</span>
                  <span className="font-normal">{product?.size} cm</span>
                </div>
                <Divider></Divider>
              </div>
              <div>
                <div className="grid grid-cols-2">
                  <span className="opacity-70">Tác giả</span>
                  <span className="font-normal">{product?.author}</span>
                </div>
                <Divider></Divider>
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg ">
              <h2 className="text-xl font-semibold mb-5">
                Thông tin chi tiết sách
              </h2>
              <div
                className="w-full max-w-[590px] mx-auto font-normal text-base "
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></div>
            </div>
          </Col>
        </Row>
      </div>

      <ModalCustomize
        title="Đăng nhập để tiếp tục"
        footer=""
        onCancel={() => setOpen(false)}
        open={open}
      >
        <div className="flex flex-col items-center justify-center gap-10">
          <img src="../../public/image/logo.png" alt="" className="w-16 h-16" />
          <Button type="default" onClick={() => navigate(AppRoutes.login)}>
            Đến trang đăng nhập
          </Button>
          <div>
            Bạn chưa có tài khoản?
            <Button type="link" onClick={() => navigate(AppRoutes.register)}>
              Đăng kí
            </Button>
          </div>
        </div>
      </ModalCustomize>
      <Cart open={isOpenDrawer} setIsOpenDrawer={setIsOpenDrawer}></Cart>
    </Spin>
  );
};

export default ProductDetail;
