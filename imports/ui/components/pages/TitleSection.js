import { CButton, CCol, } from '@coreui/react';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default TitleSection = props => {
  const { back = false, icon, title, subtitle} = props;
  const history = useNavigate();

  const colTitle = back ? 9 :  12;

  return (
    <>
      <CCol xs={colTitle}>
        <h3>
          <FontAwesomeIcon icon={icon} className="me-1" />
          {title}
        </h3>
        {subtitle && (
          <h3>
            <small>{subtitle}</small>
          </h3>
        )}
      </CCol>
      {back && (
        <CCol xs={3} className="text-end">
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            shape="rounded-pill"
            onClick={() => history(-1)}
          >
            <FontAwesomeIcon icon={faArrowAltCircleLeft} />{' '}
            Atrás
          </CButton>
        </CCol>
      )}
      <hr />
    </>
  );
};
