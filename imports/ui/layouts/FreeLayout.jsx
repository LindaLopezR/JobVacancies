import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default FreeLayout = props => {
  return (
    <div className="container-free">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <Outlet />
    </div>
  );
};
