import classNames from "classnames";
import { ErrorIcon, InfoCircle } from "../assets";

export const ResponseMessage = ({
  gray,
  error,
  success,
  children,
  warning,
  dashed,
  info,
  className,
  icon,
}) => {
  if (!children) return null;
  return (
    <div
      className={classNames(
        `px-[16px] py-[12px] rounded flex flex-row items-center text-[13px] text-yankees-blue 
        ${error && "bg-linen"} 
        ${warning && "bg-primarys-lighter"}
        ${info && "bg-blue"}
        ${dashed && "bg-[#EEEEEE]"}
        ${gray && "bg-grayscale-border"}
        ${success && "bg-bright-green-gray"}`,
        className
      )}
    >
      <div className="mr-[12px]">{icon}</div>
      {!icon && error && <ErrorIcon className="mr-[12px]" />}
      {!icon && success && <InfoCircle fill="#FFFFFF" className="mr-[12px]" />}
      {!icon && warning && <InfoCircle fill="#FFC42C" className="mr-[12px]" />}
      {!icon && info && <InfoCircle fill="#03A1FA" className="mr-[12px]" />}
      {!icon && dashed && <InfoCircle fill="#ccc" className="mr-[12px]" />}
      {!icon && gray && <InfoCircle fill="#676E72" className="mr-[12px]" />}
      {children}
    </div>
  );
};
