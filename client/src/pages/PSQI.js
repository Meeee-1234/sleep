import React, { useState } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import axios from 'axios';

export default function PSQI() {
const [formData, setFormData] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ดึง user จาก localStorage ถ้ามี
        const user = localStorage.getItem("user");
        let dataToSend = { ...formData };
        if (user) {
            dataToSend.user_id = JSON.parse(user).id; // เพิ่ม user_id ถ้า Login
        }

        try {
            await axios.post('http://localhost:3002/psqi', dataToSend); 
            alert('บันทึกข้อมูลเรียบร้อยแล้ว');
            setFormData({}); 
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };


    
  return (
    <>
      <Navbar /><br/><br/>
      <div className='container mt-4 mb-5'>
        <div className="bg-white rounded-4 p-4 p-md-5 mx-auto" style={{maxWidth: "1500px"}}>

          <h1 className='text-center mb-4'>แบบประเมินออนไลน์คุณภาพการนอนหลับ</h1>
          <h1 className='text-center mb-4'>Pittsburgh sleep Quality Index (PSQI)</h1> <br/>
          
          <p>แบบประเมินคุณภาพการนอนหลับ (PSQI) คำแนะนำในการทดสอบ: คำถามต่อไปนี้เกี่ยวข้องกับพฤติกรรมการนอนของท่านในช่วงระยะเวลา 1 เดือนที่ผ่านมา คำตอบของท่านควรบ่งบอกสิ่งที่ใกล้เคียงความเป็นจริงมากที่สุด และเป็นสิ่งที่เกิดขึ้นกับตัวท่านเป็นส่วนใหญ่ทั้งในเวลาช่วงกลางวันและกลางคืน โปรดตอบทุกคำถามอย่างตรงไปตรงมา</p><br/>

          <form onSubmit={handleSubmit}>
            {/* คำถาม 1 */}
            <div className='mb-3 fw-bold'>
              <label>1. ในช่วงระยะเวลา 1 เดือนที่ผ่านมาส่วนใหญ่ท่านมักเข้านอนเวลาใด</label>
              <select 
                className='form-select' 
                value={formData.bedtime || ""} 
                onChange={(e) => handleChange('bedtime', e.target.value)}
              >
                <option value="">-- เลือกเวลา --</option>
                {Array.from({length: 24}, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  return <option key={i} value={`${hour}:00`}>{`${hour}:00`}</option>;
                })}
              </select>
            </div>

            {/* คำถาม 2 */}
            <div className='mb-3 fw-bold'>
              <label>2. ในช่วงระยะเวลา 1 เดือนที่ผ่านมาส่วนใหญ่ท่านต้องใช้เวลากี่นาทีจึงจะนอนหลับ</label>
              <input 
                type="number" 
                className='form-control' 
                placeholder="กรอกจำนวน นาที"
                value={formData.sleepLatency || ""} 
                onChange={(e) => handleChange('sleepLatency', e.target.value)} 
                min={0}
                max={180}
              />
            </div>

            {/* คำถาม 3 */}
            <div className='mb-3 fw-bold'>
              <label>3. ในช่วงระยะเวลา 1 เดือนที่ผ่านมาส่วนใหญ่ท่านตื่นนอนตอนเช้าเวลาใด</label>
              <select 
                className='form-select' 
                value={formData.wakeTime || ""} 
                onChange={(e) => handleChange('wakeTime', e.target.value)}
              >
                <option value="">-- เลือกเวลา --</option>
                {Array.from({length: 24}, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  return <option key={i} value={`${hour}:00`}>{`${hour}:00`}</option>;
                })}
              </select>
            </div>

            {/* คำถาม 4 */}
            <div className='mb-3 fw-bold'>
              <label>4. ในช่วงระยะเวลา 1 เดือนที่ผ่านมาท่านนอนหลับได้จริงเป็นเวลากี่ชั่วโมงต่อคืน</label>
              <input 
                type="number" 
                className='form-control' 
                placeholder="กรอกจำนวนชั่วโมง"
                value={formData.actualSleepHours || ""} 
                onChange={(e) => handleChange('actualSleepHours', e.target.value)} 
                min={0}
                max={24}
                step={0.1} // เพิ่ม step ให้กรอกทศนิยมได้
              />
            </div>

            {/* คำถาม 5-1 */}
            <div className='mb-3 fw-bold'>
              <label className='fw-bold'>5. ในช่วงระยะเวลา 1 เดือนที่ผ่านมาท่านมีปัญหาการนอนหลับเนื่องจากเหตุผลต่อไปนี้บ่อยเพียงใด</label><br/>
              <label className='fw-bold'>5.1 นอนไม่หลับหลังจากเข้านอนแล้วนานกว่า 30 นาที</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q5_1"  // ถูกต้อง
                    value={opt} 
                    checked={formData.q5_1 === opt} 
                    onChange={(e) => handleChange('q5_1', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 5-2 */}
            <div className='mb-3 fw-bold'>
              <label className='fw-bold'>5.2 รู้สึกตัวตื่นขึ้นระหว่างนอนหลับกลางดึก หรือตื่นเช้ากว่าเวลาที่ตั้งใจไว้</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q5_2"  // ถูกต้อง
                    value={opt} 
                    checked={formData.q5_2 === opt} 
                    onChange={(e) => handleChange('q5_2', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 5-3 */}
            <div className='mb-3 fw-bold'>
              <label className='fw-bold'>5.3 ตื่นเพื่อไปเข้าห้องน้ำ</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q5_3"  // ถูกต้อง
                    value={opt} 
                    checked={formData.q5_3 === opt} 
                    onChange={(e) => handleChange('q5_3', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 5-4 */}
            <div className='mb-3 fw-bold'>
              <label className='fw-bold'>5.4 หายใจไม่สะดวก</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q5_4"  // ถูกต้อง
                    value={opt} 
                    checked={formData.q5_4 === opt} 
                    onChange={(e) => handleChange('q5_4', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 5-5 */}
            <div className='mb-3 fw-bold'>
              <label className='fw-bold'>5.5 ไอหรือกรนเสียงดัง</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q5_5"  // ถูกต้อง
                    value={opt} 
                    checked={formData.q5_5 === opt} 
                    onChange={(e) => handleChange('q5_5', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 5-6 */}
            <div className='mb-3 fw-bold'>
              <label className='fw-bold'>5.6 รู้สึกหนาวเกินไป</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q5_6"  // ถูกต้อง
                    value={opt} 
                    checked={formData.q5_6 === opt} 
                    onChange={(e) => handleChange('q5_6', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 5-7 */}
            <div className='mb-3 fw-bold'>
              <label className='fw-bold'>5.7 รู้สึกร้อนเกินไป</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q5_7"  // ถูกต้อง
                    value={opt} 
                    checked={formData.q5_7 === opt} 
                    onChange={(e) => handleChange('q5_7', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 5-8 */}
            <div className='mb-3 fw-bold'>
              <label className='fw-bold'>5.8 ฝันร้าย</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q5_8"  // ถูกต้อง
                    value={opt} 
                    checked={formData.q5_8 === opt} 
                    onChange={(e) => handleChange('q5_8', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 5-9 */}
            <div className='mb-3 fw-bold'>
              <label className='fw-bold'>5.9 รู้สึกปวด</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q5_9"  // ถูกต้อง
                    value={opt} 
                    checked={formData.q5_9 === opt} 
                    onChange={(e) => handleChange('q5_9', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 5-10 */}
            <div className='mb-3 fw-bold'>
              <label className='fw-bold'>5.10 เหตุผลอื่นๆ ที่รบกวนการนอนหลับ</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q5_10"  // ถูกต้อง
                    value={opt} 
                    checked={formData.q5_10 === opt} 
                    onChange={(e) => handleChange('q5_10', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
           

            {/* คำถาม 6 */}
            <div className='mb-3'>
              <label className='d-block fw-bold'>6. ในช่วงระยะเวลา 1 เดือนที่ผ่านมาท่านคิดว่าคุณภาพการนอนหลับโดยรวมของท่านเป็นอย่างไร</label>
              {["ดีมาก","ค่อนข้างดี","ค่อนข้างแย่","แย่มาก"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q6"  
                    value={opt} 
                    checked={formData.q6 === opt} 
                    onChange={(e) => handleChange('q6', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 7 */}
            <div className='mb-3'>
              <label className='d-block fw-bold'>7. ในช่วงระยะเวลา 1 เดือนที่ผ่านมาท่านใช้ยาเพื่อช่วยในการนอนหลับบ่อยเพียงใด (ไม่ว่าจะตามใบสั่งแพทย์หรือหาซื้อมาเอง)</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q7" 
                    value={opt} 
                    checked={formData.q7 === opt} 
                    onChange={(e) => handleChange('q7', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 8 */}
            <div className='mb-3'>
              <label className='d-block fw-bold'>8. ในช่วงระยะเวลา 1 เดือนที่ผ่านมาท่านมีปัญหาง่วงนอนหรือเผลอหลับขณะขับขี่ยานพาหนะ, ขณะรับประทานอาหาร หรือขณะเข้าร่วมกิจกรรมทางสังคมต่างๆ บ่อยเพียงใด</label>
              {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้ง/สัปดาห์","1-2 ครั้ง/สัปดาห์","3 ครั้ง/สัปดาห์ขึ้นไป"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q8"  // เปลี่ยนจาก q6 → q8
                    value={opt} 
                    checked={formData.q8 === opt} 
                    onChange={(e) => handleChange('q8', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* คำถาม 9 */}
            <div className='mb-3'>
              <label className='d-block fw-bold'>9. ในช่วงระยะเวลา 1 เดือนที่ผ่านมาท่านมีปัญหาเกี่ยวกับความกระตือรือร้นในการทำงานให้สำเร็จมากน้อยเพียงใด</label>
              {["ไม่มีปัญหาเลยแม้แต่น้อย","มีปัญหาเพียงเล็กน้อย","ค่อนข้างที่จะเป็นปัญหา","เป็นปัญหาอย่างมาก"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q9"  // เปลี่ยนจาก q6 → q9
                    value={opt} 
                    checked={formData.q9 === opt} 
                    onChange={(e) => handleChange('q9', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}
            </div>


            {/* คำถาม 10 */}
            <div className='mb-3'>
              <label className='d-block fw-bold'>
                10. ท่านมีคู่นอน, เพื่อนร่วมห้อง หรือผู้อาศัยอยู่ในบ้านหลังเดียวกันหรือไม่
              </label>
              {["ไม่มีเลย","มี แต่แยกนอนคนละห้อง","มี และนอนในห้องเดียวกัน แต่คนละเตียง","มี และนอนเตียงเดียวกัน"].map((opt, idx) => (
                <label key={idx} className='d-block'>
                  <input 
                    type="radio" 
                    name="q10" 
                    value={idx} 
                    checked={formData.q10 == idx} 
                    onChange={(e) => handleChange('q10', e.target.value)}
                    className="me-2"
                  />
                  {opt}
                </label>
              ))}

              {formData.q10 >= 1 && (
                <div className='mt-3 ps-4'>
                {/* คำถาม 10.1 */}
                <div className='mb-2'>
                    <label className='d-block fw-bold'>10.1 กรนเสียงดัง</label>
                    {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้งต่อสัปดาห์","1 หรือ 2 ครั้งต่อสัปดาห์","3 ครั้งต่อสัปดาห์ขึ้นไป"].map((opt, idx) => (
                    <label key={idx} className='d-block ps-3'>
                        <input
                        type="radio"
                        name="q10_1"
                        value={idx}
                        checked={formData.q10_1 == idx}
                        onChange={(e) => handleChange('q10_1', e.target.value)}
                        className="me-2"
                        />
                        {opt}
                    </label>
                    ))}
                </div>

                {/* คำถาม 10.2 */}
                <div className='mb-2'>
                    <label className='d-block fw-bold'>10.2 มีช่วงหยุดหายใจเป็นระยะเวลานานขณะหลับ</label>
                    {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้งต่อสัปดาห์","1 หรือ 2 ครั้งต่อสัปดาห์","3 ครั้งต่อสัปดาห์ขึ้นไป"].map((opt, idx) => (
                    <label key={idx} className='d-block ps-3'>
                        <input
                        type="radio"
                        name="q10_2"
                        value={idx}
                        checked={formData.q10_2 == idx}
                        onChange={(e) => handleChange('q10_2', e.target.value)}
                        className="me-2"
                        />
                        {opt}
                    </label>
                    ))}
                </div>

                {/* คำถาม 10.3 */}
                <div className='mb-2'>
                    <label className='d-block fw-bold'>10.3 ขากระตุกขณะหลับ</label>
                    {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้งต่อสัปดาห์","1 หรือ 2 ครั้งต่อสัปดาห์","3 ครั้งต่อสัปดาห์ขึ้นไป"].map((opt, idx) => (
                    <label key={idx} className='d-block ps-3'>
                        <input
                        type="radio"
                        name="q10_3"
                        value={idx}
                        checked={formData.q10_3 == idx}
                        onChange={(e) => handleChange('q10_3', e.target.value)}
                        className="me-2"
                        />
                        {opt}
                    </label>
                    ))}
                </div>

                {/* คำถาม 10.4 */}
                <div className='mb-2'>
                    <label className='d-block fw-bold'>10.4 สับสนเป็นช่วงๆ ขณะหลับ</label>
                    {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้งต่อสัปดาห์","1 หรือ 2 ครั้งต่อสัปดาห์","3 ครั้งต่อสัปดาห์ขึ้นไป"].map((opt, idx) => (
                    <label key={idx} className='d-block ps-3'>
                        <input
                        type="radio"
                        name="q10_4"
                        value={idx}
                        checked={formData.q10_4 == idx}
                        onChange={(e) => handleChange('q10_4', e.target.value)}
                        className="me-2"
                        />
                        {opt}
                    </label>
                    ))}
                </div>

                {/* คำถาม 10.5 */}
                <div className='mb-2'>
                    <label className='d-block fw-bold'>10.5 อาการกระสับกระส่ายอื่นๆ ที่พบขณะหลับ</label>
                    {["ไม่เคยเลยในช่วงระยะเวลา 1 เดือนที่ผ่านมา","น้อยกว่า 1 ครั้งต่อสัปดาห์","1 หรือ 2 ครั้งต่อสัปดาห์","3 ครั้งต่อสัปดาห์ขึ้นไป"].map((opt, idx) => (
                    <label key={idx} className='d-block ps-3'>
                        <input
                        type="radio"
                        name="q10_5"
                        value={idx}
                        checked={formData.q10_5 == idx}
                        onChange={(e) => handleChange('q10_5', e.target.value)}
                        className="me-2"
                        />
                        {opt}
                    </label>
                    ))}
                </div>

                </div>
            )}
            </div>
            
            <button type="submit" className='btn btn-primary mt-3 w-100'>ส่งคำตอบ</button>
          </form>
          </div>
        </div><br/><br/><br/>
        <Footer />
    </>
  );
}
