import { Tabs } from "antd";
import Lable from "../../components/lable";
import Layouts from "../../layouts/main-layout";
import PostItem from "../../components/post-item";
import { useBlog } from "../../hooks/blog.hook";
import { useCategoriesIsActive } from "../../hooks/category.hook";

const Secret = () => {
  const { categories } = useCategoriesIsActive();
  const { blogs } = useBlog();
  console.log("blogs", blogs);

  console.log("categories", categories);

  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Tab 1",
    },
    {
      key: "2",
      label: "Tab 2",
    },
    {
      key: "3",
      label: "Tab 3",
    },
  ];
  return (
    <Layouts>
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
        <PostItem />
        <PostItem />
        <PostItem /> <PostItem />
        <PostItem />
        <PostItem /> <PostItem />
        <PostItem />
        <PostItem />
      </div>
    </Layouts>
  );
};

export default Secret;
