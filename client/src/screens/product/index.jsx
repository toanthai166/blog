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
      <div className="bg-slate-100 pt-10">
        <Lable title="Sản phẩm của tôi"></Lable>
      </div>
      <Spin spinning={isLoading}>
        <div className="w-full grid grid-cols-3 gap-10 mt-20">
          {listproduct?.map((it) => (
            <div
              key={it.id}
              data-aos="fade-up"
              data-aos-duration="1500"
              className="bg-white rounded-lg p-6"
            >
              <Link to={AppRoutes.productDetailId(it.id)}>
                <img
                  src={it.image ?? ""}
                  alt=""
                  className="w-full object-cover rounded"
                />
              </Link>
              <div className="px-12 pt-4 flex flex-col justify-between  gap-5">
                <Link to={AppRoutes.productDetailId(it.id)}>
                  <span className="text-xl font-medium text-black opacity-90 hover:text-red-700 transition-all  line-clamp-2">
                    {it?.name}
                  </span>
                </Link>
                <span className="text-lg font-normal text-center text-[#A62B00]">
                  Giá: {numberWithDots(it?.unitPrice) + " đ"}
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
