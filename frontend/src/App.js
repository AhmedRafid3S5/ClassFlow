import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LoginPage from './LoginPage';
import Student from './pages/Student';
import PrivateRoutes from './utils/PrivateRoutes';
import RoutineMaker from './pages/RoutineMaker';

function App() {

  const handleLogin = (username, password) => {
    console.log('Logging in with:', username, password);
    // Here you would usually make an API call to your authentication service
  };
  
  return (
     <div className='App'>
       
       <Router>
        <Routes>
          <Route element={<PrivateRoutes/>}>
               <Route element={<Student/>} path="/StudentDashboard"/>
               <Route element={<RoutineMaker/>} path="/RoutineMaker"/>
               {/*Nest other routes & components here*/}
               
          </Route>
          <Route element={<LoginPage onLogin={handleLogin}/>} path="/"/>
        </Routes>
       </Router>
     
     
     </div>
  );
}



export default App;
