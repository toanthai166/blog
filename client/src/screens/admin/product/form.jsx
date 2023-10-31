import { Button, Col, Form, Input, InputNumber, Row } from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import { AppRoutes } from "../../../helpers/app-routes";
import { useNavigate, useParams } from "react-router-dom";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { debounce } from "debounce";
import { useEffect, useState } from "react";

import {
  useCreateProduct,
  useGetProductById,
  useUpdateProduct,
} from "../../../hooks/product.hook";

const FormProduct = ({ isDetail, isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [dataEditor, setDataEditor] = useState("");
  const { product } = useGetProductById(id);
  const { handleUpdateProduct } = useUpdateProduct();
  const { handleCreateProduct } = useCreateProduct();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        unitPrice: product.unitPrice,
        image: product.image,
        quantity: product.quantity,
        author: product.author,
      });
    }
  }, [form, product]);

  const onFinish = (values) => {
    console.log(values);
    if (isEdit) {
      handleUpdateProduct({
        id: id,
        image: values.image,
        name: values.name,
        quantity: Number(values.quantity),
        description: dataEditor ? dataEditor : product.description,
      });
    } else {
      handleCreateProduct({
        image: values.image,
        name: values.name,
        description: dataEditor,
        quantity: Number(values.quantity),
        unitPrice: Number(values.unitPrice),
        author: values.author,
      });
    }
  };

  const handleChangeCkeditor = debounce((event, editor) => {
    const data = editor.getData();
    setDataEditor(data);
  }, 800);

  return (
    <>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Sản phẩm", to: AppRoutes.productManagement },
          {
            title: isDetail
              ? "Thông tin chi tiết sản phẩm"
              : !isDetail && isEdit
              ? "Chỉnh sửa sản phẩm"
              : "Thêm mới sản phẩm",
            to: null,
          },
        ]}
      />
      <div className="bg-white mx-5 mt-5 py-5 px-10">
        <div className="form-news">
          <Form
            form={form}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            labelAlign="left"
            disabled={isDetail}
            size="small"
            id="form-news"
            name="form-news"
            onFinish={onFinish}
          >
            <Form.Item
              label={
                <span>
                  Đường dẫn ảnh:<span className="text-red"> *</span>
                </span>
              }
              name="image"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              normalize={(e) => e.trimStart()}
            >
              <Input placeholder="Nhập đường dẫn" maxLength={255}></Input>
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Tên sản phẩm<span className="text-red"> *</span>
                </span>
              }
              name="name"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              normalize={(e) => e.trimStart()}
            >
              <Input placeholder="Nhập tên sản phẩm" maxLength={255}></Input>
            </Form.Item>
            <Form.Item label={<span>Số lượng</span>} name="quantity">
              <InputNumber placeholder="Nhập số lượng sản phẩm" />
            </Form.Item>
            <Form.Item label={<span>Giá sản phẩm</span>} name="unitPrice">
              <InputNumber placeholder="Nhập giá sản phẩm" />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Nhà xuất bản<span className="text-red"> *</span>
                </span>
              }
              name="author"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              normalize={(e) => e.trimStart()}
            >
              <Input placeholder="Nhập tên nhà xuất bản" maxLength={255} />
            </Form.Item>

            <Form.Item label={<span>Mô tả sản phẩm</span>}>
              <CKEditor
                disabled={isDetail}
                editor={ClassicEditor}
                data={isDetail || isEdit ? product?.description : ""}
                onChange={(event, editor) =>
                  handleChangeCkeditor(event, editor)
                }
              />
            </Form.Item>
            {!isDetail && (
              <Row>
                <Col span={20} className="flex justify-end space-x-4">
                  <Button
                    className="w-20"
                    type="default"
                    onClick={() => navigate(-1)}
                  >
                    Huỷ
                  </Button>
                  <Button
                    className="w-20"
                    type="dashed"
                    htmlType="submit"
                    // loading={loadingCreateNews}
                    // disabled={loadingCreateNews}
                  >
                    Lưu
                  </Button>
                </Col>
              </Row>
            )}
          </Form>
        </div>
      </div>
    </>
  );
};

export default FormProduct;
