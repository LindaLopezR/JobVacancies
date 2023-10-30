import React from 'react';
import { 
  CButton, CModal, CModalBody, CModalFooter, CModalHeader, 
  CModalTitle
} from '@coreui/react';

export default ConfirmModal = props => {
  const { visible, title = '', message = '', handleClose = () => {} } = props;

  return (
    <CModal alignment="center" visible={visible} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{message}</CModalBody>
      <CModalFooter>
        <CButton onClick={handleClose}>
          Ok
        </CButton>
      </CModalFooter>
    </CModal>
  );
};
