import { 
  CButton, CFormCheck, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, 
  CModalHeader, CModalTitle 
} from '@coreui/react';
import React, { useState } from 'react';

import { renderMessagesOptions } from '/imports/ui/pages/utils/formatters';

export default ApprovedModal = props => {
  const { visible, messages = [], handleClose = () => {}, handleAction = () => {}, } = props;

  const [ message, setMessage ] = useState('');
  const [ checked, setChecked ] = useState(true);
  const [ closeVacancy, setCloseVacancy ] = useState('yes');
  const [ messagesDiscarded, setMessagesDiscarded ] = useState('');

  const sendAction = () => {
    if (message == '') {
      return alert('Error, Selecciona un mensaje para enviar.');
    }
    if (checked && message == '') {
      return alert('Error, Selecciona un mensaje para enviar a los empleados descartados.');
    }
    const toSend = {
      message,
      messagesDiscarded,
      closeVacancy,
      sendDiscarded: checked
    }
    return handleAction(toSend);
  };

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
        <CFormLabel>Elige el mensaje a enviar:</CFormLabel>
        <CFormSelect
          aria-label="message"
          value={message}
          className="select-messages"
          onChange={e => setMessage(e.target.value)}
        >
          <option value=''>Selecciona</option>
          {messages.length && renderMessagesOptions(messages)}
        </CFormSelect>
        <p className="title-segment mt-3 mb-0">
          <small>Empleados descartados</small>
        </p>
        <hr className="mt-1 mb-1" />
        <CFormCheck
          id="discarted"
          label="Enviar mensaje de descartado a todos los postulantes no seleccionados"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="mt-2"
        />
        {checked && (
          <>
            <CFormLabel>Elige el mensaje a enviar:</CFormLabel>
            <CFormSelect
              aria-label="message"
              value={messagesDiscarded}
              className="select-messages"
              onChange={e => setMessagesDiscarded(e.target.value)}
            >
              <option value=''>Selecciona</option>
              {messages.length && renderMessagesOptions(messages)}
            </CFormSelect>
          </>
        )}
        <p className="title-segment mt-3 mb-0">
          <small>Cerrar vacante</small>
        </p>
        <hr className="mt-1 mb-1" />
        <CFormCheck
          inline
          type="radio"
          name="closeVacancyRadio"
          id="close"
          value="yes"
          label="Si"
          checked={closeVacancy == 'yes'}
          onChange={e => setCloseVacancy(e.target.value)}
        />
        <CFormCheck
          inline
          type="radio"
          name="closeVacancyRadio"
          id="close"
          value="no"
          label="No"
          checked={closeVacancy == 'no'}
          onChange={e => setCloseVacancy(e.target.value)}
        />
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
