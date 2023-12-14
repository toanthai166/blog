export const RowItem = ({ label, value, valueColor, wrapperStyle }) => {
  return (
    <div className={`flex justify-between items-baseline ${wrapperStyle}`}>
      <span className="text-base leading-5 font-normal text-grayscale-gray">
        {label}
      </span>
      <span className={"text-base leading-5 font-normal " + valueColor}>
        {value}
      </span>
    </div>
  );
};
