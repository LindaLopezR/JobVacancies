import { CButton, CCol, CRow } from '@coreui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default NotFound = () => {

  const history = useNavigate();

	return (
    <div className="content-notFound">
      <CRow>
        <CCol md={6} className="info">
          <h1 className="display-1">404</h1>
          <h2>¡UH OH! Estás perdido.</h2>
          <p>
            La página que busca no existe.
            ¿Cómo ha llegado aquí? Es un misterio, 
            pero puede hacer click en el botón de abajo
            para volver a la página principal.
          </p>
          <CButton
            color="success-dark"
            onClick={() => history('/')}
          >
            Inicio
          </CButton>
        </CCol>
        <CCol md={6} />
      </CRow>
    </div>
	);
};
