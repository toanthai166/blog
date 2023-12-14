import { useEffect } from "react";
import { ModalCustomize } from "../../../components/modal-customize";

import { Form, Input, Rate } from "antd";

export const ReviewOrder = ({ setOpen, onFinish, products, ...props }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue(
      "products",
      products?.map((it) => ({ productId: it?.productId }))
    );
  }, [form, products]);

  return (
    <ModalCustomize
      title="Đánh giá"
      {...props}
      okText="Gửi đánh giá"
      onCancel={() => setOpen(false)}
      okButtonProps={{
        form: "review-customer",
        htmlType: "submit",
      }}
    >
      <>
        <Form
          form={form}
          size="small"
          id="review-customer"
          className="h-[438px] overflow-x-auto"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.List name="products">
            {(fields) => (
              <div>
                {fields.map(({ key, name, ...restField }) => {
                  const it = products?.[key];
                  console.log(it);
                  if (!it) return null;
                  return (
                    <div key={key}>
                      <div className="flex border border-solid border-[#eee] p-[8px] mb-3">
                        <div className="w-[48px] h-[48px]">
                          <img
                            className="w-[48px] h-[48px] rounded"
                            src={it?.product?.image}
                          />
                        </div>
                        <span className="pl-3 text-base font-medium leading-5 line-clamp-1">
                          {it?.product?.name}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold">
                        Chất lượng sản phẩm
                      </h2>
                      <Form.Item
                        {...restField}
                        className="mt-3 hidden"
                        name={[name, "productId"]}
                      >
                        <Input placeholder="ok" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        className="mt-3"
                        name={[name, "rating"]}
                        rules={[
                          {
                            validator(rule, value) {
                              if (!value)
                                return Promise.reject(
                                  new Error("Vui lòng đánh giá độ thân thiện.")
                                );
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Rate />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        className="my-3 pb-5"
                        name={[name, "comment"]}
                        rules={[
                          {
                            required: true,
                            message: "Đây là trường bắt buộc",
                          },
                        ]}
                        normalize={(e) => e.trimStart()}
                      >
                        <Input.TextArea
                          placeholder="Nhập đánh giá về Chất lượng sản phẩm"
                          maxLength={1000}
                          showCount
                        />
                      </Form.Item>
                    </div>
                  );
                })}
              </div>
            )}
          </Form.List>
        </Form>
      </>
    </ModalCustomize>
  );
};
