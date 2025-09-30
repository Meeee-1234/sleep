import React from 'react'
import { useNavigate } from 'react-router-dom';


export default function Footer() {
  return (
    <footer>
      <div className="navbar navbar-expand-lg navbar-light -flex justify-content-center align-items-center" 
           style={{ backgroundColor:"#FFF3C5", color:"#3A506B", height: "110px", fontSize: "1.3rem", fontWeight: "bold" }}>
           GoodNight Hub
      </div>

      <div className="navbar navbar-expand-lg navbar-light d-flex justify-content-center align-items-center" 
           style={{ backgroundColor:"#FFE066", color:"#3A506B", height: "70px", fontSize: "1.3rem", fontWeight: "bold" }}>
            © 2025 GoodNight Hub. All rights reserved.
      </div>
    </footer>
  )
}
