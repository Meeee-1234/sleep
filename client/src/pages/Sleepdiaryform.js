import React, { useState } from "react";
import axios from "axios";

export default function SleepDiaryForm({ selectedDate }) {
  // selectedDate มาจาก prop ของปฏิทิน
  const [formData, setFormData] = useState({
    sleep_date: selectedDate || "",
    bedtime: "",
    sleep_latency: "",
    night_awakenings: "",
    awaken_times: "",
    wake_duration: "",
    wake_time: "",
    total_sleep_hours: "",
    daytime_naps: "",
    medications: "",
    alcohol: "",
    sleep_quality: "",
    morning_fatigue: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3002/sleepdiaryform", formData);
      alert("บันทึกข้อมูลเรียบร้อย!");
      setFormData({ ...formData, bedtime: "", awaken_times: "", wake_time: "" });
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0") + ":00");

  const formGroupStyle = { display: "flex", flexDirection: "column", marginBottom: "15px" };
  const labelStyle = { marginBottom: "5px", fontWeight: "bold" };
  const inputStyle = { padding: "8px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc" };
  const buttonStyle = { padding: "10px 20px", fontSize: "16px", borderRadius: "5px", backgroundColor: "#3A506B", color: "#fff", border: "none", cursor: "pointer" };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
      
      <div style={formGroupStyle}>
        <label style={labelStyle}>วันที่</label>
        <input type="date" name="sleep_date" value={formData.sleep_date} onChange={handleChange} style={inputStyle} required />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>เข้านอนเวลากี่โมง</label>
        <select name="bedtime" value={formData.bedtime} onChange={handleChange} style={inputStyle}>
          <option value="">เลือกเวลา</option>
          {hours.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>ตื่นกลางดึกกี่โมงบ้าง</label>
        <select name="awaken_times" value={formData.awaken_times} onChange={handleChange} style={inputStyle}>
          <option value="">เลือกเวลา</option>
          {hours.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>ตื่นนอนตอนเช้า</label>
        <select name="wake_time" value={formData.wake_time} onChange={handleChange} style={inputStyle}>
          <option value="">เลือกเวลา</option>
          {hours.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      {/* ช่องอื่น ๆ เหมือนเดิม */}
      <div style={formGroupStyle}>
        <label style={labelStyle}>หลังปิดไฟนอนแล้วใช้เวลานานเท่าไรจึงจะนอนหลับ (นาที)</label>
        <input type="number" name="sleep_latency" value={formData.sleep_latency} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>จำนวนครั้งการตื่นกลางดึก</label>
        <input type="number" name="night_awakenings" value={formData.night_awakenings} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>ตื่นกลางดึกแต่ละครั้งระยะเวลานานเท่าไร (คั่นด้วย , นาที)</label>
        <input type="text" name="wake_duration" value={formData.wake_duration} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>นอนวันละกี่ชั่วโมง</label>
        <input type="number" step="0.1" name="total_sleep_hours" value={formData.total_sleep_hours} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>มีช่วงที่ง่วงหลับกลางวันกี่ครั้ง กี่โมง</label>
        <input type="text" name="daytime_naps" value={formData.daytime_naps} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>ยาที่ใช้เป็นประจำ รับประทานตอนกี่โมง ปริมาณเท่าไร</label>
        <input type="text" name="medications" value={formData.medications} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>ดื่มเหล้ากี่ครั้ง ปริมาณเท่าไร</label>
        <input type="text" name="alcohol" value={formData.alcohol} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>คุณภาพการนอน (1-5)</label>
        <input type="number" name="sleep_quality" value={formData.sleep_quality} onChange={handleChange} style={inputStyle} min="1" max="5" />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>ตอนเช้าหลังตื่นนอนรู้สึกเหนื่อยล้ามากแค่ไหน (1-5)</label>
        <input type="number" name="morning_fatigue" value={formData.morning_fatigue} onChange={handleChange} style={inputStyle} min="1" max="5" />
      </div>

      <button type="submit" style={buttonStyle}>บันทึก</button>
    </form>
  );
}
