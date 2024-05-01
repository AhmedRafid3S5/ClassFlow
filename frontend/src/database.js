const mysql = require('mysql2');
const fs = require('fs');

// Create a connection pool
const pool = mysql.createPool({
  host: '127.0.0.1', //must change this url if needed
  port: '3306',
  user: 'root',
  password: '12345',
  database: 'classflow',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

 /*//Function to fetch events list from database and populate the array
function getEventsList(upcomingEvents, callback) {

  const pool = mysql.createPool({
    host: '127.0.0.1', //must change this url if needed
    port: '3306',
    user: 'root',
    password: 'admin1234',
    database: 'classflow',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
    // Execute query to fetch events from database
    pool.query('SELECT * FROM events_info', (error, results, fields) => {
      if (error) {
        console.error('Error executing query:', error);
        callback(error, null); // Pass error to callback
      } else {
        //console.log('Query results:', results);
        // Iterate over each row in the results and push to upcomingEvents array
        results.forEach(row => {
            const eventDate = new Date(row.event_date);
            const formatted_date = `${eventDate.getDate().toString().padStart(2, '0')}-${(eventDate.getMonth() + 1).toString().padStart(2, '0')}-${eventDate.getFullYear()}`;
            const time = `${formatted_date} ${row.Start_time} to ${row.End_time}`;
            const location = `AcB${row.Building} R:${row.Room}`;
            const info = `About: ${row.Event_info}`;

            const event = `${time}\n${location}\n${info}`;
         //console.log(event);
         upcomingEvents.push(event);
        });
        callback(null, upcomingEvents); // Pass populated array to callback
      }
    });
  }

  module.exports = {getEventsList};*/
  const upcomingEvents = [];

  pool.query('SELECT * FROM events_info', (error, results, fields) => {
      if (error) {
          console.error('Error executing query:', error);
          return;
      }
  
      // Iterate over each row in the results
      results.forEach(row => {
          // Construct the event information string
          const eventDate = new Date(row.event_date);
          const formatted_date = `${eventDate.getDate().toString().padStart(2, '0')}-${(eventDate.getMonth() + 1).toString().padStart(2, '0')}-${eventDate.getFullYear()}`;
          const time = `${formatted_date} ${row.Start_time} to ${row.End_time}`;
          const location = `AcB${row.Building} R:${row.Room}`;
          const info = `About: ${row.Event_info}`;
          const event = `${time}\n${location}\n${info}`;
  
          // Push the event into the upcomingEvents array
          upcomingEvents.push(event);
      });
  
      // After processing all events, write the data to a JSON file
      const path = 'events.json';
      writeData(upcomingEvents, path);
  });
  
  function writeData(data, path) {
      fs.writeFileSync(path, JSON.stringify(data, null, 4));
  }
  

  pool.query('INSERT INTO polls (title, link) VALUES (?, ?)',['hello','links']);