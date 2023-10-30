import React, { useEffect, useState } from 'react';
import { 
  CButton, CCard, CCardBody, CCol, CForm, CFormInput, 
  CFormLabel, CFormSelect, CRow,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';

import { useVacancyById } from '/imports/startup/client/hooks';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';

const MODES = {
  NEW: 'NEW',
  EDIT: 'EDIT'
};

const MODE_NAMES = {
  NEW: 'Nueva',
  EDIT: 'Editar'
};

export const NewVacancy = (props) => {

  const { mode } = props;
  const [ loading, setLoading ] = useState(false);

  let vaccineData = null;
  
  if (mode === MODES.EDIT) {
    const { id } = useParams();
    const data = useVacancyById(id);
    vaccineData = data.vacancy;
  }

  const history = useNavigate();
  const { handleSubmit } = useForm();
  const [ data, setData ] = useState({
    name: '',
    description: '',
    typeWork: '',
    typeSite: '',
    id: '',
    status: ''
  });
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  useEffect(() => {
    if (vaccineData) {
      const { description, name, typeSite, typeWork, id, status } = vaccineData;
      const vacancyEdit = { description, name, typeSite, typeWork, id, status };
      setData(vacancyEdit);
      setLoading(false);
    } else {
      setLoading(false);
    }
   }, [vaccineData]);

  const onSubmit = () => {
    if (!data.description) {
      setTitleModal('Error');
      setMessageModal('Ingresa una descripción de la vacante');
      return setShowModal(true);
    }

    setLoading(true);

    const callback = (error, result) => {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        history('/vacancies');
      };
    };

    if (mode === MODES.NEW) {
      Meteor.call('newVacancy', data, callback);
    } else if (mode === MODES.EDIT) {
      Meteor.call('editVacancy', vaccineData._id, data, callback);
    }
  };

  const updateData = (key, newValue) => {
    const newData = Object.assign({}, data);
    newData[key] = newValue;
    setData(newData);
  }

  if (loading) {
    return <LoadingView />;
  };

  const title = `${MODE_NAMES[mode]} vacante`;

  return (
    <>
      <ConfirmModal
        visible={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <TitleSection
        title={title}
        subtitle={null}
        icon={faBriefcase}
        back={false}
      />
      <CRow>
        <CCol xs={12}>
          <CForm onSubmit={ handleSubmit(onSubmit) }>
            <CRow>
              <CCol md={12}>
                <CCard>
                  <CCardBody>
                    <CRow>
                      <CCol xs={12}>
                        <p className="title-segment mb-0">
                          <small><FontAwesomeIcon icon={faBriefcase} /> Empleados</small>
                        </p>
                        <hr />
                      </CCol>
                      <CCol md={8} className="mb-3">
                        <CFormLabel htmlFor="name">Nombre del puesto</CFormLabel>
                        <CFormInput
                          type="text"
                          id="name"
                          value={data.name}
                          onChange={e => updateData('name', e.target.value)}
                          required
                        />
                      </CCol>
                      <CCol md={4} className="mb-3">
                        <CFormLabel htmlFor="name">ID</CFormLabel>
                        <CFormInput
                          type="text"
                          id="id"
                          value={data.id}
                          onChange={e => updateData('id', e.target.value)}
                          required
                        />
                      </CCol>
                      <CCol xs={12} className="mb-3">
                        <CFormLabel htmlFor="description">Descripción</CFormLabel>
                        <ReactQuill
                          theme="snow"
                          value={data.description}
                          onChange={data => updateData('description', data)}
                          placeholder={'Introduce una descripción de la vacante...'}
                        />
                      </CCol>
                      <CCol md={6} className="mb-3">
                        <CFormLabel htmlFor="typeWork">Tipo de trabajo</CFormLabel>
                        <CFormSelect 
                          aria-label="typeWork"
                          options={[
                            'Selecciona',
                            { label: 'Jornada completa', value: 1 },
                            { label: 'Media jornada', value: 2 },
                            { label: 'Contrato por obra', value: 3 },
                            { label: 'Temporal', value: 4 },
                            { label: 'Voluntario', value: 5 },
                            { label: 'Prácticas', value: 6 },
                          ]}
                          value={data.typeWork}
                          onChange={e => updateData('typeWork', e.target.value)}
                        />
                      </CCol>
                      <CCol md={6} className="mb-3">
                        <CFormLabel htmlFor="typeSite">Tipo de lugar de trabajo</CFormLabel>
                        <CFormSelect 
                          aria-label="typeSite"
                          options={[
                            'Selecciona',
                            { label: 'Presencial', value: 1 },
                            { label: 'Híbrido', value: 2 },
                            { label: 'Remoto', value: 3 },
                          ]}
                          value={data.typeSite}
                          onChange={e => updateData('typeSite', e.target.value)}
                        />
                      </CCol>
                      {mode === MODES.EDIT &&
                        <CCol md={6} className="mb-3">
                          <CFormLabel htmlFor="status">Estatus</CFormLabel>
                          <CFormSelect 
                            aria-label="status"
                            options={[
                              'Selecciona',
                              { label: 'Activo', value: 'ACTIVE' },
                              { label: 'Desactivado', value: 'INACTIVE' },
                            ]}
                            value={data.status}
                            onChange={e => updateData('status', e.target.value)}
                          />
                        </CCol>
                      }
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <hr />
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton color="secondary" variant="outline" onClick={() => history('/vacancies')}>
                Cancelar
              </CButton>
              <CButton type="submit">
                Guardar
              </CButton>
            </div>
          </CForm>
        </CCol>
      </CRow>
    </>
  );
};
