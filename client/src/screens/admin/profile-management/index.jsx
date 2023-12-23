import { Button, Col, Form, Input, Row, Upload, message } from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import { AppRoutes } from "../../../helpers/app-routes";
import { useEffect, useState } from "react";
import useUploadImage from "../../../components/upload";
import { useNavigate } from "react-router-dom";
import { useGetUserById, useUpdateUser } from "../../../hooks/user.hook";
import { focusManager } from "react-query";
import { getUserById } from "../../../api/user.api";
import { useAuth } from "../../../hooks/auth.hook";

const ProfileManagement = () => {
  const [image, setImage] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const userLocal = JSON.parse(localStorage.getItem("auth"))?.data?.user;
  const { user } = useGetUserById(userLocal?.id);
  const { auth } = useAuth();

  useEffect(() => {
    form.setFieldValue({
      name: auth?.data?.user.name,
      description: auth?.data?.user.description,
      email: auth?.data?.user.email,
    });
  }, [auth?.data?.user, form]);

  const { handleUpdateProfile, mutation } = useUpdateUser({});
  const { handleUploadFile, image: imageUpload } = useUploadImage();
  const handleSetImage = ({ file }) => {
    setImage(file);
    handleUploadFile(file);
  };
  const props = {
    listType: "picture",
    onChange: handleSetImage,
    onRemove: () => {
      return Promise.resolve(false);
    },
    beforeUpload: (file) => {
      const maxSizeInMB = 10;
      const isAllowedSize = file.size / 1024 / 1024 < maxSizeInMB;
      if (!isAllowedSize) {
        message.error(`Dung lượng ảnh tối đa là ${maxSizeInMB} MB`);
        return false;
      }
      return false;
    },
  };

  const onFinish = () => {
    form.validateFields().then(() => {
      const value = form.getFieldsValue();
      handleUpdateProfile({ id: user.id, image: imageUpload, ...value });
      setIsEdit(false);
    });
  };
  return (
    <>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Hồ sơ", to: AppRoutes.blog },
        ]}
        rightContent={<Button onClick={() => setIsEdit(true)}>Sửa</Button>}
      />
      <div className="bg-white mx-5 mt-5 py-5 px-10">
        <div className="form-news">
          <Form
            form={form}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            labelAlign="left"
            size="small"
            disabled={!isEdit}
            id="form-news"
            name="form-news"
            initialValues={
              auth?.data?.user
                ? {
                    name: auth?.data?.user.name,
                    description: auth?.data?.user.description,
                    email: auth?.data?.user.email,
                  }
                : ""
            }
            onFinish={onFinish}
          >
            <Form.Item label={<span>Ảnh đại diện:</span>}>
              <Upload
                listType="picture"
                accept="image/png, image/gif, image/jpeg"
                {...props}
              >
                <Button type="link">Thay đổi</Button>
              </Upload>
            </Form.Item>
            <img
              className="ml-[20%] rounded-lg my-10"
              src={image ? URL.createObjectURL(image) : user?.image}
              alt=""
            />
            <Form.Item
              label={
                <span>
                  Họ và tên<span className="text-red"> *</span>
                </span>
              }
              name="name"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              normalize={(e) => e.trimStart()}
            >
              <Input placeholder="Nhập họ và tên" maxLength={255}></Input>
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Email<span className="text-red"> *</span>
                </span>
              }
              name="email"
              normalize={(e) => e.trimStart()}
            >
              <Input disabled placeholder="Nhập email" maxLength={255}></Input>
            </Form.Item>
            <Form.Item
              label={<span>Giới thiệu ngắn</span>}
              name="description"
              normalize={(e) => e.trimStart()}
            >
              <Input placeholder="Nhập giới thiệu" maxLength={255}></Input>
            </Form.Item>
            <Row>
              <Col span={20} className="flex justify-end space-x-4">
                <Button
                  className="w-20"
                  type="default"
                  onClick={() => setIsEdit(false)}
                >
                  Huỷ
                </Button>
                <Button
                  className="w-20"
                  type="dashed"
                  htmlType="submit"
                  loading={mutation.isLoading}
                  disabled={mutation.isLoading || !isEdit}
                >
                  Lưu
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ProfileManagement;
