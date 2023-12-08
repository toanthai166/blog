import { QuestionCircleOutlined } from "@ant-design/icons";

import { Button, Divider, Form, Input, Modal, Popconfirm, Switch } from "antd";
import { useCallback, useState } from "react";
import {
  useAddress,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "../../../hooks/address.hook";
import { validationMessages } from "../../../helpers/validation-messages";
import ProfileLayout from "./profile-layout";

const MyAddress = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressItem, setAddressItem] = useState();
  const { handleDeleteAddress, mutation } = useDeleteAddress();
  const { handleCreateAddress } = useCreateAddress(setIsModalOpen);
  const { handleUpdateAddress } = useUpdateAddress();

  const [form] = Form.useForm();

  const { addresses } = useAddress(id);
  const handleOpenModalUpdate = useCallback(
    async (address) => {
      setAddressItem(address);
      form.setFieldsValue(address);
      setIsModalOpen(true);
    },
    [form]
  );

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        console.log(values);
        if (addressItem) {
          handleUpdateAddress({ ...values, id: addressItem.id });
        } else {
          handleCreateAddress({ ...values });
        }
      })
      .then(() => {
        setIsModalOpen(false);
      });
  };

  const handleCancelModal = () => {
    setAddressItem(undefined);
    form.resetFields();

    setIsModalOpen(false);
  };
  // const onChange = (value) => {
  //   console.log(`values`, value);
  // };
  const validateField = async (rule, value) => {
    if (value === "" || value === undefined) {
      throw new Error(validationMessages.required);
    }
    if (value == null) {
      throw new Error(validationMessages.required);
    }
  };

  return (
    <ProfileLayout>
      <div className="w-full h-full min-h-[600px]">
        <div className="flex justify-between bg-white rounded-lg p-6">
          <span className="text-xl font-semibold">Địa chỉ của tôi</span>
          <Button type="dashed" onClick={() => setIsModalOpen(true)}>
            Thêm địa chỉ
          </Button>
        </div>
        <Form
          form={form}
          name="control-hooks"
          onFinish={handleOk}
          style={{ maxWidth: 600 }}
        >
          <Modal
            open={isModalOpen}
            title={!addressItem ? "Địa chỉ mới" : "Cập nhật địa chỉ"}
            onOk={handleOk}
            onCancel={handleCancelModal}
            footer={
              <div className="flex justify-end shadow-md p-3 rounded-md">
                <Button onClick={handleCancelModal}>Hủy</Button>
                <Button type="primary" htmlType="submit" onClick={handleOk}>
                  Lưu
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-4 mt-8">
              <div className="space-y-2">
                <h2 className="text-sm font-medium space-x-2">
                  <span className="text-[#D63120]">* </span> Địa chỉ
                </h2>

                <Form.Item
                  name="addressName"
                  label=""
                  rules={[
                    {
                      validator: (rule, value) => validateField(rule, value),
                    },
                  ]}
                >
                  <Input
                    placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
                    maxLength={1000}
                  />
                </Form.Item>
              </div>
              <div className="space-y-2">
                <h2 className="text-sm font-medium space-x-2">
                  <span className="text-[#D63120]">* </span>Chi tiết địa chỉ
                </h2>
                <Form.Item
                  name="addressMoreInfo"
                  label=""
                  rules={[
                    {
                      validator: (rule, value) => validateField(rule, value),
                    },
                  ]}
                >
                  <Input
                    placeholder="VD: Tên tòa nhà, địa điểm gần đó..."
                    maxLength={1000}
                  />
                </Form.Item>
              </div>
              <div className="space-y-2">
                <h2 className="text-sm font-medium space-x-2">
                  <span className="text-[#D63120]">* </span> Tên người liên hệ
                </h2>
                <Form.Item
                  name="fullname"
                  label=""
                  rules={[
                    {
                      validator: (rule, value) =>
                        validateField(rule, value, "fullname"),
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập tên người liên hệ"
                    maxLength={255}
                  ></Input>
                </Form.Item>
              </div>
              <div className="space-y-2">
                <h2 className="text-sm font-medium space-x-2">
                  <span className="text-[#D63120]">* </span>Số điện thoại người
                  liên hệ
                </h2>
                <Form.Item
                  name="phone"
                  label=""
                  rules={[
                    {
                      validator: (rule, value) => validateField(rule, value),
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập số điện thoại"
                    maxLength={10}
                  ></Input>
                </Form.Item>
              </div>
              <div className="flex justify-between mb-5">
                <h2 className="text-sm font-medium">Đặt làm mặc định</h2>
                <Form.Item name="isDefault" valuePropName="checked" label="">
                  <Switch />
                </Form.Item>
              </div>
            </div>
          </Modal>
        </Form>
        <div className="mt-5 flex flex-col gap-5 w-full">
          {addresses[0]?.addresses?.map((address) => (
            <div key={address?.id} className="bg-white p-5 rounded-md">
              <div className=" w-full flex items-center justify-between">
                <div className="flex gap-4 flex-col">
                  <div className="flex gap-1 items-center">
                    <h2 className="text-xl font-medium">{address?.fullname}</h2>
                    <Divider className="translate-y-1" type="vertical" />
                    <span className=" opacity-80 text-lg">
                      {address?.phone}
                    </span>
                  </div>
                  <div className="space-y-3 text-grayscale-gray">
                    <div className="flex flex-col ">
                      <span className="text-base font-normal">
                        {address?.addressMoreInfo}
                      </span>
                      <span className="text-base font-normal">
                        {" "}
                        {address?.addressName}
                      </span>
                    </div>
                    {address?.isDefault === true ? (
                      <Button className="h-5">
                        <span className="px-1 py-1 -translate-y-2.5 font-normal">
                          Mặc định
                        </span>
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 justify-end">
                    <Button
                      type="ghost"
                      className="text-white bg-[#1890ff]"
                      onClick={() => handleOpenModalUpdate(address)}
                    >
                      Sửa
                    </Button>
                    <Divider className="translate-y-4" type="vertical" />
                    <Popconfirm
                      onConfirm={() =>
                        handleDeleteAddress({ addressId: address?.id })
                      }
                      title="Xóa địa chỉ"
                      description="Bạn có chắc chắn xóa địa chỉ này?"
                      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                    >
                      <Button
                        type="ghost"
                        className="text-white bg-[#f5222d]"
                        disabled={mutation.isLoading}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </div>
                  <Button className="h-5" disabled={address?.isDefault}>
                    <span className="px-1 py-1 -translate-y-2.5 font-normal">
                      Thiết lập mặc định
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProfileLayout>
  );
};

export default MyAddress;
