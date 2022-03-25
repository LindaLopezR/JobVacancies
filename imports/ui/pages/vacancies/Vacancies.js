import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { CButton, CCard, CCardBody, CCol, CContainer, } from '@coreui/react';
import {
  faBriefcase, faEye, faHandshakeSimpleSlash, faPencilAlt, faPlusCircle, faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';

import { useAllVacancies, useAllUsers } from '/imports/startup/client/hooks';
import { getNameItem, dateFormatter } from '/imports/ui/pages/utils/formatters';

import NoData from '/imports/ui/components/noData/NoData';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import ActionModal from '/imports/ui/components/modals/ActionModal';

export const Vacancies = () => {

  const history = useNavigate();
  const [ loading, setLoading ] = useState(false);
  const { loading: loading1, allVacancies } = useAllVacancies();
  const { loading: loading2, allUsers } = useAllUsers();
  const [ showModal, setShowModal ] = useState(false);
  const [ showModalAction, setShowModalAction ] = useState(false);
  const [ selectVacancy, setSelectVacancy ] = useState(null);

  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const deleteVacancy = (vacancyId) => {

    setLoading(true);

    Meteor.call('deleteVacancy', vacancyId, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      setTitleModal('Éxito');
      setMessageModal('Mensaje eliminado');
      return setShowModal(true);
    });
  };

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
      sort: true
    }, {
      dataField: 'name',
      text: 'Nombre',
      sort: true
    }, {
      dataField: 'date',
      text: 'Fecha',
      sort: true,
      formatter: dateFormatter
    }, {
      dataField: 'user',
      text: 'Originador',
      sort: true,
      formatter: (cell) => getNameItem(cell, allUsers)
    }, {
      dataField: 'description',
      text: 'Descripción',
      formatter: (cell, row) => (
        <div>
          {parse(cell)}
        </div>
      ),
      classes: 'cell-description'
    }, {
      dataField: 'view',
      text: 'Ver',
      formatter: (cell, row) => (
        <center>
          <CButton
            color="info"
            className="btn-circle"
            onClick={() => history(`/viewVacancy/${row._id}`)}
          >
            <FontAwesomeIcon icon={faEye} />
          </CButton>
        </center>
      )
    }, {
      dataField: 'edit',
      text: 'Editar',
      formatter: (cell, row) => (
        <center>
          <CButton
            color="success"
            className="btn-circle"
            onClick={() => history(`/editVacancy/${row._id}`)}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </CButton>
        </center>
      )
    }, {
      dataField: 'delete',
      text: 'Eliminar',
      formatter: (cell, row) => (
        <center>
          <CButton
            color="danger"
            className="btn-circle"
            onClick={() => {
              setShowModalAction(true);
              setSelectVacancy(row._id);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </CButton>
        </center>
      )
    }
  ];

  if (loading || loading1 || loading2) {
    return <LoadingView />;
  };

  return (
    <>
      <ConfirmModal
        visible={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <ActionModal
        visible={showModalAction}
        handleClose={() => {
          setShowModalAction(false);
          setSelectVacancy(null);
        }}
        title={'Eliminar'}
        message={'¿Desea eliminar esta vacante?'}
        handleAction={() => {
          setShowModalAction(false);
          deleteVacancy(selectVacancy);
        }}
      />
      <CCol xs={12}>
        <h3>
          <FontAwesomeIcon icon={faBriefcase} className="me-1" />
          Vacantes
        </h3>
        <hr />
      </CCol>
      <CCol xs={12} className="text-end mb-3">
        <CButton
          href="/newVacancy"
        >
          <FontAwesomeIcon icon={faPlusCircle} className="me-1" />{' '}
          Nueva vacante
        </CButton>
      </CCol>
      <CCol xs={12}>
        {allVacancies.length > 0 
          ? (
            <CCard>
              <CCardBody>
                <div className="table-responsive-vacancies">
                  <BootstrapTable
                    keyField='_id'
                    data={ allVacancies }
                    columns={ columns }
                    pagination={paginationFactory()}
                    striped
                    condensed
                  />
                </div>
              </CCardBody>
            </CCard>
          )
          : <NoData title="Sin datos por mostrar" icon={faHandshakeSimpleSlash} />
        }
      </CCol>
    </>
  );
};
