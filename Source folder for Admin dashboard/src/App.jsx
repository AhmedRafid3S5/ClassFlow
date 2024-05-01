import React from 'react';
import TeacherRequests from './TeacherReq';
import ApprovalRequests from './ApprovalReq';
import BookingRequests from './BookingReq';
import './App.css';

function App() {
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

export default App;