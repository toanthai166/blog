export const getNameCategoriesEntity = (categories) => {
  if (!categories || (categories && categories?.length === 0)) return "";
  return categories
    ?.map((qualification, idx) => {
      if (idx + 1 === categories.length) return qualification.name;
      return qualification?.name + ", ";
    })
    .join(" ");
};
export const orderStatusText = (value) => {
  switch (value) {
    case "cancel":
      return "Đơn hàng đã bị hủy.";
    case "complete":
      return "Đơn hàng đã hoàn thành.";
    case "shipping":
      return "Đơn hàng đang giao.";
    case "wait_for_confirm":
      return "Đơn hàng đang chờ xác nhận.";
    case "delivered":
      return "Đơn hàng đã được giao.";
    default: {
      const exhaustiveCheck = value;
      throw new Error(` not supported value: ${exhaustiveCheck}`);
    }
  }
};
