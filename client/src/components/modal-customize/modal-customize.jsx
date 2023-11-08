import { Modal } from "antd";

import { DefaultPropModal } from "../../helpers/modal";

export const ModalCustomize = ({ ...props }) => {
  return (
    <Modal
      {...DefaultPropModal}
      {...props}
      zIndex={100}
      title={<span className="font-semibold text-20px">{props.title}</span>}
    >
      {props.children}
    </Modal>
  );
};
