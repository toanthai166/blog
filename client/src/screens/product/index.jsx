import { Button, Spin, Tabs } from "antd";
import Lable from "../../components/lable";
import PostItem from "../../components/post-item";
import { useBlog } from "../../hooks/blog.hook";
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
  // const { blogs, isLoading: loadingBlogs } = useBlog({ ...filter });
  // const listBlog = blogs.results;
  const listproduct = products.results;

  console.log(listproduct);

  const onChange = (key) => {
    setFilter({ ...filter, categoryId: key });
  };

  return (
    <>
      <Lable title="Sản phẩm"></Lable>
      <div className="my-10 text-[#A62B00] font-normal text-2xl">
        Công thức nấu ăn phổ biến của tôi
      </div>
      <div className="w-full grid grid-cols-2 gap-10 max-w-[900px]">
        {listproduct?.map((it) => (
          <div key={it.id}>
            <Link to={AppRoutes.productDetailId(it.id)}>
              <img
                src={it.image ?? ""}
                alt=""
                className="w-full object-cover rounded"
              />
            </Link>
            <div className="p-5 flex flex-col gap-5">
              <Link to={AppRoutes.productDetailId(it.id)}>
                <span className="text-2xl font-normal text-[#A62B00] ">
                  {it?.name}
                </span>
              </Link>
              <span>{numberWithDots(it?.unitPrice) + " đ"}</span>
            </div>
            <div className="flex gap-10">
              <Button type="dashed" block>
                Thêm vào giở hàng
              </Button>
              <Button type="dashed" block>
                Mua ngay
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Product;
