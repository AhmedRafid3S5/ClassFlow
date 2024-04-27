const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;

// MySQL database configuration
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'admin1234',
  database: 'classflow'
});

// API endpoint to fetch upcoming events
app.get('/events', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM events_info');

    const upcomingEvents = rows.map(row => {
      const eventDate = new Date(row.event_date);
      const formattedDate = `${eventDate.getDate().toString().padStart(2, '0')}-${(eventDate.getMonth() + 1).toString().padStart(2, '0')}-${eventDate.getFullYear()}`;
      const time = `${formattedDate} ${row.Start_time} to ${row.End_time}`;
      const location = `AcB${row.Building} R:${row.Room}`;
      const info = `About: ${row.Event_info}`;
      return `${time}\n${location}\n${info}`;
    });

    return res.json(upcomingEvents);
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Default route
app.get('/', (req, res) => {
  return res.json("From backend server");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//No longer required
app.post('/addRequest', async (req, res) => {
  try {
    const { studentID,dept ,request } = req.body; // Assuming you're sending studentName and comment from frontend
    
    // Insert the data into the database
    const [result] = await pool.query('INSERT INTO student_requests (ID, Dept,Request) VALUES (?, ?,?)', [studentID, dept,request]);

    return res.status(201).json({ message: 'Request added successfully' });
  } catch (error) {
    console.error('Error adding request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Api endpoint to fectch all form link from from the database
app.get('/polls', async (req, res) => {
  try {
    const [polls] = await pool.query('SELECT * FROM polls');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Api endpoint to insert poll links into database


// Express.js endpoint in your server code
//something
// Node.js backend (using prepared statements)


app.post('/polls', async (req, res) => {
  try {
    const { title, link } = req.body;

    const query = 'INSERT INTO polls (title, link) VALUES (?, ?)';
    const values = [title, link];

    await pool.query(query, values);
    res.status(201).json({ message: 'Poll created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



