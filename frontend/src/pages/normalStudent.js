//import logo from './logo.svg';
import '../studentDash.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

//const mysql = require('mysql2');
const timetable = require('../evolutionary-timetable-scheduling-master/processedTimetable.json');
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const slots = ["8:00AM-9:15AM", "9:15AM-10:30AM", "10:30AM-11:45AM", "11:45AM-1:00PM", "2:30PM-3:45PM", "3:45PM-5:00PM"];
//const {getEventsList} = require('./database');


function classInfo(timetable, idx) {
  var info = [];
  for (var i = 0; i < timetable[idx].length; i++) {
    var str = timetable[idx][i].Subject + " " + timetable[idx][i].Assigned_classroom + " " + timetable[idx][i].Group[0] + (timetable[idx][i].Length === '1' ? "\n" : "(2.5Hr)"+"\n");
    info.push(str);
  }
  return info;
}




//----------------------------------------------------------------------------------------------------------------------------------------------------





function NormalStudent() {
  const sectionRoutineRef = useRef(null);
  const sectionEventsRef = useRef(null);
  const separatorRef = useRef(null);

  useEffect(() => {
    // When the Student component mounts
    document.body.classList.add('student-body');

    // Cleanup function when the component unmounts
    return () => {
      document.body.classList.remove('student-body');
    };
  }, []);

  useEffect(() => {
    if (sectionRoutineRef.current && sectionEventsRef.current && separatorRef.current) {
      const routineHeight = sectionRoutineRef.current.offsetHeight;
      const eventsHeight = sectionEventsRef.current.offsetHeight;
      const maxHeight = Math.max(routineHeight*2, eventsHeight);

      // Set the height of the separator to match the taller section
      separatorRef.current.style.height = `${maxHeight}px`;
    }
  }, []);

  const [data, setData] = useState([]);

  useEffect(() => {
    // Make API request to fetch data
    axios.get('http://localhost:3000/events')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const studentID = 'John Doe'; // Example: Get studentName from input field
    const dept = 'CSE'; // Example: Get comment from input field
    const request = 'Please change my routine'
  
    try {
      const response = await axios.post('http://localhost:3000/addRequest', { studentID, dept,request });
      console.log(response.data); // Log success message from backend
    } catch (error) {
      console.error('Error adding request:', error.response.data);
    }
  };

  function openGoogleForms() {
    alert('Please copy the form link then submit here');
    window.open('https://docs.google.com/forms/u/0/', '_blank');
   
  }

  //Fetch & render polls button 
 
    const [polls, setPolls] = useState([]);
  
  
    useEffect(() => {
      const fetchPolls = async () => {
        try {
          const response = await axios.get('http://localhost:3000/polls');
          setPolls(response.data);
        } catch (error) {
          console.error('Error fetching polls:', error);
        }
      };
  
      fetchPolls();
    }, []);

    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
  
    const handlePollSubmit =  (event) => {
      event.preventDefault();
      const title = event.target.title.value;
      const link = event.target.url.value;
      // Validate input if necessary
      if (!title || !link) {
        alert('Please set in both fields.');
        return;
      }
  
      try {
        // Send a POST request to the backend API endpoint
        const response = axios.post('http://localhost:3000/polls', { title, link });
        console.log(response.data);
        alert('Poll created successfully!');
  
        // Clear form fields
        setTitle('');
        setLink('');
      } catch (error) {
        console.error('Error creating poll:', error);
        alert('Error creating poll.'+title+link);
      }
    };

   

  return (
    <div className="Student">
     <h1 className="StudentDashboard">Student Dashboard</h1>
      <div>
        <select id="semester">
          {/* Options for semester dropdown */}
          <option value="">Select Semester</option>
          <option value="">Semester 1</option>
          <option value="">Semester 2</option>
          <option value="">Semester 3</option>
          <option value="">Semester 4</option>
          <option value="">Semester 5</option>
          <option value="">Semester 6</option>
          <option value="">Semester 7</option>
          <option value="">Semester 8</option>
          {/* Populate options dynamically based on available semesters */}
        </select>
        <select id="department">
          {/* Options for department dropdown */}
          <option value="">Select Department</option>
          <option value="">CSE</option>
          <option value="">SWE</option>
          <option value="">MPE</option>
          <option value="">IPE</option>
          <option value="">EEE</option>
          <option value="">CEE</option>
          <option value="">BTM</option>
          <option value="">TVE</option>
          {/* Populate options dynamically based on available departments */}
        </select>
      </div>

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

      <div className="section-container">
        <div className="sectionPolls" ref={sectionRoutineRef}>
          <h2>Student Polls</h2>
          {/*openGoogleForms only for CRS*/}
        <div> 
          <ol>
          {polls.map((poll) => (
            <li>
        <button key={poll.poll_id} onClick={() => window.open(poll.link, '_blank')}>
          {poll.title}
        </button>
        </li>
      ))}
      </ol>
      </div>
         
        </div>

        <div className="separator" ref={separatorRef}></div>

        <div className="sectionEvents" ref={sectionEventsRef}>
          <h2>Upcoming events !!</h2>
          <ol>
            {data.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default NormalStudent;
