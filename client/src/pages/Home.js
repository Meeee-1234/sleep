import React from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { useNavigate } from 'react-router-dom';


export default function Home() {
  return (
    <>
      <Navbar hideAuthButtons={true} />
      <div>
        <h1 className="container mt-4 text-center">เว็บไซต์ให้ความรู้เกี่ยวกับการนอนไม่หลับ</h1>
      </div>

      <div>
        
      </div>

      <Footer />
    </>
  );
}
