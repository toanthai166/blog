import { Button, Col, Form, Input, Row, Select } from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import { AppRoutes } from "../../../helpers/app-routes";
import { useNavigate, useParams } from "react-router-dom";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { debounce } from "debounce";
import { useEffect, useState } from "react";
import {
  useCreateBlog,
  useGetBlogById,
  useUpdateBlog,
} from "../../../hooks/blog.hook";
import { useCategoriesIsActive } from "../../../hooks/category.hook";

const FormCreateBlog = ({ isDetail, isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [dataEditor, setDataEditor] = useState("");
  const { blog } = useGetBlogById(id);
  const { categories } = useCategoriesIsActive();
  const { handleUpdateBlog } = useUpdateBlog();
  const { handleCreateBlog } = useCreateBlog();
  console.log(blog);

  useEffect(() => {
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        categoryId: blog.categoryId,
        image: blog.image,
      });
    }
  }, [blog, form]);

  const onFinish = (values) => {
    if (isEdit) {
      handleUpdateBlog({
        id: id,
        image: values.image,
        title: values.title,
        categoryId: values.categoryId,
        content: dataEditor ? dataEditor : blog.content,
      });
    } else {
      handleCreateBlog({
        image: values.image,
        title: values.title,
        categoryId: values.categoryId,
        content: dataEditor,
      });
    }
  };

  const handleChangeCkeditor = debounce((event, editor) => {
    const data = editor.getData();
    setDataEditor(data);
  }, 800);

  const categoryOptions = categories?.results?.map((it) => ({
    label: it.name,
    value: it.id,
  }));

  return (
    <>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Bài viết", to: AppRoutes.blog },
          {
            title: isDetail
              ? "Thông tin chi tiết bài viết"
              : !isDetail && isEdit
              ? "Chỉnh sửa bài viết"
              : "Thêm mới bài viết",
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
                  Tiêu đề<span className="text-red"> *</span>
                </span>
              }
              name="title"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              normalize={(e) => e.trimStart()}
            >
              <Input placeholder="Nhập tiêu đề" maxLength={255}></Input>
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Chọn danh mục<span className="text-red"> *</span>
                </span>
              }
              name="categoryId"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
            >
              <Select placeholder="Chọn danh mục" options={categoryOptions} />
            </Form.Item>
            <Form.Item label={<span>Mô tả</span>}>
              <CKEditor
                disabled={isDetail}
                editor={ClassicEditor}
                data={isDetail || isEdit ? blog?.content : ""}
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

export default FormCreateBlog;
