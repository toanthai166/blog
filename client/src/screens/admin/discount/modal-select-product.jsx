import { useCallback, useState, useEffect } from "react";
import { Checkbox, Modal, Table } from "antd";
import { DefaultPagination, numberWithDots } from "../../../ultis/pagination";

import { useProduct } from "../../../hooks/product.hook";

export const ModalSelectProduct = ({
  open,
  setOpen,
  onFinish,
  productIds,
  products: productsDefault,
}) => {
  const [filter, setFilter] = useState({
    limit: 100,
    page: 1,
    isActive: true,
  });
  const { products } = useProduct(filter);
  const listProduct = products?.results
    ? products?.results?.map((item, index) => ({
        ...item,
        key: item.id,
        index: ++index,
      }))
    : [];

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const handleSelectedProducts = useCallback(
    (id, row) => {
      // handle check all
      const isChecked = selectedProductIds.includes(id);
      if (isChecked) {
        setSelectedProductIds(selectedProductIds.filter((ids) => ids !== id));
        setSelectedProducts(selectedProducts.filter((item) => item.id !== id));
        return;
      }
      setSelectedProductIds([...selectedProductIds, id]);
      setSelectedProducts([...selectedProducts, row]);
    },
    [selectedProductIds, selectedProducts]
  );

  const onChangePage = (newPage) => {
    setFilter({ ...filter, page: newPage });
  };

  useEffect(() => {
    if (productIds && productIds.length > 0) {
      setSelectedProductIds([...productIds]);
    }
  }, [productIds]);

  useEffect(() => {
    if (productsDefault && productsDefault.length > 0) {
      setSelectedProducts([...productsDefault]);
    }
  }, [productsDefault]);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mã sản phẩm",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Tên sản phẩm",
      key: "name",
      dataIndex: "name",
      with: "40%",
      render: (name, _) => (
        <div className="flex flex-row items-center break-words">
          <img
            src={_.image ? _.image : ""}
            alt=""
            width={32}
            height={32}
            className="rounded"
          />
          <div
            className="ml-[12px]"
            style={{ maxWidth: "calc(100% - 32px - 12px)" }}
          >
            <div className="font-medium text-[14px] leading-[20px] text-yankees-blue whitespace-nowrap text-ellipsis overflow-hidden">
              {name}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      key: "unitPrice",
      dataIndex: "unitPrice",
      render: (value) => numberWithDots(value) + "đ",
    },
    {
      title: "Tồn kho",
      key: "quantity",
      dataIndex: "quantity",
    },
    {
      title: "Tùy chọn",
      key: "action",
      dataIndex: "id",
      align: "center",
      render: (id, row) => (
        <Checkbox
          key={id}
          onChange={() => handleSelectedProducts(id, row)}
          checked={!!selectedProductIds.includes(id)}
        />
      ),
    },
  ];

  return (
    <Modal
      width={"85%"}
      open={open}
      onCancel={() => setOpen(false)}
      okButtonProps={{}}
      onOk={() => onFinish(selectedProductIds, selectedProducts)}
      title={
        <div className="flex items-center justify-between">
          <div>
            <h2>Chọn sản phẩm</h2>
            <p className="text-grayscale-gray text-14px">
              Danh sách này không bao gồm các sản phẩm đã áp dụng khuyến mãi và
              đang ẩn
            </p>
          </div>
        </div>
      }
    >
      <Table
        size="small"
        bordered
        columns={columns}
        dataSource={listProduct}
        pagination={{
          ...DefaultPagination,
          onChange: onChangePage,
          current: Number(filter?.page),
          total: products?.totalResults,
        }}
        scroll={{ y: "calc(100vh - 320px)" }}
      />
    </Modal>
  );
};
