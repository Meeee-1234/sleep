import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import Footer from "../component/Footer";

export default function Sleepafter() {
  const { year, month, day } = useParams();
  const navigate = useNavigate();

  const [diary, setDiary] = useState({
    bedtime: "",
    wake: "",
    hours: "",
    quality: "",
  });

  // โหลดข้อมูลจาก localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sleepDiary")) || {};
    const dateKey = `${year}-${month}-${day}`;
    if (saved[dateKey]) setDiary(saved[dateKey]);
  }, [year, month, day]);

  const handleChange = (field, value) => {
    setDiary(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault(); // ป้องกัน form reload

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("กรุณา Login ก่อนบันทึกข้อมูล");

    const dateKey = `${year}-${month}-${day}`;

    // 1️⃣ บันทึกลง localStorage
    const saved = JSON.parse(localStorage.getItem("sleepDiary")) || {};
    saved[dateKey] = diary;
    localStorage.setItem("sleepDiary", JSON.stringify(saved));

    // 2️⃣ ส่งข้อมูลไป server (MySQL)
    try {
      const res = await axios.post("http://localhost:3002/sleepdiary", {
        user_id: user.id,
        diary_date: `${year}-${month}-${day}`,
        sleep_time: diary.bedtime,
        wake_time: diary.wake,
        quality: diary.quality,
        note: `นอน ${diary.hours} ชั่วโมง`
      });

      if (res.data.status === "Success") {
        alert("บันทึกข้อมูลสำเร็จ!");
        navigate("/sleepdiary"); // กลับหน้า diary
      } else {
        alert("เกิดข้อผิดพลาด: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light px-4 d-flex align-items-center" 
         style={{backgroundColor:"#FFE066", height: "70px", fontSize: "1.3rem" }}>
    </nav>

    <div className="container mt-5">
      <button className="btn" 
              style={{backgroundColor:"#FFF3C5", color: "black", borderRadius: "12px", padding: "0.5rem 1rem", fontWeight: "bold", width: "150px"}}
              onClick={() => navigate("/sleepdiary")}>Back
      </button>
      <div className="bg-white rounded-4 p-4 p-md-5 mx-auto" style={{ maxWidth: "800px" }}>

        <h1 className="text-center mb-4 fw-bold">บันทึกการนอน</h1>
        <h2 className="text-center mb-4">วันที่ {day}/{month}/{year}</h2>

        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label>เวลาเข้านอน</label>
            <select className="form-select" value={diary.bedtime} onChange={e => handleChange("bedtime", e.target.value)}>
            <option value="">เลือกเวลา</option>
                {[...Array(24)].map((_, hour) => {
                const h = hour.toString().padStart(2, '0'); // เติม 0 หน้าเลขเดียว
                return <option key={h} value={`${h}:00`}>{`${h}:00`}</option>;})}
            </select>
          </div>

          <div className="mb-3">
            <label>เวลาตื่น</label>
            <select className="form-select" value={diary.wake} onChange={e => handleChange("wake", e.target.value)}>
            <option value="">เลือกเวลา</option>
                {[...Array(24)].map((_, hour) => {
                const h = hour.toString().padStart(2, '0');
                return <option key={h} value={`${h}:00`}>{`${h}:00`}</option>;})}
            </select>
          </div>

          <div className="mb-3">
            <label>ชั่วโมงการนอน</label>
            <input type="number" className="form-control" value={diary.hours} onChange={e => handleChange("hours", e.target.value)}/>
          </div>

          <div className="mb-3">
            <label>คุณภาพการนอน</label>
            <select className="form-select" value={diary.quality} onChange={e => handleChange("quality", e.target.value)}>
              <option value="">เลือก</option>
              <option value="1">1 - แย่</option>
              <option value="2">2</option>
              <option value="3">3 - ปานกลาง</option>
              <option value="4">4</option>
              <option value="5">5 - ดีมาก</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">บันทึก</button>
        </form>
      </div><br/><br/>
    </div>
    <Footer/>
    </>
  );
}
