import { Avatar, Button, Col, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import {
  useGetContactById,
  useUpdateContact,
} from "../../../hooks/contact.hook";
import { UserOutlined } from "@ant-design/icons";

import { useParams } from "react-router-dom";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import { AppRoutes } from "../../../helpers/app-routes";
import { FORMAT_TIME } from "../order";

export const ServiceFeedbacksStatusEnum = {
  done: "done",
  waiting: "waiting",
};
const convertServiceFeedbackStatus = (status) => {
  switch (status) {
    case ServiceFeedbacksStatusEnum.waiting:
      return "Chờ xử lý";
    case ServiceFeedbacksStatusEnum.done:
      return "Đã xử lý";
    default:
      break;
  }
};

const ContactDetail = () => {
  const [form] = Form.useForm();
  const { id = "" } = useParams();
  const { contact } = useGetContactById(id);
  const { handleUpdateContact, mutation } = useUpdateContact();
  const onCompleted = () => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue();
      handleUpdateContact({ id: id, ...values });
    });
  };
  return (
    <div>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Bài viết", to: AppRoutes.contactManagement },
          {
            title: "Thông tin chi tiết liên hệ",
            to: null,
          },
        ]}
      />
      <div className="mt-10 mx-5 border border-solid border-grayscale-light bg-white">
        <Row>
          <Col span={4}>
            <div className="text-center p-4">
              <Avatar
                style={{ backgroundColor: "#b4755e" }}
                icon={<UserOutlined />}
              />
              <p className="mt-4 text-lg font-medium">{contact?.fullname}</p>
              <p className="mt-2 text-base">{contact?.email}</p>
            </div>
          </Col>
          <Col
            span={20}
            className={`border-l border-t-0 border-b-0 border-r-0 border-solid border-grayscale-light`}
          >
            <div className="">
              <div className="border-b border-t-0 border-l-0 border-r-0 border-solid border-grayscale-light">
                <p className="py-3 pl-4 text-grayscale-gray text-base">
                  Thời gian phản ánh:{" "}
                  {dayjs(contact.createdAt).format(FORMAT_TIME)}
                </p>
              </div>
              <div className="min-h-full pl-4">
                <p className="pt-3 pb-2 text-grayscale-gray text-base ">
                  Nội dung phản ánh:
                </p>
                <p className="font-semibold">{contact.content}</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {contact.status !== "done" ? (
        <div className="bg-white mt-5 p-5 mx-5">
          <Form
            size="small"
            className="w-full"
            form={form}
            name="form-reply-feedback"
            id="form-reply-feedback"
            onFinish={onCompleted}
            labelAlign="left"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Form.Item
              name={"answer"}
              label={
                <span>
                  Nội dung <span className="text-error">*</span>
                </span>
              }
              normalize={(e) => e.trimStart()}
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
            >
              <Input.TextArea
                rows={4}
                showCount
                maxLength={1000}
                className="w-full"
                placeholder="Nhập nội dung"
              />
            </Form.Item>
            <Form.Item
              name={"status"}
              label={
                <span>
                  Trạng thái<span className="text-error">*</span>
                </span>
              }
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
            >
              <Select
                className="w-full"
                options={(Object.values(ServiceFeedbacksStatusEnum) ?? []).map(
                  (it) => ({
                    label: convertServiceFeedbackStatus(it),
                    value: it,
                    disabled: it === ServiceFeedbacksStatusEnum?.waiting,
                  })
                )}
                placeholder="Chọn trạng thái xử lý"
              />
            </Form.Item>
          </Form>
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              size="middle"
              form="form-reply-feedback"
              disabled={mutation.isLoading}
              loading={mutation.isLoading}
            >
              Gửi
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 border border-solid border-grayscale-light bg-white mx-5">
          <Col
            span={24}
            className={`border-l border-t-0 border-b-0 border-r-0 border-solid border-grayscale-light`}
          >
            <div className="">
              <div className="border-b border-t-0 border-l-0 border-r-0 border-solid border-grayscale-light">
                <p className="py-3 pl-4 text-grayscale-gray text-base">
                  Thời gian phản hồi:{" "}
                  {dayjs(contact.updateAt).format(FORMAT_TIME)}
                </p>
              </div>
              <div className="min-h-full pl-4">
                <p className="pt-3 pb-2 text-grayscale-gray text-base ">
                  Nội dung phản hồi:
                </p>
                <p className="font-semibold">{contact.answer}</p>
              </div>
            </div>
          </Col>
        </div>
      )}
    </div>
  );
};

export default ContactDetail;
