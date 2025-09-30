import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light px-4 d-flex align-items-center" 
         style={{backgroundColor:"#FFE066", height: "70px", fontSize: "1.3rem" }}>
    </nav>

    <nav className="navbar navbar-expand-lg navbar-light px-4 d-flex align-items-center" 
         style={{ backgroundColor:"#FFF3C5", paddingTop: "15px", paddingBottom: "30px", fontSize: "1.3rem" }}>

      <img src="/images/GNH.png" alt="GNH" className="navbar-brand ms-5" 
           style={{ cursor: "pointer", height: "70px" }} onClick={() => navigate("/")}/>

      <div className='d-flex flex-grow-1 justify-content-center ' style={{ gap: '200px', fontSize: "1.3rem", marginTop: "20px"}}>
          <span className='nav-link' style={{ cursor: "pointer" }} onClick={() => navigate("/")}>หน้าแรก</span>

          <div className="nav-item dropdown">
            <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ cursor: "pointer" }}>สาระนอน</span>
              <ul className="dropdown-menu">
                <li><span className="dropdown-item" onClick={() => navigate("/inform")}>ให้ความรู้เกี่ยวกับอาการนอนไม่หลับ</span></li>
                <li><span className="dropdown-item" onClick={() => navigate("/therapy")}>วิธีการบำบัดอาการนอนไม่หลับ</span></li>
              </ul>
          </div>
          
          <span className='nav-link' style={{ cursor: "pointer" }} onClick={() => navigate("/psqi")}>แบบทดสอบฝันดี</span>
          <span className='nav-link' style={{ cursor: "pointer" }} onClick={() => navigate("/sleepdiary")}>บันทึกฝันหวาน</span>
      </div>

      <span className="nav-link d-flex align-items-center" 
            style={{ cursor: "pointer", marginRight: "3rem", marginTop: "20px" }} onClick={() => navigate(user ? "/profile" : "/login")}>
          {user ? user.name : "Login / Register"}
      </span>

    </nav>
    </>
  );
}
