import { Modal } from "antd";
import { createContext, useCallback, useContext, useState } from "react";

const DialogContext = createContext({
  showDialog() {
    throw new Error("not-ready");
  },
});

export const useDialog = () => useContext(DialogContext);

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState();
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = useCallback((options) => {
    setDialog(options);
    setDialogVisible(true);
  }, []);

  const resetShowdiaLog = useCallback(() => {
    setDialog(undefined);
    setDialogVisible(false);
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <Modal
        open={dialogVisible}
        title={dialog?.title}
        okText={dialog?.confirmText}
        onOk={async () => {
          await dialog?.onOK?.();
          resetShowdiaLog();
        }}
        onCancel={async () => {
          await dialog?.onCancel?.();
          resetShowdiaLog();
        }}
        cancelText={dialog?.cancelText}
      >
        {dialog?.content}
      </Modal>
    </DialogContext.Provider>
  );
};
