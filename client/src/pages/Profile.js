import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../component/Navbar';
import Sleepdiary from './Sleepdiary';
import Footer from '../component/Footer';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // กลับหน้า Home หลัง Logout
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


  return (
    <>
      <Navbar hideAuthButtons={true} />
      <>
        <h1 className="container mt-4 text-center">Profile</h1>
        <div className='container mt-4 d-flex justify-content-center'>
          <div className="card" style={{ maxWidth: "1500px", width: "100%" }}>
            <div className="card-body" style={{ padding: "2rem" }}> {/* เพิ่ม padding รอบๆ card-body */}
              {user && (
                <>
                  <h2 className="mb-4">Personal Information</h2> {/* เว้นระยะด้านล่างหัวข้อ */}
                  <table className="table table-borderless text-start">
                    <tbody>
                      <tr>
                        <th style={{ width: "120px", paddingLeft: "2rem" }}>Name</th> {/* เพิ่ม paddingLeft */}
                        <td>{user.name}</td>
                      </tr>
                      <tr>
                        <th style={{ paddingLeft: "2rem" }}>Birthday</th>
                        <td>{user.birthday}</td>
                      </tr>
                      <tr>
                        <th style={{ paddingLeft: "2rem" }}>Gender</th>
                        <td>{user.gender}</td>
                      </tr>
                      <tr>
                        <th style={{ paddingLeft: "2rem" }}>Email</th>
                        <td>{user.email}</td>
                      </tr>
                    </tbody>
                  </table>

                  <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div><br/><br/>
        <Footer/>
      </>
    </>
  );
}
