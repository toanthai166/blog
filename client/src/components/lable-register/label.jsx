export const LabelRegister = ({ required, children }) => {
  return (
    <div className="mb-[8px] flex flex-row items-center">
      {required ? (
        <div className="text-vermilion text-[15px] text-sm mr-[4px]">*</div>
      ) : (
        ""
      )}

      <div className="text-[14px] leading-[20px] font-medium text-yankees-blue">
        {children}
      </div>
    </div>
  );
};
