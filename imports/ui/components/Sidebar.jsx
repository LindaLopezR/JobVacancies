import React from 'react';
import {
  CNavGroup, CNavItem, CSidebar, 
  CSidebarBrand, CSidebarNav, CSidebarToggler
} from '@coreui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faBriefcase, faCommentDots } from '@fortawesome/free-solid-svg-icons';


export default Sidebar = (props) => {
  return (
    <CSidebar
      position='fixed'
    >
      <CSidebarBrand>Job Vacancies</CSidebarBrand>
      <CSidebarNav>
        <CNavItem href="/">
          <FontAwesomeIcon icon={faAddressBook} className="me-3" />
          Postulaciones
        </CNavItem>
        <CNavItem href="/vacancies">
          <FontAwesomeIcon icon={faBriefcase} className="me-3" />
          Vacantes
        </CNavItem>
        <CNavItem href="/messages">
          <FontAwesomeIcon icon={faCommentDots} className="me-3" />
          Mensajes
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
}
