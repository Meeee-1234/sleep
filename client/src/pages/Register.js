import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import Navbar from '../component/Navbar';

export default function Register() {
    const navigate = useNavigate();
    const [values, setValues] = useState({ name: "", email: "", password: "", confirmpassword: "" });
    const [message, setMessage] = useState("");

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(values.name === "" || values.email === "" || values.password === "" || values.confirmpassword === ""){
            setMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }
        if(values.password !== values.confirmpassword){
            setMessage("Confirm Password ไม่ตรงกับ Password");
            return;
        }

        axios.post('http://localhost:3002/register', values)
            .then(res => {
                if (res.data.status === "Success") {
                    // บันทึกข้อมูล user ลง localStorage เพื่อเข้าสู่ระบบทันที
                    localStorage.setItem("user", JSON.stringify(res.data.user));

                    setMessage("Register Successful!");
                    navigate("/"); // กลับ Home
                } else {
                    setMessage("Register Failed. ลองใหม่อีกครั้ง");
                }
            })
            .catch(err => {
                console.log(err);
                setMessage("Register Failed");
            });
    };

    return (
        <>
            <Navbar />
            <div className='d-flex justify-content-center align-items-center vh-100 '>
                <div className='card w-25'>
                    <h2 className='text-center'>Register</h2>

                    <div className='card-body'>
                        {message && <div className="alert alert-danger" >{message}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name='name' onChange={handleInput} value={values.name} className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name='email' onChange={handleInput} value={values.email} className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" name='password' onChange={handleInput} value={values.password} className="form-control"/>
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input type="password" name='confirmpassword' onChange={handleInput} value={values.confirmpassword} className="form-control"/>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mt-2">Register</button>
                        </form>

                        <p className="mt-2 text-center">or</p>
                        <button type="submit" className="btn btn-secondary w-100" onClick={() => navigate("/login")}>Login</button>
                    </div>
                </div>
            </div>
        </>
    );
}
