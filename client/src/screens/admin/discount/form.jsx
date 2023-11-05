import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Table,
} from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import { AppRoutes } from "../../../helpers/app-routes";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { DefaultPagination } from "../../../ultis/pagination";

import dayjs from "dayjs";
import {
  useCreateDiscount,
  useGetDiscountById,
} from "../../../hooks/discount.hook";
import { ModalSelectProduct } from "./modal-select-product";

const disabledDate = (current) => {
  return current && current <= dayjs();
};

const FormDiscount = ({ isDetail, isEdit }) => {
  const [form] = Form.useForm();

  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const unit = Form.useWatch("unit", form);
  const startDate = Form.useWatch("startDate", form);

  const productIds = Form.useWatch("productIds", form);

  const navigate = useNavigate();
  const { discount } = useGetDiscountById(id);

  const { handleCreateDiscount } = useCreateDiscount();

  // useEffect(() => {
  //   if (faq) {
  //     form.setFieldsValue({ title: faq.title });
  //   }
  // }, [faq, form]);

  const handleFinishSelectProducts = useCallback(
    (newProductIds, newProducts) => {
      form.setFieldValue("productIds", newProductIds);
      setProducts(newProducts);
      setOpen(false);
    },
    [form]
  );

  const onFinish = async (values) => {
    if (isEdit) {
      console.log(1);
    } else {
      const startDate = JSON.stringify(values.startDate).replace(/"/g, "");
      const endDate = JSON.stringify(values.endDate).replace(/"/g, "");
      handleCreateDiscount({
        ...values,
        startDate: startDate,
        endDate: endDate,
      });
    }
  };
  const handleRemoveProduct = useCallback(
    (id) => {
      const newProductIds = productIds.filter((item) => item !== id);
      form.setFieldsValue({ productIds: newProductIds });
      setProducts(products.filter((p) => p.id !== id));
    },
    [form, productIds, products]
  );

  useEffect(() => {
    setEditing(isEdit);
  }, [isEdit]);

  return (
    <>
      <SubHeader
        items={[
          {
            title: "Trang chủ",
            to: AppRoutes.home,
          },
          {
            title: "Khuyến mãi",
            to: AppRoutes.discountManagement,
          },
          {
            title:
              !isDetail && !isEdit ? "Thêm mới khuyến mãi" : discount?.name,
          },
        ]}
      />
      <Form
        form={form}
        name="form-promotion"
        id="form-promotion"
        layout="vertical"
        className="max-w-[868px] bg-white mx-auto mt-20px p-20px mb-[80px]"
        initialValues={{
          unit: "PERCENTAGE",
          startDate: dayjs(),
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label={
            <span>
              Tên chương trình{" "}
              <span className="text-grayscale-light font-light"></span>
            </span>
          }
          name="name"
          normalize={(e) => e.trimStart()}
          rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
        >
          <Input maxLength={255} placeholder="Nhập tên chương trình" />
        </Form.Item>
        <Form.Item
          name="productIds"
          label={
            <span>
              <span className="text-error">* </span> Sản phẩm áp dụng
            </span>
          }
        >
          {productIds && productIds.length > 0 ? (
            <Table
              dataSource={products}
              pagination={{
                ...DefaultPagination,
              }}
              bordered={true}
              columns={[
                {
                  title: "Mã sản phẩm",
                  dataIndex: "id",
                  key: "id",
                },
                {
                  title: "Tên sản phẩm",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Tùy chọn",
                  dataIndex: "id",
                  key: "action",
                  render(id) {
                    return (
                      <span
                        className="text-error hover:cursor-pointer"
                        onClick={() => handleRemoveProduct(id)}
                      >
                        Bỏ chọn
                      </span>
                    );
                  },
                },
              ]}
            />
          ) : (
            <span>Áp dụng cho tất cả sản phẩm</span>
          )}
        </Form.Item>
        <div className="w-full flex justify-end">
          <Button type="primary" onClick={() => setOpen(true)}>
            Chọn sản phẩm
          </Button>
        </div>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
            >
              <DatePicker
                className="w-full"
                format={"DD/MM/YYYY"}
                disabledDate={disabledDate}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={"Ngày kết thúc"}
              name="endDate"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
            >
              <DatePicker
                className="w-full"
                format={"DD/MM/YYYY"}
                disabledDate={(current) =>
                  current && current <= dayjs(startDate)
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item name="unit" label="Giá trị giảm">
              <Select
                className="w-full"
                options={[
                  {
                    label: "%",
                    value: "PERCENTAGE",
                  },
                  {
                    label: "vnđ",
                    value: "VND",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Mức giảm"
              name="value"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
            >
              <InputNumber
                className="w-full"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                suffix={unit === "PERCENTAGE" ? "%" : "đ"}
                max={unit === "PERCENTAGE" ? 100 : undefined}
                min={1}
                placeholder="Nhập Mức giảm"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item
              label={"Giới hạn tổng số lượt sử dụng"}
              name="limit"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
            >
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\$\s?|([.]*)/g, "")}
                min={1}
                className="w-full"
                placeholder={`Nhập giới hạn tổng số lượt sử dụng.`}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={"Giới hạn số lượt sử dụng tài khoản"}
              name="limitPerAccount"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
            >
              <InputNumber
                min={1}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\$\s?|([.]*)/g, "")}
                className="w-full"
                placeholder={`Nhập giới hạn số lượt sử dụng tài khoản.`}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Giá trị đơn hàng tối thiểu"
              name="minOrderValue"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
            >
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\$\s?|([.]*)/g, "")}
                className="w-full"
                placeholder={`Nhập giá trị đơn hàng tối thiểu.`}
                min={1}
                suffix="đ"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {(editing || (!isDetail && !isEdit)) && (
        <div className="flex justify-end items-center fixed left-0 right-0 bottom-0 pr-[24px] py-8px bg-white">
          <Button
            className="mr-16px"
            type="default"
            onClick={() => {
              if (isEdit || isDetail) {
                setEditing(false);
                return;
              }
              navigate(-1);
            }}
          >
            Huỷ
          </Button>
          <Button type="primary" htmlType="submit" form="form-promotion">
            Lưu
          </Button>
        </div>
      )}
      {open && (
        <ModalSelectProduct
          open={open}
          setOpen={setOpen}
          onFinish={handleFinishSelectProducts}
          productIds={productIds}
          products={products}
        />
      )}
    </>
  );
};

export default FormDiscount;
