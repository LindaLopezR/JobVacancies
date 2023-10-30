import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { CButton, CCard, CCardBody, CCol } from '@coreui/react';
import { faCommentDots, faCommentSlash, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';

import { useAllMessages } from '/imports/startup/client/hooks';

import NoData from '/imports/ui/components/noData/NoData';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import ActionModal from '/imports/ui/components/modals/ActionModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export const Messages = () => {

  const history = useNavigate();
  const [ loading, setLoading ] = useState(false);
  const { loading: loading1, allMessages } = useAllMessages();
  const [ showModal, setShowModal ] = useState(false);
  const [ showModalAction, setShowModalAction ] = useState(false);
  const [ selectMessage, setSelectMessage ] = useState(null);

  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const deleteMessage = (messageId) => {

    setLoading(true);

    Meteor.call('deleteMessage', messageId, function(error, result) {
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
      dataField: 'label',
      text: 'Mensaje',
      classes: 'cell-label-message',
      formatter: (cell, row) => (
        <div>{cell}</div>
      ),
      headerStyle: () => {
        return { width: '45%' };
      }
    }, {
      dataField: 'edit',
      text: 'Editar',
      formatter: (cell, row) => (
        <center>
          <CButton
            color="success"
            className="btn-circle"
            onClick={() => history(`/editMessage/${row._id}`)}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </CButton>
        </center>
      ),
      headerStyle: () => {
        return { width: '20%' };
      }
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
              setSelectMessage(row._id);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </CButton>
        </center>
      ),
      headerStyle: () => {
        return { width: '20%' };
      }
    }
  ];

  const expandRow = {
    renderer: row => {
      const dataMessage = row.message;
      return (
        <div>
          {dataMessage && parse(dataMessage)}
        </div>
      )
    },
    showExpandColumn: true,
    expandByColumnOnly: true,
    onlyOneExpanding: true,
  };

  if (loading || loading1) {
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
          setSelectMessage(null);
        }}
        title='Eliminar'
        message='¿Desea eliminar este mensaje?'
        handleAction={() => {
          setShowModalAction(false);
          deleteMessage(selectMessage);
        }}
      />
      <TitleSection
        title='Mensajes'
        subtitle={null}
        icon={faCommentDots}
        back={false}
      />
      <CCol xs={12} className="text-end mb-3">
        <CButton
          color="primary"
          href="/newMessage"
        >
          Nuevo mensaje
        </CButton>
      </CCol>
      <CCol xs={12}>
        {allMessages.length > 0 
          ? (
            <CCard>
              <CCardBody>
                <BootstrapTable
                  keyField='_id'
                  data={ allMessages }
                  columns={ columns }
                  expandRow={ expandRow }
                  pagination={paginationFactory()}
                  bootstrap4
                  striped
                  condensed
                />
              </CCardBody>
            </CCard>
          )
          : <NoData title="Sin datos por mostrar" icon={faCommentSlash} />
        }
      </CCol>
    </>
  );
};
