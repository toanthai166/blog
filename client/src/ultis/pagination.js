export const DefaultPagination = {
  size: "small",
  defaultPageSize: 10,
  showQuickJumper: false,
  showSizeChanger: false,
  showTotal: (total, range) => {
    return `${range[0]}-${range[1]} của ${total}`;
  },
};
export function numberWithDots(num) {
  if (!num) return 0;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
