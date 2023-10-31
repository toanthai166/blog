import { Collapse, Spin } from "antd";
import { useFAQ } from "../../hooks/faq.hook";
import Lable from "../../components/lable";
import { useState } from "react";

const Faq = () => {
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
    isActive: true,
  });
  const { faqs, isLoading } = useFAQ(filter);
  const onChange = (key) => {
    console.log(key);
  };

  const items = faqs?.results?.map((it, index) => ({
    key: index,
    label: <span className="text-[#A62B00]">{it.title}</span>,
    children: <div>{it.description}</div>,
  }));

  return (
    <>
      <Lable title=" FAQ's"></Lable>
      <div className="my-[80px]">Những câu hỏi thường gặp</div>
      <div className="w-full max-w-[1200px] faq">
        <Spin spinning={isLoading}>
          <Collapse
            defaultActiveKey={["1"]}
            expandIconPosition="end"
            onChange={onChange}
            items={items}
          />
        </Spin>
      </div>
    </>
  );
};

export default Faq;
