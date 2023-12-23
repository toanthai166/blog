import { Button, Col, Form, Input, Row, Spin } from "antd";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import { AppRoutes } from "../../../helpers/app-routes";
import { useNavigate, useParams } from "react-router-dom";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { debounce } from "debounce";
import { useEffect, useState } from "react";

import {
  useCreateFaq,
  useGetFaqById,
  useUpdateFaq,
} from "../../../hooks/faq.hook";

const FormFaq = ({ isDetail, isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [dataEditor, setDataEditor] = useState("");
  const { faq, isLoading } = useGetFaqById(id);
  console.log(faq);
  const { handleUpdateFaq } = useUpdateFaq();
  const { handleCreateFaq } = useCreateFaq();

  useEffect(() => {
    if (faq) {
      form.setFieldsValue({ title: faq?.data?.title });
    }
  }, [faq, form]);

  const onFinish = async (values) => {
    if (isEdit) {
      await handleUpdateFaq({
        faqId: id,
        title: values.title,
        description: dataEditor ? dataEditor : faq.description,
      });
    } else {
      await handleCreateFaq({
        title: values.title,
        description: dataEditor,
      });
    }
  };

  const handleChangeCkeditor = debounce((event, editor) => {
    const data = editor.getData();
    setDataEditor(data);
  }, 800);

  return (
    <Spin spinning={isLoading}>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Câu hỏi", to: AppRoutes.faqManagement },
          {
            title: isDetail
              ? "Thông tin chi tiết câu hỏi"
              : !isDetail && isEdit
              ? "Chỉnh sửa câu hỏi"
              : "Thêm mới câu hỏi",
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
                  Tiêu đề<span className="text-red"> *</span>
                </span>
              }
              name="title"
              rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
              normalize={(e) => e.trimStart()}
            >
              <Input placeholder="Nhập tiêu đề" maxLength={255}></Input>
            </Form.Item>

            <Form.Item label={<span>Mô tả</span>}>
              <CKEditor
                disabled={isDetail}
                editor={ClassicEditor}
                data={isDetail || isEdit ? faq?.data?.description : ""}
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
    </Spin>
  );
};

export default FormFaq;
