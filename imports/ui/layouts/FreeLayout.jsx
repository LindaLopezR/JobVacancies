import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default FreeLayout = props => {
  return (
    <div className="container-free">
      <div class="bg"></div>
      <div class="bg bg2"></div>
      <div class="bg bg3"></div>
      <Outlet />
    </div>
  );
};
