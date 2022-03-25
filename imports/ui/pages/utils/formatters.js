import React from 'react';
import { CBadge } from '@coreui/react';
import { default as momenttz } from 'moment-timezone';
import parse from 'html-react-parser';

const timezone = Meteor.settings.public.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

export const dateFormatter = (cell) => {
  if (!cell) return '--';
  return momenttz(cell).tz(timezone).format('ll')
};

export const orderCollection = (arrayCollection) => {
  return arrayCollection.sort(function (as, bs) {
    const rx = /(\d+)|(\D+)/g, rd = /\d+/;
    let a = as.name.toLowerCase().match(rx);
    let b = bs.name.toLowerCase().match(rx);
    while (a.length && b.length) {
      a1 = a.shift();
      b1 = b.shift();
      if (rd.test(a1) || rd.test(b1)) {
        if (!rd.test(a1)) return -1;
        if (!rd.test(b1)) return 1;
        if (a1 != b1) return (a1 - b1);
      } else if (a1 != b1) return ((a1 > b1) ? 1 : -1);
    }
    return a.length - b.length;
  })
}

export const getEmployeeNumber = (item, collection) => {
  const dataItem = collection.find(i => i._id == item);

  if (!dataItem) {
    return '--';
  }

  if (dataItem.profile) {
    return dataItem ? dataItem.profile.numberEmployee : '--';
  }
};

export const getNameItem = (item, collection) => {

  const dataItem = collection.find(i => i._id == item);

  if (!dataItem) {
    return '--';
  }

  if (dataItem.profile) {
    return dataItem ? dataItem.profile.name : '--';
  }

  return dataItem.name ? dataItem.name : '--';
};

export const colorStatus = (item) => {
  switch(item) {
    case 'PENDIENT':
      color = 'orange';
      break;
    case 'APPROVED':
      color = 'success';
      break;
    case 'CANCELLED':
      color = 'danger';
      break;
    default:
      color = 'secondary';
      break;
  }
  return color;
};

export function textStatus(cell) {
  let text = '';
  switch(cell) {
    case 'PENDIENT':
      text = 'PENDIENTE';
      break;
    case 'APPROVED':
      text = 'APROBADO';
      break;
    case 'CANCELLED':
      text = 'CANCELADO';
      break;
    default:
      text = '--';
      break;
  }
  return text;
}

export const badgeStatus = (cell) => {
  const variant = colorStatus(cell);
  return (
    <center>
      <CBadge shape="rounded-pill" color={variant}>
        {textStatus(cell)}
      </CBadge>
    </center>
  );
};

export const getMessages = (item, collection) => {
  const dataItem = collection && collection.find(i => i._id == item);

  if (!dataItem) {
    return '--';
  }
  return dataItem;
};

export const renderMessagesOptions = (collection) => {
  return collection.map((item, index) => {
    const dataMessage = parse(item.message);
    const message = dataMessage[0].props.children;
    const finalMessage = message.length > 60 ? message.substring(0, 60) + "..." : message;
    
    return (
      <option
        key={`item-${index}`}
        value={item._id}
        className="option-message"
      >
        {finalMessage}
      </option>
    )
  });
};
