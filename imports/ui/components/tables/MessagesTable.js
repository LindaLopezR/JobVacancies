import React, { useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { faUsers, } from '@fortawesome/free-solid-svg-icons';
import parse from 'html-react-parser';

import { dateFormatter, getMessages } from '/imports/ui/pages/utils/formatters';

export default MessagesTable = props => {
  const { allMessages, data } = props;

  useEffect(() => {
    if (data) {
      data.map((i, index) => {
        i.index = `intem-${index}`;
        return i;
      })
    }

  }, [ data ]);

  const columnsHistory = [
    {
      dataField: 'date',
      text: 'Fecha',
      sort: true,
      formatter: dateFormatter
    }, {
      dataField: 'message',
      text: 'Mensaje',
      sort: true,
      formatter: (cell, row) => {
        if (!cell) {
          return '--';
        }
        const dataMessage = getMessages(cell, allMessages);
        return (
          <div>
            {dataMessage  
              ? parse(dataMessage .message)
              : '--'
            }
          </div>
        )
      },
      classes: 'cell-message'
    },
  ];

  return (
    <>
      {data.length > 0 
        ? (
          <div className="table-responsive-vacancies">
            <BootstrapTable
              keyField='index'
              data={ data }
              columns={ columnsHistory }
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
