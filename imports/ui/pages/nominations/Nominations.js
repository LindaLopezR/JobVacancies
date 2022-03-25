import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { CButton, CCol, CContainer, } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faEye, faUsersSlash, } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { useAllNominations, useAllVacancies, useAllUsers } from '/imports/startup/client/hooks';
import { 
  badgeStatus, getNameItem, getEmployeeNumber, dateFormatter 
} from '/imports/ui/pages/utils/formatters';

import NoData from '/imports/ui/components/noData/NoData';

export const Nominations = () => {

  const history = useNavigate();
  const { loading: loading1, allNominations } = useAllNominations();
  const { loading: loading2, allVacancies } = useAllVacancies();
  const { loading: loading3, allUsers } = useAllUsers();

  const columns = [
    {
      dataField: 'id',
      text: '# Empleado',
      sort: true,
      formatter: (cell, row) => getEmployeeNumber(row.candidate, allUsers)
    }, {
      dataField: 'candidate',
      text: 'Nombre',
      sort: true,
      formatter: (cell) => getNameItem(cell, allUsers)
    }, {
      dataField: 'vacancy',
      text: 'Vacante',
      sort: true,
      formatter: (cell) => getNameItem(cell, allVacancies)
    }, {
      dataField: 'date',
      text: 'Fecha',
      sort: true,
      formatter: dateFormatter
    }, {
      dataField: 'status',
      text: 'Estatus',
      sort: true,
      formatter: badgeStatus
    }, {
      dataField: 'view',
      text: 'Ver',
      formatter: (cell, row) => {
        return (
          <center>
            <CButton
              color="info"
              className="btn-circle"
              onClick={() => history(`/viewNomination/${row._id}`)}
            >
              <FontAwesomeIcon icon={faEye} />
            </CButton>
          </center>
        )
      }
    },
  ];

  if (loading1 || loading2 || loading3) {
    return <LoadingView />;
  };

  return (
    <>
      <CCol xs={12}>
        <h3>
          <FontAwesomeIcon icon={faAddressBook} className="me-1" />
          Postulaciones
        </h3>
        <hr />
      </CCol>
      <CCol xs={12}>
        {allNominations.length > 0
          ? (
            <div className="table-responsive-vacancies">
              <BootstrapTable
                keyField='_id'
                data={ allNominations }
                columns={ columns }
                pagination={paginationFactory()}
                striped
                condensed
              />
            </div>
          )
          : <NoData title="Sin datos por mostrar" icon={faUsersSlash} />
        }
      </CCol>
    </>
  );
};
