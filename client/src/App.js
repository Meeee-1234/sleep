import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Inform from './pages/Inform';
import Therapy from './pages/Therapy';
import PSQI from './pages/PSQI';
import Sleepafter from './pages/Sleepafter';
import Sleepdiary from './pages/Sleepdiary';
import Profile from './pages/Profile';

import TestChart from "./component/TestChart"; 
import Sleepdiaryform from './pages/Sleepdiaryform';


export default function App() {
  return (
    <div>
      <div className="w-100" style={{ backgroundColor: "#3A506B", maxWidth: '2000px' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} /> 
            <Route path="/inform" element={<Inform />} /> 
            <Route path="/therapy" element={<Therapy />} />
            <Route path="/psqi" element={<PSQI />} />
            <Route path="/sleepafter/:year/:month/:day" element={<Sleepafter />} />
            <Route path="/sleepdiary" element={<Sleepdiary />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/testchart" element={<TestChart />} />
            <Route path="/Sleepdiaryform" element={<Sleepdiaryform />} />
            
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
