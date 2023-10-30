import React from 'react';
import { 
  CButton, CModal, CModalBody, CModalFooter, CModalHeader, 
  CModalTitle
} from '@coreui/react';

export default ActionModal = props => {
  const { 
    visible, title = '', message = '', handleClose = () => {}, 
    handleAction = () => {} 
  } = props;

  return (
    <CModal alignment="center" visible={visible} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{message}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={handleClose}>
          Cancelar
        </CButton>
        <CButton onClick={handleAction}>Aceptar</CButton>
      </CModalFooter>
    </CModal>
  );
};
