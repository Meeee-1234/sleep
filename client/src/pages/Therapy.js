import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

export default function Therapy() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar/>
        <div>
          <h1 className="container mt-4 text-center">วิธีการบำบัด</h1>
        </div>
      <Footer/>
    </>
  );
}
