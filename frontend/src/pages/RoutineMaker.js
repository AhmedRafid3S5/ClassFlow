//Routine maker can manipulate the occupancy list --> TO Do later
//Routine maker can add classes to the input file
//Routine maker can generate a timetable as an output file


//1st figure out how to create an input file.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './routineMakerStyles.css';
import TeacherAvailability from './TeacherAvailability';

function RoutineMaker() {

   //for creating a color background
   useEffect(() => {
    // When the Student component mounts
    document.body.classList.add('routineMaker-body');

    // Cleanup function when the component unmounts
    return () => {
      document.body.classList.remove('routineMaker-body');
    };
  }, []);
    const [data, setData] = useState({
        classrooms: {},
        semesters: [],
        professors: [],
        groups: [],
        types: ['L', 'P'], // Assuming these are constant
        subjects: [],
    });

    const [selectedSemester, setSelectedSemester] = useState('');
    const [formData, setFormData] = useState({
        subject: '',
        type: '',
        professor: '',
        section: '',
        duration: '',
        classesPerWeek: ''
    });
    const [classesList, setClassesList] = useState([]);
    const [isDonePressed, setIsDonePressed] = useState(false);
    const [isGeneratePressed,setIsGeneratePressed] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3000/infoCSE')
            .then(response => {
                setData({
                    classrooms: response.data.Classrooms,
                    semesters: response.data.Semesters,
                    professors: response.data.Professors,
                    groups: response.data.Group,
                    types: data.types, // Maintain the constant types
                    subjects: response.data.Courses
                });
            })
            .catch(error => console.error('Failed to fetch data', error));
    }, []);

    const handleSemesterChange = (event) => {
        setSelectedSemester(event.target.value);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddClass = () => {
        const newClasses = Array.from({ length: formData.classesPerWeek }, () => ({
            Subject: formData.subject,
            Type: formData.type,
            Professor: formData.professor,
            Group: [formData.section],
            Classroom: formData.type === 'L' ? 'r' : 'n',
            Length: formData.duration
        }));
        setClassesList([...classesList, ...newClasses]);
        setFormData({
            subject: '',
            type: '',
            professor: '',
            section: '',
            duration: '',
            classesPerWeek: ''
        });
    };

    const handleRemoveClass = (index) => {
        setClassesList(prev => prev.filter((_, i) => i !== index));
    };

    const handleDone = () => {
        const outputData = {
            Classrooms: data.classrooms,
            Classes: classesList
        };

        axios.post('http://localhost:3000/saveClassData', outputData)
            .then(response => {
                console.log('Data saved successfully');
                setIsDonePressed(true);
            })
            .catch(error => console.error('Failed to save data', error));
    };

    const handleGenerateRoutine = () => {
        axios.post('http://localhost:3000/run-script')
            .then(response => {
              console.log('Script executed successfully:', response.data)
              setIsGeneratePressed(true);
            })
            .catch(error => console.error('Failed to execute script:', error));
    };

    //functions and utilities for table that is generated
const timetable = require('../evolutionary-timetable-scheduling-master/processedTimetable.json');
const occupancyList = require('../evolutionary-timetable-scheduling-master/classes/occupancy.json');
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const slots = ["8:00AM-9:15AM", "9:15AM-10:30AM", "10:30AM-11:45AM", "11:45AM-1:00PM", "2:30PM-3:45PM", "3:45PM-5:00PM"];
//const {getEventsList} = require('./database');


const handleSaveOccupancy = () => {
  axios.post('http://localhost:3000/save-occupancy', occupancyList)
    .then(response => console.log('Occupancy saved successfully'))
    .catch(error => console.error('Failed to save occupancy', error));
};

const updateProfessorAvailability = (professorName, newAvailability) => {
  occupancyList.Professors[professorName] = newAvailability;
};



function classInfo(timetable, idx) {
  var info = [];
  for (var i = 0; i < timetable[idx].length; i++) {
    var str = timetable[idx][i].Subject + " " + timetable[idx][i].Assigned_classroom + " " + timetable[idx][i].Group[0] + (timetable[idx][i].Length === '1' ? "\n" : "(2.5Hr)"+"\n");
    info.push(str);
  }
  return info;
}

    return (
        <div className="routine-maker">
            <div>
                <select value={selectedSemester} onChange={handleSemesterChange}>
                    {data.semesters.map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                    ))}
                </select>
            </div>
            <div className="input-row">
                <select value={formData.subject} name="subject" onChange={handleChange} disabled={!selectedSemester}>
                    {data.subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
                <select value={formData.type} name="type" onChange={handleChange} disabled={!selectedSemester}>
                    <option key="N/A" value="N/A">N/A</option>
                    {data.types.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <div>
                <select value={formData.professor} name="professor" onChange={handleChange} disabled={!selectedSemester}>
                    {data.professors.map(prof => (
                        <option key={prof} value={prof}>{prof}</option>
                    ))}
                </select>
            </div>
            <div>
                <select value={formData.section} name="section" onChange={handleChange} disabled={!selectedSemester}>
                    {data.groups.map(group => (
                        <option key={group} value={group}>{group}</option>
                    ))}
                </select>
            </div>
            <div>
                <select value={formData.duration} name="duration" onChange={handleChange} disabled={!selectedSemester}>
                    <option value="0">N/A</option>
                    <option value="1">1hr 15 min</option>
                    <option value="2">2hr 30 min</option>
                </select>
            </div>
            <div>
                <input type="number" name="classesPerWeek" value={formData.classesPerWeek} onChange={handleChange} placeholder="Classes a week" disabled={!selectedSemester} />
            </div>
            <div>
                <button onClick={handleAddClass} disabled={!selectedSemester}>Add</button>
                <button onClick={handleDone} disabled={!classesList.length}>Done</button>
                <button 
                    onClick={handleGenerateRoutine} 
                    disabled={!isDonePressed} 
                    className={!isDonePressed ? 'disabled-button' : ''}
                >
                    Generate Routine
                </button>
            </div>
            <ol>
                {classesList.map((cls, index) => (
                    <li key={index}>
                        {`${cls.Subject} ${cls.Type} - ${cls.Professor} - ${cls.Group.join(', ')}`}
                        <button onClick={() => handleRemoveClass(index)}>Remove</button>
                    </li>
                ))}
            </ol>

            {/* Show generated routine on routine maker dashboard*/}
            {/*For CSS Styling: ADD a header here that says Generated Routine*/}

            <div>
           {isGeneratePressed && ( <table id="timetable" className='timetable'>
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
      </table>)}
            </div>

            <div>
            {Object.keys(occupancyList.Professors).map(professorName => (
          <TeacherAvailability
            key={professorName}
            professorName={professorName}
            availability={occupancyList.Professors[professorName]}
            updateAvailability={(newAvailability) => updateProfessorAvailability(professorName, newAvailability)}
          />
        ))}
            </div>

      <div>
        <button onClick={handleSaveOccupancy}>Save Occupancy</button>
      </div>
        </div>
        
    );
}









export default RoutineMaker;
