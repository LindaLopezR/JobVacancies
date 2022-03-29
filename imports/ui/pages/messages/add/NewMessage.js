import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCol, CContainer, CForm } from '@coreui/react';
import { faAddressBook, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';

import { useMessageById } from '/imports/startup/client/hooks';

import LoadingView from '../../../components/loading/LoadingView';
import ConfirmModal from '../../../components/modals/ConfirmModal';

const MODES = {
  NEW: 'NEW',
  EDIT: 'EDIT'
};

const MODE_NAMES = {
  NEW: 'Nuevo',
  EDIT: 'Editar'
};

export const NewMessage = (props) => {

  const { mode } = props;
  const [ loading, setLoading ] = useState(true);

  let messageData = null;

  if (mode === MODES.EDIT) {
    const { id } = useParams();
    const data = useMessageById(id);
    messageData = data.message;
  }

  const history = useNavigate();
  const { handleSubmit } = useForm();
  const [ contentText, setContentText ] = useState('');
  const [ label, setLabel ] = useState('');
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  useEffect(() => {
    if (messageData) {
      const { label, message } = messageData;
      setContentText(message);
      setLabel(label);
      setLoading(false);
    } else {
      setLoading(false);
    }
   }, [messageData]);

  const onSubmit = () => {

    if(!contentText) {
      setTitleModal('Error');
      setMessageModal('Ingresa un mensaje');
      return setShowModal(true);
    }

    const data = {
      message: contentText,
      label
    };

    setLoading(true);

    const callback = (error, result) => {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        history('/messages');
      };
    };

    if (mode === MODES.NEW) {
      Meteor.call('newMessage', data, callback);
    } else if (mode === MODES.EDIT) {
      Meteor.call('editMessage', messageData._id, data, callback);
    }
  };

  const handleChange = (content, delta, source, editor) => {
    const value = editor.getText(content);
    setContentText(content);
    setLabel(value);
  }

  if (loading) {
    return <LoadingView />;
  };

  const title = `${MODE_NAMES[mode]} mensaje`;

  return (
    <>
      <ConfirmModal
        visible={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <CCol xs={12}>
        <h3>
          <FontAwesomeIcon icon={faAddressBook} className="me-1" />
          {title}
        </h3>
        <hr />
      </CCol>
      <CCol xs={12}>
        <CCard>
          <CCardBody>
            <CForm onSubmit={ handleSubmit(onSubmit) }>
              <p>Utiliza la etiqueta {'{{user}}'} para el nombre del empleado</p>
              <div className="mb-3">
                <ReactQuill
                  theme="snow"
                  value={contentText}
                  onChange={handleChange}
                  placeholder={'Hola {{user}}, nos complace informarte...'}
                />
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="secondary" variant="outline" onClick={() => history('/messages')}>
                  Cancelar
                </CButton>
                <CButton color="primary" type="submit">
                  Guardar
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </>
  );
};
