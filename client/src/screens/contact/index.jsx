import { Button, Col, Form, Input, Row } from "antd";
import Lable from "../../components/lable";
import TextArea from "antd/es/input/TextArea";
import { useCreateContact } from "../../hooks/contact.hook";
import { Link } from "react-router-dom";
import { REGEX_EMAIL, REGEX_PHONE } from "../../helpers/regex.js";

const Contact = () => {
  const [form] = Form.useForm();
  const { handleCreateContact, mutation } = useCreateContact();
  const onFinish = () => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      handleCreateContact({ ...values });
    });
  };
  return (
    <>
      <div className="bg-slate-100 pt-10">
        <Lable title="Liên hệ" />
      </div>
      <div className="flex items-center justify-center gap-28 mt-10">
        <div className="bg-[#219653] w-[62px] h-[62px] rounded-full flex flex-col gap-5">
          <img
            src="../public/image/phone.png"
            alt=""
            className="mx-auto my-4"
          />
          <span className="text-lg font-medium ">Hotline</span>
          <Link to={"tel:0382203388"} className="">
            0382203388
          </Link>
        </div>
        <div className="w-[62px] h-[62px] rounded-full flex flex-col gap-5">
          <img src="../public/image/mess.png" alt="" />
          <span className="text-lg font-medium ">Message</span>
          <Link
            target="_blank"
            to={"https://www.facebook.com/toanthai1606"}
            className=""
          >
            fb.toanthai1606
          </Link>
        </div>{" "}
      </div>
      <div className="mt-32 pb-40 w-full">
        <Form form={form} onFinish={onFinish}>
          <Row className="space-y-5">
            <Col span={20} className="mx-auto">
              <h3 className="font-semibold text-2xl left-6">
                Thông tin liên hệ
              </h3>
              <div className="mt-10 mb-1 font-medium text-lg">
                Họ và tên <span className="text-red-700">*</span>
              </div>
              <Form.Item
                name="fullname"
                className="w-full"
                rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={20} className="flex gap-10 mx-auto">
              <div className="w-full">
                <div className=" mb-1 font-medium text-lg">
                  Email <span className="text-red-700">*</span>
                </div>
                <Form.Item
                  name="email"
                  className="w-full"
                  rules={[
                    { required: true, message: "Đây là trường bắt buộc" },
                    {
                      validator(_, value) {
                        if (!value) return Promise.resolve();

                        const validation = REGEX_EMAIL.test(value);
                        return validation
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Email chưa đúng định dạng")
                            );
                      },
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </div>
              <div className="w-full">
                <div className="mb-1 font-medium text-lg">
                  Số điện thoại <span className="text-red-700">*</span>
                </div>
                <Form.Item
                  name="phone"
                  className="w-full"
                  rules={[
                    { required: true, message: "Đây là trường bắt buộc" },
                    {
                      validator(_, value) {
                        if (!value) return Promise.resolve();

                        const validation = REGEX_PHONE.test(value);
                        return validation
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Số điện thoại chưa đúng định dạng")
                            );
                      },
                    },
                  ]}
                >
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
              </div>
            </Col>
            <Col span={20} className="mx-auto">
              <div className="mb-1 font-medium text-lg">
                Nội dung liên hệ <span className="text-red-700">*</span>
              </div>
              <Form.Item
                name="content"
                className="w-full"
                rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              >
                <TextArea
                  maxLength={1000}
                  showCount
                  rows={4}
                  placeholder="Nội dung"
                />
              </Form.Item>
              <Button
                loading={mutation.isLoading}
                disabled={mutation.isLoading}
                type="primary"
                htmlType="submit"
                className="mt-10"
              >
                <span className="font-medium text-lg">Gửi yêu cầu</span>
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default Contact;
