import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { CButton, CCard, CCardBody, CCol } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faEye, faUsersSlash, } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { useAllVacancies, useAllEmployees } from '/imports/startup/client/hooks';
import { 
  callbackError, badgeStatus, getNameItem, getEmployeeNumber, dateFormatter 
} from '/imports/ui/pages/utils/formatters';

import NoData from '/imports/ui/components/noData/NoData';
import FilterNominations from '/imports/ui/components/form/FilterNominations';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const DEFAULT_FILTERS =  {
  startDate: null,
  finishDate: null,
  vacancy: '',
  candidate: '',
  employee: ''
};

export const Nominations = () => {

  const history = useNavigate();
  const [ loading, setLoading ] = useState(false);
  const [ nominations, setNominations ] = useState([]);
  const [ filters, setFilters ] = useState(DEFAULT_FILTERS);

  const { loading: loading1, allVacancies } = useAllVacancies();
  const { loading: loading2, allEmployees } = useAllEmployees();

  const onSubmit = () => {
    setLoading(true);

    if (filters.startDate && filters.finishDate) {
      const start = new Date(filters.startDate).getTime();
      const finish = new Date(filters.finishDate).getTime();
      if (start > finish) {
        setLoading(false);
        return alert('Error, La fecha de finalización debe ser mayor que la fecha de inicio');
      }
    }

    Meteor.call('getNominations', filters, function(error, result) {
      setLoading(false);
      if (error) callbackError(error);

      if (result) {
        setNominations(result);
      }
    });
  };

  useEffect(() => {
    onSubmit();
  }, [filters]);

  const columns = [
    {
      dataField: 'id',
      text: '# Empleado',
      sort: true,
      formatter: (cell, row) => getEmployeeNumber(row.candidate, allEmployees)
    }, {
      dataField: 'candidate',
      text: 'Nombre',
      sort: true,
      formatter: (cell) => getNameItem(cell, allEmployees)
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
    },
    // {
    //   dataField: 'status',
    //   text: 'Estatus',
    //   sort: true,
    //   formatter: badgeStatus
    // },
    {
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

  if (loading || loading1 || loading2) {
    return <LoadingView />;
  };

  return (
    <>
      <TitleSection
        title='Postulaciones'
        subtitle={null}
        icon={faAddressBook}
        back={false}
      />
      <CCol xs={12} className="mb-3">
        <FilterNominations
          users={allEmployees}
          filters={filters}
          vacancies={allVacancies}
          handleFilter={(filters) => setFilters(filters)}
        />
      </CCol>
      <CCol xs={12}>
        {nominations.length > 0
          ? (
            <CCard>
              <CCardBody>
                <div className="table-responsive-vacancies">
                  <BootstrapTable
                    keyField='_id'
                    data={ nominations }
                    columns={ columns }
                    pagination={paginationFactory()}
                    striped
                    condensed
                  />
                </div>
              </CCardBody>
            </CCard>
          )
          : <NoData title="Sin datos por mostrar" icon={faUsersSlash} />
        }
      </CCol>
    </>
  );
};
