import { Button, Spin } from "antd";
import Lable from "../../components/lable";

import { useState } from "react";
import { useProduct } from "../../hooks/product.hook";
import { numberWithDots } from "../../ultis/pagination";
import { Link } from "react-router-dom";
import { AppRoutes } from "../../helpers/app-routes";

const Product = () => {
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
    isActive: true,
  });
  const { products, isLoading } = useProduct(filter);
  const listproduct = products.results;

  console.log(listproduct);

  return (
    <>
      <Lable title="Sản phẩm của tôi"></Lable>
      {/* <div className="my-10 text-[#A62B00] font-normal text-2xl">
        Công thức nấu ăn phổ biến của tôi
      </div> */}
      <Spin spinning={isLoading}>
        <div className="w-full grid grid-cols-2 gap-10 mt-20">
          {listproduct?.map((it) => (
            <div key={it.id} data-aos="fade-up" data-aos-duration="1500">
              <Link to={AppRoutes.productDetailId(it.id)}>
                <img
                  src={it.image ?? ""}
                  alt=""
                  className="w-full object-cover rounded"
                />
              </Link>
              <div className="p-10 px-28 flex flex-col  gap-5">
                <Link to={AppRoutes.productDetailId(it.id)}>
                  <span className="text-2xl font-normal text-[#A62B00] ">
                    {it?.name}
                  </span>
                </Link>
                <span className="text-lg font-normal">
                  {numberWithDots(it?.unitPrice) + " đ"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Spin>
    </>
  );
};

export default Product;
