import { Button, Col, Form, Input, Row } from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import { AppRoutes } from "../../../helpers/app-routes";
import AdminDashboard from "../dashboard";
import { useNavigate, useParams } from "react-router-dom";

import { useEffect } from "react";
import {
  useCreateCategory,
  useGetCategoryById,
  useUpdateCate,
} from "../../../hooks/category.hook";

const FormCategory = ({ isDetail, isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { cate } = useGetCategoryById(id);
  const { handleCreateCategory, mutation } = useCreateCategory();
  const { handleUpdateCate, mutation: mutationUpdate } = useUpdateCate();

  useEffect(() => {
    if (cate) {
      form.setFieldsValue({ name: cate.name });
    }
  }, [cate, form]);

  const onFinish = async (values) => {
    if (isEdit) {
      await handleUpdateCate({
        id: id,
        name: values.name,
      });
    } else {
      await handleCreateCategory({
        name: values.name,
      });
    }
  };

  return (
    <AdminDashboard>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Danh mục", to: AppRoutes.category },
          {
            title: isDetail
              ? "Thông tin chi tiết danh mục"
              : !isDetail && isEdit
              ? "Chỉnh sửa danh mục"
              : "Thêm mới danh mục",
            to: null,
          },
        ]}
      />
      <div className="bg-white mx-5 mt-5">
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
                  Tên danh mục<span className="text-red"> *</span>
                </span>
              }
              name="name"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              normalize={(e) => e.trimStart()}
            >
              <Input placeholder="Nhập tên danh mục" maxLength={255}></Input>
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
                    loading={mutation.isLoading || mutationUpdate.isLoading}
                    disabled={mutation.isLoading || mutationUpdate.isLoading}
                  >
                    Lưu
                  </Button>
                </Col>
              </Row>
            )}
          </Form>
        </div>
      </div>
    </AdminDashboard>
  );
};

export default FormCategory;
