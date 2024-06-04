import React from "react";

function BookingRequests() {
  return (
    <div className="pane">
      <h2>Booking Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Dept</th>
            <th>ID</th>
            <th>Booking Request</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CSE</td>
            <td>210041149</td>
            <td>
              Algorithm Class for 2nd year students (Extra Class for covering
              syllabus)
            </td>
            <td >
              <button className='AdBut'>Approve</button>
              <button className='AdBut'>Decline</button>
            </td>
          </tr>
          <tr>
            <td>CSE</td>
            <td>210041219</td>
            <td>Room needed for CP class</td>
            <td >
              <button className='AdBut'>Approve</button>
              <button className='AdBut'>Decline</button>
            </td>
          </tr>
          <tr>
            <td>EEE</td>
            <td>210021304</td>
            <td>Room Needed for Circuit Workshop</td>
            <td>
              <button className='AdBut'>Approve</button>
              <button className='AdBut'>Decline</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BookingRequests;
