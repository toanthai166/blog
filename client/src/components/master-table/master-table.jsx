import { useCallback } from "react";
import { Table } from "antd";

import { DefaultPagination } from "../../ultis/pagination";
export function MasterTable({
  title = "",
  columns,
  data,
  setFilter,
  filter,
  rowSelection,
  total,
  emptyImage,
  emptyText = "Không có dữ liệu",
  ...props
}) {
  const onChangePage = useCallback(
    (newPage) => {
      setFilter?.({ ...filter, page: newPage });
    },
    [filter, setFilter]
  );

  const renderTitle = () => {
    if (title && typeof title !== "string") {
      return title;
    }
    return (
      <h2 className="text-16px font-semibold leading-24px mb-20px">{title}</h2>
    );
  };

  if (emptyImage && (!data || (data && data?.length === 0))) {
    return (
      <div>
        {renderTitle()}
        <div className="w-full text-center">
          {emptyImage}
          <p className="text-14px text-grayscale-gray leading-20px font-normal">
            {emptyText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderTitle()}
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        tableLayout="fixed"
        rowSelection={rowSelection}
        pagination={{
          ...DefaultPagination,
          onChange: onChangePage,
          current: Number(filter?.page) || undefined,
          total: total || data?.length,
        }}
        bordered={true}
        scroll={{ y: "calc(100vh - 320px)" }}
        rowKey={"id"}
        {...props}
      />
    </div>
  );
}
