import { Link, useLocation } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";

import {
  Breadcrumb,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Switch,
} from "antd";
import { AppRoutes } from "../../helpers/app-routes";
import { useCallback, useState } from "react";
import {
  useAddress,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "../../hooks/address.hook";
import { validationMessages } from "../../helpers/validation-messages";

const MyAddress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state } = useLocation();
  const [addressItem, setAddressItem] = useState();
  const { handleDeleteAddress, mutation } = useDeleteAddress();
  const { handleCreateAddress } = useCreateAddress(setIsModalOpen);
  const { handleUpdateAddress } = useUpdateAddress();

  const [form] = Form.useForm();

  const { addresses } = useAddress(state?.userId);
  const handleOpenModalUpdate = useCallback(
    async (address) => {
      setAddressItem(address);
      form.setFieldsValue(address);
      setIsModalOpen(true);
    },
    [form]
  );

  // const { city } = useSearchAddress();
  // console.log(city);
  // const cityOptions = city?.data?.map((it) => ({
  //   label: it.name,
  //   value: it.id,
  // }));
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
    <div className="w-full">
      <div className="flex justify-between">
        <Breadcrumb
          className="text-2xl  "
          items={[
            {
              title: <Link to={AppRoutes.home}>Trang chủ</Link>,
            },
            {
              title: <Link to={AppRoutes.myAddress}>Địa chỉ của tôi</Link>,
            },
          ]}
        />
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
              {/* <Row>
                <Col span={8}>
                  <Form.Item
                    name="addressName"
                    label=""
                    // rules={[
                    //   {
                    //     validator: (rule, value) =>
                    //       validateField(rule, value, "addressName"),
                    //   },
                    // ]}
                  >
                    <Select
                      onChange={onChange}
                      placeholder="Chọn thành phố"
                      options={cityOptions}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>fd</Col>
                <Col span={8}>fđ</Col>
              </Row> */}
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
                <Input placeholder="Nhập số điện thoại" maxLength={10}></Input>
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
        {/* <ModalCustomize
          open={isModalOpen}
          title={!addressItem ? "Địa chỉ mới" : "Cập nhật địa chỉ"}
          onCancel={handleCancelModal}
          onOk={handleOk}
          footer={
            <div className="flex justify-end shadow-md p-3 rounded-md">
              <Button onClick={handleCancelModal}>Hủy</Button>
              <Button type="primary" htmlType="submit" onClick={handleOk}>
                Lưu
              </Button>
            </div>
          }
        >
          <BodyModalAddress
            setAddressMapInfo={setAddressMapInfo}
            addressItem={addressItem}
          ></BodyModalAddress>
        </ModalCustomize> */}
      </Form>

      <div className="mt-5 flex flex-col gap-5 w-full">
        {addresses?.map((address) => (
          <div key={address?.id} className="bg-white p-5 ">
            <div className=" w-full flex items-center justify-between">
              <div className="flex gap-4 flex-col">
                <div className="flex gap-1">
                  <h2>{address?.fullname}</h2>
                  <Divider className="translate-y-1" type="vertical" />
                  <span className="text-grayscale-gray">{address?.phone}</span>
                </div>
                <div className="space-y-3 text-grayscale-gray">
                  <div className="flex flex-col">
                    <span>{address?.addressMoreInfo}</span>
                    <span> {address?.addressName}</span>
                  </div>
                  {address?.isDefault === true ? (
                    <Button className="h-5">
                      <span className="px-1 py-1 -translate-y-4 font-normal">
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
                    className="text-[#03A1FA]"
                    onClick={() => handleOpenModalUpdate(address)}
                  >
                    Sửa
                  </Button>
                  <Divider className="translate-y-4" type="vertical" />
                  <Popconfirm
                    onConfirm={() => handleDeleteAddress(address?.id)}
                    title="Xóa địa chỉ"
                    description="Bạn có chắc chắn xóa địa chỉ này?"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  >
                    <Button
                      type="ghost"
                      className="text-error"
                      disabled={mutation.isLoading}
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                </div>
                <Button className="h-5" disabled={address?.isDefault}>
                  <span className="px-1 py-1 -translate-y-4 font-normal">
                    {" "}
                    Thiết lập mặc định
                  </span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAddress;
