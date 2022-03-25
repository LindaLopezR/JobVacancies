import { 
  CButton, CFormSelect, CModal, CModalBody, CModalFooter, 
  CModalHeader, CModalTitle 
} from '@coreui/react';
import React, { useState } from 'react';

import { renderMessagesOptions } from '../../pages/utils/formatters';

export default FormMessageModal = props => {
  const { visible, messages = [], handleClose = () => {}, handleAction = () => {}, } = props;

  const [ valueDefault, setValueDefault ] = useState('');

  const sendAction = () => {
    if (valueDefault == '') {
      return alert('Error, Selecciona un mensaje para enviar.');
    }
    return handleAction(valueDefault);
  };

  console.log(messages)

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={handleClose}
    >
      <CModalHeader>
        <CModalTitle>Enviar</CModalTitle>
      </CModalHeader>
      <CModalBody>
        Elige el mensaje a enviar:
        <CFormSelect
          aria-label="message"
          value={valueDefault}
          className="select-messages"
          onChange={e => setValueDefault(e.target.value)}
        >
          <option value=''>Selecciona</option>
          {messages.length && renderMessagesOptions(messages)}
        </CFormSelect>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="outline" onClick={handleClose}>Cerrar</CButton>
        <CButton onClick={ () => sendAction() }>
          Enviar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};
