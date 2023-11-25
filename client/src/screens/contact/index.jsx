import { Button, Col, Form, Input, Row } from "antd";
import Lable from "../../components/lable";
import TextArea from "antd/es/input/TextArea";
import { useCreateContact } from "../../hooks/contact.hook";

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
      <Lable title="Liên hệ"></Lable>
      <div className="mt-20 pb-40 w-full">
        <Form form={form} onFinish={onFinish}>
          <Row>
            <Col span={20} className="mx-auto">
              <h3>Thông tin liên hệ</h3>
              <Form.Item
                name="fullname"
                className="w-full mt-10"
                rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={20} className="flex gap-10 mx-auto">
              <Form.Item
                name="email"
                className="w-full mt-10"
                rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="phone"
                className="w-full mt-10"
                rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={20} className="mx-auto">
              <Form.Item
                name="content"
                className="w-full mt-10"
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
                type="dashed"
                htmlType="submit"
              >
                Gửi liên hệ
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default Contact;
