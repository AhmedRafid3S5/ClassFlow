import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function StudentRequests() {
  const [teacherRequests, setTeacherRequests] = useState([]);

    useEffect(() => {
        // Fetch teacher requests from the backend
        const fetchTeacherRequests = async () => {
            try {
                const response = await axios.get('http://localhost:3000/teacher-requests');
                setTeacherRequests(response.data);
            } catch (error) {
                console.error('Error fetching teacher requests:', error);
            }
        };

        fetchTeacherRequests();
    }, []);

  return (
    <div className="pane">
      <h2>Teacher Requests</h2>
  
                {teacherRequests.length > 0 ? (
                    <ul>
                        {teacherRequests.map((request, index) => (
                            <li key={index} className="request-item">
                                {request.name}: {request.request}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No requests found</p>
                )}
            
    </div>
  );
}

export default StudentRequests;
