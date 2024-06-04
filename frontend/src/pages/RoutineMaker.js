//Routine maker can manipulate the occupancy list --> TO Do later
//Routine maker can add classes to the input file
//Routine maker can generate a timetable as an output file


//1st figure out how to create an input file.
import React, { useState, useEffect } from 'react';
import axios from 'axios';


function RoutineMaker() {


   

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
        setData({
            ...data,
            
        });
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

    const sampleClassList = [
        { "Subject": "CSE4406", "Type": "L", "Professor": "Sakhawat", "Group": ["Sec1","Sec2"], "Classroom": "r", "Length": "2" },
        { "Subject": "CSE4406", "Type": "L", "Professor": "Sakhawat", "Group": ["Sec2"], "Classroom": "r", "Length": "2" },
        { "Subject": "CSE4403", "Type": "L", "Professor": "Milu", "Group": ["Sec1"], "Classroom": "r", "Length": "1" },
        { "Subject": "CSE4403", "Type": "L", "Professor": "Milu", "Group": ["Sec2"], "Classroom": "r", "Length": "1" }
      ];
      
      const handleDone = () => {
        const outputData = {
          Classrooms: data.classrooms,
          Classes: classesList
        };
      
        axios.post('http://localhost:3000/saveClassData', outputData)
          .then(response => console.log('Data saved successfully'))
          .catch(error => console.error('Failed to save data', error));
      };

      const handleGenerateRoutine = () => {
        axios.post('http://localhost:3000/run-script')
          .then(response => console.log('Script executed successfully:', response.data))
          .catch(error => console.error('Failed to execute script:', error));
    };




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
                    <option key = "N/A" value = "N/A">N/A</option>
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
                <button onClick={handleGenerateRoutine} disabled={!classesList.length}>Generate Routine</button>
            </div>
            <ol>
                {classesList.map((cls, index) => (
                    <li key={index}>
                        {`${cls.Subject} ${cls.Type} - ${cls.Professor} - ${cls.Group.join(', ')}`}
                        <button onClick={() => handleRemoveClass(index)}>Remove</button>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default RoutineMaker;
