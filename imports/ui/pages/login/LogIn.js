import React, { useState } from 'react';
import { 
  CButton, CCard, CCardBody, CForm, CFormInput, CFormLabel 
} from '@coreui/react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';

export const LogIn = () => {

  const [ loading, setLoading] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const { state } = useLocation();

  const navigate = useNavigate();
  const { register, formState: { errors }, handleSubmit } = useForm();

  const version = 'Versión 1.0';

  const onSubmit = data => {

    const { username, password } = data;
    setLoading(true);

    Meteor.loginWithPassword(username, password, error => {
      if (error) {
        console.log('ERROR ', error.error === 403)
        setLoading(false);
        setTitleModal('Error');
        const message = error.error === 403 ? 'Usuario no encontrado' : error.reason;
        setMessageModal(message);
        return setShowModal(true);
      }else {
        navigate(state?.path || '/');
      }
    });
  };

  if (loading) {
    return <LoadingView />;
  }

  return (
    <CCard className="content-login">
       <ConfirmModal
        visible={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <CCardBody>
        <CForm onSubmit={ handleSubmit(onSubmit) }>
          <div className="mb-3">
            <CFormLabel htmlFor="username">Usuario</CFormLabel>
            <CFormInput
              type="text"
              id="username"
              {...register("username")}
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="password">Password</CFormLabel>
            <CFormInput
              type="password"
              id="Password"
              {...register("password")}
            />
          </div>
          <div className="d-grid gap-2">
            <CButton type="submit" color="success">
              Entrar
            </CButton>
          </div>
          <p className="text-center mt-3">
            <small>{version}</small>
          </p>
        </CForm>
      </CCardBody>
    </CCard>
  );
  
};
