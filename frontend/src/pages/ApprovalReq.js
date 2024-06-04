import React from 'react';

function ApprovalRequests() {
  return (
    <div className="pane">
      <h2>Routine Update Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Sem</th>
            <th>Sec</th>
            <th>View Routine</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CSE</td>
            <td>5</td>
            <td>1</td>
            <td><button className='AdBut' >View</button></td>
          </tr>
          <tr>
            <td>EEE</td>
            <td>3</td>
            <td>B</td>
            <td><button className='AdBut'>View</button></td>
          </tr>
          <tr>
            <td>IPE</td>
            <td>7</td>
            <td>A</td>
            <td><button className='AdBut'>View</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ApprovalRequests;
