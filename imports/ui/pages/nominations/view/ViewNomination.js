import React, { useEffect, useState } from 'react';
import { 
  CButton, CCard, CCardBody, CCardHeader, CCardTitle, 
  CCol, CRow,
} from '@coreui/react';
import { faBriefcase, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';

import { 
  useAllUsers, useAllVacancies, useAllMessages, useNominationById 
} from '/imports/startup/client/hooks';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import { dateFormatter, getNameItem } from '../../utils/formatters';

export const ViewNomination = (props) => {

  const { id } = useParams();
  const { loading: loading1, nomination } = useNominationById(id);
  const { loading: loading2, allVacancies } = useAllVacancies();
  const { loading: loading3, allUsers } = useAllUsers();
  const { loading: loading4, allMessages } = useAllMessages();

  const [ messages, setMessages ] = useState([]);

  useEffect(() => {
    let mss = [];
    if (allVacancies && nomination) {
      const data = allVacancies.find(vacancy => vacancy._id == nomination.vacancy);
      console.log(data)
      mss = data && data.history && data.history.filter(item => item.candidate == nomination.candidate);
      
    }
    setMessages(mss);
  }, [ allVacancies, nomination ]);

  if (loading1 || loading2 || loading3 || loading4) {
    return <LoadingView />;
  };

  const { candidate, date, vacancy } = nomination;

  return (
    <>
      <CCol xs={12}>
        <h3>
          <FontAwesomeIcon icon={faBriefcase} className="me-1" />
          Detalle de postulación
        </h3>
        <hr />
      </CCol>
      <CCol xs={12}>
        <CRow>
          <CCol md={4}>
            <CCard className="mb-3">
              <CCardHeader>Detalle</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xs={8}>
                    <p className="mb-0">Empleado:</p>
                    <CCardTitle>{getNameItem(candidate, allUsers)}</CCardTitle>
                  </CCol>
                  <CCol xs={4}>
                    <CButton size="sm">Ver empleado</CButton>
                  </CCol>
                </CRow>
                <p className="mb-0">Vacante:</p>
                <CCardTitle>{getNameItem(vacancy, allVacancies)}</CCardTitle>
                <p className="mb-0">Fecha:</p>
                <CCardTitle>{dateFormatter(date)}</CCardTitle>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={8}>
            <CCard className="card-answers mb-3">
              <CCardHeader>Respuestas</CCardHeader>
              <CCardBody>
                <MessagesTable
                  allMessages={allMessages}
                  data={messages}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCol>
    </>
  );
};
