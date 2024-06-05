const express = require('express');

const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs').promises;
const util = require('util');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;

// MySQL database configuration
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'admin1234',
  database: 'classflow'
});


// Paths to JSON files
//const infoFilePath = "my-app\\src\\evolutionary-timetable-scheduling-master\\classes\\Info_CSE.json"
const outputFilePath = "my-app\\src\\evolutionary-timetable-scheduling-master\\classes\\input0.json"

const filePath = 'backend-api\Info_CSE.json'; // Replace with relative path



// POST API to send output0.json
app.post('/output', async (req, res) => {
    fs.readFile(outputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).json({ error: 'Failed to read file' });
        }
        return res.json(JSON.parse(data));
    });
});


/*app.post('/save-class-data', (req, res) => {
  const data = req.body; // This is your JSON data from the client side

  // Write the JSON data to the specified file path
  fs.writeFile(outputFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
          console.error('Failed to write to file', err);
          return res.status(500).json({ error: 'Failed to save data' });
      }
      res.status(200).json({ message: 'Data saved successfully' });
  });
});*/

// API endpoint to save class data
app.post('/saveClassData', async (req, res) => {
  try {
    const { Classrooms, Classes } = req.body;

    const insertClassQuery = 'INSERT INTO classes (Subject, Type, Professor, GroupSection, Classroom, Length) VALUES ?';
    const classValues = Classes.map(cls => [cls.Subject, cls.Type, cls.Professor, cls.Group.join(','), cls.Classroom, cls.Length]);

    await pool.query(insertClassQuery, [classValues]);
    res.status(201).json({ message: 'Class data saved successfully' });

   
  }
   catch (error) {
    console.error('Error saving class data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

   //Create input file here............
   createInput(req,res);
   deleteRecords();
});

// API to run console.js child process which executes the algorithm and generates a processed timetable
const { spawn } = require('child_process');


  // Classrooms object to be passed to the function
const classrooms = {
  "a": ["Atelje"],
  "k": ["Kolarac"],
  "n": ["B2-L01","B2-L02","B2-L03","B2-L04","B2-L05"],
  "r": ["B2-301","B2-302","B2-303","B2-304","B2-305","B2-306","B2-310","B2-507","B2-508","B2-510","B3-106","B3-107","B3-105"],
  "s": ["Studio"]
};

const writeFile = util.promisify(fs.writeFile);


async function createInput(req, res) {
  try {
    const query = 'SELECT * FROM classes';
    const [results] = await pool.query(query);

    // Process the results to create the Classes array
    const classes = results.map(row => ({
      Subject: row.Subject,
      Type: row.Type,
      Professor: row.Professor,
      Group: row.GroupSection ? row.GroupSection.split(',') : [],
      Classroom: row.Classroom,
      Length: row.Length
    }));

    // Create the final JSON object
    const output = {
      Classrooms: classrooms,
      Classes: classes
    };


    
     // Define the file path
     const inputfilePath = 'C:\\Users\\Rafid\\Documents\\GitHub\\ClassFlow\\frontend\\src\\evolutionary-timetable-scheduling-master\\classes\\input0.json';

     // Write the JSON object to the file
     try {
       // Convert data to JSON string with indentation
       const jsonData = JSON.stringify(output, null, 4);
 
       // Write JSON string to file, overwriting if it already exists
       await writeFile(inputfilePath, jsonData);
       console.log('Data written successfully to', inputfilePath);
       console.log('JSON file created successfully');
     } catch (error) {
       // Log an error message if something goes wrong during the file write
       console.error('Failed to write data to', inputfilePath, ':', error);
       res.status(500).send('Error writing to file');
       return;
     }
  
  } catch (err) {
    console.error('Error:', err);
   
  }
  
}

async function deleteRecords() {
  try {
    // Delete all data from the classes table
    const deleteQuery = 'DELETE FROM classes';
    const [deleteResults] = await pool.query(deleteQuery);
    console.log('Delete query result:', deleteResults);

    // If deletion is successful
    if (deleteResults.affectedRows > 0) {
      console.log('All data deleted from classes table');
      
    } else {
      console.log('No data deleted from classes table');
     
    }
  } catch (err) {
    console.error('Error deleting data from table:', err);
   
  }
}


app.post('/run-script', (req, res) => {
  const {exec } = require('child_process')

    // use relative path but make sure to use double back slash since a single slash is considered an escape literal
const pythonScriptPath = "..\\frontend\\src\\evolutionary-timetable-scheduling-master\\algorithm.py";


//Execute the python script, will wrap it inside a conditional statement when implementing so when a generate button is pressed, this algorithm is 
//executed



const childProcess = exec(`python ${pythonScriptPath}`, (error,stdout,stderr) => {
    if(error){
      console.log(`Error: ${error.message}`)
      return
    }

    if(stderr){
      console.log(`Python script stderr: ${stderr}`)
      return
    }

    console.log(`Python script console log: ${stdout}`)
})

childProcess.on('error', (error) => {
    console.error(`Error executing script : ${error.message}`)
})


//A rudimentary routine format
console.log("          0/6/12/18/24 | 1/7/13/19/25 | 2/8/14/20/26  | 3/9/15/21/27 |           | 4/10/16/22/28 | 5/11/17/23/29")
console.log("          --------------------------------------------------------------------------------------------------------")
console.log("          8 - 9:15     | 9-15 - 10:30 | 10:30 - 11:15 | 11:15 - 1:00 |## Lunch ##| 2:30 - 3:45   | 3:45 - 5     |")
console.log("          --------------------------------------------------------------------------------------------------------")
const fs = require('fs');
const samplePath = '../frontend/src/evolutionary-timetable-scheduling-master/classes/output0.json';
const sample = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
//console.log(sample);

let timetable = [[],[],[],[],[],[],[],[],[],[],
                 [],[],[],[],[],[],[],[],[],[],
                 [],[],[],[],[],[],[],[],[],[]];

for( i = 0; i<sample.length;i++)
{
    const assignedTime = sample[i].Assigned_time;
    if (!timetable[assignedTime]) {
        // If not, create a new array for this assigned time
        timetable[assignedTime] = [];
    }
   timetable[sample[i].Assigned_time].push(sample[i]); 
}




// Initialize an array to store the names of days
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Iterate over each time slot for each day
for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
    const day = days[dayIndex];
    let dayTimetable = timetable.slice(dayIndex * 6, (dayIndex + 1) * 6);

    // Print the name of the day
    process.stdout.write(day + " : ");

    // Iterate over each time slot for the current day
    dayTimetable.forEach((timeSlot, index) => {

        // Print the details of each class in the time slot
        if(timeSlot.length == 0)
        {
            process.stdout.write("______________");
        }
        else{
        timeSlot.forEach((classDetails, classIndex) => {
            
            process.stdout.write(`${classDetails.Subject},${classDetails.Group},${classDetails.Assigned_time} ,`);
            if (classIndex == timeSlot.length - 1) {
                process.stdout.write(" | "); // Separate classes within the same time slot
            }
        });
        if (index < dayTimetable.length - 1) {
            process.stdout.write(" | "); // Separate time slots within the same day
        }
    }
    
    });
    console.log(); // Move to the next line for the next day

}
// Iterate over each time slot for each day



function writeData(data, path) {
    try {
        // Convert data to JSON string with indentation
        const jsonData = JSON.stringify(data, null, 4);

        // Write JSON string to file, overwriting if it already exists
        fs.writeFileSync(path, jsonData);
        console.log('Data written successfully to', path);
    } catch (error) {
        // Log an error message if something goes wrong during the file write
        console.error('Failed to write data to', path, ':', error);
    }
}


const data = timetable;
// use relative path but make sure to use double back slash since a single slash is considered an escape literal
const path = 'my-app\\src\\evolutionary-timetable-scheduling-master\\processedTimetable.json';
const frontendPath = '..\\frontend\\src\\evolutionary-timetable-scheduling-master\\processedTimetable.json';
writeData(data,frontendPath);
        // Send success response
        res.status(200).send('Script executed successfully.');
   

    childProcess.on('error', (error) => {
        console.error(`Error executing script : ${error.message}`);
        res.status(500).send(`Error executing script: ${error.message}`);
    });
});




app.post('/save-occupancy', async (req, res) => {
  const fs = require('fs');
  const inputfilePath = 'C:\\Users\\Rafid\\Documents\\GitHub\\ClassFlow\\frontend\\src\\evolutionary-timetable-scheduling-master\\classes\\occupancy.json';
  const samplePath = '../frontend/src/evolutionary-timetable-scheduling-master/classes/occupancy.json';
  const occupancyData = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
  try {
    // Read the existing JSON file
   
    

    // Update only the Professors object
    occupancyData.Professors = req.body.Professors;

    // Convert data to JSON string with indentation
    const jsonData = JSON.stringify(occupancyData, null, 4);

    // Write JSON string to file, overwriting if it already exists
    await writeFile(inputfilePath, jsonData);
    console.log('Data written successfully to', inputfilePath);
    console.log('JSON file created successfully');
    res.status(200).send('Occupancy saved successfully');
  } catch (error) {
    // Log an error message if something goes wrong during the file write
    console.error('Failed to write data to',inputfilePath, ':', error);
    res.status(500).send('Error writing to file');
  }
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


app.get('/infoCSE', async (req, res) => {
  try {
    data = require('../frontend/src/evolutionary-timetable-scheduling-master/classes/Info_CSE.json')
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const query = 'SELECT id, username, role, department, batch FROM users WHERE username = ? AND password = ?';  //SELECT * FROM users WHERE username = ? AND password = ?
    const [results] = await pool.query(query, [username, password]);

    if (results.length > 0) {
      res.json({ 
        message: "Login successful",
        user: results[0] //added 
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error('Error executing login query:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



