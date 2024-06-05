import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const slots = ["8:00AM-9:15AM", "9:15AM-10:30AM", "10:30AM-11:45AM", "11:45AM-1:00PM", "2:30PM-3:45PM", "3:45PM-5:00PM"];
const timetable = require('../evolutionary-timetable-scheduling-master/processedTimetable.json');



const Teacher = () => {

  const [routineChangeRequest, setRoutineChangeRequest] = useState('');
  const [notification, setNotification] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');
  

  function classInfo(timetable, idx) {
    const info = [];
    if (timetable[idx]) {
        for (let i = 0; i < timetable[idx].length; i++) {
            if(timetable[idx][i].Professor === loggedInUser){
            const str = `${timetable[idx][i].Subject} ${timetable[idx][i].Assigned_classroom} ${timetable[idx][i].Group[0]}${timetable[idx][i].Length === '1' ? "\n" : "(2.5Hr)\n"}`;
            info.push(str);
            }
        }
    }
    return info.join(''); // Join the array into a string
}

  const handleRoutineChangeRequest = () => {
    // Send the routine change request to the backend
    axios.post('http://localhost:3000/teacher-request', { name: loggedInUser, request: routineChangeRequest })
      .then(response => {
        console.log('Routine change request sent successfully');
        alert('Request stored successfully!');
      })
      .catch(error => {
        console.error('Error sending routine change request:', error);
       alert('Failed to store request. Please try again later.');
      });
  };

  useEffect(() => {
    // Fetch the login data to get the username
    const fetchLoginData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/loginData');
        setLoggedInUser(response.data.username);
      } catch (error) {
        console.error('Error fetching login data:', error);
      }
    };

    fetchLoginData();
  }, []);



  return (
    <div className="teacher-page">
      <h1>Welcome, {loggedInUser}!</h1>
      <h2>Your Timetable</h2>
      <table id="timetable" className='timetable'>
        <thead>
          <tr>
            <th>Day</th>
            {slots.map((slot, index) => (
              <th key={index}>{slot}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, idx) => (
            <tr key={idx}>
              <td>{day}</td>
              {slots.map((slot, index) => (
                <td key={index}>{classInfo(timetable, idx * slots.length + index)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Routine Change Request</h2>
        <input
          type="text"
          value={routineChangeRequest}
          onChange={(e) => setRoutineChangeRequest(e.target.value)}
          placeholder="Enter your routine change request"
        />
        <button onClick={handleRoutineChangeRequest}>Submit</button>
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
}

export default Teacher;