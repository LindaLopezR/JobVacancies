import React from 'react';

export const getTypeWork = (item) => {
  let type = '';

  switch(parseInt(item)) {
    case 1:
      type = 'Jornada completa';
      break;
    case 2:
      type = 'Media jornada';
      break;
    case 3:
      type = 'Contrato por obra';
      break;
    case 4:
      type = 'Temporal';
      break;
    case 5:
      type = 'Voluntario';
      break;
    case 6:
      type = 'Prácticas';
      break;
    default:
      type = '--';
      break;
  }
  return type;
};

export const getTypeSite = (item) => {
  let type = '';

  switch(parseInt(item)) {
    case 1:
      type = 'Presencial';
      break;
    case 2:
      type = 'Híbrido';
      break;
    case 3:
      type = 'Remoto';
      break;
    default:
      type = '--';
      break;
  }
  return type;
};
