import React from 'react';

function StudentRequests() {
  return (
    <div className="pane">
      <h2>Teacher Requests</h2>
      {/* Simulate some data with longer lines */}
      <ul>
        <li className="list-item">Request for cancellation of class due to unforeseen circumstances.</li>
        <li className="list-item">Need special permission for accessing the lab after hours for critical project work.</li>
        <li className="list-item">Request for additional library resources on machine learning and data analytics for upcoming thesis.</li>
      </ul>
    </div>
  );
}

export default StudentRequests;
