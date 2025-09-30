import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleInput = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      setMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      const res = await axios.post('http://localhost:3002/login', values);

      if (res.data.status === "Success") {
        // บันทึกข้อมูล user ลง localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setMessage("Login Successful!");
        navigate("/");
      } else {
        setMessage("Login Failed. ตรวจสอบข้อมูลอีกครั้ง");
      }
    } catch (err) {
      console.error(err);
      setMessage("Login Failed. ลองใหม่อีกครั้ง");
    }
  };

  return (
    <>
      <Navbar />
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='card w-25'>
          <h2 className='text-center'>Login</h2>

          <div className='card-body'>
            {message && <div className="alert alert-danger">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name='email' value={values.email} onChange={handleInput} className="form-control" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name='password' value={values.password} onChange={handleInput} className="form-control" />
              </div>
              <button type="submit" className="btn btn-success w-100 mt-2">Login</button>
            </form>

            <p className="mt-2 text-center">or</p>
            <button type="submit" className="btn btn-secondary w-100" onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>
      </div>
    </>
  );
}
