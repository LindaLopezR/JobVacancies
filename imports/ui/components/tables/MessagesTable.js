import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { faUsers, } from '@fortawesome/free-solid-svg-icons';
import parse from 'html-react-parser';

import { dateFormatter, getMessages } from '/imports/ui/pages/utils/formatters';

export default MessagesTable = props => {
  const { allMessages, data, showCandidate } = props;
  const [ orderData, setOrderData ] = useState([]);

  useEffect(() => {
    if (data) {
      data.map((i, index) => {
        i.index = `intem-${index}`;
        return i;
      });
      data.sort((a, b) => b.date - a.date);
      setOrderData(data);
    }
  }, [ data ]);

  const columnsHistory = [
    {
      dataField: 'date',
      text: 'Fecha',
      sort: true,
      formatter: dateFormatter,
      headerStyle: () => {
        return { width: '30%' };
      }
    }, {
      dataField: 'message',
      text: 'Mensaje',
      sort: true,
      classes: 'cell-label-message',
      formatter: (cell, row) => {
        if (!cell) {
          return '--';
        }
        const dataMessage = getMessages(cell, allMessages);
        return (
          <div>
            {dataMessage && dataMessage.label
              ? dataMessage.label
              : '--'
            }
          </div>
        )
      },
      headerStyle: () => {
        return { width: '45%' };
      }
    },
  ];

  if (showCandidate) {
    columnsHistory.splice(1, 0, {
      dataField: 'username',
      text: 'Candidato',
      sort: true,
      formatter: (cell) => cell ? cell : '--',
      headerStyle: () => {
        return { width: '20%' };
      }
    });
  }

  const expandRow = {
    renderer: row => {
      const dataMessage = getMessages(row.message, allMessages);
      return (
        <div>
          {dataMessage && parse(dataMessage.message)}
        </div>
      )
    },
    showExpandColumn: true,
    expandByColumnOnly: true,
    onlyOneExpanding: true,
  };

  return (
    <>
      {orderData.length > 0 
        ? (
          <div className="table-responsive-vacancies">
            <BootstrapTable
              keyField='index'
              data={ orderData }
              columns={ columnsHistory }
              expandRow={ expandRow }
              pagination={paginationFactory()}
              striped
              condensed
            />
          </div>
        )
        : <NoData title="Sin datos por mostrar" icon={faUsers} />
      }
    </>
  );
};
