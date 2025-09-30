import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

import TestChart from "../component/TestChart";

export default function Sleepdiary() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [diary, setDiary] = useState({});
  const [calendarDays, setCalendarDays] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  const navigate = useNavigate();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // ตรวจสอบ Login
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login");
  }, [navigate]);

  // โหลดข้อมูล Sleep Diary จาก DB
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const fetchDiary = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/sleepdiary/${user.id}`);
        if (res.data.status === "Success") {
          const diaryObj = {};
          res.data.diary.forEach(item => {
            const date = new Date(item.diary_date);
            const key = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
            diaryObj[key] = item;
          });
          setDiary(diaryObj);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDiary();
  }, []);

  // สร้าง weeklyData สำหรับกราฟ 7 วันล่าสุด
  useEffect(() => {
    const diaryArray = Object.entries(diary).map(([date, item]) => ({
      date,
      quality: item.quality
    }));
    // เรียงจากเก่าไปใหม่
    const sorted = diaryArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    const last7 = sorted.slice(-7); // เอา 7 วันล่าสุด
    setWeeklyData(last7);
  }, [diary]);

  // สร้างปฏิทิน
  useEffect(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar = [];
    for (let i = 0; i < firstDay; i++) calendar.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendar.push(i);
    setCalendarDays(calendar);
  }, [month, year]);

  const handleDayClick = (day) => {
    if (!day) return;
    navigate(`/sleepafter/${year}/${month + 1}/${day}`);
  };

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      rows.push(calendarDays.slice(i, i + 7));
    }
    return rows;
  };

  return (
    <>
      <Navbar /><br/><br/>
      <div className="container mt-4">
        <h1 className="text-center mb-3" style={{color:"white", fontWeight:"bold"}}>📖 Sleep Diary 📖</h1>

        {/* เลือกเดือน/ปี */}
        <div className="d-flex justify-content-center">
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}
                  style={{ width: "300px", fontSize: "1.2rem", padding: "0.4rem 0.8rem" }}>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("th-TH", { month: "long" })}
              </option>
            ))}
          </select>

          <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="ms-2"
                  style={{ width: "150px", fontSize: "1.2rem", padding: "0.4rem 0.8rem" }}>
            {Array.from({ length: 5 }, (_, i) => year - 2 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* ตารางปฏิทิน */}
        <table className="table table-bordered text-center mt-3" style={{ backgroundColor: "white", borderRadius: "15px", overflow: "hidden" }}>
          <thead>
            <tr>{weekdays.map(day => <th key={day} style={{backgroundColor:"#FFF3C5"}}>{day}</th>)}</tr>
          </thead>
          <tbody>
            {renderRows().map((week, rowIndex) => (
              <tr key={rowIndex}>
                {week.map((day, idx) => {
                  if (!day) return <td key={idx}></td>;
                  const dateKey = `${year}-${(month+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
                  const isToday = day === currentDay && month === currentMonth && year === currentYear;
                  const hasDiary = diary[dateKey];
                  return (
                    <td key={idx} onClick={() => handleDayClick(day)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: hasDiary ? "#1E90FF" : isToday ? "#a0e7a0" : "white",
                          color: hasDiary || isToday ? "white" : "black",
                          minWidth: "40px", height: "60px", verticalAlign: "middle",
                        }}>
                      {day}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table><br/><br/><br/>

        {/* กราฟรายสัปดาห์ */}
        <div>
          <h1 className="text-center mb-3" style={{color:"white", fontWeight:"bold"}}>📊 Weekly Sleep Quality 📊</h1><br/>
          {weeklyData.length > 0 ? <TestChart data={weeklyData} /> : <p style={{color:"white"}}>No data for chart</p>}
        </div>
      </div><br/><br/><br/><br/>
      <Footer />
    </>
  );
}
