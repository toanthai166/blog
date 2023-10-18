import { Button, Popconfirm, Switch, Table, Tag, Tooltip } from "antd";
import { AppRoutes } from "../../../helpers/app-routes";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { SubHeader } from "../../../components/sub-header/SubHeader";
import { useChangeIsActiveFaq, useFAQ } from "../../../hooks/faq.hook";

const FaqManagement = () => {
  const navigate = useNavigate();

  const { Faqs } = useFAQ();
  const listFaq = Faqs
    ? Faqs?.map((item, index) => ({
        ...item,
        key: item.id,
        index: ++index,
      }))
    : [];
  const { handleChangeIsActiveFaq } = useChangeIsActiveFaq();

  const handleChangeStatus = async (row) => {
    const { id, isActive } = row;
    await handleChangeIsActiveFaq({ id: id, isActive: !isActive });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Trạng thái",
      key: "isActive",
      render: (it) => {
        return (
          <Popconfirm
            title={`Bạn có chắc muốn cập nhật trạng thái câu hỏi thường gặp ?`}
            okText="Đồng ý"
            cancelText="Huỷ bỏ"
            placement="topLeft"
            onConfirm={() => handleChangeStatus(it)}
          >
            <Switch checked={it?.isActive} size="default" />
          </Popconfirm>
        );
      },
    },

    {
      title: "Action",
      key: "id",
      dataIndex: "id",
      render: (id) => {
        return (
          <div className="flex gap-2 justify-end">
            <Tooltip title="Sửa">
              <Tag
                className="hover:cursor-pointer"
                color="blue"
                onClick={() => navigate(AppRoutes.faqEditById(id))}
              >
                <EditOutlined />
              </Tag>
            </Tooltip>
            <span className="translate-y-0.5 text-grayscale-border">|</span>
            <Popconfirm
              title="Xóa bài viết"
              // okButtonProps={{ disabled: mutation.isLoading }}
              onConfirm={() => {
                // handleDeleteBlog(id);
              }}
              description="Bạn có chắc chắn xóa bài viết này?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Tooltip title="Xóa">
                <Tag className="hover:cursor-pointer" color="#f50">
                  <DeleteOutlined />
                </Tag>
              </Tooltip>
            </Popconfirm>
            <span className="translate-y-0.5 text-grayscale-border">|</span>
            <Tooltip title="Xem chi tiết">
              <Tag
                className="hover:cursor-pointer"
                color="gold"
                onClick={() => navigate(AppRoutes.faqDetailId(id))}
              >
                <EyeOutlined />
              </Tag>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <SubHeader
        items={[
          { title: "Trang chủ", to: AppRoutes.admin },
          { title: "Bài viết", to: AppRoutes.blog },
        ]}
        rightContent={
          <Button
            type="default"
            onClick={() => {
              navigate(AppRoutes.createFaq);
            }}
          >
            Tạo câu hỏi mới
          </Button>
        }
      />
      <div className="bg-white mx-5 mt-5">
        <h2 className="text-lg font-semibold p-5">
          {Faqs?.totalResults} câu hỏi tất cả
        </h2>
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={listFaq}
          scroll={{ y: "calc(100vh - 320px)" }}
        />
      </div>
      <div></div>
    </>
  );
};

export default FaqManagement;
