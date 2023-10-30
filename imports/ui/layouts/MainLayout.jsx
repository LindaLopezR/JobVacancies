import React, { useState } from 'react';
import { 
  CCol, CCollapse, CContainer, CNavbar, CNavbarBrand, CNavbarNav, 
  CNavbarToggler, CNavItem, CNavLink, CRow
} from '@coreui/react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faBriefcase, faCommentDots, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default MainLayout = props => {
  const [ visible, setVisible ] = useState(false);

  return (
    <>
      <Sidebar className="d-none d-md-block" />
      <div className="wrapper">
        <CNavbar expand="lg" colorScheme="light" className="bg-light">
          <CContainer fluid>
            <CNavbarBrand className="d-md-none">Job Vacancies</CNavbarBrand>
            <CNavbarToggler
              aria-label="Toggle navigation"
              aria-expanded={visible}
              onClick={() => setVisible(!visible)}
            />
            <CCollapse className="navbar-collapse justify-content-end" visible={visible}>
              <CNavbarNav>
                <CNavItem href="/" className="d-md-none">
                  <FontAwesomeIcon icon={faAddressBook} className="me-3" />
                  Postulaciones
                </CNavItem>
                <CNavItem href="/vacancies" className="d-md-none">
                  <FontAwesomeIcon icon={faBriefcase} className="me-3" />
                  Vacantes
                </CNavItem>
                <CNavItem href="/messages" className="d-md-none">
                  <FontAwesomeIcon icon={faCommentDots} className="me-3" />
                  Mensajes
                </CNavItem>
                <CNavItem>
                  <CNavLink href="/login" onClick={() => Meteor.logout()}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                    Salir
                  </CNavLink>
                </CNavItem>
              </CNavbarNav>
            </CCollapse>
          </CContainer>
        </CNavbar>
        <div className="container-body">
          <CContainer>
            <CRow>
              <Outlet />
            </CRow>
          </CContainer>
        </div>
      </div>
    </>
  );
};
