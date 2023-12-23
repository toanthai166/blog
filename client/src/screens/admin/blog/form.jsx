import { Button, Col, Form, Input, Row, Select, Upload, message } from "antd";
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

import useUploadImage from "../../../components/upload";

const FormCreateBlog = ({ isDetail, isEdit }) => {
  const [image, setImage] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [dataEditor, setDataEditor] = useState("");
  const { blog } = useGetBlogById(id);
  const { categories } = useCategoriesIsActive();
  const { handleUpdateBlog, mutation } = useUpdateBlog();
  const { handleCreateBlog, mutation: mutationCreate } = useCreateBlog();
  const { handleUploadFile, image: imageUpload } = useUploadImage();

  useEffect(() => {
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        categoryId: blog.categoryId,
        image: blog.image,
      });
    }
  }, [blog, form]);

  const onFinish = async (values) => {
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
        image: imageUpload,
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

  const categoryOptions = categories?.map((it) => ({
    label: it.name,
    value: it.id,
  }));

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
              label={<span className="text-base font-semibold">Ảnh:</span>}
              name="image"
            >
              <Upload
                listType="picture"
                accept="image/png, image/gif, image/jpeg"
                {...props}
              >
                <Button type="link">Thay đổi</Button>
              </Upload>
            </Form.Item>
            <img
              className="ml-[20%] my-10"
              src={image ? URL.createObjectURL(image) : blog?.image}
              alt=""
            />
            <Form.Item
              label={<span className="text-base font-semibold">Tiêu đề</span>}
              name="title"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              normalize={(e) => e.trimStart()}
            >
              <Input placeholder="Nhập tiêu đề" maxLength={255}></Input>
            </Form.Item>
            <Form.Item
              label={
                <span className="text-base font-semibold">Chọn danh mục</span>
              }
              name="categoryId"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
            >
              <Select
                placeholder="Chọn danh mục"
                options={categoryOptions}
                className="h-12"
              />
            </Form.Item>
            <Form.Item
              label={<span className="text-base font-semibold">Mô tả</span>}
            >
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
                    type="primary"
                    htmlType="submit"
                    loading={mutation.isLoading || mutationCreate.isLoading}
                    disabled={mutation.isLoading || mutationCreate.isLoading}
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
