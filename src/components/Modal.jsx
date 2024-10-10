import React from "react";
import { Modal } from "antd";

const ModalWrapper = ({children,openModal, setOpenModal, title, handleOk}) => {

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <Modal
      title={title}
      open={openModal}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
        {children}
    </Modal>
  );
};

export default ModalWrapper;
