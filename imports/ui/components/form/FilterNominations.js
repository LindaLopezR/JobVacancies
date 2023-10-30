import React, { useEffect, useState } from 'react';
import {
  CButton, CCard, CCardBody, CCol, CCollapse, CForm, CFormInput, CFormLabel, CRow 
} from '@coreui/react';
import DatePicker from 'react-datepicker';

import { 
  orderCollection, renderOptions 
} 
from '/imports/ui/pages/utils/formatters';

export default FilterNominations = (props) => {

  const { filters, users, handleFilter = () => {}, vacancies } = props;
  const [ startDate, setStartDate ] = useState();
  const [ finishDate, setFinishDate ] = useState();
  const [ employee, setEmployee ] = useState('');
  const [ candidate, setCandidate ] = useState('');
  const [ vacancy, setVacancy ] = useState('');
  const [ open, setOpen ] = useState(false);

  useEffect(() => {
    if (filters) {
      setStartDate(filters.startDate);
      setFinishDate(filters.finishDate);
      setVacancy(filters.vacancy);
      setCandidate(filters.candidate);
      setEmployee(filters.employee);
    }
  }, []);

  const onSubmit = () => {
    const filters = {
      startDate,
      finishDate,
      employee,
      candidate,
      vacancy,
    };

    return handleFilter(filters);
  }

  let finalUsers = users.map(item => {
    item.name = `${item.profile.name} ${item.profile.lastName}`;
    return item;
  });

  finalUsers = orderCollection(finalUsers);

  return (
    <>
      <CButton
        onClick={() => setOpen(!open)}
      >
        {open ? 'Ocultar' : 'Mostrar'}{' '}
        filtros
      </CButton>
      <CCollapse visible={open}>
        <CForm id="collapse">
          <CCard>
            <CCardBody>
              <CRow>
                <CCol xs={6} md={4}>
                  <CFormLabel>Empieza</CFormLabel>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    className="form-select input-calendar"
                    onChange={(date) => setStartDate(date)}
                    selected={startDate}
                  />
                  {startDate && <CButton
                    color="info"
                    className="mt-1"
                    onClick={() => setStartDate(null)}
                    size="sm"
                  >
                    Limpiar
                  </CButton>}
                </CCol>
                <CCol xs={6} md={4}>
                  <CFormLabel>Termina</CFormLabel>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    className="form-select input-calendar"
                    onChange={(date) => setFinishDate(date)}
                    selected={finishDate}
                  />
                  {finishDate && <CButton
                    color="info"
                    className="mt-1"
                    onClick={() => setFinishDate(null)}
                    size="sm"
                  >
                    Limpiar
                  </CButton>}
                </CCol>
                <CCol md={4} className="mt-3 mt-md-0">
                  <CFormLabel>Vacantes</CFormLabel>
                  <select
                    className="form-select"
                    value={vacancy}
                    onChange={(e) => setVacancy(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    {renderOptions(vacancies)}
                  </select>
                </CCol>
                <CCol md={6} className="mt-3">
                  <CFormLabel>Candidato</CFormLabel>
                  <select
                    className="form-select"
                    value={candidate}
                    onChange={(e) => setCandidate(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    {renderOptions(finalUsers)}
                  </select>
                </CCol>
                <CCol md={6} className="mt-3">
                  <CFormLabel>Número de empleado</CFormLabel>
                  <CFormInput
                    type="number"
                    value={employee}
                    placeholder="# Empleado"
                    onChange={(e) => setEmployee(e.target.value)}
                  />
                </CCol>

                <CCol xs={12} className="text-end mt-3">
                  <CButton color="success" onClick={() => onSubmit()}>
                    Filtrar
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CForm>
      </CCollapse>
    </>
  );
};
