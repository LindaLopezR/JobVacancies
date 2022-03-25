import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';

import { Messages } from './pages/messages/Messages.js';
import { NewMessage } from './pages/messages/add/NewMessage.js';
import { NewVacancy } from './pages/vacancies/add/NewVacancy';
import { Nominations } from './pages/nominations/Nominations.js';
import { LogIn } from './pages/login/LogIn.js';
import { Vacancies } from './pages/vacancies/Vacancies.js';
import { ViewNomination } from './pages/nominations/view/ViewNomination.js';
import { ViewVacancy } from './pages/vacancies/view/ViewVacancy.js';

import { useAccount } from '/imports/startup/client/hooks';

import FreeLayout from './layouts/FreeLayout.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import NotFound from './pages/notFound/NotFound.js';

const RequireAuth = ({ children }) => {
  const { isLoggedIn, isLoggingIn } = useAccount();
  const location = useLocation();

  if (!isLoggingIn && !isLoggedIn) {
    return <Navigate to='/login' replace state={{ path: location.pathname }} />;
  }

  return children;
}

const ProtectedLogging = ({ children }) => {
  const { isLoggedIn } = useAccount();
  const location = useLocation();

  if (!isLoggedIn) {
    return children;
  }

  return <Navigate to='/' replace state={{ path: location.pathname }} />;
}

export const App = () => (
  <>
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={
            <RequireAuth>
              <Nominations />
            </RequireAuth>
          } />
          <Route path='/viewNomination/:id' element={
            <RequireAuth>
              <ViewNomination />
            </RequireAuth>
          } />
          <Route path='/vacancies' element={
            <RequireAuth>
              <Vacancies />
            </RequireAuth>
          } />
          <Route path='/newVacancy' element={
            <RequireAuth>
              <NewVacancy mode={'NEW'} />
            </RequireAuth>
          } />
          <Route path='/editVacancy/:id' element={
            <RequireAuth>
              <NewVacancy mode={'EDIT'} />
            </RequireAuth>
          } />
          <Route path='/viewVacancy/:id' element={
            <RequireAuth>
              <ViewVacancy />
            </RequireAuth>
          } />
          <Route path='/messages' element={
            <RequireAuth>
              <Messages />
            </RequireAuth>
          } />
          <Route path='/newMessage' element={
            <RequireAuth>
              <NewMessage mode={'NEW'} />
            </RequireAuth>
          } />
          <Route path='/editMessage/:id' element={
            <RequireAuth>
              <NewMessage mode={'EDIT'} />
            </RequireAuth>
          } />
        </Route>
        <Route element={<FreeLayout />}>
          <Route path='/login' element={
            <ProtectedLogging>
              <LogIn />
            </ProtectedLogging>
          } />
          <Route path='*' element={
            <ProtectedLogging>
              <NotFound />
            </ProtectedLogging>
          } />
        </Route>
      </Routes>
    </Router>
  </>
);
