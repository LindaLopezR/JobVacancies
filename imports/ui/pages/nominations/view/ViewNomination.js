import React, { useEffect, useState } from 'react';
import { 
  CButton, CCard, CCardBody, CCardHeader, CCardTitle, 
  CCol, CRow,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faEye, } from '@fortawesome/free-solid-svg-icons';

import { useParams } from 'react-router-dom';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import { dateFormatter } from '/imports/ui/pages/utils/formatters';

export const ViewNomination = (props) => {

  const { id } = useParams();
  const [ loading, setLoading ] = useState(true);
  const [ nomination, setNomination ] = useState({});
  const [ allMessages, setAllMessages ] = useState([]);

  const [ showModal, setShowModal ] = useState(false);

  const loadData = () => {
    setLoading(true);
    Meteor.call('getNominationById', id, function(error, result) {
      setLoading(false);
      if (error) callbackError(error);

      if (result) {
        setNomination(result.nomination);
        setAllMessages(result.messages)
      }
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  const sendMessages = (message) => {
    setLoading(true);
    setShowModal(false);

    const json = {
      candidate: nomination.candidate,
      vacancy: nomination.vacancy,
      message
    }

    Meteor.call('sendMessage', json, function(error, result) {
      setLoading(false);
      if (error) callbackError();
  
      loadData();
      return alert('Éxito');
    });
  };

  if (loading || nomination == {}) {
    return <LoadingView />;
  };

  return (
    <>
      <FormMessageModal
        visible={showModal}
        messages={allMessages}
        handleClose={() => setShowModal(false)}
        handleAction={(data) => sendMessages(data)}
      />
      <TitleSection
        title='Detalle de postulación'
        subtitle={null}
        icon={faBriefcase}
        back={true}
      />
      <CCol xs={12}>
        <CRow>
          <CCol md={4}>
            <CCard className="mb-3">
              <CCardHeader>Detalle</CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xs={8}>
                    <p className="mb-0">Empleado:</p>
                    <CCardTitle>{nomination.username && nomination.username}</CCardTitle>
                  </CCol>
                  <CCol xs={4} className="d-flex justify-content-center align-items-center">
                    <CButton
                      size="sm"
                      shape="rounded-pill"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </CButton>
                  </CCol>
                </CRow>
                <p className="mb-0">Vacante:</p>
                <CCardTitle>{nomination.vacancyName}</CCardTitle>
                <p className="mb-0">Fecha:</p>
                <CCardTitle>{dateFormatter(nomination.date)}</CCardTitle>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={8}>
            <CCard className="card-answers mb-3">
              <CCardHeader>Historial de Respuestas</CCardHeader>
              <CCardBody>
                <CRow className="mb-2">
                  <CCol xs={12} className="text-end">
                    <CButton
                      variant="outline"
                      shape="rounded-pill"
                      size="sm"
                      onClick={() => setShowModal(true)}
                    >
                      Enviar nuevo mensaje
                    </CButton>
                  </CCol>
                </CRow>
                <MessagesTable
                  allMessages={allMessages}
                  data={nomination.historyMss}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCol>
    </>
  );
};
