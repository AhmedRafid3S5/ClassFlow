import React, { useEffect, useRef, useState } from 'react';
import TeacherRequests from './TeacherReq';
import ApprovalRequests from './ApprovalReq';
import BookingRequests from './BookingReq';
import './App.css';

function Admin() {

  useEffect(() => {
    // When the Student component mounts
    document.body.classList.add('admin-body');

    // Cleanup function when the component unmounts
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  return (
    <div className="app-container">
      <header className="dashboard-header">
        Admin Dashboard
      </header>
      <div className="panes-container">
        <TeacherRequests />
        <ApprovalRequests />
        <BookingRequests />
      </div>
    </div>
  );
}

export default Admin;