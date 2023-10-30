import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { 
  CBadge, CButton, CCard, CCardBody, CCardHeader, CCardText, CCol, 
  CRow,
} from '@coreui/react';
import { faBriefcase, faUsers, } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';

import { getTypeSite, getTypeWork } from '/imports/ui/components/utilities';
import { 
  callbackError, dateFormatter, getEmployeeNumber, getNameItem,
} from '/imports/ui/pages/utils/formatters';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import TitleSection from '/imports/ui/components/pages/TitleSection';
import FormMessageModal from '/imports/ui/components/modals/FormMessageModal';
import MessagesTable from '/imports/ui/components/tables/MessagesTable';
import ApprovedModal from '/imports/ui/components/modals/ApprovedModal';

export const ViewVacancy = (props) => {

  const { id } = useParams();
  const [ loading, setLoading ] = useState(false);
  const [ data, setData ] = useState({
    allUsers: [],
    allMessages: [],
    nominations: [],
    vacancy: [],
    history: []
  });

  const [ actionSelected, setActionSelected ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ showApprovedModal, setApprovedModal ] = useState(false);

  const callback = (error, result) => {
    setLoading(false);
    if (error) callbackError(error);

    setActionSelected([]);
    loadData();
    return alert('Éxito');
  };

  const loadData = () => {
    setLoading(true);
    Meteor.call('getVacancyById', id, function(error, result) {
      if (error) callbackError(error);

      if (result) {
        setData(result);
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      setActionSelected([...actionSelected, row.candidate]);
    } else {
      setActionSelected(actionSelected.filter(item => item !== row.candidate));
    }
  }
  
  const handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.candidate);
    if (isSelect) {
      setActionSelected(ids);
    } else {
      setActionSelected([]);
    }
  }

  const columns = [
    {
      dataField: 'id',
      text: '# Empleado',
      sort: true,
      formatter: (cell, row) => getEmployeeNumber(row.candidate, data.allUsers)
    }, {
      dataField: 'candidate',
      text: 'Nombre',
      sort: true,
      formatter: (cell) => getNameItem(cell, data.allUsers)
    }, {
      dataField: 'date',
      text: 'Fecha',
      sort: true,
      formatter: dateFormatter
    },
  ];

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: (row, isSelect) => handleOnSelect(row, isSelect),
    onSelectAll: (isSelect, rows, e) => handleOnSelectAll(isSelect, rows),
  };

  const sendMessages = (message) => {
    setLoading(true);
    setShowModal(false);

    const json = {
      message,
      candidates: actionSelected,
      vacancy: data.vacancy._id
    }

    Meteor.call('sendNewMessage', json, callback);
  };

  const sendApprovedMessages = (json) => {
    setLoading(true);
    setApprovedModal(false);

    json.candidates = actionSelected;
    json.vacancy = data.vacancy._id;

    Meteor.call('sendApprovedNewMessage', json, callback);
  }

  if (loading) {
    return <LoadingView />;
  };

  const { allMessages, allUsers, history, nominations, vacancy, } = data;
  const colorStatus = vacancy && vacancy.status == 'ACTIVE' ? 'success' : 'danger';

  return (
    <>
      <FormMessageModal
        visible={showModal}
        messages={allMessages}
        handleClose={() => setShowModal(false)}
        handleAction={(data) => sendMessages(data)}
      />
      <ApprovedModal
        visible={showApprovedModal}
        messages={allMessages}
        handleClose={() => setApprovedModal(false)}
        handleAction={(data) => sendApprovedMessages(data)}
      />
      <TitleSection
        title="Detalle de vacante"
        subtitle={vacancy.name}
        icon={faBriefcase}
        back={true}
      />
      <CCol lg={4}>
        <CCard className="mb-3">
          <CCardHeader>Detalle</CCardHeader>
          <CCardBody className="card-vacancy">
            <p>
              <b>Estatus:</b> {' '}
              <CBadge color={colorStatus} shape="rounded-pill">{vacancy.status}</CBadge>
            </p>
            <CCardText>
              {vacancy.description && parse(vacancy.description)}
            </CCardText>
            <hr />
            <p>
              <b>Tipo de trabajo:</b> {getTypeWork(vacancy.typeWork)}
            </p>
            <p>
              <b>Tipo de lugar de trabajo:</b> {getTypeSite(vacancy.typeSite)}
            </p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={8}>
        <CCard className="mb-3 card-candidates">
          <CCardHeader>Postulantes</CCardHeader>
          <CCardBody>
            <CRow className="mb-2">
              <CCol xs={6}>
                {actionSelected.length > 0 && 
                  <CButton
                    onClick={() => setApprovedModal(true)}
                  >
                    Seleccionar para la vacante
                  </CButton>
                }
              </CCol>
              <CCol xs={6} className="text-end">
                {actionSelected.length > 0 && 
                  <CButton
                    variant="outline"
                    onClick={() => setShowModal(true)}
                  >
                    Enviar mensaje
                  </CButton>
                }
              </CCol>
            </CRow>
            
            {nominations.length > 0 
              ? (
                <div className="table-responsive-vacancies">
                  <BootstrapTable
                    keyField='_id'
                    data={ nominations }
                    columns={ columns }
                    pagination={paginationFactory()}
                    striped
                    condensed
                    selectRow={ selectRow }
                  />
                </div>
              )
              : <NoData title="Sin datos por mostrar" icon={faUsers} />
            }
          </CCardBody>
        </CCard>
        <CCard className="card-history">
          <CCardHeader>
            Historial de mensajes
          </CCardHeader>
          <CCardBody>
            <MessagesTable
              allMessages={ allMessages }
              allUsers={ allUsers }
              data={ history }
              showCandidate={true}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </>
  );
};
