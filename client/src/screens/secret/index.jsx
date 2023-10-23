import { Spin, Tabs } from "antd";
import Lable from "../../components/lable";
import PostItem from "../../components/post-item";
import { useBlog } from "../../hooks/blog.hook";
import { useCategoriesIsActive } from "../../hooks/category.hook";
import { useState } from "react";

const Secret = () => {
  const { categories, isLoading } = useCategoriesIsActive();
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
    isActive: true,
    categoryId: "",
  });
  const { blogs, isLoading: loadingBlogs } = useBlog({ ...filter });
  console.log("blogs", blogs);
  const listBlog = blogs.results;

  // console.log("categories", categories);
  const listCate = categories.results;

  const onChange = (key) => {
    setFilter({ ...filter, categoryId: key });
  };
  const items = listCate?.map((it) => ({
    key: it.id,
    label: it.name,
  }));

  return (
    <Spin spinning={isLoading || loadingBlogs}>
      <Lable title=" Tất cả bí quyết"></Lable>
      <div className="mt-20 flex justify-start">
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          indicatorSize={(origin) => origin - 16}
        />
      </div>
      <div className="grid grid-cols-3 gap-5 w-full max-w-[900px]">
        {listBlog?.map((it) => (
          <PostItem key={it.id} it={it} />
        ))}
      </div>
    </Spin>
  );
};

export default Secret;
