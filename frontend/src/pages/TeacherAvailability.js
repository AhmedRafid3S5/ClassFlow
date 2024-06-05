import React, { useState, useEffect } from 'react';
import './availabletable.css'; // Add some basic styling if needed

const TableComponent = ({ data, setData }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = ["8:00AM-9:15AM", "9:15AM-10:30AM", "10:30AM-11:45AM", "11:45AM-1:00PM", "2:30PM-3:45PM", "3:45PM-5:00PM"];

  const handleClick = (index) => {
    const newData = [...data];
    newData[index] = newData[index] === 1 ? 0 : 1;
    setData(newData);
  };

  return (
    <table className="styled-table" style={{ width: '100%' }}>
    <thead>
        <tr>
            <th></th>
            {slots.map(slot => (
                <th key={slot}>{slot}</th>
            ))}
        </tr>
    </thead>
    <tbody>
        {days.map((day, rowIndex) => (
            <tr key={day}>
                <td>{day}</td>
                {slots.map((slot, colIndex) => {
                    const index = rowIndex * slots.length + colIndex;
                    const cellStyle = {
                        backgroundColor: data[index] > 0 ? '#B0BEC5' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'center',
                        padding: '20px',  // Adjust padding to make the cells square
                        height: '20px',   // Fixed height to ensure square shape
                        width: '20px'  ,   // Fixed width to ensure square shape
                    };
                    return (
                        <td
                            key={colIndex}
                            style={cellStyle}
                            onClick={() => handleClick(index)}
                        >
                            {data[index]}
                        </td>
                    );
                })}
            </tr>
        ))}
    </tbody>
</table>

  );
};

const TeacherAvailability = ({ professorName, availability, updateAvailability }) => {
  const [data, setData] = useState(availability);

  useEffect(() => {
    updateAvailability(data);
  }, [data]);

  return (
    <div className="slots">
      <h1 style={{ 
    fontFamily: 'Arial Rounded MT Bold, sans-serif', 
    fontSize: '24px', 
    fontWeight: 'bold', 
    color: 'rgba(51, 51, 51, 0.7)', 
    textAlign: 'center', 
    borderBottom: '2px solid #607d8b', 
    paddingBottom: '10px', 
    marginBottom: '20px' 
}}>
    Availability Slots for {professorName}
</h1>
      <TableComponent data={data} setData={setData} />
    </div>
  );
};

export default TeacherAvailability;