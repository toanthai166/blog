import { Collapse, Spin } from "antd";
import { useFAQ } from "../../hooks/faq.hook";
import Lable from "../../components/lable";

const Faq = () => {
  const { Faqs, isLoading } = useFAQ();
  console.log(isLoading);
  const onChange = (key) => {
    console.log(key);
  };

  const items = Faqs.map((it, index) => ({
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
